<!-- src/lib/components/metas/CardMeta.svelte -->
<script>
  let { 
    meta, 
    onabrir 
  } = $props();

  // calcula o progresso para exibicao dependendo do modo
  let progresso = $derived(calcularProgresso(meta));
  let urgente   = $derived(meta.dias_restantes !== null && meta.dias_restantes <= 7 && meta.status === 'ativa');
  let atrasada  = $derived(meta.dias_restantes !== null && meta.dias_restantes < 0  && meta.status === 'ativa');

  function calcularProgresso(m) {
    switch (m.modo_progresso) {
      case 'tarefas':
        return { pct: m.progresso_tarefas_pct ?? 0, label: `${m.tarefas_concluidas ?? 0}/${m.tarefas_total ?? 0} tarefas` };
      case 'numerico':
        const pct = m.valor_alvo ? Math.min(Math.round((m.valor_atual / m.valor_alvo) * 100), 100) : 0;
        return { pct, label: `${m.valor_atual} / ${m.valor_alvo} ${m.unidade ?? ''}`.trim() };
      case 'percentual':
        return { pct: m.percentual_atual, label: `${m.percentual_atual}%` };
      case 'binario':
        return { pct: m.binario_concluido ? 100 : 0, label: m.binario_concluido ? 'concluida' : 'em andamento' };
      default:
        return { pct: 0, label: '' };
    }
  }
</script>

<div
  class="card-meta"
  class:urgente
  class:atrasada
  class:concluida={meta.status === 'concluida'}
  onclick={() => onabrir?.()}
  onkeydown={() => {}}
  role="button"
  tabindex="0"
>
  <!-- linha superior: area + prazo -->
  <div class="meta-topo">
    {#if meta.area_nome}
      <span class="meta-area" style="color: {meta.area_cor}">{meta.area_nome}</span>
    {/if}
    <span class="meta-prazo" class:urgente class:atrasada>
      {#if meta.prazo_tipo}
        {meta.dias_restantes !== null
          ? (meta.dias_restantes < 0
              ? `${Math.abs(meta.dias_restantes)}d atrasada`
              : meta.dias_restantes === 0
                ? 'vence hoje'
                : `${meta.dias_restantes}d restantes`)
          : meta.prazo_tipo}
      {:else}
        sem prazo
      {/if}
    </span>
  </div>

  <!-- titulo -->
  <h3 class="meta-titulo">{meta.titulo}</h3>

  <!-- barra de progresso -->
  <div class="progresso-wrapper">
    <div class="progresso-barra">
      <div
        class="progresso-fill"
        style="width: {progresso.pct}%; background: {meta.area_cor ?? 'var(--accent)'}"
      />
    </div>
    <span class="progresso-label">{progresso.label}</span>
  </div>

  <!-- submetas (se houver) -->
  {#if meta.tem_submetas}
    <div class="meta-submetas-hint">
      <span>▸ tem submetas</span>
    </div>
  {/if}
</div>

<style>
  .card-meta {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: var(--space-4) var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  .card-meta:hover { border-color: var(--border-strong); box-shadow: var(--shadow-sm); }
  .card-meta.urgente  { background: #fff8f0; border-color: #fde8cc; }
  .card-meta.atrasada { background: #fff1f2; border-color: #fecaca; }
  .card-meta.concluida { opacity: 0.6; }

  .meta-topo {
    display: flex; align-items: center; justify-content: space-between;
  }

  .meta-area {
    font-size: var(--text-xs); font-weight: 600; opacity: 0.8;
  }

  .meta-prazo {
    font-size: var(--text-xs); color: var(--text-muted); font-weight: 500;
  }
  .meta-prazo.urgente  { color: #c2570a; }
  .meta-prazo.atrasada { color: var(--status-danger); }

  .meta-titulo {
    font-size: var(--text-md);
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
  }

  .progresso-wrapper {
    display: flex; flex-direction: column; gap: 5px;
  }

  .progresso-barra {
    height: 4px;
    background: var(--bg-active);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .progresso-fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width var(--transition-slow);
    min-width: 4px;
  }

  .progresso-label {
    font-size: var(--text-xs); color: var(--text-muted);
  }

  .meta-submetas-hint {
    font-size: var(--text-xs); color: var(--text-muted);
    margin-top: calc(-1 * var(--space-1));
  }
</style>
