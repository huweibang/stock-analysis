
import React, { useState, useEffect } from "react"
import ListView from "@/components/ListView/ListView"
import { useLocation } from "react-router-dom"
import {
    limitUp,
    limitDown,
    mighty,
    nextNew,
    boomStock,
} from '@/api/index';
import { openEquityMarketDay } from "@/utils/index";
import ReturnBack from "@/components/ReturnBack/ReturnBack";

const StockList: React.FC = () => {
    const [data, setData] = useState([])
    const { state } = useLocation();
    const num = (state as { num: number }).num;

    // 涨停股池
    const getLimitUp = async () => {
        const day = openEquityMarketDay();
        const res = await limitUp(day);
        res.map((item, index) => item.key = index.toString());
        setData(res);
    }

    // 强势股池
    const getMightyList = async () => {
        const day = openEquityMarketDay();
        const res = await mighty(day);
        res.map((item, index) => item.key = index.toString());
        setData(res);
    }

    // 跌停股池
    const getLimitDown = async () => {
        const day = openEquityMarketDay();
        const res = await limitDown(day);
        res.map((item, index) => item.key = index.toString());
        setData(res);
    }

    // 次新股池
    const getNextNewList = async () => {
        const day = openEquityMarketDay();
        const res = await nextNew(day);
        res.map((item, index) => item.key = index.toString());
        setData(res);
    }

    // 炸板股池
    const getBoomStockList = async () => {
        const day = openEquityMarketDay();
        const res = await boomStock(day);
        res.map((item, index) => item.key = index.toString());
        setData(res);
    }

    useEffect(() => {
        switch (num) {
            case 1:
                getLimitUp();
                break;
            case 2:
                getMightyList();
                break;
            case 3:
                getLimitDown();
                break;
            case 4:
                getNextNewList();
                break;
            case 5:
                getBoomStockList();
                break;
        }
    }, [])

    return (
        <div className='box'>
            <ReturnBack />
            <ListView data={data}></ListView>
        </div>
    )
}

export default StockList