<script>
  import { createEventDispatcher } from 'svelte';
  import { diasDoMes, hoje } from '$lib/utils/dates.js';
  import { activeModal, eventoEditando } from '$lib/stores/ui.js';

  export let eventos = [];
  export let dataRef = hoje();

  const dispatch = createEventDispatcher();

  const CABECALHO = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

  $: dias = diasDoMes(dataRef);
  $: hojeISO = hoje();

  $: eventosPorDia = eventos.reduce((acc, e) => {
    const dia = e.inicio.slice(0, 10);
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(e);
    return acc;
  }, {});

  function abrirEvento(evento) {
    eventoEditando.set(evento);
    activeModal.set('editarEvento');
  }

  function novoPorDia(iso) {
    eventoEditando.set({ inicio: iso });
    activeModal.set('novoEvento');
  }
</script>

<div class="grid-mensal">

  <!-- cabecalho -->
  <div class="mes-header">
    {#each CABECALHO as dia}
      <div class="mes-header-dia">{dia}</div>
    {/each}
  </div>

  <!-- grade de dias -->
  <div class="mes-grade">
    {#each dias as { iso, mesAtual }}
      <div
        class="mes-celula"
        class:fora-mes={!mesAtual}
        class:hoje={iso === hojeISO}
        on:click={() => novoPorDia(iso)}
        on:keydown={() => {}}
        role="button"
        tabindex="0"
      >
        <span class="mes-numero">{parseInt(iso.slice(8))}</span>

        <!-- eventos do dia (max 3 visiveis) -->
        <div class="mes-eventos">
          {#each (eventosPorDia[iso] ?? []).slice(0, 3) as evento (evento.id)}
            <div
              class="mes-evento-chip"
              style="background: {evento.area_cor ?? 'var(--accent)'}22; color: {evento.area_cor ?? 'var(--text-primary)'};"
              on:click|stopPropagation={() => abrirEvento(evento)}
              on:keydown={() => {}}
              role="button"
              tabindex="0"
              title={evento.titulo}
            >
              {evento.titulo}
            </div>
          {/each}
          {#if (eventosPorDia[iso] ?? []).length > 3}
            <span class="mes-mais">+{(eventosPorDia[iso] ?? []).length - 3} mais</span>
          {/if}
        </div>
      </div>
    {/each}
  </div>

</div>

<style>
  .grid-mensal {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    background: var(--bg);
  }

  .mes-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
  }

  .mes-header-dia {
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--text-muted);
    text-align: center;
    border-right: 1px solid var(--border);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .mes-header-dia:last-child { border-right: none; }

  .mes-grade {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    flex: 1;
  }

  .mes-celula {
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: var(--space-2);
    min-height: 96px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: background var(--transition-fast);
  }
  .mes-celula:hover { background: var(--bg-hover); }
  .mes-celula:nth-child(7n) { border-right: none; }
  .mes-celula.fora-mes { background: var(--bg-secondary); }
  .mes-celula.hoje { background: var(--accent-subtle); }

  .mes-numero {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-secondary);
    width: 24px; height: 24px;
    display: flex; align-items: center; justify-content: center;
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }
  .mes-celula.hoje .mes-numero {
    background: var(--accent);
    color: white;
    font-weight: 600;
  }
  .mes-celula.fora-mes .mes-numero { color: var(--text-disabled); }

  .mes-eventos {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    overflow: hidden;
  }

  .mes-evento-chip {
    font-size: 11px;
    font-weight: 500;
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    transition: opacity var(--transition-fast);
  }
  .mes-evento-chip:hover { opacity: 0.75; }

  .mes-mais {
    font-size: 10px;
    color: var(--text-muted);
    padding: 1px 4px;
  }
</style>
