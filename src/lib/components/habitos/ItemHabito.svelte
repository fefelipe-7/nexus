<!-- src/lib/components/habitos/ItemHabito.svelte -->
<script>
  let { 
    habito, 
    streak = 0, 
    ontoggle, 
    oneditar 
  } = $props();

  const FREQ_LABEL = {
    diaria:      'diario',
    semanal:     'semanal',
    mensal:      'mensal',
    trimestral:  'trimestral',
    semestral:   'semestral',
    anual:       'anual',
  };
</script>

<div
  class="item-habito"
  class:concluido={habito.concluido_hoje}
>
  <!-- check -->
  <button
    class="check-btn"
    onclick={() => ontoggle?.()}
    aria-label={habito.concluido_hoje ? 'desmarcar habito' : 'marcar habito'}
  >
    <span class="check-box" class:checked={habito.concluido_hoje}
      style={habito.concluido_hoje ? `background: ${habito.area_cor ?? 'var(--accent)'}; border-color: ${habito.area_cor ?? 'var(--accent)'}` : ''}>
      {#if habito.concluido_hoje}✓{/if}
    </span>
  </button>

  <!-- icone + nome -->
  <div class="habito-corpo">
    <div class="habito-linha-principal">
      {#if habito.icone}
        <span class="habito-icone">{habito.icone}</span>
      {/if}
      <span class="habito-nome">{habito.nome}</span>
    </div>
    <div class="habito-meta">
      <span class="habito-freq">{FREQ_LABEL[habito.frequencia_tipo]}</span>
      {#if habito.area_nome}
        <span class="habito-area" style="color: {habito.area_cor}">{habito.area_nome}</span>
      {/if}
    </div>
  </div>

  <!-- streak -->
  {#if streak > 0}
    <div class="streak-badge" title="{streak} periodos consecutivos">
      <span class="streak-fogo">🔥</span>
      <span class="streak-num">{streak}</span>
    </div>
  {/if}

  <!-- botao editar no hover -->
  <button
    class="btn-editar"
    onclick={(e) => { e.stopPropagation(); oneditar?.(); }}
    aria-label="editar habito"
  >
    ···
  </button>
</div>

<style>
  .item-habito {
    display: flex; align-items: center; gap: var(--space-3);
    padding: 12px var(--space-3); border-radius: var(--radius-md);
    transition: background var(--transition-fast);
    position: relative;
  }
  .item-habito:hover { background: var(--bg-hover); }
  .item-habito.concluido .habito-nome { color: var(--text-muted); }

  .check-btn {
    background: none; border: none; cursor: pointer;
    flex-shrink: 0; display: flex; align-items: center; padding: 0;
  }

  .check-box {
    width: 20px; height: 20px;
    border: 1.5px solid var(--border-strong);
    border-radius: var(--radius-full);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; color: white;
    transition: all var(--transition-base);
  }

  .habito-corpo {
    flex: 1;
    display: flex; flex-direction: column; gap: 2px;
    min-width: 0;
  }

  .habito-linha-principal {
    display: flex; align-items: center; gap: var(--space-2);
  }

  .habito-icone { font-size: var(--text-md); line-height: 1; }

  .habito-nome {
    font-size: var(--text-sm); font-weight: 500; color: var(--text-primary);
    transition: color var(--transition-fast);
  }

  .habito-meta {
    display: flex; align-items: center; gap: var(--space-2);
  }

  .habito-freq, .habito-area {
    font-size: var(--text-xs); color: var(--text-muted);
  }
  .habito-area { font-weight: 500; }

  .streak-badge {
    display: flex; align-items: center; gap: 3px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    padding: 3px 8px;
    flex-shrink: 0;
  }

  .streak-fogo { font-size: 12px; line-height: 1; }

  .streak-num {
    font-size: var(--text-xs); font-weight: 700;
    color: var(--text-primary);
  }

  .btn-editar {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); font-size: var(--text-md);
    padding: 4px 8px; border-radius: var(--radius-sm);
    opacity: 0;
    transition: all var(--transition-fast);
    letter-spacing: 1px;
  }
  .item-habito:hover .btn-editar { opacity: 1; }
  .btn-editar:hover { color: var(--text-primary); background: var(--bg-active); }
</style>
