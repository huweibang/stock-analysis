let lastItem;

export const calculate = (list, maList) => {
    lastItem = list[list.length - 1]

    if(isHammerCandlestick(list)) {
        return "低位锤形线"
    }
    if(isLowHammerstick(list)) {
        return "低位倒锤线"
    }
    if(isImmortal(list)) {
        return "仙人指路"
    }
    if(lowCrossStar(list)) {
        return "低位十字星"
    }
    if(isRedThreeSoldiers(list)) {
        return "红三兵"
    }
    if(isMultiPartyArtillery(list)) {
        return "多方炮"
    }
    if(isBullishBeltHold(list)) {
        return "看涨捉腰带"
    }
    if(isLowSpinningTop(list)) {
        return "低位螺旋桨"
    }
    if(isMorningStar(list)) {
        return "启明之星"
    }
    if(isBullishEngulfing(list)) {
        return "看涨吞没"
    }
    if(isEvenBottom(list)) {
        return "平头底部"
    }
    if(isRisingSun(list)) {
        return "旭日东升"
    }
    if(isBearishHaramiCross(list)) {
        return "阴孕十字"
    }
    if(isAscendingThreeMethods(list)) {
        return "上升三法"
    }
    if(isSeparatingLines(list)) {
        return "上涨分手"
    }
    if(isThreeGapDown(list)) {
        return "三空阴线"
    }
    if(isFallingExhaustion(list)) {
        return "下跌尽头线"
    }
    if(isBullishAbandonedBaby(list)) {
        return "看涨舍子线"
    }
    if(isAirRefueling(list)) {
        return "空中加油"
    }
    if(isShavenHeadYang()) {
        return "光头阳"
    }
    if(isEveningStar(list)) {
        return "黄昏之星"
    }
    if(isThreeCrows(list)) {
        return "三只乌鸦"
    }
    if(isHighHangingMan(list)) {
        return "高位吊颈线"
    }
    if(isDeadlyCandlestick(list, maList)) {
        return "断头铡刀"
    }
    if(isBearishBeltHold(list)) {
        return "看跌提腰带线"
    }
    if(isBearishEngulfing(list)) {
        return "看跌吞没形态"
    }
    if(isFlatTop(list)) {
        return "平顶（镊子线）"
    }
    if(isGapDown(list)) {
        return "跳空低开"
    }
    if(isDarkClouds(list)) {
        return "乌云盖顶"
    }
    if(isNineYinBaiGuZhua(list)) {
        return "九阴白骨爪"
    }
    if(isDoubleBearishEngulfing(list)) {
        return "叠叠空方炮"
    }
    return "暂无匹配对应K线"
}

// 判断K线是否处于上涨状态
const upState = (record) => {
    // 判断是否是处于下跌状态
    let decreasingCount = 0; // 统计上涨个数
    let cumulativeChange = 0; // 累计价格变化
    for (let i = 1; i < record.length; i++) {
        if (record[i].c > record[i - 1].c) {
            decreasingCount++;
        }
        cumulativeChange += record[i].c - record[i - 1].c;
    }

    // 如果超过一半的元素是上升的，且累积变化是正数，则整体趋势是上涨的
    if((decreasingCount > record.length / 2) || cumulativeChange > 0) {
        return true
    } else {
        return false
    }
}

// 判断K线是否处于下跌状态
const downState = (record) => {
    // 判断是否是处于下跌状态
    let decreasingCount = 0; // 统计下跌个数
    let cumulativeChange = 0; // 累计价格变化
    for (let i = 1; i < record.length; i++) {
        if (record[i].c < record[i - 1].c) {
            decreasingCount++;
        }
        cumulativeChange += record[i].c - record[i - 1].c;
    }

    // 如果超过一半的元素是下降的，且累积变化是负数，则整体趋势是下降的
    if((decreasingCount > record.length / 2) || cumulativeChange < 0) {
        return true
    } else {
        return false
    }
}

// 计算K线实体长度
const bodyLength = (item) => {
    // 开盘价与收盘价的绝对差值
    return Math.abs(item.c - item.o);
}

// 计算上影线的长度
const upperShadowLength = (item) => {
    // 确定实体的顶部
    const bodyTop = item.c >= item.o ? item.c : item.o;
    // 计算上影线长度，即最高价与实体顶部的差值
    return item.h - bodyTop;
}

// 计算下影线的长度
const lowerShadowLength = (item) => {
    // 确定实体的底部
    const bodyBottom = item.c <= item.o ? item.c : item.o;
    // 计算上影线长度，即实体底部与最低价的差值
    return bodyBottom - item.l;
}

/**
 * 判断低位锤形线的特征：
 * 1. 实体部分较小，涨跌幅在3%以内
 * 2. 有较长的下影线，这里定义为实体长度的2倍以上
 * 3. 上影线较短或没有，这里假设上影线长度不超过实体长度
 * o - 开盘价
 * c - 收盘价
 * h - 最高价
 * l - 最低价
 */
function isHammerCandlestick(record) {
    if(downState(record)) {
        // 计算实体部分的大小（开盘价与收盘价的绝对差值）
        const bodySize = bodyLength(lastItem);
        // 计算上影线的长度
        const upperShadow = upperShadowLength(lastItem);
        // 计算下影线的长度
        const lowerShadow = lowerShadowLength(lastItem);

        // 根据定义的特征判断是否为锤形线
        const isSmallBody = lastItem.zd < 3;
        const hasLongLowerShadow = lowerShadow > 3 * bodySize;
        const hasShortUpperShadow = upperShadow < bodySize;

        return isSmallBody && hasLongLowerShadow && hasShortUpperShadow;
    }
}

