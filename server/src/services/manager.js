
let request = require('superagent');
let config = require('../config');
let moment = require('moment');
let _ = require('lodash');

let status = {
    switch: {
        on: false,
        online: false
    },
    pi: {
        heartbeat: null,
        online: false,
        last_heartbest_time: null,
        last_startup_time: null // 开关打开后1分钟内不判断是否电力不足
    },
    next_startup_time: null, // 自动启动任务
    autostart_config: {
        type: 'delay', // delay, timepoint
        delay_seconds: 10 * 60,
        timepoint_hour: 9
    }
};

function sleep (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function syncSwitch () {
    try {
        let cmd = status.switch.on ? 'low' : 'high';
        await request.get(config.SWITCH_HOST).query({gpio: 0, cmd: cmd}).timeout(5*1000);
        status.switch.online = true;
    } catch (e) {
        status.switch.online = false;
        console.error(e);
    }
}

async function syncPi () {
    if (status.pi.online && moment(status.pi.last_heartbest_time).add(moment.duration(10, 'seconds')).isBefore(moment())) {
        status.pi.online = false;
        console.log('pi disconnected');
    }
}

async function syncTask () {
    if (status.pi.last_startup_time && moment(status.pi.last_startup_time).add(moment.duration(1, 'minute')).isAfter(moment())) return;
    if (status.switch.online && status.next_startup_time && moment(status.next_startup_time).isBefore(moment())) {
        status.next_startup_time = null;
        status.pi.last_startup_time = moment();
        status.switch.on = true;
        console.log('reach startup time');
        return;
    }
    if (status.switch.on && !status.next_startup_time && !status.pi.online) {
        let next_startup_time = null;
        if (status.autostart_config.type == 'delay') {
            next_startup_time = moment().add(moment.duration(status.autostart_config.delay_seconds, 'seconds'));
        } else if (status.autostart_config.type == 'timepoint') {
            next_startup_time = moment().hour(status.autostart_config.timepoint_hour).minute(0).seconds(0).milliseconds(0);
            if (next_startup_time.isBefore(moment())) next_startup_time = next_startup_time.add(moment.duration(1, 'day'));
        }

        status.switch.on = false;
        status.next_startup_time = next_startup_time;
        console.log('set startup time:', next_startup_time.format('YYYY-MM-DD HH:mm:ss'));
        return;
    }
}

exports.mainLoop = async function () {
    while (true) {
        await sleep(500);
        await syncSwitch();
        await syncPi();
        await syncTask();
    }
}

exports.heartbeat = async function (heartbeat) {
    status.pi.heartbeat = heartbeat;
    status.pi.online = true;
    status.pi.last_heartbest_time = moment();
}

exports.setSwitch = async function (on) {
    if (status.switch.on == on) return;
    status.switch.on = on;
    if (on) {
        status.pi.last_startup_time = moment();
        status.next_startup_time = null;
    }
}

exports.getStatus = function () {
    return _.cloneDeep(status);
}

exports.setAutostartConfig = function (config) {
    status.autostart_config = config;
}

exports.setDelayStart = function (seconds) {
    status.switch.on = false;
    status.next_startup_time = moment().add(moment.duration(seconds, 'seconds'));
}
