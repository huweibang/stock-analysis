import React, { useEffect, useState } from 'react';
import { Radio, Collapse } from 'antd';
import type { RadioChangeEvent, CollapseProps } from 'antd';
import "@/assets/styles/Dataset.scss"
import { upList } from "@/utils/up"
import { downList } from "@/utils/down"
import { otherList } from "@/utils/other"

const optionsWithDisabled = [
    { label: '看涨K线', value: '1' },
    { label: '看跌K线', value: '2' },
    { label: '其他K线', value: '3' },
];

const Dataset: React.FC = () => {
    const [val, setVal] = useState('1');
    const [items, setItems] = useState<CollapseProps['items']>([])
    const onChange = ({ target: { value } }: RadioChangeEvent) => {
        setVal(value);
        setItems([])
        if(value == '1') {
            handlerChange(upList)
        } else if(value == '2') {
            handlerChange(downList)
        } else if(value == '3') {
            handlerChange(otherList)
        }
    };

    // 处理数据
    const handlerChange = (arr: any) => {
        arr.map((item: { key: number; children: React.JSX.Element; image: string[]; des: string; }, index: number) => {
            item.key = index + 1
            item.children = (
                <>
                    {
                        item.image.length != 0 ? item.image.map((ele: string, idx: React.Key) => <img src={ele} key={idx} className="k-img" />)  : null
                    }
                    <div dangerouslySetInnerHTML={{ __html: item.des }} className='k-p'></div>
                </>
            )
        })
        setItems(arr)
    }

    useEffect(() => {
        handlerChange(upList)
    }, [])

    return (
        <div className='k-box'>
            <Radio.Group
                options={optionsWithDisabled}
                onChange={onChange}
                value={val}
                optionType="button"
                buttonStyle="solid"
            />
            {
                val == '1' ? <Collapse defaultActiveKey={['1']} ghost items={items} /> : null
            }
            {
                val == '2' ? <Collapse defaultActiveKey={['1']} ghost items={items} /> : null
            }
            {
                val == '3' ? <Collapse defaultActiveKey={['1']} ghost items={items} /> : null
            }
        </div>
    )
}

export default Dataset