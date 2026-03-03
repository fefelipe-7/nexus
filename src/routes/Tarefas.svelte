<!-- src/routes/Tarefas.svelte -->
<script>
  import { onMount } from 'svelte';
  import { activeTab } from '$lib/stores/navigation.js';
  import {
    tarefas, tarefasAtrasadas, tarefasSemData,
    carregando, carregarTarefas,
    filtroTexto, filtroArea, filtroPrioridade
  } from '$lib/stores/tarefas.js';
  import { activeModal } from '$lib/stores/ui.js';
  import { areas } from '$lib/stores/areas.js';
  import { hoje, labelRelativo, getIntervalo, tituloPeriodo } from '$lib/utils/dates.js';
  import { concluirTarefa, reabrirTarefa, adiarTarefa } from '$lib/db/queries/tarefas.js';

  import TemporalTabs from '$lib/components/layout/TemporalTabs.svelte';
  import ModalTarefa from '$lib/components/tarefas/ModalTarefa.svelte';
  import ItemTarefa from '$lib/components/tarefas/ItemTarefa.svelte';
  import FiltrosBarra from '$lib/components/tarefas/FiltrosBarra.svelte';

  let buscaLocal = '';
  let debounceTimer;

  onMount(() => {
    carregarTarefas($activeTab);
  });

  $: carregarTarefas($activeTab, {
    texto: $filtroTexto,
    areaId: $filtroArea,
    prioridade: $filtroPrioridade,
  });

  // agrupa tarefas por data para exibicao
  $: grupos = agruparPorData($tarefas, $activeTab);

  function agruparPorData(lista, tab) {
    if (tab === 'dia') return []; // na tab dia nao precisa agrupar, so mostra a lista plana

    const mapa = new Map();
    for (const t of lista) {
      const key = t.data_prevista ?? '__sem_data';
      if (!mapa.has(key)) mapa.set(key, []);
      mapa.get(key).push(t);
    }

    return [...mapa.entries()]
      .sort(([a], [b]) => {
        if (a === '__sem_data') return 1;
        if (b === '__sem_data') return -1;
        return a.localeCompare(b);
      })
      .map(([data, itens]) => ({ data, itens }));
  }

  async function toggleConcluir(tarefa) {
    if (tarefa.status === 'concluida') {
      await reabrirTarefa(tarefa.id);
    } else {
      await concluirTarefa(tarefa.id);
    }
    carregarTarefas($activeTab);
  }

  $: temFiltroAtivo = $filtroTexto || $filtroArea || $filtroPrioridade;
  $: totalPendentes = $tarefas.filter(t => t.status !== 'concluida').length
                    + $tarefasAtrasadas.length;
</script>

