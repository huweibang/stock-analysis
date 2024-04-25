import React, { useState } from 'react';
import {
    PushpinOutlined,
    PlusOutlined,
    MinusOutlined,
    CloseOutlined,
    SearchOutlined
} from '@ant-design/icons';
import type { DrawerProps, TableProps } from 'antd';
import { Divider, Drawer, Flex, Input, Tooltip, Table, Tag, message } from 'antd';
import { getBaseAll, getHsltList } from '@/api/index';
import { debounce } from '@/utils/index'
import "@/assets/styles/Header.scss";

interface operateItem {
    icon: JSX.Element,
    val: string,
    fun?: () => void
}
interface DataType {
    key: number;
    jys: string;
    api_code: string;
    name: string;
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: '交易所',
        dataIndex: 'jys',
        key: 'jys',
        width: 70,
        render: (_, { jys }) => {
            if (jys == "sh") {
                return <Tag color="orange">上证</Tag>
            } else if (jys == "sz") {
                return <Tag color="orange">深证</Tag>
            }
        },
    },
    {
        title: '股票代码',
        dataIndex: 'api_code',
        key: 'api_code',
        width: 70,
    },
    {
        title: '股票名称',
        dataIndex: 'name',
        key: 'name',
    }
];

let allStockList: DataType[] = [];

const getStockList = async () => {
    const res = await getHsltList();
    res.map((item, index) => {
        item.key = index.toString()
        item.name = item.mc;
        item.api_code = item.dm;
    });
    allStockList = res;
    console.log(allStockList)
}
getStockList();

const Header: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [isTable, setIsTable] = useState(false);
    let [ikey, setIkey] = useState(0)
    const [data, setData] = useState<DataType[]>([]);
    const [isTop, setIsTop] = useState(false);
    const [winTopVa, setWinTopVa] = useState('置顶');
    const [placement, setPlacement] = useState<DrawerProps['placement']>('top');
    const appRegionStyle: any = open ? { WebkitAppRegion: 'no-drag' } : { WebkitAppRegion: 'drag' };
    const [messageApi, contextHolder] = message.useMessage();

    const showDrawer = () => {
        localStorage.isUpData = 1;
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    // 窗口置顶
    const pushpin = () => {
        if (!isTop) {
            setWinTopVa('取消置顶')
            setIsTop(true)
        } else {
            setWinTopVa('置顶')
            setIsTop(false)
        }
        window.api.windowTop();
    }

    // 窗口最小化
    const windowMin = () => {
        window.api.windowMin();
    }

    // 窗口关闭
    const windowClose = () => {
        window.close();
    }

    const iconList: operateItem[] = [
        { icon: <PushpinOutlined />, val: winTopVa, fun: pushpin },
        { icon: <PlusOutlined />, val: '添加', fun: showDrawer },
        { icon: <MinusOutlined />, val: '最小化', fun: windowMin },
        { icon: <CloseOutlined />, val: '关闭', fun: windowClose }
    ]

    const handlerSearch = (event) => {
        if (event.target.value != '') {
            setIsTable(true);
        } else {
            setIsTable(false);
        }
        const filterArr = allStockList.filter(item => {
            return (
                item.api_code.toLowerCase().includes(event.target.value) ||
                item.name.toLowerCase().includes(event.target.value)
            )
        })
        setData(filterArr);
    }
    const d_handlerSearch = debounce(handlerSearch);

    const stockInput = (): JSX.Element => {
        return (
            <Flex vertical gap={12}>
                <Input
                    key={ikey}
                    addonBefore={<SearchOutlined />}
                    placeholder="请输入股票名称/代码"
                    variant="borderless"
                    onChange={d_handlerSearch}
                />
            </Flex>
        )
    }

    // 左上角按钮导航
    const iconTooltip = iconList.map((item, index) =>
        <div className='operate-item' key={index}>
            <Tooltip title={item.val} color={'#FFF'} arrow={false} mouseLeaveDelay={0.01} overlayInnerStyle={{
                minWidth: 'initial',
                minHeight: 'initial',
                padding: '1px 5px',
                fontSize: '12px',
                lineHeight: '20px',
                textAlign: 'center',
                color: '#000'
            }}>
                <div className='item-icon' onClick={item.fun}>{item.icon}</div>
            </Tooltip>
            {index == 1 ? <Divider type="vertical" /> : null}
        </div>
    )

    return (
        <div>
            {contextHolder}
            <div className='Menu' style={appRegionStyle}>
                股票策略助手
                <div className='operate'>
                    {iconTooltip}
                </div>
            </div>
            <Drawer
                title={stockInput()}
                placement={placement}
                closable={false}
                onClose={onClose}
                open={open}
                key={placement}
                height={'auto'}
            >
                {
                    isTable ? (
                        <Table
                            columns={columns}
                            dataSource={data}
                            showHeader={false}
                            pagination={false}
                            scroll={{ y: 255 }}
                            onRow={(row) => {
                                return {
                                    onClick: async () => {
                                        setOpen(false);
                                        ikey++;
                                        setIkey(ikey);
                                        setData([]);
                                        setIsTable(false);

                                        const fs = window.api.moduleFs();
                                        // 先读取stock.txt里的数据
                                        fs.readFile(localStorage.stockUrl, "utf8", (err, data) => {
                                            if (err) {
                                                console.log("读取失败");
                                            } else {
                                                let arr = JSON.parse(data);
                                                for (let i = 0; i < arr.length; i++) {
                                                    if (row.api_code == arr[i].api_code) {
                                                        messageApi.open({
                                                            type: 'error',
                                                            content: '自选列表已存在！',
                                                        });
                                                        return;
                                                    }
                                                }
                                                arr.push({
                                                    name: row.name,
                                                    api_code: row.api_code
                                                });
                                                fs.writeFile(localStorage.stockUrl, JSON.stringify(arr), err => {
                                                    if (err) {
                                                        messageApi.open({
                                                            type: 'error',
                                                            content: '加入失败！',
                                                        });
                                                        return
                                                    }
                                                    messageApi.open({
                                                        type: 'success',
                                                        content: '加入成功！',
                                                    });
                                                })
                                            }
                                        })
                                    }, // 点击行
                                };
                            }} />
                    ) : null
                }
            </Drawer>
            <Divider />
        </div>
    )
}

export default Header