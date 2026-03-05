<script>
  import { onMount } from 'svelte';
  import { activeModal, metaEditando } from '$lib/stores/ui.js';
  import { areas } from '$lib/stores/areas.js';
  import { metas } from '$lib/stores/metas.js';
  import { criarMeta, atualizarMeta } from '$lib/db/queries/metas.js';

  let { onfechar, onsalvo } = $props();

  let titulo = $state('');
  let descricao = $state('');
  let areaId = $state(null);
  let metaPaiId = $state(null);
  let prazoTipo = $state(null);
  let dataInicio = $state(null);
  let dataFim = $state(null);
  let modoProgresso = $state('tarefas');
  let valorAlvo = $state(null);
  let unidade = $state('');

  const MODOS = [
    { id: 'tarefas', label: 'por tarefas vinculadas' },
    { id: 'numerico', label: 'valor numerico (ex: 10/20 km)' },
    { id: 'percentual', label: 'porcentagem (0-100%)' },
    { id: 'binario', label: 'sim/nao (feito ou nao)' },
  ];

  const PRAZOS = [
    { id: null, label: 'sem prazo definido' },
    { id: 'semana', label: 'uma semana' },
    { id: 'mes', label: 'um mes' },
    { id: 'trimestre', label: 'um trimestre' },
    { id: 'semestre', label: 'um semestre' },
    { id: 'ano', label: 'um ano' },
  ];

  onMount(() => {
    if ($metaEditando) {
      titulo = $metaEditando.titulo;
      descricao = $metaEditando.descricao || '';
      areaId = $metaEditando.area_id;
      metaPaiId = $metaEditando.meta_pai_id;
      prazoTipo = $metaEditando.prazo_tipo;
      dataInicio = $metaEditando.data_inicio;
      dataFim = $metaEditando.data_fim;
      modoProgresso = $metaEditando.modo_progresso;
      valorAlvo = $metaEditando.valor_alvo;
      unidade = $metaEditando.unidade || '';
    }
  });

  async function salvar() {
    if (!titulo) return;

    const dados = {
      titulo,
      descricao,
      areaId,
      metaPaiId,
      prazoTipo,
      dataInicio,
      dataFim,
      modoProgresso,
      valorAlvo,
      unidade
    };

    if ($metaEditando) {
      await atualizarMeta($metaEditando.id, dados);
    } else {
      await criarMeta(dados);
    }

    onsalvo?.();
    fechar();
  }

  function fechar() {
    activeModal.set(null);
    metaEditando.set(null);
    onfechar?.();
  }
</script>

<div class="modal-overlay" onclick={(e) => { if (e.target === e.currentTarget) fechar(); }}>
  <div class="modal-content">
    <header>
      <h2>{$metaEditando ? 'editar meta' : 'nova meta'}</h2>
      <button class="btn-close" onclick={fechar}>×</button>
    </header>

    <div class="form">
      <div class="field">
        <label for="titulo">titulo</label>
        <input id="titulo" type="text" bind:value={titulo} placeholder="o que voce quer alcançar?" autofocus />
      </div>

      <div class="field">
        <label for="descricao">descricao (opcional)</label>
        <textarea id="descricao" bind:value={descricao} placeholder="detalhes extras..."></textarea>
      </div>

      <div class="row">
        <div class="field">
          <label for="area">area</label>
          <select id="area" bind:value={areaId}>
            <option value={null}>nenhuma area</option>
            {#each $areas as a}
              <option value={a.id}>{a.nome}</option>
            {/each}
          </select>
        </div>

        <div class="field">
          <label for="pai">meta pai (opcional)</label>
          <select id="pai" bind:value={metaPaiId}>
            <option value={null}>nenhuma (meta principal)</option>
            {#each $metas.filter(m => m.id !== $metaEditando?.id) as m}
              <option value={m.id}>{m.titulo}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="field">
        <label>modo de progresso</label>
        <div class="modo-grid">
          {#each MODOS as m}
            <button
              class="modo-btn"
              class:active={modoProgresso === m.id}
              onclick={() => modoProgresso = m.id}
            >
              {m.label}
            </button>
          {/each}
        </div>
      </div>

      {#if modoProgresso === 'numerico'}
        <div class="row">
          <div class="field">
            <label for="alvo">valor alvo</label>
            <input id="alvo" type="number" bind:value={valorAlvo} placeholder="ex: 100" />
          </div>
          <div class="field">
            <label for="unidade">unidade</label>
            <input id="unidade" type="text" bind:value={unidade} placeholder="ex: km, livros" />
          </div>
        </div>
      {/if}

      <div class="field">
        <label for="prazo">prazo</label>
        <select id="prazo" bind:value={prazoTipo}>
          {#each PRAZOS as p}
            <option value={p.id}>{p.label}</option>
          {/each}
        </select>
      </div>
    </div>

    <footer>
      <button class="btn-secondary" onclick={fechar}>cancelar</button>
      <button class="btn-primary" onclick={salvar} disabled={!titulo}>
        {$metaEditando ? 'salvar alteracoes' : 'criar meta'}
      </button>
    </footer>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; z-index: 1000;
  }

  .modal-content {
    background: var(--bg); border-radius: var(--radius-xl);
    width: 100%; max-width: 500px; padding: var(--space-6);
    box-shadow: var(--shadow-xl); border: 1px solid var(--border);
  }

  header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
  h2 { font-size: var(--text-xl); font-weight: 600; }
  .btn-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted); }

  .form { display: flex; flex-direction: column; gap: var(--space-4); }
  .field { display: flex; flex-direction: column; gap: var(--space-1); }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }

  label { font-size: var(--text-xs); font-weight: 600; color: var(--text-muted); }
  input, textarea, select {
    background: var(--bg-secondary); border: 1px solid var(--border);
    border-radius: var(--radius-md); padding: 8px 12px;
    font-size: var(--text-sm); color: var(--text-primary); outline: none;
  }
  input:focus, textarea:focus { border-color: var(--accent); }
  textarea { height: 80px; resize: none; }

  .modo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .modo-btn {
    background: var(--bg-secondary); border: 1px solid var(--border);
    padding: 8px; border-radius: var(--radius-md); font-size: var(--text-xs);
    cursor: pointer; transition: all var(--transition-fast); text-align: left;
  }
  .modo-btn.active { border-color: var(--accent); background: var(--bg); font-weight: 600; }

  footer { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-8); }
</style>
