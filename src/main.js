import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import goods from './components/goods/goods';
import seller from './components/seller/seller';
import ratings from './components/ratings/ratings';
import VueResource from 'vue-resource'

import './common/stylus/index.styl'

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
    { path: '/', redirect: '/goods' },
    { path: '/goods', component: goods },
    { path: '/seller', component: seller },
    { path: '/ratings', component: ratings }
];

const router = new VueRouter({
    routes
});

// /* eslint-disable no-new */
let app = new Vue({
    router,
    el: '#app',
    render: h => h(App)
});
