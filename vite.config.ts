import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), dts()],
    build: {
        lib: {
            entry: './src/index.ts',
            name: 'applejelly',
            fileName: (format) => `index.${format}.js`,
            formats: ['es', 'cjs'],
        },
        rollupOptions: {},
    },
    resolve: {
        alias: {
            '@applejelly': path.resolve(__dirname, './src'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                // SCSS 파일에서 별칭 '@applejelly'를 사용할 수 있도록 includePaths에 경로 추가
                includePaths: [path.resolve(__dirname, 'src')],
                // SCSS 파일 내에서 별칭을 사용할 때, 경로의 시작 부분에 '~'를 추가
                // additionalData: `@import '~@applejelly/styles/variables';`,
            },
        },
    },
})
