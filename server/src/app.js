// 网站

let mount = require('koa-mount');
let Koa = require('koa');
let Router = require('koa-router');
let bodyParser = require('koa-bodyparser');
let path = require('path');
let session = require('koa-session');
let fs = require('fs');

let config = require('./config');
let { SERVER } = require('./config');
let manager = require('./services/manager');

let app = new Koa();

app.use(bodyParser({
    formLimit: '10MB'
}));
app.keys = [config.SERVER.SECRET_KEYS];
const CONFIG = {
    key: 'www:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 1000 * 60 * 60 * 24 * 7,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: false, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: true /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false) */
};
app.use(session(CONFIG, app));

app.use(async (ctx, next) => {
    ctx.state.ip = ctx.headers['x-real-ip'] || ctx.ip;
    await next();
});

let host_api = new Router();

host_api.use(require('koa-logger')());
// error handle
host_api.use(async (ctx, next) => {
    try {
        ctx.set({
            'Cache-Control': 'nocache',
            'Pragma': 'no-cache',
            'Expires': -1
        });
        await next();
    } catch (e) {
        console.error(e);
        ctx.body = {
            success: false,
            message: e.message
        };
    }
});
host_api.use('', require('./controllers/index').routes());

app.use(mount('/api', host_api.routes()));
app.use(mount('/', require('koa-static')(path.join(__dirname, '..', 'dist'), {
    maxage: SERVER.MAXAGE
})));
app.use(async ctx => {
    ctx.type = 'text/html';
    ctx.body = fs.createReadStream(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(SERVER.PORT, SERVER.ADDRESS);
console.log(`listen on http://${SERVER.ADDRESS}:${SERVER.PORT}`);

manager.mainLoop();
