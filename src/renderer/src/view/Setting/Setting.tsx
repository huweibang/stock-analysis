import React from 'react';
import { Checkbox, Form } from 'antd';
import "@/assets/styles/Setting.scss"

type FieldType = {
    closeTray?: string;
};

// 字段值更新时触发回调
const valueChange = (changedValues) => {
    // 判断是否存在closeTray
    if(changedValues.hasOwnProperty('closeTray')) {
        // @ts-ignore
		window.api.windowSetClose();
    }
}

const Setting: React.FC = () => {
    return (
        <div className='set-box'>
            <p className='set-box-title'>系统设置</p>
            <Form
                className='set-form'
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 24 }}
                initialValues={{ closeTray: false }}
                onValuesChange={valueChange}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    name="closeTray"
                    valuePropName="checked"
                    wrapperCol={{ span: 16 }}
                >
                    <Checkbox>关闭时最小化到托盘</Checkbox>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Setting