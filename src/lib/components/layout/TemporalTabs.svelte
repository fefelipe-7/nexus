<script>
  import { activeTab } from '$lib/stores/navigation.js';

  const tabs = [
    { id: 'dia',       label: 'dia'       },
    { id: 'semana',    label: 'semana'    },
    { id: 'mes',       label: 'mes'       },
    { id: 'trimestre', label: 'trimestre' },
    { id: 'semestre',  label: 'semestre'  },
    { id: 'ano',       label: 'ano'       },
  ];
</script>

<div class="temporal-tabs">
  {#each tabs as tab}
    <button
      class="tab"
      class:active={navigationState.activeTab === tab.id}
      onclick={() => navigationState.activeTab = tab.id}
    >
      {tab.label}
    </button>
  {/each}
</div>

<style>
  .temporal-tabs {
    display: flex; align-items: center; gap: 2px; padding: 3px;
    background: var(--bg-secondary); border-radius: var(--radius-md);
    border: 1px solid var(--border); width: fit-content;
  }
  .tab {
    padding: 5px 12px; border-radius: calc(var(--radius-md) - 2px);
    border: none; background: none; cursor: pointer;
    font-size: var(--text-sm); font-family: var(--font-body); font-weight: 500;
    color: var(--text-secondary); transition: all var(--transition-fast); white-space: nowrap;
  }
  .tab:hover:not(.active) { color: var(--text-primary); background: var(--bg-hover); }
  .tab.active { background: var(--bg); color: var(--text-primary); box-shadow: var(--shadow-sm); }
</style>
