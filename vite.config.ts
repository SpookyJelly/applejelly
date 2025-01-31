import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from 'path'
import postcss from 'rollup-plugin-postcss'

export default defineConfig({
    plugins: [
        react(),
        dts({
            entryRoot: 'src',
            outDir: 'dist/types',
        }),
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'applejelly',
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: [
                {
                    // 단일 출력 구성으로 변경
                    dir: 'dist/esm',
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: '[name].js',
                },
                {
                    dir: 'dist/cjs',
                    format: 'cjs',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: '[name].js',
                },
            ],
            plugins: [
                postcss({
                    extract: true,
                    minimize: true,
                    sourceMap: true,
                    modules: true, // CSS 모듈 활성화
                }),
            ],
        },
    },
    resolve: {
        alias: {
            '@applejelly': path.resolve(__dirname, './src'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                includePaths: [path.resolve(__dirname, 'src')],
            },
        },
    },
})
