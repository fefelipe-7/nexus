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
  let erroInit = null;

  onMount(async () => {
    try {
      await initDb();
      dbPronto = true;
      try {
        await restaurarJanela();
        await iniciarPersistenciaJanela();
      } catch (errWin) {
        console.warn('erro nao-fatal ao restaurar janela:', errWin);
      }
    } catch (e) {
      console.error('Erro critico na inicializacao:', e);
      erroInit = e.message || String(e);
    }
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
    {#if erroInit}
      <div class="erro-box">
        <h3>Erro fatal ao carregar o nexus</h3>
        <p>{erroInit}</p>
        <p class="dica">Verifique se as permissoes do plugin-sql ou window estao no tauri.conf.json / capabilities.</p>
        <button on:click={() => window.location.reload()}>tentar novamente</button>
      </div>
    {:else}
      <span>nexus</span>
    {/if}
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

  .erro-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
    max-width: 400px;
    text-align: center;
    background: var(--bg-secondary);
    padding: var(--space-6);
    border-radius: var(--radius-lg);
    border: 1px solid var(--status-danger);
  }
  .erro-box h3 { color: var(--status-danger); font-size: var(--text-md); margin: 0; }
  .erro-box p { color: var(--text-primary); font-size: var(--text-sm); font-family: var(--font-body); margin: 0; word-break: break-all; }
  .erro-box p.dica { color: var(--text-muted); font-size: var(--text-xs); }
  .erro-box button { background: var(--text-primary); color: var(--bg); border: none; padding: 8px 16px; border-radius: var(--radius-md); cursor: pointer; }
</style>
