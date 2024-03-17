import * as React from "react";
import {
    LineChartOutlined,
    AlignLeftOutlined,
    ProductOutlined,
    SettingOutlined,
    BorderOuterOutlined
} from '@ant-design/icons';
import Index from "../view/Index/Index";
import Operation from "../view/Stocks/Optional";
import StockList from "../view/Stocks/StockList";
import StockDetail from "../view/Stocks/StockDetail";
import Tactics from "../view/Tactics/Tactics";
import Setting from "../view/Setting/Setting";
import Test1 from "../view/Test/Test1/Test1";
import Test2 from "../view/Test/Test2/Test2";

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
        path: '/Tactics',
        label: "策略",
        hidden: true,
        element: <Tactics />,
        icon: <ProductOutlined />
    },
    {
        path: '/Setting',
        label: "设置",
        hidden: false,
        element: <Setting />,
        icon: <SettingOutlined />
    },
    {
        path: '/Test',
        label: "测试",
        icon: <BorderOuterOutlined />,
        children: [
            {
                path: '/Test/Test1',
                label: "测试页1",
                hidden: false,
                element: <Test1 />
            },
            {
                path: '/Test/Test2',
                label: "测试页2",
                hidden: false,
                element: <Test2 />
            }
        ]
    }
];

export default pages;