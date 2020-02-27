/**
 * Created by Administrator on 2019/9/6.
 */
// const baseUrl = 'http://80.205.2.125:8084';//线上环境
const baseUrl = 'http://10.65.48.109:8084'; //线上环境
const upmsUrl = "http://80.205.2.91:8762"; //用户登录信息
const personImgUrl = "http://80.205.2.69:8733"; //人员照片
const gaUrl = "http://80.205.2.124:8081"; //上传
const wwjc = 'http://80.205.2.124:8080'; //wwjc
const yyfx = 'http://172.16.240.78:8888' //药品分析
module.exports = {
    '/ga-znbk-api': {
        target: baseUrl
    },
    '/person': {
        target: personImgUrl,
        changeOrigin: true
    },
    '/upms': {
        target: upmsUrl,
        changeOrigin: true,
        pathRewrite: {
            "^/upms": ""
        }
    },
    '/ga-infrastructure-api': {
        target: gaUrl,
        changeOrigin: true,
        pathRewrite: {
            "^/ga-infrastructure-api": ""
        }
    },
    '/ww-wwjc-api': {
        target: wwjc
    },
    '/apis': {
        target: yyfx
    },
}