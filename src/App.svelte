<script>
  import AppShell from '$lib/components/layout/AppShell.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import Tarefas from './routes/Tarefas.svelte';
  import Calendario from './routes/Calendario.svelte';
  import { currentRoute } from '$lib/stores/navigation.js';
  import { initDb } from '$lib/db/client.js';
  import { restaurarJanela, iniciarPersistenciaJanela } from '$lib/utils/window.js';
  import { onMount } from 'svelte';

  let dbPronto = false;

  onMount(async () => {
    await initDb();
    dbPronto = true;
    await restaurarJanela();
    await iniciarPersistenciaJanela();
  });

  // views que exibem o painel lateral
  const viewsComPainel = new Set(['dashboard', 'tarefas']);

  const views = { 
    dashboard: Dashboard,
    tarefas: Tarefas,
    calendario: Calendario
  };
  
  $: currentView = views[$currentRoute] ?? Dashboard;
  $: showPainel  = viewsComPainel.has($currentRoute);
</script>

{#if dbPronto}
  <AppShell {currentView} {showPainel} />
{:else}
  <div class="app-loading">
    <span>nexus</span>
  </div>
{/if}

<style>
  .app-loading {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--text-muted);
    background: var(--bg);
  }
</style>
