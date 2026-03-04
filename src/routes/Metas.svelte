<!-- src/routes/Metas.svelte -->
<script>
  import { onMount } from 'svelte';
  import { metas, carregandoMetas, carregarMetas, abrirMeta, metaAtiva } from '$lib/stores/metas.js';
  import { activeModal, metaEditando } from '$lib/stores/ui.js';
  import { areas } from '$lib/stores/areas.js';

  import CardMeta from '$lib/components/metas/CardMeta.svelte';
  import ModalMeta from '$lib/components/metas/ModalMeta.svelte';
  import DetalheMeta from '$lib/components/metas/DetalheMeta.svelte';
  import FiltrosMetas from '$lib/components/metas/FiltrosMetas.svelte';

  let filtroStatus    = 'ativa';
  let filtroArea      = null;
  let filtroPrazo     = null;

  onMount(() => carregarMetas());

  $: carregarMetas({ status: filtroStatus, areaId: filtroArea, prazoTipo: filtroPrazo });

  // agrupa metas por prazo_tipo para exibicao
  $: grupos = agruparPorPrazo($metas);

  function agruparPorPrazo(lista) {
    const ordem = ['semana', 'mes', 'trimestre', 'semestre', 'ano', null];
    const mapa  = {};
    for (const m of lista) {
      const chave = m.prazo_tipo ?? 'abertas';
      if (!mapa[chave]) mapa[chave] = [];
      mapa[chave].push(m);
    }
    return ordem
      .map(tipo => ({ tipo: tipo ?? 'abertas', itens: mapa[tipo ?? 'abertas'] ?? [] }))
      .filter(g => g.itens.length > 0);
  }

  const LABEL_PRAZO = {
    semana:    'esta semana',
    mes:       'este mes',
    trimestre: 'este trimestre',
    semestre:  'este semestre',
    ano:       'este ano',
    abertas:   'sem prazo definido',
  };
</script>

<div class="page">
  <header class="page-header">
    <div class="page-title">
      <h1>metas</h1>
      <span class="badge-contador">{$metas.filter(m => m.status === 'ativa').length} ativas</span>
    </div>
    <button class="btn-primary" on:click={() => activeModal.set('novaMeta')}>
      + nova meta
    </button>
  </header>

  <FiltrosMetas
    bind:status={filtroStatus}
    bind:area={filtroArea}
    bind:prazo={filtroPrazo}
  />

  {#if $carregandoMetas}
    <div class="estado-loading">carregando metas...</div>

  {:else if $metas.length === 0}
    <div class="estado-vazio">
      <span class="vazio-icone">◎</span>
      <p>nenhuma meta encontrada</p>
      <button class="btn-ghost" on:click={() => activeModal.set('novaMeta')}>
        + criar primeira meta
      </button>
    </div>

  {:else}
    {#each grupos as grupo}
      <section class="grupo-metas">
        <div class="grupo-header">
          <span class="grupo-titulo">{LABEL_PRAZO[grupo.tipo]}</span>
          <span class="grupo-contador">{grupo.itens.length}</span>
        </div>
        <div class="metas-grid">
          {#each grupo.itens as meta (meta.id)}
            <CardMeta
              {meta}
              on:abrir={() => abrirMeta(meta.id)}
              on:editar={() => { metaEditando.set(meta); activeModal.set('editarMeta'); }}
              on:atualizar={() => carregarMetas({ status: filtroStatus })}
            />
          {/each}
        </div>
      </section>
    {/each}
  {/if}
</div>

{#if $metaAtiva}
  <DetalheMeta
    meta={$metaAtiva}
    on:fechar={() => metaAtiva.set(null)}
    on:atualizar={() => { carregarMetas(); abrirMeta($metaAtiva.id); }}
  />
{/if}

{#if $activeModal === 'novaMeta' || $activeModal === 'editarMeta'}
  <ModalMeta
    on:fechar={() => activeModal.set(null)}
    on:salvo={() => carregarMetas({ status: filtroStatus })}
  />
{/if}

<style>

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

  .btn-primary {
    background: var(--text-primary); color: var(--bg);
    border: none; border-radius: var(--radius-md);
    padding: 8px 14px; font-size: var(--text-sm);
    font-family: var(--font-body); font-weight: 500;
    cursor: pointer; transition: opacity var(--transition-fast);
  }
  .btn-primary:hover { opacity: 0.85; }

  .grupo-metas { display: flex; flex-direction: column; gap: var(--space-3); }

  .grupo-header {
    display: flex; align-items: center; gap: var(--space-2);
    padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--border);
  }

  .grupo-titulo {
    font-size: var(--text-sm); font-weight: 600; color: var(--text-primary);
  }

  .grupo-contador {
    font-size: var(--text-xs); color: var(--text-muted);
  }

  .metas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-4);
  }

  .estado-loading, .estado-vazio {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: var(--space-3);
    padding: var(--space-12) 0;
    color: var(--text-muted); font-size: var(--text-sm);
  }

  .vazio-icone { font-size: 28px; opacity: 0.25; }

  .btn-ghost {
    background: none; border: 1px solid var(--border);
    color: var(--text-secondary); border-radius: var(--radius-md);
    padding: 7px 14px; font-size: var(--text-sm);
    font-family: var(--font-body); cursor: pointer;
    transition: all var(--transition-fast); margin-top: var(--space-2);
  }
  .btn-ghost:hover { background: var(--bg-hover); }
</style>
