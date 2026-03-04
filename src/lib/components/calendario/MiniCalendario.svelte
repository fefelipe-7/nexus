<script>
  import { diasDoMes, hoje, navegarPeriodo, toISO } from '$lib/utils/dates.js';
  import { dataReferencia } from '$lib/stores/calendario.js';

  const CABECALHO = ['d', 's', 't', 'q', 'q', 's', 's'];
  const MESES = ['janeiro','fevereiro','marco','abril','maio','junho',
                 'julho','agosto','setembro','outubro','novembro','dezembro'];

  let mesRef = hoje();
  $: [ano, mes] = mesRef.split('-').map(Number);
  $: dias = diasDoMes(mesRef);
  $: hojeISO = hoje();

  function navMes(dir) {
    mesRef = navegarPeriodo(mesRef, 'mes', dir === 1 ? 'proximo' : 'anterior');
  }

  function selecionarDia(iso) {
    dataReferencia.set(iso);
  }
</script>

<div class="mini-cal">
  <div class="mini-cal-header">
    <button class="mini-nav" on:click={() => navMes(-1)}>‹</button>
    <span class="mini-titulo">{MESES[mes - 1]} {ano}</span>
    <button class="mini-nav" on:click={() => navMes(1)}>›</button>
  </div>

  <div class="mini-grid-header">
    {#each CABECALHO as d}<span>{d}</span>{/each}
  </div>

  <div class="mini-grade">
    {#each dias as { iso, mesAtual }}
      <button
        class="mini-dia"
        class:fora={!mesAtual}
        class:hoje={iso === hojeISO}
        class:selecionado={iso === $dataReferencia}
        on:click={() => selecionarDia(iso)}
      >
        {parseInt(iso.slice(8))}
      </button>
    {/each}
  </div>
</div>

<style>
  .mini-cal {
    padding: var(--space-4);
  }

  .mini-cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-3);
  }

  .mini-titulo {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--text-primary);
  }

  .mini-nav {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); font-size: var(--text-md);
    width: 20px; height: 20px;
    display: flex; align-items: center; justify-content: center;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }
  .mini-nav:hover { color: var(--text-primary); background: var(--bg-hover); }

  .mini-grid-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: var(--space-1);
  }

  .mini-grid-header span {
    font-size: 10px;
    color: var(--text-muted);
    text-align: center;
    font-weight: 500;
    padding: 2px 0;
  }

  .mini-grade {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .mini-dia {
    background: none; border: none; cursor: pointer;
    font-size: var(--text-xs); font-family: var(--font-body);
    color: var(--text-secondary);
    width: 100%; aspect-ratio: 1;
    display: flex; align-items: center; justify-content: center;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }
  .mini-dia:hover:not(.fora)  { background: var(--bg-hover); color: var(--text-primary); }
  .mini-dia.fora              { color: var(--text-disabled); }
  .mini-dia.hoje              { font-weight: 700; color: var(--accent); }
  .mini-dia.selecionado       { background: var(--text-primary); color: var(--bg); border-radius: var(--radius-sm); }
  .mini-dia.hoje.selecionado  { background: var(--accent); }
</style>