<div class="tarefas-page">

  <!-- header -->
  <header class="page-header">
    <div class="page-title">
      <h1>tarefas</h1>
      {#if totalPendentes > 0}
        <span class="badge-contador">{totalPendentes}</span>
      {/if}
    </div>
    <div class="page-actions">
      <TemporalTabs />
      <button class="btn-primary" on:click={() => activeModal.set('novaTarefa')}>
        + nova tarefa
      </button>
    </div>
  </header>

  <!-- filtros -->
  <FiltrosBarra />

  <!-- lista -->
  {#if $carregando}
    <div class="estado-loading">carregando tarefas...</div>

  {:else if totalPendentes === 0 && $tarefas.length === 0 && $tarefasAtrasadas.length === 0 && $tarefasSemData.length === 0}
    <div class="estado-vazio">
      <span class="vazio-icone">✓</span>
      <p>nenhuma tarefa {temFiltroAtivo ? 'encontrada com esses filtros' : 'para este periodo'}</p>
      {#if !temFiltroAtivo}
        <button class="btn-ghost" on:click={() => activeModal.set('novaTarefa')}>
          + adicionar tarefa
        </button>
      {/if}
    </div>

  {:else}

    <!-- atrasadas (so aparece na tab dia) -->
    {#if $tarefasAtrasadas.length > 0 && $activeTab === 'dia'}
      <section class="grupo-tarefas grupo-atrasadas">
        <div class="grupo-header">
          <span class="grupo-titulo alerta">atrasadas</span>
          <span class="grupo-contador">{$tarefasAtrasadas.length}</span>
        </div>
        {#each $tarefasAtrasadas as tarefa (tarefa.id)}
          <ItemTarefa
            {tarefa}
            on:concluir={() => toggleConcluir(tarefa)}
            on:atualizar={() => carregarTarefas($activeTab)}
          />
        {/each}
      </section>
    {/if}

    <!-- tab dia: lista plana com header "hoje" -->
    {#if $activeTab === 'dia'}
      {#if $tarefas.length > 0}
        <section class="grupo-tarefas">
          <div class="grupo-header">
            <span class="grupo-titulo">hoje</span>
            <span class="grupo-contador">
              {$tarefas.filter(t => t.status !== 'concluida').length} pendentes
            </span>
          </div>
          {#each $tarefas as tarefa (tarefa.id)}
            <ItemTarefa
              {tarefa}
              on:concluir={() => toggleConcluir(tarefa)}
              on:atualizar={() => carregarTarefas($activeTab)}
            />
          {/each}
        </section>
      {/if}

    <!-- outras tabs: agrupado por data -->
    {:else}
      {#each grupos as grupo}
        <section class="grupo-tarefas">
          <div class="grupo-header">
            <span class="grupo-titulo">
              {grupo.data === '__sem_data' ? 'sem data' : labelRelativo(grupo.data)}
            </span>
            <span class="grupo-contador">
              {grupo.itens.filter(t => t.status !== 'concluida').length} pendentes
            </span>
          </div>
          {#each grupo.itens as tarefa (tarefa.id)}
            <ItemTarefa
              {tarefa}
              on:concluir={() => toggleConcluir(tarefa)}
              on:atualizar={() => carregarTarefas($activeTab)}
            />
          {/each}
        </section>
      {/each}
    {/if}

    <!-- sem data (todas as tabs) -->
    {#if $tarefasSemData.length > 0 && $activeTab === 'dia'}
      <section class="grupo-tarefas grupo-sem-data">
        <div class="grupo-header">
          <span class="grupo-titulo muted">sem data</span>
          <span class="grupo-contador">{$tarefasSemData.length}</span>
        </div>
        {#each $tarefasSemData as tarefa (tarefa.id)}
          <ItemTarefa
            {tarefa}
            on:concluir={() => toggleConcluir(tarefa)}
            on:atualizar={() => carregarTarefas($activeTab)}
          />
        {/each}
      </section>
    {/if}

  {/if}

</div>

{#if $activeModal === 'novaTarefa' || $activeModal === 'editarTarefa'}
  <ModalTarefa
    on:fechar={() => activeModal.set(null)}
    on:salvo={() => carregarTarefas($activeTab)}
  />
{/if}

<style>
  .tarefas-page {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: var(--space-8);
    width: 100%;
    gap: var(--space-5);
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
  }

  .page-title {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  h1 {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 600;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .badge-contador {
    background: var(--bg-active);
    color: var(--text-secondary);
    font-size: var(--text-xs);
    font-weight: 600;
    padding: 3px 8px;
    border-radius: var(--radius-full);
  }

  .page-actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-shrink: 0;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: 8px 14px;
    background: var(--text-primary);
    color: var(--bg);
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-family: var(--font-body);
    font-weight: 500;
    cursor: pointer;
    transition: opacity var(--transition-fast);
    white-space: nowrap;
  }
  .btn-primary:hover { opacity: 0.85; }

  /* grupos */
  .grupo-tarefas {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .grupo-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) 0 var(--space-1);
    margin-bottom: var(--space-1);
    border-bottom: 1px solid var(--border);
  }

  .grupo-titulo {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
  }
  .grupo-titulo.alerta { color: #c2570a; }
  .grupo-titulo.muted  { color: var(--text-muted); }

  .grupo-contador {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .grupo-atrasadas .grupo-titulo { color: #c2570a; }

  /* estados */
  .estado-loading,
  .estado-vazio {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    padding: var(--space-12) 0;
    color: var(--text-muted);
    font-size: var(--text-sm);
  }

  .vazio-icone { font-size: 28px; opacity: 0.25; }

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
    margin-top: var(--space-2);
  }
  .btn-ghost:hover { background: var(--bg-hover); }
</style>
