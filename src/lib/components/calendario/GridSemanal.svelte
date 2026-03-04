<script>
  import { createEventDispatcher } from 'svelte';
  import { diasDaSemana, hoje } from '$lib/utils/dates.js';
  import { activeModal, eventoEditando } from '$lib/stores/ui.js';

  export let eventos  = [];
  export let dataRef  = hoje();

  const dispatch = createEventDispatcher();

  const HORAS = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, '0') + ':00'
  );

  const DIAS_LABEL = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

  $: dias = diasDaSemana(dataRef);
  $: hojeISO = hoje();

  // mapeia eventos para cada dia
  $: eventosPorDia = dias.reduce((acc, dia) => {
    acc[dia] = eventos.filter(e => e.inicio.slice(0, 10) === dia);
    return acc;
  }, {});

  function getEventoStyle(evento) {
    if (!evento.inicio.includes(' ')) return '';
    const [, hora] = evento.inicio.split(' ');
    const [h, m]   = hora.split(':').map(Number);
    const top       = (h * 60 + m) * (64 / 60); // 64px por hora
    const altura    = evento.fim
      ? (() => {
          const [, fimHora] = evento.fim.split(' ');
          const [fh, fm]    = fimHora.split(':').map(Number);
          return ((fh * 60 + fm) - (h * 60 + m)) * (64 / 60);
        })()
      : 48; // altura padrao de 48px se nao tem fim

    return `top: ${top}px; height: ${Math.max(altura, 24)}px;`;
  }

  function abrirEvento(evento) {
    eventoEditando.set(evento);
    activeModal.set('editarEvento');
  }

  function novoPorClique(dia, hora) {
    // pre-preenche o modal com a data e hora clicada
    eventoEditando.set({ inicio: `${dia} ${hora}` });
    activeModal.set('novoEvento');
  }
</script>

<div class="grid-semanal">

  <!-- cabecalho dos dias -->
  <div class="grid-header">
    <div class="coluna-horas"></div>
    {#each dias as dia, i}
      <div class="coluna-dia-header" class:hoje={dia === hojeISO}>
        <span class="dia-label">{DIAS_LABEL[i]}</span>
        <span class="dia-numero" class:hoje={dia === hojeISO}>
          {parseInt(dia.slice(8))}
        </span>
      </div>
    {/each}
  </div>

  <!-- corpo com horas -->
  <div class="grid-corpo">

    <!-- coluna de horas -->
    <div class="coluna-horas">
      {#each HORAS as hora}
        <div class="celula-hora">
          <span class="hora-label">{hora}</span>
        </div>
      {/each}
    </div>

    <!-- colunas dos dias -->
    {#each dias as dia}
      <div class="coluna-dia">
        <!-- linhas de hora (clicaveis) -->
        {#each HORAS as hora}
          <div
            class="celula-tempo"
            on:click={() => novoPorClique(dia, hora)}
            on:keydown={() => {}}
            role="button"
            tabindex="0"
          ></div>
        {/each}

        <!-- eventos posicionados absolutamente -->
        {#each eventosPorDia[dia] ?? [] as evento (evento.id)}
          <div
            class="evento-bloco"
            class:evento-tarefa={evento.tipo === 'tarefa'}
            style="{getEventoStyle(evento)} background: {evento.area_cor ?? evento.cor ?? 'var(--accent)'}22; border-left: 3px solid {evento.area_cor ?? evento.cor ?? 'var(--accent)'};"
            on:click|stopPropagation={() => abrirEvento(evento)}
            on:keydown={() => {}}
            role="button"
            tabindex="0"
            title={evento.titulo}
          >
            <span class="evento-titulo">{evento.titulo}</span>
            {#if evento.inicio.includes(' ')}
              <span class="evento-hora">{evento.inicio.slice(11, 16)}</span>
            {/if}
          </div>
        {/each}
      </div>
    {/each}

  </div>
</div>

<style>
  .grid-semanal {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    background: var(--bg);
  }

  /* header */
  .grid-header {
    display: grid;
    grid-template-columns: 52px repeat(7, 1fr);
    border-bottom: 1px solid var(--border);
    background: var(--bg-secondary);
    position: sticky;
    top: 0;
    z-index: 2;
  }

  .coluna-horas {
    border-right: 1px solid var(--border);
  }

  .coluna-dia-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-3) var(--space-2);
    border-right: 1px solid var(--border);
    gap: 2px;
  }
  .coluna-dia-header:last-child { border-right: none; }
  .coluna-dia-header.hoje { background: var(--accent-subtle); }

  .dia-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .dia-numero {
    font-size: var(--text-md);
    font-weight: 600;
    color: var(--text-secondary);
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    border-radius: var(--radius-full);
  }
  .dia-numero.hoje {
    background: var(--accent);
    color: white;
  }

  /* corpo */
  .grid-corpo {
    display: grid;
    grid-template-columns: 52px repeat(7, 1fr);
    flex: 1;
    overflow-y: auto;
  }

  .coluna-horas {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border);
  }

  .celula-hora {
    height: 64px;
    display: flex;
    align-items: flex-start;
    padding: 4px 6px 0;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .hora-label {
    font-size: var(--text-xs);
    color: var(--text-disabled);
    font-weight: 400;
    white-space: nowrap;
  }

  .coluna-dia {
    position: relative;
    border-right: 1px solid var(--border);
    min-height: calc(64px * 24);
  }
  .coluna-dia:last-child { border-right: none; }

  .celula-tempo {
    height: 64px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background var(--transition-fast);
  }
  .celula-tempo:hover { background: var(--bg-hover); }

  /* eventos */
  .evento-bloco {
    position: absolute;
    left: 4px;
    right: 4px;
    border-radius: var(--radius-sm);
    padding: 3px 6px;
    cursor: pointer;
    overflow: hidden;
    z-index: 1;
    transition: opacity var(--transition-fast);
  }
  .evento-bloco:hover { opacity: 0.85; }

  .evento-titulo {
    display: block;
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }

  .evento-hora {
    display: block;
    font-size: 10px;
    color: var(--text-secondary);
    margin-top: 1px;
  }

  .evento-tarefa .evento-titulo::before {
    content: '✓ ';
    opacity: 0.5;
  }
</style>
