<script>
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import { activeModal, eventoEditando } from '$lib/stores/ui.js';
  import { areas } from '$lib/stores/areas.js';
  import { criarEvento, atualizarEvento, deletarEvento } from '$lib/db/queries/eventos.js';

  const dispatch = createEventDispatcher();

  let inputTitulo;
  $: editando = $eventoEditando;

  // pre-preenche com dados do evento ou valores do clique no grid
  let titulo      = editando?.titulo    ?? '';
  let descricao   = editando?.descricao ?? '';
  let local       = editando?.local     ?? '';
  let inicio      = editando?.inicio    ?? '';
  let fim         = editando?.fim       ?? '';
  let diaInteiro  = editando?.dia_inteiro ? true : false;
  let areaId      = editando?.area_id   ?? null;

  // separar data e hora do inicio para inputs separados
  $: dataInicio = inicio ? inicio.slice(0, 10) : '';
  $: horaInicio = inicio && inicio.includes(' ') ? inicio.slice(11, 16) : '';
  $: dataFim    = fim ? fim.slice(0, 10) : '';
  $: horaFim    = fim && fim.includes(' ') ? fim.slice(11, 16) : '';

  let salvando  = false;
  let deletando = false;
  let erro      = '';

  onMount(async () => {
    await tick();
    if (inputTitulo) {
      inputTitulo.focus();
    }
  });

  function fechar() {
    eventoEditando.set(null);
    activeModal.set(null);
    dispatch('fechar');
  }

  function montarDatetime(data, hora) {
    if (!data) return null;
    if (!hora) return data;
    return `${data} ${hora}`;
  }

  async function salvar() {
    if (!titulo.trim()) {
      erro = 'o titulo e obrigatorio';
      return;
    }
    if (!dataInicio) {
      erro = 'a data de inicio e obrigatoria';
      return;
    }
    salvando = true;
    erro = '';
    try {
      const dados = {
        titulo:     titulo.trim(),
        descricao:  descricao.trim() || null,
        local:      local.trim() || null,
        inicio:     montarDatetime(dataInicio, horaInicio),
        fim:        montarDatetime(dataFim, horaFim),
        diaInteiro,
        areaId:     areaId || null,
      };

      if (editando?.id && !editando?.tipo?.includes('tarefa')) {
        await atualizarEvento(editando.id, dados);
      } else {
        await criarEvento(dados);
      }

      dispatch('salvo');
      fechar();
    } catch (e) {
      console.error('[nexus] erro ao salvar evento:', e);
      erro = e?.message ?? 'erro ao salvar. tente novamente.';
    } finally {
      salvando = false;
    }
  }

  async function remover() {
    if (!editando?.id) return;
    deletando = true;
    try {
      await deletarEvento(editando.id);
      dispatch('salvo');
      fechar();
    } finally {
      deletando = false;
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') fechar();
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) salvar();
  }

  $: areaAtual = areaId ? $areas.find(a => a.id === Number(areaId)) : null;
  $: corBotao  = areaAtual?.cor ?? 'var(--text-primary)';
  $: ehTarefa  = editando?.tipo === 'tarefa';
</script>

<svelte:window on:keydown={onKeydown} />

<div class="backdrop" on:click={fechar} on:keydown={() => {}} role="presentation"></div>