/**
 * 判断低位倒锤线的特征：
 * 1. 出现在下跌过程中，上影线较长，下影线很短或没有
 * 2. 收盘价接近开盘价
 * 3. 下影线较短或没有，这里假设下影线长度不超过实体长度
 */
function isLowHammerstick(record) {
    if(downState(record)) {
        const bodySize = bodyLength(lastItem);
        const upperShadow = upperShadowLength(lastItem);
        const lowerShadow = lowerShadowLength(lastItem);

        const isSmallBody = lastItem.zd < 3;
        const hasLongLowerShadow = lowerShadow < bodySize;
        const hasShortUpperShadow = upperShadow > 3 * bodySize;

        return isSmallBody && hasLongLowerShadow && hasShortUpperShadow;
    }
}

// 判断仙人指路
function isImmortal(record) {
    if(upState(record)) {
        const secondLast = record[record.length - 2]
        const bodySize = bodyLength(lastItem);
        const upperShadow = upperShadowLength(lastItem);

        // 计算实体长度比例，上影线比例
        const bodyLengthRatio = bodySize / (lastItem.h - lastItem.l);
        const upperShadowRatio = upperShadow / (lastItem.h - lastItem.l);
        
        // 定义阈值，这些阈值可能需要根据具体情况调整
        const bodyLengthThreshold = 0.1; // 实体长度比例的上限
        const upperShadowThreshold = 0.3; // 上影线比例的下限
        const volumeThreshold = 1.5; // 当前成交量至少是前一日成交量的1.5倍，表示放量
        
        // 收盘价高于前一日
        const isRise = lastItem.c > secondLast.c;
        
        // 实体较短
        const hasSmallBody = bodyLengthRatio < bodyLengthThreshold;
        
        // 上影线较长
        const hasLongUpperShadow = upperShadowRatio > upperShadowThreshold;
        
        // 成交量高于平均水平或前一交易日
        const isVolumeUp = lastItem.v > secondLast.v * volumeThreshold;
        
        // 所有条件必须满足才能判定为仙人指路
        return isRise && hasSmallBody && hasLongUpperShadow && isVolumeUp;
    }
}

// 低位十字星
function lowCrossStar (record) {
    if(downState(record)) {
        const bodySize = bodyLength(lastItem);
        const upperShadow = upperShadowLength(lastItem);
        const lowerShadow = lowerShadowLength(lastItem);

        // 定义上下影线均为实体3倍以上
        // 定义阈值
        const num = 3;

        const hasSmallBody = bodySize < 1;
        const hasLongUpperShadow = upperShadow > num * bodySize;
        const hasLowerShadow = lowerShadow > num * bodySize;

        return hasSmallBody && hasLongUpperShadow && hasLowerShadow;
    }
}

/**
 * 判断红三兵的特征：
 * 1. 连续三根小阳线：每根K线都是阳线，即收盘价高于开盘价。
 * 2. 实体和影线均较短：实体长度和影线长度都相对较短。
 * 3. 没有跳空高开：每根K线的开盘价与前一根K线的收盘价相近，没有出现明显的跳空。
 */
function isRedThreeSoldiers(record) {
    const arr = record.slice(-3);
    const candlestick1 = arr[0];
    const candlestick2 = arr[1];
    const candlestick3 = arr[2];

    // 计算三个实体的两两之间的差的绝对值
    const diffs = [Math.abs(candlestick1.zde - candlestick2.zde), Math.abs(candlestick2.zde - candlestick3.zde), Math.abs(candlestick1.zde - candlestick3.zde)];
    
    // 定义容忍范围
    const tolerance = 0.6;
    
    // 检查K线实体是否较短，是否小于或等于容忍范围
    const diffFlag =  diffs.every(diff => diff <= tolerance);

    // 检查每根K线是否为阳线
    const isBullishCandlestick = (item) => item.c > item.o;
    
    // 检擦影线是否较短
    const hasShortBodyAndShadow = (item) => {
        const bodySize = bodyLength(item);
        const upperShadow = upperShadowLength(item);
        const lowerShadow = lowerShadowLength(item);
        
        return  upperShadow <= bodySize + 0.5 && lowerShadow <= bodySize + 0.5;
    };
    
    // 检查连续性（没有跳空高开）
    const hasNoGapUp = candlestick2.l <= candlestick1.h && candlestick3.l <= candlestick2.h;
    
    // 所有条件必须满足才能判定为红三兵
    return (
        diffFlag &&
        isBullishCandlestick(candlestick1) &&
        isBullishCandlestick(candlestick2) &&
        isBullishCandlestick(candlestick3) &&
        hasShortBodyAndShadow(candlestick1) &&
        hasShortBodyAndShadow(candlestick2) &&
        hasShortBodyAndShadow(candlestick3) &&
        hasNoGapUp
    );
}

/**
 * 判断多方炮的特征：
 * 1. 第一根是中阳线或大阳线：第一根K线是阳线，且实体相对较长。
 * 2. 第二根是阴线：第二根K线是阴线，且其实体完全处于第一根阳线的实体内部。
 * 3. 第三根是阳线：第三根K线是阳线，且其实体完全包住第二根阴线的实体，形成吞噬形态。
 * 4. 第三根阳线成交量放大：与前两根K线相比，第三根阳线对应的成交量有明显增加。
 */
