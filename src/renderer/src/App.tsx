import React, { useEffect, useState } from 'react';
import pages from './router/index';
import { Modal } from 'antd';
import { Routes, Route, RouteObject, useNavigate } from 'react-router-dom';
import './assets/styles/App.scss'
import Header from './components/Header/Header';
import MenuNav from './components/MenuNav/MenuNav';

const path = window.api.moduleJoin();
const fs = window.api.moduleFs();

if(process.env['NODE_ENV'] == "development") {
	localStorage.stockUrl = "./stock.txt";
	localStorage.settingUrl = "./setting.txt";
} else {
	localStorage.stockUrl = path.join(__dirname, "../../stock.txt");
	localStorage.settingUrl = path.join(__dirname, "../../setting.txt");
}

// Router数组扁平化
const renderRouter = (routes): RouteObject[] => {
	return routes.reduce((arr, item) => {
		// 如果当前路由有子路由，递归扁平化 
		if (item.children) {
			arr.push(...renderRouter(item.children));
		} else {
			// 添加当前路由到扁平化数组  
			arr.push(item);
		}
		return arr;
	}, []);
}
// 动态循环加载组件
const RouteItems = renderRouter(pages).map((item, index) =>
	<Route key={index} path={item.path} element={item.element} />
);

const App: React.FC = () => {
	const [settingData, setSettingData] = useState<any>({});
	const [isModalOpen, setIsModalOpen] = useState(false);
    // 定义跳转
    const navigate = useNavigate();

    fs.readFile(localStorage.settingUrl, "utf8", (err, data) => {
        if (err) { console.log("读取失败"); return };
        
        const obj = JSON.parse(data);
        setSettingData(obj)

        setIsModalOpen(settingData.isOpen)
        if(settingData.riseFall == "fall") {
            document.documentElement.style.setProperty('--main-rise-color', '#389e0d');
            document.documentElement.style.setProperty('--rise-border-color', '#b7eb8f');
            document.documentElement.style.setProperty('--rise-background-color', '#f6ffed');
            document.documentElement.style.setProperty('--main-fall-color', '#f5222d');
            document.documentElement.style.setProperty('--fall-border-color', '#ffccc7');
            document.documentElement.style.setProperty('--fall-background-color', '#fff2f0');
        } else if(settingData.riseFall == "rise") {
            document.documentElement.style.setProperty('--main-rise-color', '#f5222d');
            document.documentElement.style.setProperty('--rise-border-color', '#ffccc7');
            document.documentElement.style.setProperty('--rise-background-color', '#fff2f0');
            document.documentElement.style.setProperty('--main-fall-color', '#389e0d');
            document.documentElement.style.setProperty('--fall-border-color', '#b7eb8f');
            document.documentElement.style.setProperty('--fall-background-color', '#f6ffed');
        }
    })

	// 同意
	const handleOk = () => {
        settingData.isOpen = false;
        setSettingData(settingData)
        
        fs.writeFile(localStorage.settingUrl, JSON.stringify(settingData), err => {
            if (err) { console.log("写入失败"); return };
        })
	};
	
	// 不同意
	const handleCancel = () => {
		window.close();
	}
    
    useEffect(() => {
        window.api.getRouterLink((route) => {
            navigate(route);
        })
    }, [])

	return (
		<div className='app'>
			<Header></Header>
			<div className='app-container'>
				<MenuNav></MenuNav>
				<div className='app-flex'>
					<Routes>
						{RouteItems}
					</Routes>
				</div>
			</div>
			<Modal 
				title="温馨提醒" 
				width='90%'
				centered 
				open={isModalOpen} 
				onOk={handleOk}
				onCancel={handleCancel}
				maskClosable={false}
				closeIcon={false}
				okText="我同意以上内容"
				cancelText="我不同意以上内容"
			>
				<p>本产品初衷意在提供简单化的查看股票的方式，拒绝繁杂，让人眼花缭乱的数据。</p>
				<p>本产品提供对股票的K线形态展示以及分析结果，和部分数据集合展示。K线分析将于每次开盘日下午4点后更新</p>
                <p>本产品不提供任何投资建议，炒股盈亏自负。 </p>
			</Modal>
		</div>
	)
}

export default App