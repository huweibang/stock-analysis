import { app, shell, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset';
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
	// 主窗口
	mainWindow.winObj = new BrowserWindow({
		frame: false,  //设置为 false 时可以创建一个无边框窗口 默认值为 true
		resizable: false,//用户是否可以调整窗口大小
		width: 400,
		height: 680,
		show: false,
		autoHideMenuBar: true,
		...(process.platform === 'linux' ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false,
			nodeIntegration: true,   //允许渲染进程使用node.js
            contextIsolation: false  //允许渲染进程使用node.js
		}
	})

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
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		mainWindow.winObj.loadURL(process.env['ELECTRON_RENDERER_URL'])
	} else {
		mainWindow.winObj.loadFile(join(__dirname, '../renderer/index.html'))
	}
}

// 窗口初始化
const init = () => {
	createMainWindow();

	// 监听窗口置顶
	ipcMain.on('window-top', () => {
		mainWindow.isTop = !mainWindow.isTop
		mainWindow.winObj.setAlwaysOnTop(mainWindow.isTop);
	})

	// 监听窗口自定义最小化
	ipcMain.on('window-min', () => {
		mainWindow.winObj.minimize() // 窗口最小化
	})
	
	// 设置关闭程序行为
	ipcMain.on('change-allowQuitting', () => {
		fs.readFile("./setting.json", "utf8", (err, data) => {
			if (err) { console.log("读取失败"); return };
			let settingData = JSON.parse(data);
			settingData.closeTray ? mainWindow.allowQuitting = false : mainWindow.allowQuitting = true
		})
	})

	// 创建右下角任务栏图标
	appTray = new Tray(join(__dirname, 'icons', '../../../resources/Cookie.ico'))

	// 自定义托盘图标的内容菜单
	const contextMenu = Menu.buildFromTemplate([
		{
			label: "打开助手",
			icon: "resources/yx_setting.png",
			click: () => {
				showMainWindow()
			}
		},
		{
			label: "系统设置",
			click: () => {
			}
		},
		{
			label: "关于助手",
			click: () => {
			}
		},
		{
			label: "退出助手",
			icon: "resources/yx_log_in.png",
			click: () => {
				if(mainWindow.winObj != null)  mainWindow.winObj.destroy()
				app.quit();
			}
		},
	])

	appTray.setToolTip('demo')  // 设置鼠标指针在托盘图标上悬停时显示的文本
	appTray.setContextMenu(contextMenu)  // 设置图标的内容菜单

	// 点击托盘图标，显示主窗口
	appTray.on("click", () => {
		if(!mainWindow.isShow) showMainWindow();
	})
}

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
		mainWindow.winObj.show()
	}
}

// 应用程序准备就绪后执行
app.whenReady().then(() => {
	// 设置应用程序的用户模型 ID
	electronApp.setAppUserModelId('com.electron')

	// 用于监听新创建的浏览器窗口（BrowserWindow）事件
	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window)
	})

	// 创建窗口
	init()
	
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) init()
	})
})
// 当应用程序的所有窗口都被关闭时触发
app.on('window-all-closed', () => {
	// 检查当前运行的操作系统平台是否不是 macOS
	// darwin 是 macOS 的内核名称
	if (process.platform !== 'darwin') {
		app.quit() // app.quit() 关闭应用程序
	}
})