function isMultiPartyArtillery(record) {
    const arr = record.slice(-3);
    const candlestick1 = arr[0];
    const candlestick2 = arr[1];
    const candlestick3 = arr[2];
    // 定义长阳线的实体长度阈值，这个值可能需要根据具体情况调整
    const longBodyThreshold = (candlestick1.h - candlestick1.l) * 0.5;
    
    // 检查K线是否为阳线或阴线
    const isBullishCandlestick = (item) => item.c > item.o;
    const isBearishCandlestick = (item) => item.c < item.o;
    
    // 检查阴线实体是否被阳线实体完全包住
    const isEngulfedByBullishCandle = (rish, fall) =>
        fall.o >= rish.o && fall.c <= rish.c;
    
    // 检查成交量是否放大，这里简化为第三根K线的成交量大于前两根K线的成交量
    const isVolumeUp = (currentVolume, previousVolume1, previousVolume2) =>
        currentVolume > previousVolume1 && currentVolume > previousVolume2;
    
    // 获取实体长度
    const bodyLength1 = bodyLength(candlestick1);
    const bodyLength2 = bodyLength(candlestick2);
    const bodyLength3 = bodyLength(candlestick3);

    // 所有条件必须满足才能判定为多方炮
    return (
        isBullishCandlestick(candlestick1) && // 第一根是阳线
        isBearishCandlestick(candlestick2) && // 第二根是阴线
        isBullishCandlestick(candlestick3) && // 第三根是阳线
        bodyLength2 / bodyLength1 < 1 && // 阴线实体在阳线实体内部
        isEngulfedByBullishCandle(candlestick1, candlestick2) && // 第三根阳线包住阴线
        bodyLength3 >= longBodyThreshold && // 第三根阳线实体较长
        isVolumeUp(candlestick3.v, candlestick1.v, candlestick2.v) // 第三根阳线成交量放大
    );
}

/**
 * 判断看涨捉腰带的特征：
 * 1. 出现在下跌趋势中。
 * 2. 阴线后跟随阳线：看涨捉腰带线通常出现在一根阴线之后，紧接着是一根阳线
 * 3. 阳线实体覆盖阴线实体：阳线的实体应该完全覆盖前一根阴线的实体。
 * 4. 捉腰带线的阳线部分应该相对较大，而影线较短。
 */
function isBullishBeltHold(record) {
    const secondLast = record[record.length - 2];
    if(downState(record)) {
        // 计算第二根K线的实体长度和影线长度
        const bodyLength2 = bodyLength(lastItem);
        const upperShadowLength2 = upperShadowLength(lastItem)
        const lowerShadowLength2 = lowerShadowLength(lastItem);
        
        // 阳线实体是否覆盖阴线实体
        const isEngulfing = lastItem.o >= secondLast.o && lastItem.c <= secondLast.c;
        
        // 定义影线长度与实体长度的比值阈值，用于判断影线是否“短”
        const shadowToBodyRatioThreshold = 0.5;
        
        // 检查阳线是否有较短的上影线和下影线
        const hasShortUpperShadow = upperShadowLength2 / bodyLength2 <= shadowToBodyRatioThreshold;
        const hasShortLowerShadow = lowerShadowLength2 / bodyLength2 <= shadowToBodyRatioThreshold;
        
        // 第一根K线应为阴线，第二根K线应为阳线，且阳线实体覆盖阴线实体，阳线影线较短
        const bullishBeltHoldConditions = secondLast.c < secondLast.o && // 阴线
            lastItem.c > lastItem.o && // 阳线
            isEngulfing &&
            hasShortUpperShadow &&
            hasShortLowerShadow;
        
        return bullishBeltHoldConditions;
    }
}

/**
 * 判断低位螺旋桨的特征：
 * 1. 出现在下跌趋势中。
 * 2. 阴线后跟随阳线：看涨捉腰带线通常出现在一根阴线之后，紧接着是一根阳线
 * 3. 阳线实体覆盖阴线实体：阳线的实体应该完全覆盖前一根阴线的实体。
 * 4. 捉腰带线的阳线部分应该相对较大，而影线较短。
 */
function isLowSpinningTop(record) {
    const secondLast = record[record.length - 2];

    if(downState(record)) {
        const bodySize = bodyLength(lastItem);
        const upperShadow = upperShadowLength(lastItem);
        const lowerShadow = lowerShadowLength(lastItem);
        
        // 定义阈值，这些值可能需要根据具体情况调整
        const bodyToShadowRatioThreshold = 0.5; // 实体与下影线长度的比值阈值
        const upperShadowToBodyThreshold = 2; // 上影线与实体长度的最大比值阈值
        
        // 检查是否为小实体
        const hasSmallBody = bodySize <= (lastItem.h - lastItem.l) * 0.05;
        
        // 检查是否有长下影线
        const hasLongLowerShadow = lowerShadow / bodySize >= bodyToShadowRatioThreshold;
        
        // 检查是否有短或无上影线
        const hasShortUpperShadow = upperShadow / bodySize <= upperShadowToBodyThreshold;
        
        // 检查成交量，比上一条的成交量要小
        const lowVolume = lastItem.v <= secondLast.v; // someVolumeThreshold需要根据实际情况确定
        
        // 所有条件必须满足才能判定为低位螺旋桨
        return hasSmallBody && hasLongLowerShadow && hasShortUpperShadow && lowVolume;
    }
}

/**
 * 判断启明之星的特征：
 * 1. 第一根是长阴线：第一根K线是阴线，且实体相对较长。
 * 2. 第二根是星线：第二根K线实体较小，可以是阳线或阴线，且实体向下低开，通常伴随着长上影线和/或长下影线。
 * 3. 第三根是阳线：第三根K线是阳线，其实体进入第一根阴线的实体范围内。
 * 4. 第三根阳线的收盘价：理想的启明之星形态中，第三根阳线的收盘价通常高于第一根阴线的实体中点。
 */
