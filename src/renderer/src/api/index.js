import { get } from '@/api/axios'

// 麦蕊智数licence
const licence = 'aa43656c35008536b3'
// 4c45e6480502b27048

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

// stockApi
// 查询所有A股股票数据，包括股票名称、股票代码
export const getBaseAll = (p) => get(`/v1/base/all`, p, '/sapi')
// 查询所有A股股票历史日线，周线，月线行情，数据都是前复权的
export const getBaseDay = (p) => get(`/v1/base/day`, p, '/sapi')
