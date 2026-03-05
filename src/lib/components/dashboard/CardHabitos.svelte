<!-- src/lib/components/dashboard/CardHabitos.svelte -->
<script>
  let { habitos = [], streaks = {} } = $props();

  let habitosHoje = $derived(habitos.filter(h => h.frequencia_tipo === 'diaria').slice(0, 4));
</script>

<div class="card-dashboard card-habitos">
  <header>
    <div class="titulo-grupo">
      <span class="icone">~</span>
      <h3>habitos</h3>
    </div>
    <button class="btn-ver-mais" onclick={() => navigationState.currentRoute = 'habitos'}>
      ver todos
    </button>
  </header>

  <div class="conteudo">
    {#if habitosHoje.length === 0}
      <p class="vazio">nenhum habito diario</p>
    {:else}
      <div class="grid-habitos">
        {#each habitosHoje as habito}
          <div class="item-habito" class:feito={habito.concluido_hoje}>
            <div class="habito-check" style={habito.concluido_hoje ? `background: ${habito.area_cor ?? 'var(--accent)'}; border-color: ${habito.area_cor ?? 'var(--accent)'}` : ''}>
              {#if habito.concluido_hoje}✓{/if}
            </div>
            <span class="habito-nome">{habito.nome}</span>
            {#if streaks[habito.id] > 0}
              <span class="streak">🔥{streaks[habito.id]}</span>
            {/if}
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

  .grid-habitos { display: flex; flex-direction: column; gap: var(--space-2); }

  .item-habito {
    display: flex; align-items: center; gap: var(--space-3);
    padding: var(--space-1) 0;
  }

  .habito-check {
    width: 14px; height: 14px; border: 1px solid var(--border-strong);
    border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center;
    font-size: 8px; color: white; flex-shrink: 0;
  }

  .habito-nome { font-size: var(--text-xs); color: var(--text-secondary); flex: 1; }
  .item-habito.feito .habito-nome { color: var(--text-muted); text-decoration: line-through; }

  .streak { font-size: 10px; font-weight: 700; color: var(--text-primary); }
</style>
