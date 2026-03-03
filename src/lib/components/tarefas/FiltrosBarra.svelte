<!-- src/lib/components/tarefas/FiltrosBarra.svelte -->
<script>
  import { filtroTexto, filtroArea, filtroPrioridade } from '$lib/stores/tarefas.js';
  import { areas } from '$lib/stores/areas.js';

  $: temFiltro = $filtroTexto || $filtroArea || $filtroPrioridade;

  function limpar() {
    filtroTexto.set('');
    filtroArea.set(null);
    filtroPrioridade.set(null);
  }

  const PRIORIDADES = ['critica', 'alta', 'media', 'baixa'];
</script>

<div class="filtros-barra">

  <!-- busca -->
  <div class="busca-campo">
    <span class="busca-icone">○</span>
    <input
      type="text"
      bind:value={$filtroTexto}
      class="busca-input"
      placeholder="buscar tarefas..."
    />
    {#if $filtroTexto}
      <button class="btn-limpar-campo" on:click={() => filtroTexto.set('')}>×</button>
    {/if}
  </div>

  <!-- filtro area -->
  <select bind:value={$filtroArea} class="filtro-select">
    <option value={null}>todas as areas</option>
    {#each $areas as area}
      <option value={area.id}>{area.nome}</option>
    {/each}
  </select>

  <!-- filtro prioridade -->
  <select bind:value={$filtroPrioridade} class="filtro-select">
    <option value={null}>qualquer prioridade</option>
    {#each PRIORIDADES as p}
      <option value={p}>{p}</option>
    {/each}
  </select>

  <!-- limpar filtros -->
  {#if temFiltro}
    <button class="btn-limpar" on:click={limpar}>limpar filtros</button>
  {/if}

</div>

<style>
  .filtros-barra {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .busca-campo {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 6px 12px;
    transition: border-color var(--transition-fast);
    flex: 1;
    min-width: 200px;
  }
  .busca-campo:focus-within {
    border-color: var(--text-primary);
    background: var(--bg);
  }

  .busca-icone {
    font-size: 13px;
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .busca-input {
    border: none;
    background: transparent;
    outline: none;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    color: var(--text-primary);
    flex: 1;
  }
  .busca-input::placeholder { color: var(--text-disabled); }

  .btn-limpar-campo {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); font-size: 16px;
    display: flex; align-items: center;
    transition: color var(--transition-fast);
  }
  .btn-limpar-campo:hover { color: var(--text-primary); }

  .filtro-select {
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 6px 10px;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    color: var(--text-secondary);
    background: var(--bg-secondary);
    outline: none;
    cursor: pointer;
    transition: border-color var(--transition-fast);
  }
  .filtro-select:focus { border-color: var(--text-primary); background: var(--bg); }

  .btn-limpar {
    background: none; border: none; cursor: pointer;
    font-size: var(--text-xs); color: var(--text-muted);
    font-family: var(--font-body); font-weight: 500;
    padding: 6px 10px; border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    margin-left: auto;
  }
  .btn-limpar:hover { background: var(--bg-hover); color: var(--text-primary); }
</style>