function isMorningStar(record) {
    const arr = record.slice(-3);
    const candlestick1 = arr[0];
    const candlestick2 = arr[1];
    const candlestick3 = arr[2];
    // 计算每根K线的实体长度
    const bodyLength1 = bodyLength(candlestick1);
    const bodyLength2 = bodyLength(candlestick2);

    // 第一根K线为长阴线
    const isLongBearishCandlestick1 = bodyLength1 > (candlestick1.h - candlestick1.l) * 0.5;
    
    // 第二根K线为星线，实体较小，下开
    const isStarCandlestick2 = bodyLength2 < bodyLength1 * 0.3 && candlestick2.o < candlestick1.c;
    
    // 第三根K线为阳线，其实体进入第一根阴线的实体范围内
    const isBullishCandlestick3 = candlestick3.c > candlestick3.o && candlestick3.c > candlestick1.o;
    
    // 第三根阳线的实体至少进入第一根阴线实体的一半
    const isPenetrativeCandlestick3 = candlestick3.c > (candlestick1.o + candlestick1.c) / 2;
    
    // 所有条件必须满足才能判定为启明之星
    return isLongBearishCandlestick1 && isStarCandlestick2 && isBullishCandlestick3 && isPenetrativeCandlestick3;
}

/**
 * 判断看涨吞没的特征：
 * 1. 第一根是阴线。
 * 2. 第二根是阳线。
 * 3. 第二根K线实体吞没第一根K线实体：第二根K线的实体从开盘到收盘价完全覆盖了第一根K线的实体部分。
 */
function isBullishEngulfing(record) {
    const secondLast = record[record.length - 2];
    if(downState(record)) {
        // 检查第一根K线是否为阴线，第二根K线是否为阳线
        const isFirstBearish = secondLast.c < secondLast.o;
        const isSecondBullish = lastItem.c > lastItem.o;
        
        // 检查第二根K线实体是否吞没了第一根K线实体
        const isEngulfing = lastItem.o < secondLast.o && lastItem.c > secondLast.c;
        
        // 所有条件必须满足才能判定为看涨吞没
        return isFirstBearish && isSecondBullish && isEngulfing;
    }
}

/**
 * 判断平头底部的特征：
 * 1. 下降趋势中：在一轮下降趋势中形成。
 * 2. 两根K线有相同的最低价：这两根K线的最低价相同，表明股价在尝试更低的价格时受到支撑。
 * 3. 两条K线均为阴线
 */
function isEvenBottom(record) {
    const secondLast = record[record.length - 2];
    if(downState(record)) {
        // 检查两根K线是否有相同的最低价
        const isSameLow = secondLast.l === lastItem.l;

        const isYing1 = secondLast.zde < 0;
        const isYing2 = lastItem.zde < 0;
        
        // 所有条件必须满足才能判定为平头底部
        return isSameLow && isYing1 && isYing2;
    }
}

/**
 * 判断旭日东升的特征：
 * 1. 第一根是中阴线或大阴线：第一根K线是阴线，且实体相对较长，表明市场处于下跌趋势。
 * 2. 第二根是高开的中阳线或大阳线：第二根K线是阳线，且开盘价高于第一根K线的收盘价，表明开盘时买方积极介入。
 * 3. 第二根阳线的收盘价高于第一根阴线的开盘价：这表明买方不仅推动价格上涨，而且收盘价还超过了卖方在第一根K线开盘时控制的价格水平。
 */
function isRisingSun(record) {
    const secondLast = record[record.length - 2];
    if(downState(record)) {
        // 检查第一根K线是否为阴线
        const isBearishCandlestick1 = secondLast.zde < 0;
        
        // 检查第二根K线是否为阳线，并且高开
        const isBullishCandlestick2 = lastItem.zde > 0;
        const isGapUp = lastItem.o > secondLast.c;
        
        // 检查第二根阳线的收盘价是否高于第一根阴线的开盘价
        const isCloseAboveOpen = lastItem.c > secondLast.o;
        
        // 所有条件必须满足才能判定为旭日东升
        return isBearishCandlestick1 && isBullishCandlestick2 && isGapUp && isCloseAboveOpen;
    }
}

/**
 * 判断阴孕十字的特征：
 * 1. 第一根是中阴线或大阴线：第一根K线是阴线，且实体相对较长，表明市场处于下跌趋势。
 * 2. 第二根是高开的中阳线或大阳线：第二根K线是阳线，且开盘价高于第一根K线的收盘价，表明开盘时买方积极介入。
 * 3. 第二根阳线的收盘价高于第一根阴线的开盘价：这表明买方不仅推动价格上涨，而且收盘价还超过了卖方在第一根K线开盘时控制的价格水平。
 */
function isBearishHaramiCross(record) {
    const secondLast = record[record.length - 2];
    if(downState(record)) {
        // 检查第一根K线是否为阴线且实体相对较长
        const isBearishCandlestick1 = secondLast.zde < 0 && bodyLength(secondLast) > 3;

        // 检查第二根K线是否为十字星线
        // 十字星线定义为实体长度非常小，这里我们假设实体长度小于某个阈值
        const isDojiCandlestick2 = bodyLength(lastItem) < 0.5;

        // 检查十字星线是否完全在第一根阴线的实体内
        const isWithinFirstCandle = lastItem.o > secondLast.o && lastItem.c < secondLast.c;

        // 所有条件必须满足才能判定为阴孕十字
        return isBearishCandlestick1 && isDojiCandlestick2 && isWithinFirstCandle;
    }
}