<div class="modal-wrapper" role="dialog" aria-modal="true">
  <div class="modal-conteudo">

    <div class="modal-header">
      <div class="modal-header-inner">
        <span class="modal-label">
          {ehTarefa ? 'tarefa no calendario' : editando?.id ? 'editar evento' : 'novo evento'}
        </span>
        {#if areaAtual}
          <span class="modal-area-badge" style="color: {areaAtual.cor}">{areaAtual.nome}</span>
        {/if}
      </div>
      <button class="btn-fechar" on:click={fechar}>×</button>
    </div>

    <div class="modal-corpo">
      <div class="campo-titulo">
        <input
          bind:this={inputTitulo}
          bind:value={titulo}
          class="input-titulo"
          class:com-erro={!!erro && !titulo}
          placeholder="nome do evento"
          disabled={ehTarefa}
          autocomplete="off"
        />
        {#if erro}<span class="msg-erro">{erro}</span>{/if}
      </div>

      <div class="campos-tempo">
        <div class="campo-detalhe">
          <label for="data-inicio">data inicio</label>
          <input id="data-inicio" type="date" bind:value={dataInicio} class="input-detalhe" disabled={ehTarefa} />
        </div>
        {#if !diaInteiro}
          <div class="campo-detalhe">
            <label for="hora-inicio">hora inicio</label>
            <input id="hora-inicio" type="time" bind:value={horaInicio} class="input-detalhe" disabled={ehTarefa} />
          </div>
          <div class="campo-detalhe">
            <label for="data-fim">data fim</label>
            <input id="data-fim" type="date" bind:value={dataFim} class="input-detalhe" />
          </div>
          <div class="campo-detalhe">
            <label for="hora-fim">hora fim</label>
            <input id="hora-fim" type="time" bind:value={horaFim} class="input-detalhe" />
          </div>
        {/if}
        <label class="label-check" for="dia-inteiro-chk">
          <input id="dia-inteiro-chk" type="checkbox" bind:checked={diaInteiro} disabled={ehTarefa} />
          dia inteiro
        </label>
      </div>

      <div class="campos-extra">
        <div class="campo-detalhe campo-detalhe--full">
          <label for="local-input">local</label>
          <input
            id="local-input"
            type="text"
            bind:value={local}
            class="input-detalhe"
            placeholder="opcional"
            disabled={ehTarefa}
          />
        </div>
        <div class="campo-detalhe campo-detalhe--full">
          <label for="area-select">area</label>
          <select id="area-select" bind:value={areaId} class="input-detalhe" disabled={ehTarefa}>
            <option value={null}>sem area</option>
            {#each $areas as area}
              <option value={area.id}>{area.nome}</option>
            {/each}
          </select>
        </div>
        {#if !ehTarefa}
          <div class="campo-detalhe campo-detalhe--full">
            <label for="desc-textarea">descricao</label>
            <textarea id="desc-textarea" bind:value={descricao} class="input-desc" placeholder="opcional" rows="2"></textarea>
          </div>
        {/if}
      </div>

      {#if ehTarefa}
        <p class="aviso-tarefa">
          este evento foi gerado automaticamente a partir de uma tarefa com hora definida.
          para editar, va ao modulo de tarefas.
        </p>
      {/if}
    </div>

    <div class="modal-footer">
      <div class="footer-esquerda">
        {#if editando?.id && !ehTarefa}
          <button class="btn-deletar" on:click={remover} disabled={deletando}>
            {deletando ? 'removendo...' : 'remover evento'}
          </button>
        {/if}
      </div>
      <div class="footer-direita">
        <span class="hint">cmd+enter para salvar</span>
        <button class="btn-cancelar" on:click={fechar}>cancelar</button>
        {#if !ehTarefa}
          <button
            class="btn-salvar"
            style="background: {corBotao}"
            on:click={salvar}
            disabled={salvando || !titulo.trim()}
          >
            {salvando ? 'salvando...' : 'salvar'}
          </button>
        {/if}
      </div>
    </div>

  </div>
</div>

<style>
  .backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.25);
    z-index: 100;
    backdrop-filter: blur(3px);
    animation: fadeIn 150ms ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal-wrapper {
    position: fixed; inset: 0;
    display: flex; align-items: center; justify-content: center;
    z-index: 101; pointer-events: none;
  }

  .modal-conteudo {
    pointer-events: all;
    width: 480px;
    max-width: calc(100vw - var(--space-8));
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    display: flex; flex-direction: column; overflow: hidden;
    animation: modalEntrar 180ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes modalEntrar {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1); }
  }

  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--space-3) var(--space-4) var(--space-3) var(--space-5);
    background: var(--bg-secondary); border-bottom: 1px solid var(--border);
  }
  .modal-header-inner { display: flex; align-items: center; gap: var(--space-2); }
  .modal-label { font-size: var(--text-xs); color: var(--text-muted); font-weight: 500; }
  .modal-area-badge { font-size: var(--text-xs); font-weight: 600; opacity: 0.8; }

  .btn-fechar {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); font-size: 18px; line-height: 1;
    width: 24px; height: 24px;
    display: flex; align-items: center; justify-content: center;
    border-radius: var(--radius-sm); transition: all var(--transition-fast);
  }
  .btn-fechar:hover { background: var(--bg-hover); color: var(--text-primary); }

  .modal-corpo {
    padding: var(--space-5);
    display: flex; flex-direction: column; gap: var(--space-4);
  }

  .campo-titulo { display: flex; flex-direction: column; gap: var(--space-1); }

  .input-titulo {
    border: none; border-bottom: 1px solid var(--border); border-radius: 0;
    padding-bottom: var(--space-3);
    font-size: var(--text-xl); font-family: var(--font-body); font-weight: 500;
    color: var(--text-primary); background: transparent; outline: none; width: 100%;
    transition: border-color var(--transition-fast);
  }
  .input-titulo:focus { border-bottom-color: var(--text-primary); }
  .input-titulo:disabled { opacity: 0.6; cursor: not-allowed; }
  .input-titulo::placeholder { color: var(--text-disabled); font-weight: 400; }

  .msg-erro { font-size: var(--text-xs); color: var(--status-danger); font-weight: 500; }

  .campos-tempo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
    align-items: end;
  }

  .campos-extra {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .campo-detalhe { display: flex; flex-direction: column; gap: 4px; }
  .campo-detalhe--full { grid-column: span 1; }

  label {
    font-size: var(--text-xs); color: var(--text-muted); font-weight: 500;
  }

  .label-check {
    display: flex; align-items: center; gap: var(--space-2);
    font-size: var(--text-xs); color: var(--text-secondary);
    cursor: pointer; grid-column: span 2;
  }

  .input-detalhe, select.input-detalhe {
    border: 1px solid var(--border); border-radius: var(--radius-md);
    padding: 6px 10px; font-size: var(--text-sm);
    font-family: var(--font-body); color: var(--text-primary);
    background: var(--bg-secondary); outline: none;
    transition: border-color var(--transition-fast); width: 100%;
  }
  .input-detalhe:focus { border-color: var(--text-primary); background: var(--bg); }
  .input-detalhe:disabled { opacity: 0.5; cursor: not-allowed; }

  .input-desc {
    border: 1px solid var(--border); border-radius: var(--radius-md);
    padding: var(--space-3); font-size: var(--text-sm);
    font-family: var(--font-body); color: var(--text-primary);
    background: var(--bg-secondary); outline: none; resize: vertical;
    min-height: 60px; transition: border-color var(--transition-fast); width: 100%;
  }
  .input-desc:focus { border-color: var(--text-primary); background: var(--bg); }

  .aviso-tarefa {
    font-size: var(--text-xs); color: var(--text-muted);
    background: var(--bg-secondary); border-radius: var(--radius-md);
    padding: var(--space-3); line-height: 1.5;
  }

  .modal-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--space-3) var(--space-5); border-top: 1px solid var(--border); gap: var(--space-3);
  }
  .footer-esquerda { display: flex; align-items: center; }
  .footer-direita  { display: flex; align-items: center; gap: var(--space-2); }

  .hint { font-size: var(--text-xs); color: var(--text-disabled); }

  .btn-deletar {
    background: none; border: none; cursor: pointer;
    font-size: var(--text-xs); color: var(--status-danger);
    font-family: var(--font-body); font-weight: 500;
    padding: 6px 10px; border-radius: var(--radius-md);
    transition: all var(--transition-fast); opacity: 0.7;
  }
  .btn-deletar:hover { opacity: 1; background: #fef2f2; }
  .btn-deletar:disabled { opacity: 0.3; cursor: not-allowed; }

  .btn-cancelar {
    background: none; border: 1px solid var(--border); color: var(--text-secondary);
    border-radius: var(--radius-md); padding: 7px 14px;
    font-size: var(--text-sm); font-family: var(--font-body); cursor: pointer;
    transition: all var(--transition-fast);
  }
  .btn-cancelar:hover { background: var(--bg-hover); }

  .btn-salvar {
    color: var(--bg); border: none; border-radius: var(--radius-md);
    padding: 7px 16px; font-size: var(--text-sm);
    font-family: var(--font-body); font-weight: 500; cursor: pointer;
    transition: opacity var(--transition-fast);
  }
  .btn-salvar:hover:not(:disabled) { opacity: 0.85; }
  .btn-salvar:disabled { opacity: 0.35; cursor: not-allowed; }
</style>
