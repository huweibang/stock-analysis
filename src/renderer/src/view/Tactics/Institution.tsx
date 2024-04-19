import React, { useState } from 'react';
import { Button, Form, DatePicker, type FormProps, Select, Input, Table } from 'antd';
import type { TableProps } from 'antd';
import { institutionCollect, jijiHeavy } from "@/api/index"
import "@/assets/styles/Institution.scss"

interface DataType {
    mc: string;
    dt: Array<any>;
    gbl: number;
    gblz: string;
    lbl: string;
    ltz: string;
    q: string;
    yq: string;
    bq: string;
    cbl: string;
    ltb: string;
    szj: string;
}

const columns1: TableProps<DataType>['columns'] = [
    {
        title: '股票名称',
        dataIndex: 'mc',
        key: 'mc',
        width: 90,
        fixed: 'left',
    },
    {
        title: '持仓机构',
        dataIndex: 'dt',
        key: 'dt',
        width: 150,
        render: (_, record) => (
            <>
                {
                    record.dt.map((item: any, index) => <p key={index}>{item.n}</p>)
                }
            </>
        )
    },
    {
        title: '持股比例',
        dataIndex: 'gbl',
        key: 'gbl',
        render: (_, record) => (<span>{record.gbl}%</span>)
    },
    {
        title: '持股比例增幅',
        dataIndex: 'gblz',
        key: 'gblz',
        render: (_, record) => (<span>{record.gblz}%</span>)
    },
    {
        title: '占流通股比例',
        dataIndex: 'lbl',
        key: 'lbl',
        render: (_, record) => (<span>{record.lbl}%</span>)
    },
    {
        title: '占流通股比例增幅',
        dataIndex: 'ltz',
        key: 'ltz',
        render: (_, record) => (<span>{record.ltz}%</span>)
    },
    {
        title: '报告季度',
        dataIndex: 'q',
        key: 'q',
        render: (_, record) => (
            <span>{record.q == '1'? '季报' : record.q == '2' ? '中报' : record.q == '3' ? '三季报' : '年报'}</span>
        )
    },
    {
        title: '报告年份',
        dataIndex: 'yq',
        key: 'yq'
    }
];

const columns2: TableProps<DataType>['columns'] = [
    {
        title: '股票名称',
        dataIndex: 'mc',
        key: 'mc',
        width: 90,
        fixed: 'left',
    },
    {
        title: '重仓机构',
        dataIndex: 'dt',
        key: 'dt',
        width: 150,
        render: (_, record) => (
            <>
                {
                    record.dt.map((item: any, index) => <p key={index}>{item.n}</p>)
                }
            </>
        )
    },
    {
        title: '本期持股数',
        dataIndex: 'bq',
        key: 'bq',
        render: (_, record) => (<span>{record.bq}万股</span>)
    },
    {
        title: '持股比例',
        dataIndex: 'cbl',
        key: 'cbl',
        render: (_, record) => (<span>{record.cbl}%</span>)
    },
    {
        title: '持股占已流通A股比例',
        dataIndex: 'ltb',
        key: 'ltb',
        render: (_, record) => (<span>{record.ltb}%</span>)
    },
    {
        title: '同上期增减',
        dataIndex: 'szj',
        key: 'szj',
        render: (_, record) => (<span>{record.szj}万股</span>)
    },
    {
        title: '报告季度',
        dataIndex: 'q',
        key: 'q',
        render: (_, record) => (
            <span>{record.q == '1'? '季报' : record.q == '2' ? '中报' : record.q == '3' ? '三季报' : '年报'}</span>
        )
    },
    {
        title: '报告年份',
        dataIndex: 'yq',
        key: 'yq'
    }
];

const Institution: React.FC = () => {
    const [data1, setData1] = useState([])
    const [data2, setData2] = useState([])

    const onFinish: FormProps["onFinish"] = (values) => {
        institutionCollect(values.year.$y, values.quarter).then(res => {
            if(values.name != undefined) {
                setData1(res.filter(item => {
                    return (
                        item.dm.toLowerCase().includes(values.name) ||
                        item.mc.toLowerCase().includes(values.name)
                    )
                }))
            } else {
                setData1(res)
            }
        })
        jijiHeavy(values.year.$y, values.quarter).then(res => {
            if(values.name != undefined) {
                setData2(res.filter(item => {
                    return (
                        item.dm.toLowerCase().includes(values.name) ||
                        item.mc.toLowerCase().includes(values.name)
                    )
                }))
            } else {
                setData2(res)
            }
        })
    };

    return (
        <div>
            <div className='from-box'>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    labelWrap={false}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item label="年份" name="year" className="from-item" rules={[{ required: true, message: '请选择年份!' }]}>
                        <DatePicker picker="year" placeholder="请选择年份" />
                    </Form.Item>
                    <Form.Item label="季度" name="quarter" className="from-item" rules={[{ required: true, message: '请选择季度!' }]}>
                        <Select
                            style={{ width: 150 }}
                            allowClear
                            placeholder="请选择季度"
                            options={[
                                { value: '1', label: '第一季度' },
                                { value: '2', label: '第二季度' },
                                { value: '3', label: '第三季度' },
                                { value: '4', label: '第四季度' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="股票名称、代码" name="name" className="from-item">
                        <Input style={{ width: 150 }}/>
                    </Form.Item>
                    <Form.Item className="from-item" >
                        <Button type="primary" htmlType="submit" className='search-btn'>
                            搜索
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className='tab-box'>
                <h3 className='tab-title'>机构持仓汇总</h3>
                <Table dataSource={data1} columns={columns1} scroll={{ x: 800 }}/>
            </div> 
            <div>
                <h3 className='tab-title'>基金重仓</h3>
                <Table dataSource={data2} columns={columns2} scroll={{ x: 800 }}/>
            </div>
        </div>
    )
}

export default Institution