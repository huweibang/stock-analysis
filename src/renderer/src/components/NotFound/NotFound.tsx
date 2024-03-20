import React from 'react';
import { Empty } from 'antd';

const Notfound: React.FC = () => {
    return (
        <div>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="404"/>;
        </div>
    )
}

export default Notfound