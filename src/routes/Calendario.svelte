<script>
  import { onMount } from 'svelte';
  import { eventos, carregandoEventos, viewCalendario, dataReferencia, carregarEventos } from '$lib/stores/calendario.js';
  import { activeModal } from '$lib/stores/ui.js';
  import { tituloPeriodo, navegarPeriodo } from '$lib/utils/dates.js';

  import GridSemanal from '$lib/components/calendario/GridSemanal.svelte';
  import GridMensal from '$lib/components/calendario/GridMensal.svelte';
  import ModalEvento from '$lib/components/calendario/ModalEvento.svelte';

  onMount(() => {
    carregarEventos($dataReferencia, $viewCalendario);
  });

  $effect(() => {
    carregarEventos($dataReferencia, $viewCalendario);
  });

  let titulo = $derived(tituloPeriodo(
    $viewCalendario === 'semana' ? 'semana' : 'mes',
    $dataReferencia
  ));

  function navegar(direcao) {
    dataReferencia.update(ref => navegarPeriodo(ref, $viewCalendario, direcao));
  }

  async function irParaHoje() {
    const { hoje } = await import('$lib/utils/dates.js');
    dataReferencia.set(hoje());
  }
</script>

<div class="page">

  <!-- header -->
  <header class="page-header">
    <div class="page-title">
      <h1>calendario</h1>
    </div>
    <div class="page-actions">
      <!-- navegacao de periodo -->
      <div class="nav-periodo">
        <button class="btn-nav" onclick={() => navegar('anterior')}>‹</button>
        <span class="periodo-titulo">{titulo}</span>
        <button class="btn-nav" onclick={() => navegar('proximo')}>›</button>
      </div>

      <!-- toggle semana / mes -->
      <div class="view-toggle">
        <button
          class="toggle-btn"
          class:ativo={$viewCalendario === 'semana'}
          onclick={() => viewCalendario.set('semana')}
        >semana</button>
        <button
          class="toggle-btn"
          class:ativo={$viewCalendario === 'mes'}
          onclick={() => viewCalendario.set('mes')}
        >mes</button>
      </div>

      <button class="btn-ghost" onclick={irParaHoje}>hoje</button>

      <button class="btn-primary" onclick={() => activeModal.set('novoEvento')}>
        + novo evento
      </button>
    </div>
  </header>

  <!-- grid -->
  {#if $carregandoEventos}
    <div class="estado-loading">carregando...</div>
  {:else if $viewCalendario === 'semana'}
    <GridSemanal
      eventos={$eventos}
      dataRef={$dataReferencia}
      onatualizar={() => carregarEventos($dataReferencia, $viewCalendario)}
    />
  {:else}
    <GridMensal
      eventos={$eventos}
      dataRef={$dataReferencia}
      onatualizar={() => carregarEventos($dataReferencia, $viewCalendario)}
    />
  {/if}

</div>

{#if $activeModal === 'novoEvento' || $activeModal === 'editarEvento'}
  <ModalEvento
    onfechar={() => activeModal.set(null)}
    onsalvo={() => carregarEventos($dataReferencia, $viewCalendario)}
  />
{/if}

<style>

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  h1 {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 600;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .page-actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .nav-periodo {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .btn-nav {
    background: none;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: var(--text-md);
    color: var(--text-secondary);
    transition: all var(--transition-fast);
  }
  .btn-nav:hover { background: var(--bg-hover); border-color: var(--border-strong); }

  .periodo-titulo {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
    min-width: 160px;
    text-align: center;
  }

  .view-toggle {
    display: flex;
    gap: 2px;
    padding: 3px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }

  .toggle-btn {
    padding: 4px 12px;
    border-radius: calc(var(--radius-md) - 2px);
    border: none;
    background: none;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  .toggle-btn.ativo {
    background: var(--bg);
    color: var(--text-primary);
    box-shadow: var(--shadow-sm);
  }

  .btn-ghost {
    background: none;
    border: 1px solid var(--border);
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    padding: 7px 14px;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  .btn-ghost:hover { background: var(--bg-hover); }

  .btn-primary {
    background: var(--text-primary);
    color: var(--bg);
    border: none;
    border-radius: var(--radius-md);
    padding: 8px 14px;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    font-weight: 500;
    cursor: pointer;
    transition: opacity var(--transition-fast);
  }
  .btn-primary:hover { opacity: 0.85; }

  .estado-loading {
    font-size: var(--text-sm);
    color: var(--text-muted);
    padding: var(--space-8) 0;
  }
</style>
