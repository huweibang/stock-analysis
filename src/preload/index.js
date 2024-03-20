import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import fs from "fs"

// Custom APIs for renderer
const api = {
	// 获取当前窗口宽高
	getWindowInfo: (callback) => {
		ipcRenderer.on('window-size', (event, args) => {
			callback(args.width, args.height);
		})
	},
	// 窗口置顶
	windowTop: () => {
		ipcRenderer.send("window-top")
	},
	// 窗口最小化
	windowMin: () => {
		ipcRenderer.send("window-min")
	},
	// 设置窗口关闭行为
	windowSetClose: () => {
		ipcRenderer.send("change-allowQuitting")
	},
	// 调用Node.js内置模块的功能 
	moduleFs: () => {
		const result = fs
		return result
	},
	moduleShell: () => {
		const result = shell
		return result
	}
}

// 使用' contextBridge ' api只在启用上下文隔离的情况下将Electron api暴露给渲染器，否则只添加到DOM全局。
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld('electron', electronAPI)
		contextBridge.exposeInMainWorld('api', api)
	} catch (error) {
		console.error(error)
	}
} else {
	window.electron = electronAPI
	window.api = api
}
