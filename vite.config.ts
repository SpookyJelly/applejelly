import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from 'path'
import postcss from 'rollup-plugin-postcss'
import replace from '@rollup/plugin-replace'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

export default defineConfig({
    plugins: [
        libInjectCss(),
        react(),
        dts({
            entryRoot: 'src',
            outDir: 'dist/types',
        }),
    ],
    build: {
        cssCodeSplit: true, // ✅ CSS 분할 활성화
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'applejelly',
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: [
                {
                    format: 'es',
                    dir: 'dist/esm', // 📁 esm 폴더에 저장
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: '[name].js',
                },
                // CJS 구성
                {
                    format: 'cjs',
                    dir: 'dist/cjs', // 📁 cjs 폴더에 저장
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: '[name].js',
                },
            ],
            plugins: [
                postcss({
                    extract: true, // ✅ CSS 파일 추출
                    minimize: true,
                    sourceMap: true,
                    inject: true,
                    modules: true, // ❌ CSS 모듈 비활성화
                    use: ['sass'],
                    autoModules: true,
                }),
            ],
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "./src/style/variables.scss";`, // ✅ 전역 SCSS 변수 (필요시)
                includePaths: [path.resolve(__dirname, 'src')],
            },
        },
    },
    resolve: {
        alias: {
            '@applejelly': path.resolve(__dirname, './src'),
        },
    },
})
