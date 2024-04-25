import axios from "axios";
// import { stockFlag } from "@/utils/index"

let prefixUrl = process.env['ELECTRON_RENDERER_URL']
// 创建axios实例
let instance = axios.create({
    baseURL: prefixUrl,
    timeout: 0   // 设置超时时间为0，这样请求就不会因为等待时间过长而被自动中断
})

// http 请求拦截器
instance.interceptors.request.use(req => {
    if (process.env.NODE_ENV === 'production') {
        if (req.baseURL.slice(-5) == "/sapi") {
            prefixUrl = 'https://stockapi.com.cn'
        }  else {
            prefixUrl = 'http://api.mairui.club'
        }
    }
    // 请求前
    req.headers["content-type"] = "application/json;charset=UTF-8"; // 默认类型

    if (req.baseURL.slice(-5) == "/sapi") {
        req.url += "?token=097c5ec77813d4077138be3288537d97364e921235175234"
    }
    return req;
}, err => {
    // 错误时
    return Promise.reject(err)
})

// http 响应拦截器
instance.interceptors.response.use(req => {
    // 响应后
    return req.data;
}, err => {
    // 错误时
    return Promise.reject(err)
})

/**
 * 封装get方法 仅在开盘日发起长轮询
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export const get = (url, params, suffix) => {
    return new Promise((resolve, reject) => {
        instance.get(url, {
            params: params,
            baseURL: prefixUrl + suffix
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    });
}

export default instance