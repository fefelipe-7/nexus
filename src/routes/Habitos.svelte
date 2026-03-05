<!-- src/routes/Habitos.svelte -->
<script>
  import { onMount } from 'svelte';
  import { habitos, streaks, carregandoHabitos, carregarHabitosHoje } from '$lib/stores/habitos.js';
  import { activeModal, habitoEditando } from '$lib/stores/ui.js';
  import { hoje } from '$lib/utils/dates.js';
  import { registrarCheckin, removerCheckin } from '$lib/db/queries/habitos.js';

  import ItemHabito from '$lib/components/habitos/ItemHabito.svelte';
  import ModalHabito from '$lib/components/habitos/ModalHabito.svelte';

  onMount(() => carregarHabitosHoje());

  async function toggleCheckin(habito) {
    const h = hoje();
    if (habito.concluido_hoje) {
      await removerCheckin(habito.id, h);
    } else {
      await registrarCheckin(habito.id, h);
    }
    await carregarHabitosHoje();
  }

  let concluidos = $derived($habitos.filter(h => h.concluido_hoje).length);
  let total      = $derived($habitos.length);
</script>

<div class="page">
  <header class="page-header">
    <div class="page-title">
      <h1>habitos</h1>
      {#if total > 0}
        <span class="badge-contador">{concluidos}/{total} hoje</span>
      {/if}
    </div>
    <button class="btn-primary" onclick={() => activeModal.set('novoHabito')}>
      + novo habito
    </button>
  </header>

  {#if $carregandoHabitos}
    <div class="estado-loading">carregando habitos...</div>

  {:else if $habitos.length === 0}
    <div class="estado-vazio">
      <span class="vazio-icone">~</span>
      <p>nenhum habito cadastrado</p>
      <button class="btn-ghost" onclick={() => activeModal.set('novoHabito')}>
        + criar primeiro habito
      </button>
    </div>

  {:else}
    <!-- barra de progresso geral do dia -->
    {#if total > 0}
      <div class="progresso-dia">
        <div class="progresso-barra">
          <div
            class="progresso-fill"
            style="width: {Math.round((concluidos/total)*100)}%"
          />
        </div>
        <span class="progresso-label">{Math.round((concluidos/total)*100)}% do dia concluido</span>
      </div>
    {/if}

    <div class="habitos-lista">
      {#each $habitos as habito (habito.id)}
        <ItemHabito
          {habito}
          streak={$streaks[habito.id] ?? 0}
          ontoggle={() => toggleCheckin(habito)}
          oneditar={() => { habitoEditando.set(habito); activeModal.set('editarHabito'); }}
        />
      {/each}
    </div>
  {/if}
</div>

{#if $activeModal === 'novoHabito' || $activeModal === 'editarHabito'}
  <ModalHabito
    onfechar={() => activeModal.set(null)}
    onsalvo={() => carregarHabitosHoje()}
  />
{/if}

<style>

  .page-header {
    display: flex; align-items: center; justify-content: space-between;
  }

  .page-title { display: flex; align-items: center; gap: var(--space-3); }

  h1 {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 600;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .badge-contador {
    background: var(--bg-active); color: var(--text-secondary);
    font-size: var(--text-xs); font-weight: 600;
    padding: 3px 8px; border-radius: var(--radius-full);
  }

  .btn-primary {
    background: var(--text-primary); color: var(--bg);
    border: none; border-radius: var(--radius-md);
    padding: 8px 14px; font-size: var(--text-sm);
    font-family: var(--font-body); font-weight: 500;
    cursor: pointer; transition: opacity var(--transition-fast);
  }
  .btn-primary:hover { opacity: 0.85; }

  .progresso-dia {
    display: flex; flex-direction: column; gap: var(--space-2);
  }

  .progresso-barra {
    height: 6px; background: var(--bg-active);
    border-radius: var(--radius-full); overflow: hidden;
  }

  .progresso-fill {
    height: 100%; background: var(--status-ok);
    border-radius: var(--radius-full);
    transition: width var(--transition-slow);
  }

  .progresso-label {
    font-size: var(--text-xs); color: var(--text-muted);
  }

  .habitos-lista { display: flex; flex-direction: column; gap: 1px; }

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
