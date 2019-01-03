require('es6-promise').polyfill();
import axios from 'axios';
import { Modal } from 'iview';

let instance = axios.create({
    baseURL: '/api/',
    timeout: 10000
});

function showModel (type, title, content) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Modal[type]({
                title: title,
                content: content,
                onOk: resolve
            });
        }, 50);
    });
}

async function handle (req, nocheck = false) {
    let data = {};
    try {
        let res = await req;
        data = res.data;
    } catch (e) {
        if (!nocheck) await showModel('error', '网络错误', e.message);
        throw e;
    }
    if (!data.success) {
        if (!nocheck) await showModel('info', '错误', data.message);
        throw new Error(data.message);
    }
    return data;
}

export default {
    async get (url, params) {
        return await handle( instance.get(url, {
            params: params || {}
        }) );
    },
    async get_nocheck (url, params) {
        return await handle( instance.get(url, {
            params: params || {}
        }), true );
    },
    async post (url, params, data) {
        return await handle( instance.post(url, data || {}, {
            params: params || {}
        }) );
    }
};
