import React, { useState } from 'react';
import pages from './router/index';
import { Modal, Typography } from 'antd';
import { Routes, Route, RouteObject } from 'react-router-dom';
import './assets/styles/App.scss'
import Header from './components/Header/Header';
import MenuNav from './components/MenuNav/MenuNav';

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
	const { Text } = Typography;
	const [isModalOpen, setIsModalOpen] = useState(true);

	// 同意
	const handleOk = () => {
		setIsModalOpen(false);
	};
	
	// 不同意
	const handleCancel = () => {
		window.close();
	}

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
				<p>本产品仅提供对股票的K线形态研究，例如：仙人指路，墓碑线，突破箱体等。但需注意，K线形态为民间流传，没有市场与官方认可，且每个人对K线形态理解不尽相同。在本产品中，任何的K线形态，<Text mark>仅代表本开发作者的想法</Text>，如有不对之处，请添加 <Text mark>wx: Hwbb_0</Text> 联系</p>
				<p>本产品严禁任何商用用途，<Text mark>如有侵权，你自己背锅</Text>，点击下方按钮将默认你同意以上内容，即可使用本产品。</p>
			</Modal>
		</div>
	)
}

export default App