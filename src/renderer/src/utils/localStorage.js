import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// 设定存储文件的路径  
const storagePath = join(__dirname, 'localStorage.json');

// 初始化存储数据（如果文件不存在则创建一个空对象）  
let data = {};
try {
    data = JSON.parse(readFileSync(storagePath, 'utf8'));
} catch (e) {
    // 文件不存在或其他错误，忽略并继续  
}

// 封装 setItem 方法  
const setItem = (key, value) => {
    data[key] = value;
    writeFileSync(storagePath, JSON.stringify(data));
}

// 封装 getItem 方法  
const getItem = (key) => {
    return data[key];
}

// 封装 removeItem 方法  
const removeItem = (key) => {
    delete data[key];
    writeFileSync(storagePath, JSON.stringify(data));
}

// 封装 clear 方法  
const clear = () => {
    data = {};
    writeFileSync(storagePath, JSON.stringify(data));
}

// 导出这些方法，以便在主进程中使用  
export default {
    setItem,
    getItem,
    removeItem,
    clear
};