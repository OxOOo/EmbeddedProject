<template>
    <div>
        <Divider>开关状态</Divider>
        <h3>
            开关状态：{{ status.switch.on ? '开启' : '关闭' }}({{ status.switch.online ? '在线' : '离线' }})
        </h3>
        <Divider>树梅派状态</Divider>
        <h3>
            状态：{{ status.pi.online ? '在线' : '离线' }}
        </h3>
        <h3 v-if="status.next_startup_time">
            下次启动时间：{{ formatdate(status.next_startup_time) }}
        </h3>
        <div v-if="status.pi.heartbeat">
            <h3>
                上次心跳时间：{{ formatdate(status.pi.last_heartbest_time) }}
            </h3>
            <h3>
                内存使用量：{{ Math.round((status.pi.heartbeat.totalmem-status.pi.heartbeat.freemem)/status.pi.heartbeat.totalmem*10000)/100 }}%
            </h3>
            <h3>
                UPTIME：{{ status.pi.heartbeat.uptime }}s
            </h3>
        </div>
    </div>
</template>

<script>
import http from '../http';
import _ from 'lodash';
import moment from 'moment';

export default {
    data () {
        return {
            status: {
                switch: {},
                pi: {},
                next_startup_time: null
            }
        };
    },
    created () {
        this.update();
        setInterval(() => {
            this.update();
        }, 1000);
    },
    methods: {
        async update () {
            let data = await http.get('status');
            _.assign(this.status, data.data);
        },
        formatdate (date) {
            return moment(date).format('YYYY-MM-DD HH:mm:ss');
        }
    }
};
</script>
