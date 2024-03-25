import axios from "axios";
import { stockFlag } from "@/utils/index"

let prefixUrl = ""
// 创建axios实例
let instance = axios.create({
    baseURL: prefixUrl,
    timeout: 0   // 设置超时时间为0，这样请求就不会因为等待时间过长而被自动中断
})

// http 请求拦截器
instance.interceptors.request.use(req => {
    // 请求前
    req.headers["content-type"] = "application/json;charset=UTF-8"; // 默认类型
    // req.headers["Cache-Control'"] = "no-cache";
    // req.headers["Pragma'"] = "no-cache";

    if(req.baseURL == "/sapi") {
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
 * @param {number} delay [864000000 = 10天]
 */
export const get = (url, params, baseURL, delay = 864000000) => {
    return new Promise((resolve, reject) => {
        instance.get(url, {
            params: params,
            baseURL
        }).then(res => {
            resolve(res);
            const flag = stockFlag();
            // 判断股市是否开盘，开盘就轮询继续请求
            // 设置延迟后再次发起请求  
            flag ? setTimeout(() => get(url, params, baseURL), delay) : null 
        }).catch(err => {
            reject(err);
            const flag = stockFlag(); 
            flag ? setTimeout(() => get(url, params, baseURL), 1000) : null;
        })
    });
}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
// export function post(url, params) {
//     return new Promise((resolve, reject) => {
//         axios.post(url, QS.stringify(params))
//             .then(res => {
//                 resolve(res.data);
//             })
//             .catch(err => {
//                 reject(err.data)
//             })
//     });
// }

export default instance