import { app, shell, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fs from 'fs';

let appTray = null  // 在外面创建tray变量，防止被自动删除，导致图标自动消失

const mainWindow = {
	allowQuitting: true, // true 销毁窗口 false 关闭至托盘
	isShow: true,
	isTop: false,
	winObj: null
}
// 主窗口
const createMainWindow = () => {
	let logo = "";
	if(process.env['NODE_ENV'] == "development") {
		logo = "resources/icon.png"
	} else {
		logo = join(__dirname, "../../resources/icon.png")
	}
	// 主窗口
	mainWindow.winObj = new BrowserWindow({
		frame: false,  //设置为 false 时可以创建一个无边框窗口 默认值为 true
		resizable: false,//用户是否可以调整窗口大小
		width: 400,
		height: 680,
		show: false,
		autoHideMenuBar: true,
		icon: logo,
		// ...(process.platform === 'linux' ? { icon } : {}),
		webPreferences: {
			devTools: true,
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false,
			nodeIntegration: true,   //允许渲染进程使用node.js
            contextIsolation: false,  //允许渲染进程使用node.js
			allowLocalAccessFromFileURLs: true
		}
	})
	// if (process.env.WEBPACK_DEV_SERVER_URL) {
	// 	// dev环境
	// 	win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
	// 	win.webContents.openDevTools()
	// } else {
	// 	// 打包环境
	// 	createProtocol('app')
	// 	win.loadURL(`file://${__dirname}/index.html`);
	// }
	mainWindow.winObj.openDevTools();
	// 确保窗口内容已经准备就绪后再显示窗口
	mainWindow.winObj.on('ready-to-show', () => {
        showMainWindow();
    })

	// 当点击关闭按钮
	mainWindow.winObj.on('close', (e) => {
		// 如果此时，应用并没有被退出，则终止默认行为，并且隐藏窗口
		if(mainWindow.allowQuitting) {
			mainWindow.winObj.destroy(); // 销毁应用
		} else {
			hideMainWindow();   // 隐藏主程序窗口
			e.preventDefault();  // 阻止退出程序
			// mainWindow.winObj.setSkipTaskbar(true)   // 取消任务栏显示
		}
	})

	// 监听窗口大小变化  
	mainWindow.winObj.on('resized', () => {
		// 获取窗口宽高  
		const windowBounds = mainWindow.winObj.getContentBounds();  
		const w = windowBounds.width;  
		const h = windowBounds.height;
		mainWindow.winObj.send('window-size', { width: w, height: h }); 
	})

	mainWindow.winObj.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    })

	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		mainWindow.winObj.loadURL(process.env['ELECTRON_RENDERER_URL']);
	} else {
		mainWindow.winObj.loadFile(join(__dirname, '../renderer/index.html'));
	}
}

// 窗口初始化
const init = () => {
	createMainWindow();

	// 监听窗口置顶
	ipcMain.on('window-top', () => {
		mainWindow.isTop = !mainWindow.isTop;
		mainWindow.winObj.setAlwaysOnTop(mainWindow.isTop);
	})

	// 监听窗口自定义最小化
	ipcMain.on('window-min', () => {
		mainWindow.winObj.minimize() // 窗口最小化
	})
	
	// 设置关闭程序行为
    const url = join(__dirname, "../../setting.txt");
    fs.readFile(url, "utf8", (err, data) => {
        let settingData = JSON.parse(data);
        settingData.closeTray ? mainWindow.allowQuitting = false : mainWindow.allowQuitting = true
    })
	ipcMain.on('change-allowQuitting', () => {
        setTimeout(() => {
            fs.readFile(url, "utf8", (err, data) => {
                let settingData = JSON.parse(data);
                settingData.closeTray ? mainWindow.allowQuitting = false : mainWindow.allowQuitting = true
            })
        }, 800)
	})

	// 创建右下角任务栏图标
	appTray = new Tray(join(__dirname, 'icons', '../../../resources/stocks.ico'))
	// 自定义托盘图标的内容菜单
	const contextMenu = Menu.buildFromTemplate([
		{
			label: "打开助手",
			icon: join(__dirname, "../../resources/file-open.png"),
			click: () => {
				showMainWindow();
			}
		},
		{
			label: "设置",
			icon: join(__dirname, "../../resources/setting.png"),
			click: () => {
				// showMainWindow();
                // mainWindow.winObj.webContents.send('route-change', route);
				// mainWindow.winObj.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/Setting')
                openRoute('/Setting');
			}
		},
		{
			label: "退出",
			icon: join(__dirname, "../../resources/sign-out.png"),
			click: () => {
				if(mainWindow.winObj != null)  mainWindow.winObj.destroy()
				app.quit();
			}
		},
	])

	appTray.setToolTip('股票助手')  // 设置鼠标指针在托盘图标上悬停时显示的文本
	appTray.setContextMenu(contextMenu)  // 设置图标的内容菜单

	// 点击托盘图标，显示主窗口
	appTray.on("click", () => {
		if(!mainWindow.isShow) showMainWindow();
	})
}
// 切换路由
const openRoute = (route) => {
    showMainWindow();
    mainWindow.winObj.send('route-change', route);
    // 确保窗口是可见的并聚焦
    mainWindow.winObj.show();
    mainWindow.winObj.focus();
};
// 隐藏主窗口
const hideMainWindow = () => {
	if (mainWindow.winObj && !mainWindow.winObj.isDestroyed()) {
		mainWindow.isShow = false;
		mainWindow.winObj.hide();
	}
}
// 展示主窗口
const showMainWindow = () => {
	if (mainWindow.winObj && !mainWindow.winObj.isDestroyed()) {
		mainWindow.isShow = true;
		mainWindow.winObj.show();
	}
}

// 应用程序准备就绪后执行
app.whenReady().then(() => {
	// 设置应用程序的用户模型 ID
	electronApp.setAppUserModelId('com.electron');

	// 用于监听新创建的浏览器窗口（BrowserWindow）事件
	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window);
	})

	// 创建窗口
	init()
	
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) init();
	})
})
// 当应用程序的所有窗口都被关闭时触发
app.on('window-all-closed', () => {
	// 检查当前运行的操作系统平台是否不是 macOS
	// darwin 是 macOS 的内核名称
	if (process.platform !== 'darwin') {
		app.quit(); // app.quit() 关闭应用程序
	}
})