/**
 * 判断上升三法的特征：
 * 1. 第一根是中阳线或大阳线：上涨趋势中，出现一根中阳线或大阳线，伴随成交量放大。
 * 2. 接下来是三根小实体K线：这三根K线的实体部分都位于第一根阳线的实体之内，可以是阳线也可以是阴线，表明市场在短暂的价格区间内犹豫或调整。
 * 3. 第五根是高开阳线：在三根小实体K线之后，出现一根高开的阳线，其实体部分也位于第一根阳线实体之内，且其收盘价高于第一根阳线的收盘价。
 */
function isAscendingThreeMethods(record) {
    if(upState(record)) {
        const arr = record.slice(-5);
        const candlestick1 = arr[0];
        const small1 = arr[1];
        const small2 = arr[2];
        const small3 = arr[3];
        const candlestick5 = arr[4];

        // 检查第一根K线是否为阳线
        const isFirstBullish = candlestick1.zde > 0;
        
        // 检查第五根K线是否为高开阳线，且收盘价高于第一根阳线的收盘价
        const isFifthBullish = candlestick5.zde > 0 && candlestick5.c > candlestick1.c;
        
        // 检查三根小实体K线是否都在第一根阳线实体内部
        const areSmallBodiesInside = 
            small1.o > candlestick1.o && small1.c < candlestick1.c &&
            small2.o > candlestick1.o && small2.c < candlestick1.c &&
            small3.o > candlestick1.o && small3.c < candlestick1.c;
        
        // 检查第五根阳线是否高开
        const isCandlestick5GapUp = candlestick5.o > small3.c;

        // 所有条件必须满足才能判定为上升三法
        return isFirstBullish && isFifthBullish && areSmallBodiesInside && isCandlestick5GapUp;
    }
}

/**
 * 判断上涨分手的特征：
 * 1. 第一根是中阴线或大阴线：在上涨趋势中，出现一根中阴线或大阴线。
 * 2. 第二根是高开高走的阳线：紧接着出现一根高开的阳线.
 * 3. 两根K线的开盘价大致相等：第二根阳线的开盘价与第一根阴线的开盘价相同或大致相等。
 */
function isSeparatingLines(record) {
    if(upState(record)) {
        const secondLast = record[record.length - 2];

        // 检查第一根K线是否为阴线
        const isFirstBearish = secondLast.zde < 0;
        
        // 检查第二根K线是否为高开高走的阳线
        const isSecondBullish = lastItem.zde > 0;
        const isSecondGapUp = lastItem.o > secondLast.o;
        
        // 检查两根K线的开盘价是否大致相等,0.2的正负差
        const haveEqualOpens = -0.2 < lastItem.o - secondLast.o < 0.2;

        // 所有条件必须满足才能判定为上涨分手
        return isFirstBearish && isSecondBullish && isSecondGapUp && haveEqualOpens;
    }
}

/**
 * 判断三空阴线的特征：
 * 1. 在下跌趋势中，连续出现三根阴线。
 * 2. 跳空低开：每根阴线都比前一根阴线的收盘价低开盘，形成跳空缺口
 */
function isThreeGapDown(record) {
    if(downState(record)) {
        const arr = record.slice(-3);
        const candlestick1 = arr[0];
        const candlestick2 = arr[1];
        const candlestick3 = arr[2];

        // 检查每根K线是否为阴线
        const isBearish1 = candlestick1.zde < 0;
        const isBearish2 = candlestick2.zde < 0;
        const isBearish3 = candlestick3.zde < 0;
        
        // 检查是否为跳空低开
        const hasGap1 = candlestick2.o < candlestick1.c;
        const hasGap2 = candlestick3.o < candlestick2.c;
        
        // 所有条件必须满足才能判定为三空阴线
        return isBearish1 && isBearish2 && isBearish3 && hasGap1 && hasGap2;
    }
}

/**
 * 判断下跌尽头线的特征：
 * 1. 第一根是带长下影线的阴线：在下跌趋势中，出现一根具有明显长下影线的阴线，表明下方有买盘支撑。
 * 2. 第二根是小K线：紧接着出现一根实体较小的K线，无论是阴线还是阳线。
 * 3. 第二根K线完全处于第一根K线的长下影线之内：第二根K线的开盘价、收盘价、最高价和最低价都应位于第一根K线的下影线范围内。
 */
function isFallingExhaustion(record) {
    if(downState(record)) {
        const secondLast = record[record.length - 2];
        
        // 检查第一根K线是否为带长下影线的阴线, 长度大于2以上
        const isBearish = secondLast.zde < 0 && lowerShadowLength(secondLast) > 2;
        
        // 检查第二根K线实体是否完全处于第一根K线的长下影线之内
        const isWithinLowerShadow2 = lastItem.o >= secondLast.l && 
                                    lastItem.c <= secondLast.l &&
                                    lastItem.h >= secondLast.l && 
                                    lastItem.l <= secondLast.l;
        
        // 检查第二根K线是否为小K线
        const isSmallCandlestick2 = bodyLength(lastItem) < lowerShadowLength(secondLast);
        
        // 所有条件必须满足才能判定为下跌尽头线
        return isBearish && isWithinLowerShadow2 && isSmallCandlestick2;
    }
}

/**
 * 判断看涨舍子线的特征：
 * 1. 第一根是阴线：下跌趋势中出现一根阴线。
 * 2. 第二根是十字线：紧接着出现一根十字线，可以是阴线或阳线，实体较小。
 * 3. 第三根是阳线：之后出现一根阳线，且该阳线的开盘价高于第二根十字线的开盘价，形成向上跳空缺口。
 * 4. 跳空缺口：十字线与前后两根K线都存在跳空缺口，且第三根阳线的跳空缺口弥补了十字线的向下跳空缺口
 */
