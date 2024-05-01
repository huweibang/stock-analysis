import React, { useEffect, useState } from 'react';
import "@/assets/styles/Reference.scss";
import { prompt } from "@/api/index";
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';

const data = {
    tp: "停牌",
    zfssr: "转增上市日",
    gddh: "召开股东大会",
    zqdjr: "债权登记日",
    jjfp: "基金收益分配款发放日",
    jjcx: "基金收益分配除息日",
    jjjz: "开放式基金发行截止日",
    jjdj: "基金权益登记日",
    szgg: "深交所公告",
    shgg: "上交所公告",
    jjfx: "开放式基金发行起始日",
    gpgk: "股票交易公开信息",
    obsh: "货币型基金结转份额可赎回起始日",
    cqcx: "恢复交易日",
    djr: "股票登记日"
}

const Reference: React.FC = () => {
    const [items, setItems] = useState<CollapseProps['items']>([])

    const getPrompt = () => {
        prompt().then(res => {
            let arr = []
            for(let i in res) {
                if(res[i] != null && i != "t") {
                    arr.push({
                        key: i,
                        label: data[i],
                        children: <>
                            {
                                Array.from(new Set(res[i])).map((ele: string, idx) => <p key={idx} className='spn'>{ele.replace(/\(\d{6}\)/g, '')}</p>)
                            }
                        </>
                    })
                }
            }
            setItems(arr)
        })
    }

    useEffect(() => {
        getPrompt()
    },[])

    return (
        <div className='re-box'>
            <Collapse defaultActiveKey={['1']} ghost items={items} />
        </div>
    )
}

export default Reference