// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import loadingMask from './utils/LoadingMask'
import './utils/remAdapter' //配置字体适配
import Vuex from 'vuex'

import { sync } from 'vuex-router-sync'
// require styles
import 'swiper/dist/css/swiper.css'
import 'font-awesome/css/font-awesome.css'
import kcAuth from './utils/kcAuth'
import jQuery from 'jquery'
import './assets/style/css/common';
import ElementUI from 'element-ui'
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import formCreate from '@form-create/element-ui'
Vue.use(Vuex)
Vue.use(formCreate)
import App from './App'
//注入jquery全局对象
window.$ = window.jQuery = jQuery;
// 全局处理Promise的问题,es2015
window.Promise = Promise;
//处理es2015数据方法bug
Array.prototype.includes == null && (Array.prototype.includes = function (val) { return this.indexOf(val) >= 0 });
// 引入lodash方法库
let _ = require('lodash');
Vue.prototype._ = _;

Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.config.devtools = true
Vue.config.productionTip = false
axios.defaults.withCredentials = true;

/**
 * 这里闭包执行keycloak认证;
 */
// (async ()=>{
//     console.log("keycloak start", window.location.origin)
//     let kc = await kcAuth.getKeyCloak(window.location.origin + "/static/keycloak/keycloak.json")
//     Vue.prototype.$kc = kc
//     let authed = await kcAuth.reqtoken(kc)
//     console.log("keycloak", authed, kc)
//     if (authed) {
//         let userInfo = await kcAuth.getUpmsUserInfo(kc, authed); //获取加载的用户信息
//         new Vue({
//             el: '#app',
//             router,
//             store,
//             components: { App },
//             template: '<App/>'
//         })
//     } else {
//         kc.logout()
//     }
// })();
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})

/**
 * 注册接口加载监听,实现加载的效果
 */
axios.interceptors.request.use(function (req) {
    loadingMask.start();
    let token = sessionStorage.getItem("token");
    if (token) {
        req.headers["token"] = token;
    }
    req.timeout = 1000 * 60;
    return req;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use((resp) => {
    loadingMask.done()
    return resp;
}, (error) => {
    if (error.response.data.userMessage) {
        Message.error("请求数据错误 " + error.response.data.userMessage);
    } else {
        Message.error("请求错误 ");
    }

    loadingMask.done();
    return Promise.reject(error);
});
