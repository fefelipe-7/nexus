console.log('[nexus] main.js carregando...');
import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, {
    target: document.getElementById('app'),
});

export default app;