function isBullishAbandonedBaby(record) {
    if(downState(record)) {
        const arr = record.slice(-3);
        const candlestick1 = arr[0];
        const candlestick2 = arr[1];
        const candlestick3 = arr[2];

        // 定义十字线实体长度阈值
        const someSmallThreshold = 1;

        // 检查第一根K线是否为阴线
        const isFirstBearish = candlestick1.zde < 0;
        
        // 检查第二根K线是否为十字线
        const isSecondDoji = Math.abs(candlestick2.c - candlestick2.o) < someSmallThreshold;
        
        // 检查第三根K线是否为阳线
        const isThirdBullish = candlestick3.zde > 0;
        
        // 检查是否存在跳空缺口
        const hasDownGapBetweenFirstAndSecond = candlestick2.o > candlestick1.c;
        const hasUpGapBetweenSecondAndThird = candlestick3.o > candlestick2.c;
        
        // 检查阳线的跳空缺口是否弥补了十字线的向下跳空缺口
        const doesThirdGapOffsetSecondGap = candlestick3.o >= candlestick2.o;
        
        // 所有条件必须满足才能判定为看涨舍子线
        return isFirstBearish && isSecondDoji && isThirdBullish &&
            hasDownGapBetweenFirstAndSecond && hasUpGapBetweenSecondAndThird &&
            doesThirdGapOffsetSecondGap;
    }
}

/**
 * 判断空中加油的特征：
 * 1. 前期上涨：股价从底部开始上涨，形成明显的上升趋势。
 * 2. 高位回调或盘整：在达到一定高位后，股价出现短暂回调或在一个区间内盘整。
 * 3. 继续上涨：经过一段时间的盘整后，股价再次开始上涨，突破盘整区间。
 */
function isAirRefueling(record) {
    // 定义趋势判断函数
    function isUpTrend(arr) {
        return arr.slice(1).every(k => k.c >= k.o);
    }

    // 定义盘整期判断函数
    function isConsolidation(arr) {
        const firstClose = arr[0].c;
        const lastClose = arr[arr.length - 1].c;
        const tolerance = (lastClose - firstClose) * 0.1; // 定义一个容忍范围，比如收盘价的10%
        return arr.every(k => k.c >= firstClose - tolerance && k.c <= lastClose + tolerance);
    }

    // 定义空中加油的判断逻辑
    // 1. 初始上涨趋势
    // 2. 接着进入盘整期
    // 3. 然后突破盘整期继续上涨
    const initialUpTrend = isUpTrend(record.slice(0, Math.ceil(record.length / 3)));
    const consolidation = isConsolidation(record.slice(Math.ceil(record.length / 3), Math.ceil(2 * record.length / 3)));
    const postConsolidationUpTrend = isUpTrend(record.slice(Math.ceil(2 * record.length / 3)));

    // 所有条件必须满足才能判定为空中加油
    return initialUpTrend && consolidation && postConsolidationUpTrend;
}

/**
 * 判断光头阳的特征：
 * 1. 无上下影线。
 */
function isShavenHeadYang() {
    // 当天为涨
    const riseLast = lastItem.zde > 0;
    let upperShadow = upperShadowLength(lastItem);
    let lowerShadow = lowerShadowLength(lastItem);

    // 如果数值小于阈值，则返回0；否则返回原数值
    const threshold = 0.1;
    upperShadow = upperShadow < threshold ? 0 : upperShadow.toFixed(2);
    lowerShadow = lowerShadow < threshold ? 0 : lowerShadow.toFixed(2);

    const line1 = upperShadow == 0;
    const line2 = lowerShadow == 0;

    return riseLast && line1 && line2
}

/**
 * 判断黄昏之星的特征：
 * 1. 第一根是长阳线：上升趋势中出现一根长阳线，表明市场情绪积极。
 * 2. 第二根是星线：紧接着出现一根实体部分窄小的K线，可以是十字星或小阳线/阴线，形成星的主体。这根K线的实体应该完全处于第一根阳线的实体之内，且伴随着较长的上影线。
 * 3. 第三根是长阴线：出现一根长阴线，其实体应该在第二根星线的实体以下，表明市场情绪发生转变，价格下跌。
 */
function isEveningStar(record) {
    if(upState(record)) {
        const arr = record.slice(-3);
        const candlestick1 = arr[0];
        const candlestick2 = arr[1];
        const candlestick3 = arr[2];

        // 计算每根K线的实体长度
        const bodyLength1 = bodyLength(candlestick1);
        const bodyLength2 = bodyLength(candlestick2);
        const bodyLength3 = bodyLength(candlestick3);
        
        const someThreshold = 3; // 长阳线的实体长度阈值
        const someSmallThreshold = 1; // 星线的实体长度阈值

        // 第一根K线为长阳线
        const isLongBullishCandlestick1 = candlestick1.zde > 0 && bodyLength1 > someThreshold;

        // 计算第二根K线的上影线长度
        const upperShadowLength2 = upperShadowLength(candlestick2);
        
        // 第二根K线为星线，实体窄小且有长上影线
        const isStarCandlestick2 = bodyLength2 < someSmallThreshold && upperShadowLength2 > 3 * bodyLength2;
        
        // 第三根K线为长阴线，实体在星线的实体以下
        const isLongBearishCandlestick3 = candlestick3.zde < 0 && bodyLength3 > someThreshold && candlestick3.c < candlestick2.c;
        
        // 星线的实体完全处于第一根阳线的实体之内
        const isEngulfedByBullishCandlestick = candlestick2.o > candlestick1.o && candlestick2.c < candlestick1.c;
        
        // 所有条件必须满足才能判定为黄昏之星
        return isLongBullishCandlestick1 && isStarCandlestick2 && isLongBearishCandlestick3 && isEngulfedByBullishCandlestick;
    }
}

