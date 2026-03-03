<script>
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import { currentRoute } from '$lib/stores/navigation.js';
  import { initDb } from '$lib/db/client.js';
  import { onMount } from 'svelte';

  onMount(async () => { await initDb(); });

  const views = { dashboard: Dashboard };
  $: currentView = views[$currentRoute] ?? Dashboard;
</script>

<div class="app-shell">
  <Sidebar />
  <main class="app-main">
    <svelte:component this={currentView} />
  </main>
</div>

<style>
  .app-shell { display: flex; height: 100vh; overflow: hidden; background: var(--bg); }
  .app-main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
</style>
