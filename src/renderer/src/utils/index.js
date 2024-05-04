// 节假日列表
const publicHolidays = [
    // 元旦
    '2023-12-30',
    '2023-12-31',
    '2024-01-01',
    // 春节
    '2024-02-10',
    '2024-02-11',
    '2024-02-12',
    '2024-02-13',
    '2024-02-14',
    '2024-02-15',
    '2024-02-16',
    '2024-02-17',
    // 清明节
    '2024-04-04',
    '2024-04-05',
    '2024-04-06',
    // 劳动节
    '2024-05-01',
    '2024-05-02',
    '2024-05-03',
    '2024-05-04',
    '2024-05-05',
    // 端午节
    '2024-06-08',
    '2024-06-09',
    '2024-06-10',
    // 中秋节
    '2024-09-15',
    '2024-09-16',
    '2024-09-17',
    // 国庆节
    '2024-10-01',
    '2024-10-02',
    '2024-10-03',
    '2024-10-04',
    '2024-10-05',
    '2024-10-06',
    '2024-10-07'
];

// 判断今日股市是否开盘
export const stockFlag = () => {
    const weekDay = new Date().getDay();  // 获取星期几 0 周日 1 周一 ...
    const today = new Date().toISOString().split('T')[0]; // 获取当日日期 YYYY-MM-DD
    if (weekDay >= 1 && weekDay <= 5) {
        if (publicHolidays.includes(today)) {
            // 是节假日
            return false
        } else {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            // 转换时间为24小时制  
            const openMorningHour = 9;
            const openMorningMinute = 30;
            const closeMorningHour = 11;
            const closeMorningMinute = 30;
            const openAfternoonHour = 13;
            const closeAfternoonHour = 15;
            const openAfternoonMinute = 0;
            const closeAfternoonMinute = 0;

            // 检查当前时间是否在上午开盘时间内  
            if (hours === openMorningHour && minutes >= openMorningMinute) {
                return true;
            } else if (hours > openMorningHour && hours < closeMorningHour) {
                return true;
            } else if (hours === closeMorningHour && minutes < closeMorningMinute) {
                return true;
            }

            // 检查当前时间是否在下午开盘时间内  
            if (hours === openAfternoonHour && minutes >= openAfternoonMinute) {
                return true;
            } else if (hours > openAfternoonHour && hours < closeAfternoonHour) {
                return true;
            } else if (hours === closeAfternoonHour && minutes < closeAfternoonMinute) {
                return true;
            }

            // 如果当前时间不在上述任何时间范围内，则返回false  
            return false;  
        }
    } else {
        // 不是工作日
        return false;
    }
}

// 获取最近一次的股市开市日期
export const openEquityMarketDay = (yesterday) => {
    let weekDay = yesterday ? new Date(yesterday).getDay() : new Date().getDay();  // 获取星期几 0 周日 1 周一 ...
    let day = yesterday ? new Date(yesterday).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    // 判断day这天股市是否开盘
    if(!publicHolidays.includes(day) && (weekDay >= 1 && weekDay <= 5)) {
        return day;
    } else {
        // 将字符串转换回Date对象 
        let todayDate = new Date(day);
        // 回退一天  
        todayDate.setDate(todayDate.getDate() - 1); 
        let previousDay = todayDate.toISOString().split('T')[0]
        return openEquityMarketDay(previousDay);
    }
}

/**
 * 函数防抖
 * func - 函数
 * duration - 延迟
 */
export const debounce = (func, duration = 500) => {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args)
        }, duration)
    }
}