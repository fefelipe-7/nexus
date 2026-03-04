<!-- src/lib/components/dashboard/CardMetas.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  import { currentRoute } from '$lib/stores/navigation.js';

  export let metas = [];

  const dispatch = createEventDispatcher();

  $: metasAtivas = metas.filter(m => m.status === 'ativa').slice(0, 3);
</script>

<div class="card-dashboard card-metas">
  <header>
    <div class="titulo-grupo">
      <span class="icone">◎</span>
      <h3>metas</h3>
    </div>
    <button class="btn-ver-mais" on:click={() => currentRoute.set('metas')}>
      ver todas
    </button>
  </header>

  <div class="conteudo">
    {#if metasAtivas.length === 0}
      <p class="vazio">nenhuma meta ativa</p>
    {:else}
      <div class="lista-metas">
        {#each metasAtivas as meta}
          <div class="item-meta">
            <div class="meta-info">
              <span class="meta-titulo">{meta.titulo}</span>
              <span class="meta-prazo" class:urgente={meta.dias_restantes <= 3}>
                {meta.dias_restantes !== null ? `${meta.dias_restantes}d` : '--'}
              </span>
            </div>
            <div class="meta-progresso">
              <div class="barra-bg">
                <div
                  class="barra-fill"
                  style="width: {meta.modo_progresso === 'tarefas' ? (meta.progresso_tarefas_pct ?? 0) : (meta.modo_progresso === 'percentual' ? meta.percentual_atual : 0)}%; background: {meta.area_cor ?? 'var(--accent)'}"
                />
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .card-dashboard {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  header {
    display: flex; justify-content: space-between; align-items: center;
  }

  .titulo-grupo {
    display: flex; align-items: center; gap: var(--space-2);
  }

  .icone { font-size: 18px; color: var(--text-muted); }
  h3 { font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); }

  .btn-ver-mais {
    background: none; border: none; color: var(--text-muted);
    font-size: var(--text-xs); cursor: pointer; padding: 4px;
  }
  .btn-ver-mais:hover { color: var(--text-primary); }

  .vazio { font-size: var(--text-xs); color: var(--text-secondary); text-align: center; padding: var(--space-4) 0; }

  .lista-metas { display: flex; flex-direction: column; gap: var(--space-3); }

  .item-meta { display: flex; flex-direction: column; gap: 6px; }

  .meta-info { display: flex; justify-content: space-between; align-items: center; }
  .meta-titulo { font-size: var(--text-sm); color: var(--text-primary); font-weight: 500; }
  .meta-prazo { font-size: var(--text-xs); color: var(--text-muted); }
  .meta-prazo.urgente { color: var(--status-danger); font-weight: 600; }

  .meta-progresso { height: 4px; }
  .barra-bg { background: var(--bg-secondary); height: 100%; border-radius: var(--radius-full); overflow: hidden; }
  .barra-fill { height: 100%; border-radius: var(--radius-full); transition: width var(--transition-slow); }
</style>
