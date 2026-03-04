<script>
  import { onMount } from 'svelte';
  import { proximosEventos, carregarProximosEventos } from '$lib/stores/calendario.js';
  import { labelRelativo } from '$lib/utils/dates.js';

  onMount(() => {
    carregarProximosEventos();
  });
</script>

<div class="proximos">
  <div class="proximos-header">
    <span class="proximos-titulo">proximos eventos</span>
  </div>

  {#if $proximosEventos.length === 0}
    <div class="proximos-vazio">
      <p>nenhum evento nos proximos 30 dias</p>
    </div>
  {:else}
    <div class="proximos-lista">
      {#each $proximosEventos as evento (evento.id)}
        <div class="proximos-item">
          <div
            class="proximos-cor"
            style="background: {evento.area_cor ?? 'var(--border-strong)'}"
          />
          <div class="proximos-info">
            <span class="proximos-nome">{evento.titulo}</span>
            <span class="proximos-data">
              {labelRelativo(evento.inicio.slice(0, 10))}
              {#if evento.inicio.includes(' ')}
                · {evento.inicio.slice(11, 16)}
              {/if}
            </span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .proximos { padding: var(--space-4); }

  .proximos-header {
    margin-bottom: var(--space-3);
  }

  .proximos-titulo {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.3px;
  }

  .proximos-vazio {
    font-size: var(--text-xs);
    color: var(--text-disabled);
    padding: var(--space-2) 0;
  }

  .proximos-lista {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .proximos-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--border);
  }
  .proximos-item:last-child { border-bottom: none; }

  .proximos-cor {
    width: 3px;
    height: 32px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .proximos-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .proximos-nome {
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .proximos-data {
    font-size: 11px;
    color: var(--text-muted);
  }
</style>
