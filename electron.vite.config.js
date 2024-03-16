import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()]
	},
	preload: {
		plugins: [externalizeDepsPlugin()]
	},
	renderer: {
		css: {
			preprocessorOptions: {
				scss: {
					javascriptEnabled: true,
					additionalData: `@import '@/assets/styles/variables.scss';` // 引入全局变量文件
				}
			}
		},
		resolve: {
			alias: {
				// 配置短路径 @开头
				'@': resolve(__dirname, 'src/renderer/src'),
				'@renderer': resolve(__dirname, 'src/renderer/src'),
			}
		},
		server: {
			host: '0.0.0.0', // 监听所有地址
			proxy: {
				"/mapi": {
					target: "http://api.mairui.club",
					ws: true,
					changeOrigin: true,
					rewrite: path => path.replace(/^\/mapi/, '')
                },
                "/sapi": {
					target: "https://stockapi.com.cn",
					ws: true,
					changeOrigin: true,
					rewrite: path => path.replace(/^\/sapi/, '')
				}
			}
		},
		plugins: [react()]
	}
})
