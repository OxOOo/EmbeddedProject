import Vue from 'vue';
import Router from 'vue-router';
import E404 from '@/pages/E404';

import Index from '@/pages/Index';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Index',
            component: Index
        },
        {
            path: '*',
            name: '404',
            component: E404
        }
    ],
    mode: 'history'
});
