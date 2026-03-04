<!-- src/lib/components/metas/FiltrosMetas.svelte -->
<script>
  export let status = 'ativa';
  export let area = null;
  export let prazo = null;

  import { areas } from '$lib/stores/areas.js';

  const PRAZOS = [
    { id: null, label: 'todos os prazos' },
    { id: 'semana', label: 'esta semana' },
    { id: 'mes', label: 'este mes' },
    { id: 'trimestre', label: 'este trimestre' },
    { id: 'ano', label: 'este ano' },
  ];

  const STATUS = [
    { id: 'ativa', label: 'ativas' },
    { id: 'concluida', label: 'concluidas' },
    { id: 'pausada', label: 'pausadas' },
    { id: 'abandonada', label: 'abandonadas' },
  ];
</script>

<div class="filtros">
  <div class="grupo-filtros">
    {#each STATUS as s}
      <button
        class="filtro-item"
        class:active={status === s.id}
        on:click={() => status = s.id}
      >
        {s.label}
      </button>
    {/each}
  </div>

  <div class="seletores">
    <select bind:value={area}>
      <option value={null}>todas as areas</option>
      {#each $areas as a}
        <option value={a.id}>{a.nome}</option>
      {/each}
    </select>

    <select bind:value={prazo}>
      {#each PRAZOS as p}
        <option value={p.id}>{p.label}</option>
      {/each}
    </select>
  </div>
</div>

<style>
  .filtros {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .grupo-filtros {
    display: flex;
    background: var(--bg-secondary);
    padding: 3px;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
  }

  .filtro-item {
    background: none;
    border: none;
    padding: 6px 12px;
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }

  .filtro-item.active {
    background: var(--bg);
    color: var(--text-primary);
    box-shadow: var(--shadow-sm);
  }

  .seletores {
    display: flex;
    gap: var(--space-2);
  }

  select {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 5px 10px;
    font-size: var(--text-xs);
    color: var(--text-primary);
    cursor: pointer;
    outline: none;
  }
</style>
