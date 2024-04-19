import { get } from '@/api/axios'

const fs = window.api.moduleFs();
const path = window.api.moduleJoin();
// 麦蕊智数licence
// const licence = '56f631a5d86878eef0'
// const licence = '8ba901372c1638889'
const licence = '3b931883716162366f'
// let licence;
// if(process.env['NODE_ENV'] == "development") {
// 	localStorage.settingUrl = "./setting.json";
// } else {
// 	localStorage.settingUrl = path.join(__dirname, "../../setting.json");
// }

// fs.readFile(localStorage.settingUrl, "utf8", (err, data) => {
//     const settingData = JSON.parse(data);
//     console.log(settingData)
//     licence = settingData.licenceCode
// })
// // 监听文件变化
// fs.watch(localStorage.settingUrl, () => {
//     fs.readFile(localStorage.settingUrl, "utf8", (err, data) => {
//         const settingData = JSON.parse(data);
//         licence = settingData.licenceCode
//     })
// })

// 麦蕊智数
// 获取所有股票（5000+只股）
export const getHsltList = (p) => get(`/hslt/list/${licence}`, p, '/mapi')
// 实时交易数据接口
export const getStockDetail = (c, p) => get(`/hsrl/ssjy/${c}/${licence}`, p, '/mapi')
// 获取沪深指数
export const getAllIndexList = (p) => get(`/zs/all/${licence}`, p, '/mapi')
// 指数实时数据接口
export const indexRealTimeData = (c, p) => get(`/zs/sssj/${c}/${licence}`, p, '/mapi', 60000)
// 涨停股池
export const limitUp = (d, p) => get(`/hslt/ztgc/${d}/${licence}`, p, '/mapi', 600000)
// 跌停股池
export const limitDown = (d, p) => get(`/hslt/dtgc/${d}/${licence}`, p, '/mapi', 600000)
// 强势股池
export const mighty = (d, p) => get(`/hslt/qsgc/${d}/${licence}`, p, '/mapi', 600000)
// 次新股池
export const nextNew = (d, p) => get(`/hslt/cxgc/${d}/${licence}`, p, '/mapi', 600000)
// 炸板股池
export const boomStock = (d, p) => get(`/hslt/zbgc/${d}/${licence}`, p, '/mapi', 600000)
// 今日交易提示
export const prompt = (p) => get(`/hitc/jrts/${licence}`, p, '/mapi', 600000)
// 机构持股汇总
export const institutionCollect = (y, q, p) => get(`/hijg/jgcghz/${y}/${q}/${licence}`, p, '/mapi', 600000)
// 基金重仓
export const jijiHeavy = (y, q, p) => get(`/hijg/jj/${y}/${q}/${licence}`, p, '/mapi', 600000)

// stockApi
// 查询所有A股股票数据，包括股票名称、股票代码
export const getBaseAll = (p) => get(`/v1/base/all`, p, '/sapi')
// 查询所有A股股票历史日线，周线，月线行情，数据都是前复权的
export const getMin = (p) => get(`/v1/base/second`, p, '/sapi')
