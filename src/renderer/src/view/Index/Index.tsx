import React, { useState, useEffect } from 'react';
import { Divider, Col, Row, List, Space, Skeleton, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
    getAllIndexList,
    indexRealTimeData,
    limitUp,
    limitDown,
    mighty,
    nextNew,
    boomStock,
} from '@/api/index'
import { openEquityMarketDay } from "@/utils/index"
import {
    BarChartOutlined,
    SmileOutlined,
    FrownOutlined,
    MehOutlined,
    RightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import "@/assets/styles/Index.scss"

interface indexType {
    dm: string; // 代码
    ud: number; // 涨跌额
    mc: string; // 名称
    p: number;  // 当前价格
    pc: number; // 涨跌幅
    jys: string;// 标识
    zf: string; // 涨幅%
}

const shell = window.api.moduleShell();
// 定义首页指数
const definitionList = ['上证指数', '深证成指', '北证50', '创业板指', '科创50', '沪深300'];

// 渲染指数列表
const stockIndexList = (data: indexType[]) => {
    return data.map(item =>
        <Col span={8} key={item.dm}>
            <div className={`${item.ud > 0 ? 'rise rise-bk' : 'fall fall-bk'} exponent`}>
                <div className='title'>{item.mc}</div>
                <div>{item.p}</div>
                <div className='exponent-bottom'>
                    <span>
                        {Number(item.ud) > 0 ? '+' : ''}
                        {item.ud}
                    </span>
                    <span>
                        {Number(item.ud) > 0 ? '+' : ''}
                        {item.pc}%
                    </span>
                </div>
            </div>
        </Col>
    )
}


// 渲染池子股票列表
const poolStockList = (data: indexType[]) => {
    let code: string = "";

    const items: MenuProps['items'] = [
        {
            label: "详情",
            key: '0',
            onClick: () => {
                // 打开浏览器页面查看详情
                shell.openExternal(`https://quote.eastmoney.com/${code}.html`);
            }
        },
    ]

    return <List
        dataSource={data}
        renderItem={(item: { mc: string; dm: string; zf: any; p: number; }) => (
            <List.Item onClick={() => console.log(item)}>
                <Dropdown menu={{ items }} trigger={['contextMenu']} onOpenChange={() => {
                    code = item.dm
                }}>
                    <div className="pool-list">
                        <div className="pool-left">
                            <span>{item.mc}</span>
                            <span>{item.dm}</span>
                        </div>
                        <div className={`${Number(item.zf) > 0 ? 'rise' : 'fall'} pool-item`}>{item.p}</div>
                        <div className={`${Number(item.zf) > 0 ? 'rise' : 'fall'} pool-item`}>
                            {Number(item.zf) > 0 ? '+' : ''}
                            {(item.p - (item.p / (Number(item.zf) / 100 + 1))).toFixed(2)}
                        </div>
                        <div className={Number(item.zf) > 0 ? 'rise' : 'fall'}>
                            {Number(item.zf) > 0 ? '+' : ''}
                            {item.zf}%
                        </div>
                    </div>
                </Dropdown>
            </List.Item>
        )}
    />
}

const Index: React.FC = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [list, setList] = useState<indexType[]>([]);
    const [limitUpList, setLimitUpList] = useState<indexType[]>([]);
    const [limitDownList, setLimitDownList] = useState<indexType[]>([]);
    const [mightyList, setMightyList] = useState<indexType[]>([]);
    const [nextNewList, setNextNewList] = useState<indexType[]>([]);
    const [boomStockList, setBoomStockList] = useState<indexType[]>([]);
    // 定义跳转
    const navigate = useNavigate();

    // 获取指数列表并查看指数数据
    const initIndexList =  () => {
        setLoading(true);
        getList();
        setLoading(false);
    }
    const getList = async () => {
        const MAX_RETRIES = 3; // 最大重试次数  
        const RETRY_DELAY = 1000; // 重试间隔（毫秒）

        const indexRes = await getAllIndexList()
        const pro = definitionList.map(async item => {
            let i = indexRes.findIndex((ele: { mc: string; }) => ele.mc == item);
            if (i != -1) {
                let retryCount = 0;
                let indexDetail;
                while (retryCount < MAX_RETRIES) {
                    try {
                        indexDetail = await indexRealTimeData(indexRes[i].dm);
                        console.log(`成功的指数为：${indexRes[i].mc}`)
                        break; // 请求成功，跳出循环  
                    } catch (error) {
                        retryCount++;
                        if (retryCount < MAX_RETRIES) {
                            console.log(`请求失败，正在重试... (${retryCount}/${MAX_RETRIES})`);
                            console.log(`重试的指数为：${indexRes[i].mc}`)
                            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY)); // 等待一段时间后重试  
                        } else {
                            throw "重试完成"; // 达到最大重试次数，抛出错误  
                        }
                    }
                }
                return { ...indexDetail, ...indexRes[i] };
            }
        })
        const arr = await Promise.all(pro);
        setList(arr)
    }

    // 涨停股池
    const getLimitUp = async () => {
        const day = openEquityMarketDay();
        const res = await limitUp(day);
        if (res) {
            await res.sort((a, b) => Number(b.zf) - Number(a.zf));
            const newArr = await res.slice(0, 10);
            setLimitUpList(newArr);
        }
    }

    // 跌停股池
    const getLimitDown = async () => {
        const day = openEquityMarketDay();
        const res = await limitDown(day);
        if (res) {
            await res.sort((a, b) => Number(b.zf) - Number(a.zf));
            const newArr = await res.slice(0, 10);
            setLimitDownList(newArr);
        }
    }

    // 强势股池
    const getMightyList = async () => {
        const day = openEquityMarketDay();
        const res = await mighty(day);
        if (res) {
            await res.sort((a, b) => Number(b.zf) - Number(a.zf));
            const newArr = await res.slice(0, 10);
            setMightyList(newArr);
        }
    }

    // 次新股池
    const getNextNewList = async () => {
        const day = openEquityMarketDay();
        const res = await nextNew(day);
        if (res) {
            await res.sort((a, b) => Number(b.zf) - Number(a.zf));
            const newArr = await res.slice(0, 10);
            setNextNewList(newArr);
        }
    }

    // 炸板股池
    const getBoomStockList = async () => {
        const day = openEquityMarketDay();
        const res = await boomStock(day);
        if (res) {
            await res.sort((a, b) => Number(b.zf) - Number(a.zf));
            const newArr = await res.slice(0, 10);
            setBoomStockList(newArr);
        }
    }

    // 查看更多
    const lookMore = (num: number) => {
        navigate("/Stocks/StockList", {
            state: {
                num
            }
        });
    }

    useEffect(() => {
        initIndexList();
        getLimitUp();
        getLimitDown();
        getMightyList();
        getNextNewList();
        getBoomStockList();
    }, [])

    return (
        <div className='box'>
            <div className="box-content">
                <Divider orientation="left" orientationMargin="0">
                    <Space>
                        <BarChartOutlined />
                        A股指数
                    </Space>
                </Divider>
                <Skeleton loading={loading} active>
                    <Row gutter={10}>
                        {stockIndexList(list)}
                    </Row>
                </Skeleton>
            </div>
            <div className="box-content">
                <div className="box-content-title">
                    <Space>
                        <SmileOutlined />
                        涨停股池
                    </Space>
                    <span className="box-content-title-more" onClick={() => lookMore(1)}>查看更多<RightOutlined /></span>
                </div>
                {poolStockList(limitUpList)}
            </div>
            <div className="box-content">
                <div className="box-content-title">
                    <Space>
                        <SmileOutlined />
                        强势股池
                    </Space>
                    <span className="box-content-title-more" onClick={() => lookMore(2)}>查看更多<RightOutlined /></span>
                </div>
                {poolStockList(mightyList)}
            </div>
            <div className="box-content">
                <div className="box-content-title">
                    <Space>
                        <FrownOutlined />
                        跌停股池
                    </Space>
                    <span className="box-content-title-more" onClick={() => lookMore(3)}>查看更多<RightOutlined /></span>
                </div>
                {poolStockList(limitDownList)}
            </div>
            <div className="box-content">
                <div className="box-content-title">
                    <Space>
                        <MehOutlined />
                        次新股池
                    </Space>
                    <span className="box-content-title-more" onClick={() => lookMore(4)}>查看更多<RightOutlined /></span>
                </div>
                {poolStockList(nextNewList)}
            </div>
            <div className="box-content">
                <div className="box-content-title">
                    <Space>
                        <MehOutlined />
                        炸板股池
                    </Space>
                    <span className="box-content-title-more" onClick={() => lookMore(5)}>查看更多<RightOutlined /></span>
                </div>
                {poolStockList(boomStockList)}
            </div>
        </div>
    )
}

export default Index