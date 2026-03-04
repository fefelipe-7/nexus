<!-- src/lib/components/dashboard/CardTarefas.svelte -->
<script>
  import { concluirTarefa, reabrirTarefa, deletarTarefa } from '$lib/db/queries/tarefas.js';
  import { activeModal, tarefaEditando } from '$lib/stores/ui.js';
  import { labelRelativo } from '$lib/utils/dates.js';
  import { createEventDispatcher } from 'svelte';

  export let tarefas   = [];
  export let atrasadas = [];
  export let tab       = 'dia';

  const dispatch = createEventDispatcher();

  const PRIORIDADE_COR = {
    critica: '#ef4444',
    alta:    '#f59e0b',
    media:   '#6b6b6b',
    baixa:   '#d4d2cc',
  };

  async function toggleConcluir(tarefa) {
    if (tarefa.status === 'concluida') {
      await reabrirTarefa(tarefa.id);
    } else {
      await concluirTarefa(tarefa.id);
    }
    dispatch('atualizar');
  }

  async function remover(id) {
    await deletarTarefa(id);
    dispatch('atualizar');
  }

  function editar(tarefa) {
    tarefaEditando.set(tarefa);
    activeModal.set('editarTarefa');
  }

  // na tab dia mostra atrasadas separadas antes das de hoje
  $: mostraAtrasadas = tab === 'dia' && atrasadas.length > 0;
  $: totalVisiveis = tarefas.length + atrasadas.length;
</script>

<div class="card card-tarefas">
  <div class="card-header">
    <h2 class="card-titulo">tarefas</h2>
    <span class="card-contador">
      {tarefas.filter(t => t.status !== 'concluida').length} pendentes
    </span>
  </div>

  {#if totalVisiveis === 0}
    <div class="card-vazio">
      <span class="vazio-icone">✓</span>
      <p>nenhuma tarefa para este periodo</p>
      <button class="btn-vazio" on:click={() => activeModal.set('novaTarefa')}>
        + adicionar tarefa
      </button>
    </div>

  {:else}
    {#if mostraAtrasadas}
      <div class="secao-label secao-label--alerta">atrasadas</div>
      {#each atrasadas as tarefa (tarefa.id)}
        <div class="tarefa-item tarefa-item--atrasada">
          <button class="tarefa-check" on:click={() => toggleConcluir(tarefa)} aria-label="concluir tarefa">
            <span class="check-box"></span>
          </button>
          <div class="tarefa-corpo" on:click={() => editar(tarefa)} on:keydown={() => {}} role="button" tabindex="0">
            <span class="tarefa-titulo">{tarefa.titulo}</span>
            <div class="tarefa-meta">
              <span class="tarefa-data atrasada">{labelRelativo(tarefa.data_prevista)}</span>
              {#if tarefa.area_nome}
                <span class="tarefa-area" style="color: {tarefa.area_cor}">{tarefa.area_nome}</span>
              {/if}
            </div>
          </div>
          <div class="tarefa-prioridade" style="background: {PRIORIDADE_COR[tarefa.prioridade]}" title={tarefa.prioridade}></div>
        </div>
      {/each}
    {/if}

    {#if tarefas.length > 0 && mostraAtrasadas}
      <div class="secao-label">hoje</div>
    {/if}

    {#each tarefas as tarefa (tarefa.id)}
      <div class="tarefa-item" class:concluida={tarefa.status === 'concluida'}>
        <button class="tarefa-check" on:click={() => toggleConcluir(tarefa)} aria-label="concluir tarefa">
          <span class="check-box" class:checked={tarefa.status === 'concluida'}>
            {#if tarefa.status === 'concluida'}✓{/if}
          </span>
        </button>
        <div class="tarefa-corpo" on:click={() => editar(tarefa)} on:keydown={() => {}} role="button" tabindex="0">
          <span class="tarefa-titulo">{tarefa.titulo}</span>
          <div class="tarefa-meta">
            {#if tarefa.hora_prevista}
              <span class="tarefa-hora">{tarefa.hora_prevista}</span>
            {/if}
            {#if tarefa.data_prevista && tab !== 'dia'}
              <span class="tarefa-data">{labelRelativo(tarefa.data_prevista)}</span>
            {/if}
            {#if tarefa.area_nome}
              <span class="tarefa-area" style="color: {tarefa.area_cor}">{tarefa.area_nome}</span>
            {/if}
          </div>
        </div>
        <div class="tarefa-prioridade" style="background: {PRIORIDADE_COR[tarefa.prioridade]}" title={tarefa.prioridade}></div>
      </div>
    {/each}
  {/if}

  <div class="card-footer">
    <button class="btn-link" on:click={() => activeModal.set('novaTarefa')}>+ nova tarefa</button>
  </div>
</div>

<style>
  .card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .card-tarefas { grid-column: span 1; }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--border);
  }

  .card-titulo {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
  }

  .card-contador {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
  }

  .secao-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 600;
    padding: var(--space-3) var(--space-5) var(--space-1);
    letter-spacing: 0.4px;
  }

  .secao-label--alerta { color: #c2570a; }

  .tarefa-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 10px var(--space-5);
    transition: background var(--transition-fast);
    position: relative;
  }

  .tarefa-item:hover { background: var(--bg-hover); }
  .tarefa-item.concluida .tarefa-titulo { text-decoration: line-through; color: var(--text-muted); }
  .tarefa-item--atrasada { background: #fff8f0; }
  .tarefa-item--atrasada:hover { background: #fef0e0; }

  .tarefa-check {
    background: none; border: none; cursor: pointer;
    padding: 0; flex-shrink: 0; display: flex; align-items: center;
  }

  .check-box {
    width: 16px; height: 16px;
    border: 1.5px solid var(--border-strong);
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; color: var(--bg);
    transition: all var(--transition-fast);
  }

  .check-box.checked {
    background: var(--text-primary);
    border-color: var(--text-primary);
  }

  .tarefa-corpo {
    flex: 1;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .tarefa-titulo {
    font-size: var(--text-sm);
    color: var(--text-primary);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tarefa-meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .tarefa-hora, .tarefa-data, .tarefa-area {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 400;
  }

  .tarefa-data.atrasada { color: #c2570a; font-weight: 500; }

  .tarefa-prioridade {
    width: 6px; height: 6px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }

  .card-vazio {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    padding: var(--space-10) var(--space-5);
    color: var(--text-muted);
    flex: 1;
  }

  .vazio-icone { font-size: 24px; opacity: 0.3; }

  .btn-vazio {
    background: none; border: 1px solid var(--border); color: var(--text-secondary);
    border-radius: var(--radius-md); padding: 6px 14px;
    font-size: var(--text-sm); font-family: var(--font-body);
    cursor: pointer; transition: all var(--transition-fast);
  }
  .btn-vazio:hover { background: var(--bg-hover); border-color: var(--border-strong); }

  .card-footer {
    padding: var(--space-3) var(--space-5);
    border-top: 1px solid var(--border);
  }

  .btn-link {
    background: none; border: none; cursor: pointer;
    font-size: var(--text-sm); color: var(--text-muted);
    font-family: var(--font-body); padding: 0;
    transition: color var(--transition-fast);
  }
  .btn-link:hover { color: var(--text-primary); }
</style>
