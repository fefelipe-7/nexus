<!-- src/lib/components/tarefas/ItemTarefa.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  import { activeModal, tarefaEditando } from '$lib/stores/ui.js';
  import { adiarTarefa } from '$lib/db/queries/tarefas.js';
  import { labelRelativo, hoje } from '$lib/utils/dates.js';

  export let tarefa;

  const dispatch = createEventDispatcher();

  const PRIORIDADE_COR = {
    critica: '#ef4444',
    alta:    '#f59e0b',
    media:   '#d4d2cc',
    baixa:   '#e9e8e4',
  };

  let mostrarAcoes = false;

  function editar() {
    tarefaEditando.set(tarefa);
    activeModal.set('editarTarefa');
  }

  async function adiarParaAmanha() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const amanha = d.toISOString().slice(0, 10);
    await adiarTarefa(tarefa.id, amanha);
    dispatch('atualizar');
  }

  async function adiarParaProximaSemana() {
    const d = new Date();
    const diaSemana = d.getDay();
    const diasAteSegunda = diaSemana === 0 ? 1 : 8 - diaSemana;
    d.setDate(d.getDate() + diasAteSegunda);
    await adiarTarefa(tarefa.id, d.toISOString().slice(0, 10));
    dispatch('atualizar');
  }

  $: atrasada = tarefa.data_prevista && tarefa.data_prevista < hoje() && tarefa.status !== 'concluida';
  $: corPrioridade = PRIORIDADE_COR[tarefa.prioridade] ?? PRIORIDADE_COR.media;
</script>

<div
  class="item-tarefa"
  class:concluida={tarefa.status === 'concluida'}
  class:atrasada
  on:mouseenter={() => mostrarAcoes = true}
  on:mouseleave={() => mostrarAcoes = false}
>
  <!-- checkbox -->
  <button
    class="check-btn"
    on:click={() => dispatch('concluir')}
    aria-label={tarefa.status === 'concluida' ? 'reabrir tarefa' : 'concluir tarefa'}
  >
    <span class="check-box" class:checked={tarefa.status === 'concluida'}>
      {#if tarefa.status === 'concluida'}✓{/if}
    </span>
  </button>

  <!-- corpo clicavel -->
  <div class="item-corpo" on:click={editar} on:keydown={() => {}} role="button" tabindex="0">
    <span class="item-titulo">{tarefa.titulo}</span>
    <div class="item-meta">
      {#if tarefa.hora_prevista}
        <span class="meta-chip">{tarefa.hora_prevista}</span>
      {/if}
      {#if tarefa.data_prevista}
        <span class="meta-chip" class:alerta={atrasada}>
          {labelRelativo(tarefa.data_prevista)}
        </span>
      {/if}
      {#if tarefa.area_nome}
        <span class="meta-chip area" style="color: {tarefa.area_cor}">
          {tarefa.area_nome}
        </span>
      {/if}
    </div>
  </div>

  <!-- indicador de prioridade -->
  <div
    class="prioridade-dot"
    style="background: {corPrioridade}"
    title={tarefa.prioridade}
  ></div>

  <!-- hover actions -->
  {#if mostrarAcoes && tarefa.status !== 'concluida'}
    <div class="hover-acoes">
      <button class="acao-btn" on:click={adiarParaAmanha} title="adiar para amanha">
        amanha
      </button>
      <button class="acao-btn" on:click={adiarParaProximaSemana} title="adiar para proxima semana">
        prox. semana
      </button>
      <button class="acao-btn" on:click={editar} title="editar">
        editar
      </button>
    </div>
  {/if}
</div>

<style>
  .item-tarefa {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 10px var(--space-3);
    border-radius: var(--radius-md);
    position: relative;
    transition: background var(--transition-fast);
    cursor: default;
  }
  .item-tarefa:hover { background: var(--bg-hover); }
  .item-tarefa.atrasada { background: #fff8f0; }
  .item-tarefa.atrasada:hover { background: #fef0e0; }

  .check-btn {
    background: none; border: none; cursor: pointer;
    flex-shrink: 0; display: flex; align-items: center; padding: 0;
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

  .item-corpo {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    cursor: pointer;
    min-width: 0;
  }

  .item-titulo {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color var(--transition-fast);
  }
  .concluida .item-titulo {
    text-decoration: line-through;
    color: var(--text-muted);
  }

  .item-meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .meta-chip {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 400;
  }
  .meta-chip.alerta { color: #c2570a; font-weight: 500; }
  .meta-chip.area   { font-weight: 500; }

  .prioridade-dot {
    width: 6px; height: 6px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
    opacity: 0.7;
    transition: opacity var(--transition-fast);
  }
  .item-tarefa:hover .prioridade-dot { opacity: 1; }

  /* hover actions */
  .hover-acoes {
    display: flex;
    align-items: center;
    gap: 4px;
    position: absolute;
    right: var(--space-3);
    background: var(--bg-hover);
    border-radius: var(--radius-md);
    padding: 2px;
    animation: aparecer 100ms ease;
  }

  @keyframes aparecer {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }

  .acao-btn {
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    border-radius: calc(var(--radius-md) - 2px);
    padding: 3px 8px;
    font-size: var(--text-xs);
    font-family: var(--font-body);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    white-space: nowrap;
  }
  .acao-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--border-strong);
  }
</style>
