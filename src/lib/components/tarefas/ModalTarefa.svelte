<script>
  import { onMount, tick } from 'svelte';
  import { activeModal, tarefaEditando } from '$lib/stores/ui.js';
  import { areas } from '$lib/stores/areas.js';
  import { criarTarefa, atualizarTarefa, deletarTarefa } from '$lib/db/queries/tarefas.js';
  import { hoje } from '$lib/utils/dates.js';

  let { 
    onfechar, 
    onsalvo 
  } = $props();

  let inputTitulo = $state();
  let mostrarDetalhes = $state(false);

  let editando = $derived($tarefaEditando);
  let areaAtual = $derived(areaId ? $areas.find(a => a.id === Number(areaId)) : null);
  let corBotaoSalvar = $derived(areaAtual?.cor ?? 'var(--text-primary)');

  let titulo       = $state(editando?.titulo        ?? '');
  let descricao    = $state(editando?.descricao     ?? '');
  let areaId       = $state(editando?.area_id       ?? null);
  let prioridade   = $state(editando?.prioridade    ?? 'media');
  let dataPrevista = $state(editando?.data_prevista ?? hoje());
  let horaPrevista = $state(editando?.hora_prevista ?? '');

  // abre detalhes automaticamente se a tarefa editada ja tem campos preenchidos
  $effect(() => {
    if (editando) {
      mostrarDetalhes = !!(editando.descricao || editando.area_id || editando.hora_prevista || editando.prioridade !== 'media');
    }
  });

  let salvando  = $state(false);
  let deletando = $state(false);
  let erro      = $state('');

  onMount(async () => {
    await tick(); // garante que o dom renderizou
    inputTitulo?.focus();
  });

  function fechar() {
    tarefaEditando.set(null);
    onfechar?.();
  }

  async function salvar() {
    if (!titulo.trim()) {
      erro = 'o titulo e obrigatorio';
      inputTitulo?.focus();
      return;
    }
    salvando = true;
    erro = '';
    try {
      const dados = {
        titulo:       titulo.trim(),
        descricao:    descricao.trim() || null,
        areaId:       areaId === 'null' ? null : (areaId || null),
        prioridade,
        dataPrevista: dataPrevista || null,
        horaPrevista: horaPrevista || null,
      };

      if (editando) {
        await atualizarTarefa(editando.id, dados);
      } else {
        await criarTarefa(dados);
      }

      onsalvo?.();
      fechar();
    } catch (e) {
      erro = 'erro ao salvar. tente novamente.';
      console.error('Erro ao salvar tarefa:', e);
    } finally {
      salvando = false;
    }
  }

  async function remover() {
    if (!editando) return;
    deletando = true;
    try {
      if (deletarTarefa) {
        await deletarTarefa(editando.id);
      }
      onsalvo?.();
      fechar();
    } finally {
      deletando = false;
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') fechar();
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) salvar();
  }

  const PRIORIDADES = [
    { valor: 'critica', label: 'critica', cor: '#ef4444' },
    { valor: 'alta',    label: 'alta',    cor: '#f59e0b' },
    { valor: 'media',   label: 'media',   cor: '#9b9b9b' },
    { valor: 'baixa',   label: 'baixa',   cor: '#d4d2cc' },
  ];

  let corPrioridade = $derived(PRIORIDADES.find(p => p.valor === prioridade)?.cor ?? '#9b9b9b');
</script>

<svelte:window onkeydown={onKeydown} />

<!-- backdrop separado do modal para nao interferir no posicionamento -->
<div
  class="backdrop"
  onclick={fechar}
  onkeydown={() => {}}
  role="presentation"
></div>

