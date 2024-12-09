import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		port: 8000,
	},
	compilerOptions: {
		isCustomElement: tag => tag.startsWith('custom-'), // 맞춤형 요소 설정
	},
})
