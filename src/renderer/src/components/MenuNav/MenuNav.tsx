import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import pages from '@/router/index';

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
    label: any,
    key: any,
    icon?: JSX.Element,
    children?: MenuItem[],
    type?: 'group',
): MenuItem => {
    return {
        label,
        key,
        icon,
        children,
        type,
    } as MenuItem;
}

// 递归生成菜单项
const renderRouter = (routes) => {
    return routes.reduce((val, item) => {
        if (!item.hidden) {
            const { label, path, icon, children } = item;
            const key = path; // 为菜单项生成唯一的key
            const menuItem = getItem(label, key, icon); // 创建当前路由的菜单项 

            // 如果存在子路由，则递归处理它们，并将结果作为当前菜单项的子项  
            if (children && children.length > 0) {
                const childMenuItems = renderRouter(children);
                if (childMenuItems.length > 0) {
                    // @ts-ignore
                    menuItem.children = childMenuItems;
                }
            }
            
            // 将当前菜单项添加到结果数组中  
            val.push(menuItem);
        }
        return val;
    }, [])
}
const items: MenuItem[] = renderRouter(pages);

const MenuNav: React.FC = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [mainWidth, setMainWidth] = useState(70);
    const [keyPath, setKeyPath] = useState('/')
    // 获取当前路由
    const location = useLocation();
    const currentRoute = location.pathname;
    // 定义跳转
    const navigate = useNavigate();

    useEffect(() => {
        setKeyPath(currentRoute)
    })

    window.api.getWindowInfo((width: number) => {
        width > 500 ? setCollapsed(false) : setCollapsed(true)
        if (width < 500) {
            setMainWidth(70)
        } else if (500 < width && width < 850) {
            setMainWidth(180)
        } else {
            setMainWidth(256)
        }
    });

    const onSelect = ({ key }) => {
        navigate(key);
    }

    return (
        <div
            style={{
                width: mainWidth
            }}
        >
            <Menu
                selectedKeys={[keyPath]}
                defaultOpenKeys={['/Test/Test1']}
                mode="inline"
                inlineCollapsed={collapsed}
                items={items}
                onSelect={onSelect}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    );
};
export default MenuNav;