import * as React from "react";
import {
    LineChartOutlined,
    AlignLeftOutlined,
    ProductOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import NotFound from "@/components/NotFound/NotFound";
import Index from "../view/Index/Index";
import Operation from "../view/Stocks/Optional";
import StockList from "../view/Stocks/StockList";
import StockDetail from "../view/Stocks/StockDetail";
import Kline from "../view/Dataset/Kline";
import Reference from "../view/Dataset/Reference";
import Institution from "../view/Dataset/Institution";
import Setting from "../view/Setting/Setting";

type RouteObject = {
    label: string;
    path?: string;
    hidden?: boolean;
    element?: JSX.Element;
    icon?: JSX.Element;
    children?: RouteObject[];
}

const pages :RouteObject[] = [
    {
        path: "*",
        label: "404",
        hidden: true,
        element: <NotFound />,
    },
    {
        path: "/",
        label: "行情",
        hidden: false,
        element: <Index />,
        icon: <LineChartOutlined />
    },
    {
        path: '/Stocks/Optional',
        label: "自选",
        hidden: false,
        element: <Operation />,
        icon: <AlignLeftOutlined />
    },
    {
        path: '/Stocks/StockList',
        label: "股票列表",
        hidden: true,
        element: <StockList />,
    },
    {
        path: '/Stocks/StockDetail',
        label: "股票详情",
        hidden: true,
        element: <StockDetail />,
    },
    {
        label: "策略",
        hidden: false,
        icon: <ProductOutlined />,
        children: [
            {
                path: "/Dataset/Kline",
                label: "K线分析",
                element: <Kline />,
            },
            {
                path: "/Dataset/Reference",
                label: "交易提示",
                element: <Reference />,
            },
            {
                path: "/Dataset/Institution",
                label: "机构持仓",
                element: <Institution />,
            }
        ]
    },
    {
        path: '/Setting',
        label: "设置",
        hidden: false,
        element: <Setting />,
        icon: <SettingOutlined />
    }
];

export default pages;