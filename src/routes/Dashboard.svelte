<script>
  import { onMount } from 'svelte';
  import { activeTab } from '$lib/stores/navigation.js';
  import { tarefas, tarefasAtrasadas, estatisticasDia, carregando, carregarTarefas } from '$lib/stores/tarefas.js';
  import { metas, carregarMetas } from '$lib/stores/metas.js';
  import { habitos, carregarHabitosHoje } from '$lib/stores/habitos.js';
  import { activeModal } from '$lib/stores/ui.js';
  import { areas } from '$lib/stores/areas.js';
  import { carregarAreas } from '$lib/db/queries/areas.js';
  import { saudacao, tituloPeriodo, hoje } from '$lib/utils/dates.js';

  import TemporalTabs from '$lib/components/layout/TemporalTabs.svelte';
  import BlocoDisretivo from '$lib/components/dashboard/BlocoDisretivo.svelte';
  import CardTarefas from '$lib/components/dashboard/CardTarefas.svelte';
  import CardVazio from '$lib/components/dashboard/CardVazio.svelte';
  import ModalTarefa from '$lib/components/tarefas/ModalTarefa.svelte';

  onMount(async () => {
    await carregarAreas();
    await carregarTarefas($activeTab);
    await carregarMetas();
    await carregarHabitosHoje();
  });

  // recarrega sempre que a tab muda
  $: carregarTarefas($activeTab);
  $: if ($activeTab === 'dia') carregarHabitosHoje();

  $: titulo = tituloPeriodo($activeTab, hoje());
  $: greeting = saudacao();
</script>

<div class="page">
  <header class="dashboard-header">
    <div class="dashboard-title">
      <span class="eyebrow">{greeting}</span>
      <h1>{titulo}</h1>
    </div>
    <div class="dashboard-actions">
      <TemporalTabs />
      <button class="btn-primary" on:click={() => activeModal.set('novaTarefa')}>
        <span>+</span> nova tarefa
      </button>
    </div>
  </header>

  {#if $carregando}
    <div class="loading">carregando...</div>
  {:else}
    <BlocoDisretivo
      tarefas={$tarefas}
      atrasadas={$tarefasAtrasadas}
      stats={$estatisticasDia}
      metas={$metas}
      habitos={$habitos}
      tab={$activeTab}
    />

    <div class="cards-grid">
      <CardTarefas
        tarefas={$tarefas}
        atrasadas={$tarefasAtrasadas}
        tab={$activeTab}
        on:atualizar={() => carregarTarefas($activeTab)}
      />
      <CardVazio modulo="metas"    icone="o" descricao="suas metas aparecem aqui" />
      <CardVazio modulo="habitos"  icone="~" descricao="seu progresso diario aparece aqui" />
      <CardVazio modulo="financas" icone="$" descricao="seu saldo e gastos aparecem aqui" />
    </div>
  {/if}
</div>

{#if $activeModal === 'novaTarefa' || $activeModal === 'editarTarefa'}
  <ModalTarefa on:fechar={() => activeModal.set(null)} on:salvo={() => carregarTarefas($activeTab)} />
{/if}

<style>

  .dashboard-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-4);
  }

  .dashboard-actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-shrink: 0;
  }

  .eyebrow {
    display: block;
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin-bottom: var(--space-1);
    font-weight: 500;
  }

  h1 {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 600;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: 8px 14px;
    background: var(--text-primary);
    color: var(--bg);
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-family: var(--font-body);
    font-weight: 500;
    cursor: pointer;
    transition: opacity var(--transition-fast);
    white-space: nowrap;
  }
  .btn-primary:hover { opacity: 0.85; }

  .loading {
    font-size: var(--text-sm);
    color: var(--text-muted);
    padding: var(--space-8) 0;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
</style>
