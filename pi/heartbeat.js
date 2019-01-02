let request = require('superagent');
let os = require('os');

const HEARTBEAT_URL = 'http://192.168.43.238:8800/api/heartbeat';

async function info () {
    return {
        freemem: os.freemem(),
        totalmem: os.totalmem(),
        uptime: os.uptime()
    }
}

function sleep (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

(async function () {
    while (true) {
        try {
            await request.post(HEARTBEAT_URL).send({
                data: await info()
            }).timeout(10*1000);
        } catch (e) {
            console.error(e);
        }
        await sleep(1000);
    }
})();