<!-- wrapper cuida so do posicionamento -->
<div class="modal-wrapper" role="dialog" aria-modal="true">

  <!-- conteudo cuida so da animacao e visual -->
  <div class="modal-conteudo">

    <!-- header minimalista -->
    <div class="modal-header">
      <div class="modal-header-inner">
        <span class="modal-label">
          {editando ? 'editar tarefa' : 'nova tarefa'}
        </span>
        {#if editando && editando.area_nome}
          <span class="modal-area-badge" style="color: {editando.area_cor}">
            {editando.area_nome}
          </span>
        {/if}
      </div>
      <button class="btn-fechar" onclick={fechar} aria-label="fechar">×</button>
    </div>

    <!-- corpo principal -->
    <div class="modal-corpo">

      <!-- titulo — campo principal, grande e dominante -->
      <div class="campo-titulo">
        <input
          bind:this={inputTitulo}
          bind:value={titulo}
          class="input-titulo"
          class:com-erro={!!erro}
          placeholder="no que voce precisa trabalhar?"
          autocomplete="off"
        />
        {#if erro}
          <span class="msg-erro">{erro}</span>
        {/if}
      </div>

      <!-- linha de acoes rapidas — sempre visivel -->
      <div class="acoes-rapidas">

        <!-- data -->
        <div class="chip-campo">
          <span class="chip-icone">📅</span>
          <input
            type="date"
            bind:value={dataPrevista}
            class="chip-input"
          />
        </div>

        <!-- prioridade -->
        <div
          class="chip-campo"
          class:chip-ativo={prioridade !== 'media'}
          style={prioridade !== 'media' ? `border-color: ${corPrioridade}33; background: ${corPrioridade}0d` : ''}
        >
          <span class="indicador-prioridade" style="background: {corPrioridade}"></span>
          <select bind:value={prioridade} class="chip-select">
            {#each PRIORIDADES as p}
              <option value={p.valor}>{p.label}</option>
            {/each}
          </select>
        </div>

        <!-- area -->
        {#if areaAtual}
        <div
          class="chip-campo"
          style="border-color: {areaAtual.cor}33; background: {areaAtual.cor}0d"
        >
          <span class="chip-dot" style="background: {areaAtual.cor}"></span>
          <select bind:value={areaId} class="chip-select" style="color: {areaAtual.cor}">
            <option value={null}>sem area</option>
            {#each $areas as area}
              <option value={area.id}>{area.nome}</option>
            {/each}
          </select>
        </div>
        {:else}
        <div class="chip-campo">
          <span class="chip-icone">◎</span>
          <select bind:value={areaId} class="chip-select">
            <option value={null}>sem area</option>
            {#each $areas as area}
              <option value={area.id}>{area.nome}</option>
            {/each}
          </select>
        </div>
        {/if}

        <!-- botao para mostrar/esconder detalhes -->
        <button
          class="btn-detalhes"
          onclick={() => mostrarDetalhes = !mostrarDetalhes}
        >
          {mostrarDetalhes ? 'menos' : 'mais detalhes'}
        </button>

      </div>

      <!-- detalhes opcionais — colapsavel com CSS Grid -->
      <div class="detalhes-wrapper" class:aberto={mostrarDetalhes}>
        <div class="detalhes-inner">
          <div class="campos-detalhes">

            <!-- hora -->
            <div class="campo-detalhe">
              <label for="input-hora-prev">hora</label>
              <input id="input-hora-prev" type="time" bind:value={horaPrevista} class="input-detalhe" />
            </div>

            <!-- descricao -->
            <div class="campo-detalhe campo-detalhe--full">
              <label for="input-desc-prev">descricao</label>
              <textarea
                id="input-desc-prev"
                bind:value={descricao}
                class="input-desc"
                placeholder="detalhes adicionais (opcional)"
                rows="3"
              ></textarea>
            </div>

          </div>
        </div>
      </div>

    </div>

    <!-- footer -->
    <div class="modal-footer">
      <div class="footer-esquerda">
        {#if editando}
          <button
            class="btn-deletar"
            onclick={remover}
            disabled={deletando}
          >
            {deletando ? 'removendo...' : 'remover tarefa'}
          </button>
        {/if}
      </div>

      <div class="footer-direita">
        <span class="hint">cmd+enter para salvar</span>
        <button class="btn-cancelar" onclick={fechar}>cancelar</button>
        <button
          class="btn-salvar"
          style="background: {corBotaoSalvar}"
          onclick={salvar}
          disabled={salvando || !titulo.trim()}
        >
          {salvando ? 'salvando...' : 'salvar'}
        </button>
      </div>
    </div>

  </div>
</div>

<style>
  /* ── backdrop ──────────────────────────────────────────── */
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
    z-index: 100;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    animation: fadeIn 150ms ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ── wrapper: so posicionamento ────────────────────────── */
  .modal-wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 101;
    pointer-events: none;
  }

  /* ── conteudo: so animacao e visual ────────────────────── */
  .modal-conteudo {
    pointer-events: all;
    width: 540px;
    max-width: calc(100vw - var(--space-8));
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: modalEntrar 180ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* animacao: so opacidade e escala — sem movimento de posicao */
  @keyframes modalEntrar {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1);    }
  }

  /* ── header ────────────────────────────────────────────── */
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-4) var(--space-3) var(--space-5);
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
  }

  .modal-header-inner {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .modal-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .modal-area-badge {
    font-size: var(--text-xs);
    font-weight: 600;
    opacity: 0.8;
  }

  .btn-fechar {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 18px;
    line-height: 1;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }
  .btn-fechar:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  /* ── corpo ─────────────────────────────────────────────── */
  .modal-corpo {
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  /* titulo */
  .campo-titulo { display: flex; flex-direction: column; gap: var(--space-1); }

  .input-titulo {
    border: none;
    border-bottom: 1px solid var(--border);
    border-radius: 0;
    padding-bottom: var(--space-3);
    font-size: var(--text-xl);
    font-family: var(--font-body);
    font-weight: 500;
    color: var(--text-primary);
    background: transparent;
    outline: none;
    width: 100%;
    line-height: 1.3;
    transition: border-color var(--transition-fast);
  }
  .input-titulo:focus { border-bottom-color: var(--text-primary); }
  .input-titulo::placeholder {
    color: var(--text-disabled);
    font-weight: 400;
  }
  .input-titulo.com-erro { color: var(--status-danger); }

  .msg-erro {
    font-size: var(--text-xs);
    color: var(--status-danger);
    font-weight: 500;
  }

  /* acoes rapidas */
  .acoes-rapidas {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .chip-campo {
    display: flex;
    align-items: center;
    gap: 5px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 4px 10px;
    cursor: pointer;
    transition: border-color var(--transition-fast);
  }
  .chip-campo:hover { border-color: var(--border-strong); }

  .chip-icone {
    font-size: 13px;
    line-height: 1;
    flex-shrink: 0;
  }

  .indicador-prioridade {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
    transition: background var(--transition-fast);
  }

  .chip-input,
  .chip-select {
    border: none;
    background: transparent;
    font-size: var(--text-xs);
    font-family: var(--font-body);
    color: var(--text-secondary);
    font-weight: 500;
    cursor: pointer;
    outline: none;
    padding: 0;
  }

  .chip-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }

  .btn-detalhes {
    background: none;
    border: none;
    cursor: pointer;
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-family: var(--font-body);
    font-weight: 500;
    padding: 4px 8px;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    margin-left: auto;
  }
  .btn-detalhes:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  /* detalhes */
  .detalhes-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 200ms ease;
  }

  .detalhes-wrapper.aberto {
    grid-template-rows: 1fr;
  }

  .detalhes-inner {
    overflow: hidden;
  }

  .campos-detalhes {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-3);
    padding-top: var(--space-4);
    border-top: 1px solid var(--border);
    margin-top: var(--space-1);
  }

  .campo-detalhe {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .campo-detalhe--full { grid-column: span 2; }

  label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
  }

  .input-detalhe {
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 6px 10px;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    color: var(--text-primary);
    background: var(--bg-secondary);
    outline: none;
    transition: border-color var(--transition-fast);
  }
  .input-detalhe:focus {
    border-color: var(--text-primary);
    background: var(--bg);
  }

  .input-desc {
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-3);
    font-size: var(--text-sm);
    font-family: var(--font-body);
    color: var(--text-primary);
    background: var(--bg-secondary);
    outline: none;
    resize: vertical;
    min-height: 72px;
    transition: border-color var(--transition-fast);
    width: 100%;
  }
  .input-desc:focus {
    border-color: var(--text-primary);
    background: var(--bg);
  }
  .input-desc::placeholder { color: var(--text-disabled); }

  /* ── footer ────────────────────────────────────────────── */
  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-5);
    border-top: 1px solid var(--border);
    gap: var(--space-3);
  }

  .footer-esquerda { display: flex; align-items: center; }
  .footer-direita  { display: flex; align-items: center; gap: var(--space-2); }

  .hint {
    font-size: var(--text-xs);
    color: var(--text-disabled);
  }

  .btn-deletar {
    background: none;
    border: none;
    cursor: pointer;
    font-size: var(--text-xs);
    color: var(--status-danger);
    font-family: var(--font-body);
    font-weight: 500;
    padding: 6px 10px;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    opacity: 0.7;
  }
  .btn-deletar:hover { opacity: 1; background: #fef2f2; }
  .btn-deletar:disabled { opacity: 0.3; cursor: not-allowed; }

  .btn-cancelar {
    background: none;
    border: 1px solid var(--border);
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    padding: 7px 14px;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  .btn-cancelar:hover { background: var(--bg-hover); }

  .btn-salvar {
    background: var(--text-primary);
    color: var(--bg);
    border: none;
    border-radius: var(--radius-md);
    padding: 7px 16px;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    font-weight: 500;
    cursor: pointer;
    transition: opacity var(--transition-fast);
  }
  .btn-salvar:hover:not(:disabled) { opacity: 0.85; }
  .btn-salvar:disabled { opacity: 0.35; cursor: not-allowed; }
</style>
