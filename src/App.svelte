<script>
  import AppShell from '$lib/components/layout/AppShell.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import Tarefas from './routes/Tarefas.svelte';
  import Calendario from './routes/Calendario.svelte';
  import Metas from './routes/Metas.svelte';
  import Habitos from './routes/Habitos.svelte';
  import { navigationState } from '$lib/stores/navigation.js';
  import { initDb } from '$lib/db/client.js';
  import { restaurarJanela, iniciarPersistenciaJanela } from '$lib/utils/window.js';
  import { onMount } from 'svelte';

  console.log('[nexus] carregando script de App.svelte...');

  let dbPronto = $state(false);
  let erroInit = $state(null);

  onMount(async () => {
    window.onerror = (msg, url, line, col, error) => {
      console.error('[nexus] erro global:', msg, error);
      return false;
    };
    window.onunhandledrejection = (event) => {
      console.error('[nexus] promessa nao tratada:', event.reason);
    };

    console.log('[nexus] iniciando App...');

    const isTauri = '__TAURI_INTERNALS__' in window;
    if (!isTauri) {
      erroInit = "Ambiente nao-Tauri detectado.";
      return;
    }

    try {
      await initDb();
      dbPronto = true;
      try {
        await restaurarJanela();
        await iniciarPersistenciaJanela();
      } catch (errWin) {
        console.warn('[nexus] erro na janela:', errWin);
      }
    } catch (e) {
      erroInit = e.message || String(e);
    }
  });

  const viewsComPainel = new Set(['dashboard', 'tarefas', 'metas', 'habitos']);

  const views = { 
    dashboard: Dashboard,
    tarefas: Tarefas,
    calendario: Calendario,
    metas: Metas,
    habitos: Habitos
  };
  
  let currentView = $derived(views[navigationState.currentRoute] ?? Dashboard);
  let showPainel  = $derived(viewsComPainel.has(navigationState.currentRoute));
</script>

{#if dbPronto}
  <AppShell {currentView} {showPainel} />
{:else}
  <div class="app-loading">
    {#if erroInit}
      <div class="erro-box">
        <h1 style="color: white; font-size: 30px;">ERRO CRITICO</h1>
        <p style="color: white;">{erroInit}</p>
        <button onclick={() => window.location.reload()}>RECARREGAR</button>
      </div>
    {:else}
      <div style="text-align: center;">
        <h1 style="font-size: 50px; color: white;">CARREGANDO NEXUS...</h1>
        <p style="color: white;">Aguardando banco de dados...</p>
      </div>
    {/if}
  </div>
{/if}

<style>

  .app-loading {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    position: relative;
  }

  .erro-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
    max-width: 80%;
    text-align: center;
    background: red;
    padding: var(--space-6);
    border-radius: var(--radius-lg);
    border: 5px solid white;
  }
  .erro-box h3 { color: var(--status-danger); font-size: var(--text-md); margin: 0; }
  .erro-box p { color: var(--text-primary); font-size: var(--text-sm); font-family: var(--font-body); margin: 0; word-break: break-all; }
  .erro-box p.dica { color: var(--text-muted); font-size: var(--text-xs); }
  .erro-box button { background: var(--text-primary); color: var(--bg); border: none; padding: 8px 16px; border-radius: var(--radius-md); cursor: pointer; }
</style>
