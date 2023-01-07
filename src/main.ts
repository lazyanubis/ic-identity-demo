import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import VConsole from 'vconsole';

new VConsole();

// @dfinity/agent 里创建 Actor 总是要求有 global
if ((window as any).global === undefined) (window as any).global = window;

createApp(App).mount('#app');
