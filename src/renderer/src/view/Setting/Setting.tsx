import React, { useEffect, useState } from 'react';
import { Checkbox, Form, Radio } from 'antd';
import "@/assets/styles/Setting.scss"

const fs = window.api.moduleFs();
const Setting: React.FC = () => {
    const [form] = Form.useForm();
    const [initDatas] = useState({});
    useEffect(() => {
        fs.readFile(localStorage.settingUrl, "utf8", (err, data) => {
            if (err) { console.log("读取失败"); return };
            const settingData = JSON.parse(data);
            form.setFieldsValue(settingData);
        })
    }, [])
    

    // 字段值更新时触发回调
    const valueChange = (changedValues) => {
        fs.readFile(localStorage.settingUrl, "utf8", (err, data) => {
            if (err) { console.log("读取失败"); return };
            let settingData = JSON.parse(data);

            // 判断是否存在closeTray
            if (changedValues.hasOwnProperty('closeTray')) {
                window.api.windowSetClose();
                settingData.closeTray = changedValues.closeTray
            }
            
            if (changedValues.hasOwnProperty('riseFall')) {
                if(changedValues.riseFall == "fall") {
                    document.documentElement.style.setProperty('--main-rise-color', '#389e0d');
                    document.documentElement.style.setProperty('--rise-border-color', '#b7eb8f');
                    document.documentElement.style.setProperty('--rise-background-color', '#f6ffed');
                    document.documentElement.style.setProperty('--main-fall-color', '#f5222d');
                    document.documentElement.style.setProperty('--fall-border-color', '#ffccc7');
                    document.documentElement.style.setProperty('--fall-background-color', '#fff2f0');
                } else if(changedValues.riseFall == "rise") {
                    document.documentElement.style.setProperty('--main-rise-color', '#f5222d');
                    document.documentElement.style.setProperty('--rise-border-color', '#ffccc7');
                    document.documentElement.style.setProperty('--rise-background-color', '#fff2f0');
                    document.documentElement.style.setProperty('--main-fall-color', '#389e0d');
                    document.documentElement.style.setProperty('--fall-border-color', '#b7eb8f');
                    document.documentElement.style.setProperty('--fall-background-color', '#f6ffed');
                }
                settingData.riseFall = changedValues.riseFall
            }

            fs.writeFile(localStorage.settingUrl, JSON.stringify(settingData), err => {
                if (err) { console.log("写入失败"); return };
            })
        })
    }

    
    return (
        <div className='set-box'>
            <div>{localStorage.settingUrl}</div>
            <Form
                className='set-form'
                name="basic"
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 24 }}
                initialValues={initDatas}
                onValuesChange={valueChange}
                autoComplete="off"
            >
                <p className='set-box-title'>显示设置</p>
                <Form.Item
                    name="riseFall"
                    wrapperCol={{ span: 16 }}
                >
                    <Radio.Group>
                        <Radio value="rise">红涨绿跌</Radio>
                        <Radio value="fall">绿涨红跌</Radio>
                    </Radio.Group>
                </Form.Item>
                <p className='set-box-title'>系统设置</p>
                <Form.Item
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