import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import '@/assets/styles/ReturnBack.scss';

const ReturnBack: React.FC = () => {
    // 定义跳转
    const navigate = useNavigate();

    return (
        <div className="back">
            <Button icon={<ArrowLeftOutlined />} size="small" onClick={() => navigate(-1)}></Button>
        </div>
    )
}

export default ReturnBack