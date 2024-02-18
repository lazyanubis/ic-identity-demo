import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: { hmr: true, port: 8080, host: '0.0.0.0' },
    resolve: {
        alias: {
            process: 'process/browser',
        },
    },
});