/**
 * 判断三只乌鸦的特征：
 * 1. 上升趋势中的第一个大阳线：形态开始于上升趋势中出现的一根大阳线，表明多头控制市场。
 * 2. 连续三根阴线：紧随大阳线之后，出现连续三根阴线，每根阴线的收盘价都低于开盘价，且每根K线的开盘价都位于前一根K线的实体内部，或者至少低于前一根K线实体的高点。
 * 3. 每根阴线都略有跳空低开：每根阴线相对于前一根K线都有一定的跳空低开，形成缺口，这些缺口增加了形态的看跌意味。
 * 4. 阴线实体逐渐增大：在理想的三只乌鸦形态中，随着时间的推移，阴线的实体大小逐渐增大，表示卖方动能增强。
 */
function isThreeCrows(record) {
    if(upState(record)) {
        const arr = record.slice(-4);
        const candlestick1 = arr[0];
        const candlestick2 = arr[1];
        const candlestick3 = arr[2];
        const candlestick4 = arr[2];

        // 定义实体长度的阈值
        const someThreshold = 5; // 大阳线的实体长度阈值

        // 计算每根K线的实体长度
        const bodyLength1 = bodyLength(candlestick1);
        const bodyLength2 = bodyLength(candlestick2);
        const bodyLength3 = bodyLength(candlestick3);
        const bodyLength4 = bodyLength(candlestick4);

        // 第一根K线为大阳线
        const isBullishCandlestick1 = candlestick1.c > candlestick1.o && bodyLength1 > someThreshold;

        // 接下来的三根K线为连续的阴线，开盘价在前一根阳线的实体内部或低于其高点
        const areBearishCandlesticks = [candlestick2, candlestick3, candlestick4].every(item => 
            item.zde < 0 && item.o <= candlestick1.c
        );

        const previousCandlesticks = [candlestick1, candlestick2, candlestick3];
        // 阴线开盘价逐渐降低，形成跳空
        const haveGaps = [candlestick2, candlestick3].every((item, index) => 
            item.o < previousCandlesticks[index].c
        );

        // 阴线实体逐渐增大
        const bodiesAreIncreasing = bodyLength2 < bodyLength3 && bodyLength3 < bodyLength4;

        // 所有条件必须满足才能判定为三只乌鸦
        return isBullishCandlestick1 && areBearishCandlesticks && haveGaps && bodiesAreIncreasing;
    }
}

/**
 * 判断高位吊颈线的特征：
 * 1. 实体非常短小：实体的长度非常短，表明开盘价和收盘价非常接近。
 * 2. 没有或极短的上影线：上影线长度极短，可以忽略不计。
 * 3. 极长的下影线：下影线长度相对于实体长度非常长，表明价格在交易日中有显著的下跌但最终回升。
 * 4. 出现在股价高位：高位吊颈线通常出现在股价已经持续攀升一段时间之后。
 */
function isHighHangingMan(record) {
    if(upState(record)) {
        // 计算K线各长度
        const bodySize = bodyLength(lastItem);
        const upperShadow = upperShadowLength(lastItem);
        const lowerShadow = lowerShadowLength(lastItem);
        
        // 定义股价高位的阈值, 假设比前一天收盘价高5%即为高位
        const someHighThreshold = 1.05;

        // 假设前一天的收盘价
        const secondLast = record[record.length - 2];
        const previousClose = secondLast.c;

        // 定义实体长度与下影线长度的比值阈值
        const bodyToLowerShadowRatioThreshold = 0.3;
        
        // 判断实体是否非常短小
        const hasSmallBody = bodySize <= (lastItem.h - lastItem.l) * 0.05;
        
        // 判断是否有极短的上影线和极长的下影线
        const hasTinyUpperShadow = upperShadow / (lastItem.h - lastItem.l) <= 0.1;
        const hasLongLowerShadow = lowerShadow / (lastItem.h - lastItem.l) >= bodyToLowerShadowRatioThreshold;
        
        // 判断是否出现在股价高位，这里简化为当前收盘价显著高于前一天收盘价
        const isAtHighPrice = lastItem.c > previousClose * someHighThreshold;
        
        // 所有条件必须满足才能判定为高位吊颈线
        return hasSmallBody && hasTinyUpperShadow && hasLongLowerShadow && isAtHighPrice;
    }
}

/**
 * 判断断头铡刀的特征：
 * 1. 一根大阴线：出现一根实体很长的阴线，表明卖方控制市场。
 * 2. 切断多根均线：这根阴线的收盘价低于至少三条不同周期（如5日均线、10日均线、20日均线）的均线值，意味着这些均线被“切断”
 */
function isDeadlyCandlestick(record, maList) {
    for(let i = 0; i < record.length; i++) {
        let maLastItem = maList[maList.length - 1 - i]
        // 检查是否为大阴线
        let isBigBearishCandle = record[i].zde < 0 && bodyLength(record[i]) > 5;

        // 检查是否切断了至少三条均线
        let isCuttingThroughMAs1 = record[i].c < maLastItem.ma5;
        let isCuttingThroughMAs2 = record[i].c < maLastItem.ma10;
        let isCuttingThroughMAs3 = record[i].c < maLastItem.ma20;

        // 所有条件必须满足才能判定为断头铡刀
        if(isBigBearishCandle && isCuttingThroughMAs1 && isCuttingThroughMAs2 && isCuttingThroughMAs3) {
            return true
        }
    }
}

