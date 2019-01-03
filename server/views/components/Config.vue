<template>
    <div>
        <p>
            开关:
            <Switch size="large" v-model="status.switch.on" @on-change="switchChange">
                <span slot="open">开</span>
                <span slot="close">关</span>
            </Switch>
        </p>
        <Divider>低电量重启设置</Divider>
        <Form :model="status.autostart_config" label-position="left" :label-width="150">
            <FormItem label="模式">
                <Select v-model="status.autostart_config.type">
                    <Option value="delay">延迟启动</Option>
                    <Option value="timepoint">定时启动</Option>
                </Select>
            </FormItem>
            <FormItem v-show="status.autostart_config.type == 'delay'" label="延迟启动时间（秒）">
                <InputNumber :min="60" v-model="status.autostart_config.delay_seconds"></InputNumber>
            </FormItem>
            <FormItem v-show="status.autostart_config.type == 'timepoint'" label="启动时间（小时）">
                <InputNumber :min="0" :max="23" v-model="status.autostart_config.timepoint_hour"></InputNumber>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit">修改</Button>
            </FormItem>
        </Form>
        <Divider>延迟启动设置</Divider>
        <Form label-position="left" :label-width="150">
            <FormItem label="延迟启动时间（秒）">
                <InputNumber :min="0" v-model="delay_seconds"></InputNumber>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submitDelay">设置</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import http from '../http';
import _ from 'lodash';
import { Message } from 'iview';

export default {
    name: 'Config',
    data () {
        return {
            status: {
                switch: {},
                pi: {},
                autostart_config: {}
            },
            delay_seconds: 0
        };
    },
    created () {
        this.update();
    },
    methods: {
        async update () {
            let data = await http.get('status');
            _.assign(this.status, data.data);
        },
        async switchChange () {
            let info = await http.post('set_switch', {}, {on: this.status.switch.on});
            Message.success(info.message);
        },
        async submit () {
            let info = await http.post('set_autostart_config', {}, {data: this.status.autostart_config});
            Message.success(info.message);
        },
        async submitDelay () {
            let info = await http.post('set_delay_start', {}, {seconds: this.delay_seconds});
            Message.success(info.message);
        }
    }
};
</script>
