require('should');
let Router = require('koa-router');
let manager = require('../services/manager');

const router = module.exports = new Router();

router.get('/ping', async ctx => {
    ctx.body = {
        success: true,
        message: 'pong'
    };
});

router.post('/heartbeat', async ctx => {
    await manager.heartbeat(ctx.request.body.data);
    ctx.body = {
        success: true,
        message: 'ok'
    };
});

router.get('/status', async ctx => {
    ctx.body = {
        success: true,
        data: manager.getStatus()
    };
});

router.post('/set_switch', async ctx => {
    await manager.setSwitch(ctx.request.body.on);
    ctx.body = {
        success: true,
        message: '设置成功'
    };
});

router.post('/set_autostart_config', async ctx => {
    await manager.setAutostartConfig(ctx.request.body.data);
    ctx.body = {
        success: true,
        message: '设置成功'
    };
});

router.post('/set_delay_start', async ctx => {
    await manager.setDelayStart(ctx.request.body.seconds);
    ctx.body = {
        success: true,
        message: '设置成功'
    };
});