/**
 * 判断看跌提腰带线的特征：
 * 1. 第一根是阳线。
 * 2. 第二根是阴线。
 */
function isBearishBeltHold(record) {
    if(upState(record)) {
        const secondLast = record[record.length - 2];
        // 检查第一根K线是否为阳线,
        const isBullishCandlestick1 = lastItem.zde > 0;
        // 成交量是否放大，比前一天的要少
        const handlerVolume = lastItem.v > 2 * secondLast.v;
        // 检查第二根K线是否为阴线
        const isSecondBearish = secondLast.zde < 0;
        
        // 检查第二根K线实体是否吞没了第一根K线实体
        const isEngulfing = lastItem.o < secondLast.o && lastItem.c > secondLast.c;
        
        // 所有条件必须满足才能判定为看跌提腰带线
        return isBullishCandlestick1 && handlerVolume && isSecondBearish && isEngulfing;
    }
}

/**
 * 判断看跌吞没形态特征：
 * 1. 由两根K线组成。第一根是相对较短的阳线，而第二根是相对较长的阴线，且第二根阴线的实体完全覆盖了第一根阳线的实体
 */
function isBearishEngulfing(record) {
    if(upState(record)) {
        const secondLast = record[record.length - 2];

        // 检查第一根K线是否为阳线
        const isFirstBullish = secondLast.zde > 0;
        
        // 检查第二根K线是否为阴线，并且其实体是否完全覆盖了第一根K线的实体
        const isSecondBearishAndEngulfing = lastItem.c < lastItem.o &&
                                            lastItem.o < secondLast.c &&
                                            lastItem.c < secondLast.o &&
                                            bodyLength(lastItem) > bodyLength(secondLast);
        
        // 所有条件必须满足才能判定为看跌吞没形态
        return isFirstBullish && isSecondBearishAndEngulfing;
    }
}

/**
 * 判断平顶（镊子线）特征：
 * 1. 由两根或多根K线组成，这些K线的收盘价（有时也包括开盘价）几乎在同一水平，形成了一个类似“镊子”的顶部
 */
function isFlatTop(record) {
    const secondLast = record[record.length - 2];
    // 定义收盘价相等的容忍范围
    const tolerance = 0.01;

    // 检查两根K线的收盘价是否大致相等
    const haveSameClosePrice = Math.abs(secondLast.c - lastItem.c) <= tolerance * Math.abs(secondLast.c + lastItem.c);

    // 所有条件必须满足才能判定为平顶形态
    return haveSameClosePrice;
}

/**
 * 判断跳空低开特征：
 * 1. 股票的开盘价低于前一交易日的最低价，形成价格图上的一个缺口
 */
function isGapDown(record) {
    const secondLast = record[record.length - 2];
    // 检查第二根K线的开盘价是否低于第一根K线的最低价
    const isGapDown = lastItem.o < secondLast.l;
    
    // 返回是否为跳空低开
    return isGapDown;
}

// 乌云盖顶
function isDarkClouds(record) {
    if(upState(record)) {
        const secondLast = record[record.length - 2];

        // 检查第一根K线是否为阳线
        const isFirstBullish = secondLast.zde > 0;
        
        // 检查第二根K线是否为阴线，并且其实体是否完全覆盖了第一根K线的实体
        const isSecondBearishAndEngulfing = lastItem.o > secondLast.c &&
                                            lastItem.c > secondLast.o &&
                                            lastItem.zde < 0 &&
                                            bodyLength(lastItem) > bodyLength(secondLast) / 2;
        
        // 所有条件必须满足才能判定为看跌吞没形态
        return isFirstBullish && isSecondBearishAndEngulfing;
    }
}

/**
 * 判断九阴白骨爪特征：
 * 1. 出现连续的阴线，数量可能为九根或更多
 */
function isNineYinBaiGuZhua(record) {
    let risrCount = 0;
    let fallCount = 0;
    record.forEach(item => {
        if(item.zde > 0) {
            risrCount++
        } else {
            fallCount++
        }
    })

    // 阴线数量大于阳线数量
    if(fallCount > 2 * risrCount) {
        return true
    }
}

/**
 * 判断叠叠空方炮特征：
 * 1. 出现连续的阴线，数量可能为九根或更多
 */
function isDoubleBearishEngulfing(record) {
    const arr = record.slice(-3);
    const candlestick1 = arr[0];
    const candlestick2 = arr[1];
    const candlestick3 = arr[2];

    // 计算每根K线的实体长度
    const bodyLength1 = bodyLength(candlestick1);
    const bodyLength2 = bodyLength(candlestick2);
    const bodyLength3 = bodyLength(candlestick3);
    
    // 第一根K线为阴线，并且其实体比第二根阳线的实体长
    const isFirstBearish = candlestick1.zde < 0 && bodyLength1 > bodyLength2 && bodyLength1.o > candlestick2.c;
    
    // 第二根K线为阳线
    const isSecondBullish = candlestick2.zde > 0;
    
    // 第三根K线为阴线，并且其实体比第二根阳线的实体长
    const isThirdBearishAndLonger = candlestick3.zde < 0 && bodyLength3 > bodyLength2 && candlestick3.o > candlestick2.c;
    
    // 所有条件必须满足才能判定为叠叠空方炮
    return isFirstBearish && isSecondBullish && isThirdBearishAndLonger;
}