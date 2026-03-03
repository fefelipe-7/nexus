<!-- src/lib/components/tarefas/ModalTarefa.svelte -->
<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { activeModal, tarefaEditando } from '$lib/stores/ui.js';
  import { areas } from '$lib/stores/areas.js';
  import { criarTarefa, atualizarTarefa } from '$lib/db/queries/tarefas.js';
  import { hoje } from '$lib/utils/dates.js';

  const dispatch = createEventDispatcher();

  let inputTitulo;

  // preenche com dados da tarefa sendo editada, ou valores padrao
  $: editando = $tarefaEditando;

  let titulo       = editando?.titulo       ?? '';
  let descricao    = editando?.descricao    ?? '';
  let areaId       = editando?.area_id      ?? null;
  let prioridade   = editando?.prioridade   ?? 'media';
  let dataPrevista = editando?.data_prevista ?? hoje();
  let horaPrevista = editando?.hora_prevista ?? '';

  let salvando = false;
  let erro     = '';

  onMount(() => {
    inputTitulo?.focus();
  });

  function fechar() {
    tarefaEditando.set(null);
    dispatch('fechar');
  }

  async function salvar() {
    if (!titulo.trim()) {
      erro = 'o titulo e obrigatorio';
      return;
    }
    salvando = true;
    erro = '';
    try {
      if (editando) {
        await atualizarTarefa(editando.id, {
          titulo: titulo.trim(),
          descricao: descricao.trim() || null,
          areaId: areaId || null,
          prioridade,
          dataPrevista: dataPrevista || null,
          horaPrevista: horaPrevista || null,
        });
      } else {
        await criarTarefa({
          titulo: titulo.trim(),
          descricao: descricao.trim() || null,
          areaId: areaId || null,
          prioridade,
          dataPrevista: dataPrevista || null,
          horaPrevista: horaPrevista || null,
        });
      }
      dispatch('salvo');
      fechar();
    } catch (e) {
      erro = 'erro ao salvar. tente novamente.';
    } finally {
      salvando = false;
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') fechar();
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) salvar();
  }

  const PRIORIDADES = [
    { valor: 'critica', label: 'critica'  },
    { valor: 'alta',    label: 'alta'     },
    { valor: 'media',   label: 'media'    },
    { valor: 'baixa',   label: 'baixa'    },
  ];
</script>

<svelte:window on:keydown={onKeydown} />

<!-- backdrop -->
<div class="backdrop" on:click={fechar} on:keydown={() => {}} />

<div class="modal" role="dialog" aria-modal="true">
  <div class="modal-header">
    <h2>{editando ? 'editar tarefa' : 'nova tarefa'}</h2>
    <button class="btn-fechar" on:click={fechar}>×</button>
  </div>

  <div class="modal-corpo">
    <!-- titulo (campo principal — recebe foco automatico) -->
    <div class="campo">
      <input
        bind:this={inputTitulo}
        bind:value={titulo}
        class="input-titulo"
        placeholder="o que precisa ser feito?"
        class:erro={!!erro}
      />
      {#if erro}<span class="msg-erro">{erro}</span>{/if}
    </div>

    <!-- descricao -->
    <div class="campo">
      <textarea
        bind:value={descricao}
        class="input-desc"
        placeholder="detalhes (opcional)"
        rows="2"
      />
    </div>

    <!-- linha de metadados -->
    <div class="campos-linha">
      <!-- data -->
      <div class="campo campo-inline">
        <label>data</label>
        <input type="date" bind:value={dataPrevista} class="input-field" />
      </div>

      <!-- hora -->
      <div class="campo campo-inline">
        <label>hora</label>
        <input type="time" bind:value={horaPrevista} class="input-field" />
      </div>

      <!-- prioridade -->
      <div class="campo campo-inline">
        <label>prioridade</label>
        <select bind:value={prioridade} class="input-field">
          {#each PRIORIDADES as p}
            <option value={p.valor}>{p.label}</option>
          {/each}
        </select>
      </div>

      <!-- area -->
      <div class="campo campo-inline">
        <label>area</label>
        <select bind:value={areaId} class="input-field">
          <option value={null}>sem area</option>
          {#each $areas as area}
            <option value={area.id}>{area.nome}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="modal-footer">
    <span class="hint">cmd+enter para salvar · esc para fechar</span>
    <div class="acoes">
      <button class="btn-cancelar" on:click={fechar}>cancelar</button>
      <button class="btn-salvar" on:click={salvar} disabled={salvando}>
        {salvando ? 'salvando...' : 'salvar'}
      </button>
    </div>
  </div>
</div>

<style>
  .backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.3);
    z-index: 100;
    backdrop-filter: blur(2px);
    animation: fadeIn var(--transition-fast) ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  .modal {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 101;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    width: 520px;
    max-width: calc(100vw - var(--space-8));
    display: flex;
    flex-direction: column;
    animation: slideUp 200ms ease;
  }

  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--border);
  }

  .modal-header h2 {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
  }

  .btn-fechar {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); font-size: 20px; line-height: 1;
    width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
    border-radius: var(--radius-sm); transition: all var(--transition-fast);
  }
  .btn-fechar:hover { background: var(--bg-hover); color: var(--text-primary); }

  .modal-corpo {
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .campo { display: flex; flex-direction: column; gap: var(--space-1); }

  .input-titulo {
    border: none;
    font-size: var(--text-md);
    font-family: var(--font-body);
    color: var(--text-primary);
    background: transparent;
    outline: none;
    width: 100%;
    font-weight: 500;
  }
  .input-titulo::placeholder { color: var(--text-disabled); font-weight: 400; }
  .input-titulo.erro { color: var(--status-danger); }

  .msg-erro { font-size: var(--text-xs); color: var(--status-danger); }

  .input-desc {
    border: none; border-top: 1px solid var(--border);
    font-size: var(--text-sm); font-family: var(--font-body);
    color: var(--text-secondary); background: transparent;
    outline: none; width: 100%; resize: none;
    padding-top: var(--space-3);
  }
  .input-desc::placeholder { color: var(--text-disabled); }

  .campos-linha {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
    padding-top: var(--space-2);
    border-top: 1px solid var(--border);
  }

  .campo-inline { gap: 4px; }

  label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
  }

  .input-field {
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 6px 10px;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    color: var(--text-primary);
    background: var(--bg-secondary);
    outline: none;
    width: 100%;
    transition: border-color var(--transition-fast);
  }
  .input-field:focus { border-color: var(--text-primary); background: var(--bg); }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--space-5);
    border-top: 1px solid var(--border);
  }

  .hint { font-size: var(--text-xs); color: var(--text-disabled); }

  .acoes { display: flex; gap: var(--space-2); }

  .btn-cancelar {
    background: none; border: 1px solid var(--border);
    color: var(--text-secondary); border-radius: var(--radius-md);
    padding: 7px 14px; font-size: var(--text-sm);
    font-family: var(--font-body); cursor: pointer;
    transition: all var(--transition-fast);
  }
  .btn-cancelar:hover { background: var(--bg-hover); }

  .btn-salvar {
    background: var(--text-primary); color: var(--bg);
    border: none; border-radius: var(--radius-md);
    padding: 7px 16px; font-size: var(--text-sm);
    font-family: var(--font-body); font-weight: 500;
    cursor: pointer; transition: opacity var(--transition-fast);
  }
  .btn-salvar:hover:not(:disabled) { opacity: 0.85; }
  .btn-salvar:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
