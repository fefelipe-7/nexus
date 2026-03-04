<!-- src/lib/components/habitos/ModalHabito.svelte -->
<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { activeModal, habitoEditando } from '$lib/stores/ui.js';
  import { areas } from '$lib/stores/areas.js';
  import { criarHabito, atualizarHabito, deletarHabito } from '$lib/db/queries/habitos.js';

  const dispatch = createEventDispatcher();

  let nome = '';
  let descricao = '';
  let icone = '';
  let areaId = null;
  let frequenciaTipo = 'diaria';
  let frequenciaAlvo = 1;
  let gracaAtiva = true;

  const FREQUENCIAS = [
    { id: 'diaria', label: 'diaria' },
    { id: 'semanal', label: 'semanal' },
    { id: 'mensal', label: 'mensal' },
    { id: 'trimestral', label: 'trimestral' },
    { id: 'semestral', label: 'semestral' },
    { id: 'anual', label: 'anual' },
  ];

  onMount(() => {
    if ($habitoEditando) {
      nome = $habitoEditando.nome;
      descricao = $habitoEditando.descricao || '';
      icone = $habitoEditando.icone || '';
      areaId = $habitoEditando.area_id;
      frequenciaTipo = $habitoEditando.frequencia_tipo;
      frequenciaAlvo = $habitoEditando.frequencia_alvo;
      gracaAtiva = $habitoEditando.graca_ativa === 1;
    }
  });

  async function salvar() {
    if (!nome) return;

    const dados = {
      nome,
      descricao,
      icone,
      areaId,
      frequenciaTipo,
      frequenciaAlvo,
      gracaAtiva
    };

    if ($habitoEditando) {
      await atualizarHabito($habitoEditando.id, dados);
    } else {
      await criarHabito(dados);
    }

    dispatch('salvo');
    fechar();
  }

  async function handleDeletar() {
    if (confirm('deseja excluir este habito e todo o seu historico?')) {
      await deletarHabito($habitoEditando.id);
      dispatch('salvo');
      fechar();
    }
  }

  function fechar() {
    activeModal.set(null);
    habitoEditando.set(null);
    dispatch('fechar');
  }
</script>

<div class="modal-overlay" on:click|self={fechar}>
  <div class="modal-content">
    <header>
      <h2>{$habitoEditando ? 'editar habito' : 'novo habito'}</h2>
      <button class="btn-close" on:click={fechar}>×</button>
    </header>

    <div class="form">
      <div class="row-topo">
        <div class="field field-icone">
          <label for="icone">icone</label>
          <input id="icone" type="text" bind:value={icone} placeholder="✨" />
        </div>
        <div class="field field-nome">
          <label for="nome">nome</label>
          <input id="nome" type="text" bind:value={nome} placeholder="ex: meditar, academia" autofocus />
        </div>
      </div>

      <div class="field">
        <label for="area">area</label>
        <select id="area" bind:value={areaId}>
          <option value={null}>nenhuma area</option>
          {#each $areas as a}
            <option value={a.id}>{a.nome}</option>
          {/each}
        </select>
      </div>

      <div class="row">
        <div class="field">
          <label for="freq">frequencia</label>
          <select id="freq" bind:value={frequenciaTipo}>
            {#each FREQUENCIAS as f}
              <option value={f.id}>{f.label}</option>
            {/each}
          </select>
        </div>

        {#if frequenciaTipo !== 'diaria'}
          <div class="field">
            <label for="alvo">vezes por periodo</label>
            <input id="alvo" type="number" bind:value={frequenciaAlvo} min="1" />
          </div>
        {/if}
      </div>

      {#if frequenciaTipo === 'diaria' || frequenciaTipo === 'semanal'}
        <div class="field-check">
          <input id="graca" type="checkbox" bind:checked={gracaAtiva} />
          <label for="graca">ativar regra de graca (permite falhas leves)</label>
        </div>
      {/if}
    </div>

    <footer>
      {#if $habitoEditando}
        <button class="btn-danger" on:click={handleDeletar}>excluir</button>
      {/if}
      <div class="acoes-fim">
        <button class="btn-secondary" on:click={fechar}>cancelar</button>
        <button class="btn-primary" on:click={salvar} disabled={!nome}>
          {$habitoEditando ? 'salvar' : 'criar habito'}
        </button>
      </div>
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
    width: 100%; max-width: 450px; padding: var(--space-6);
    box-shadow: var(--shadow-xl); border: 1px solid var(--border);
  }

  header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
  h2 { font-size: var(--text-xl); font-weight: 600; }
  .btn-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted); }

  .form { display: flex; flex-direction: column; gap: var(--space-4); }
  .row-topo { display: grid; grid-template-columns: 60px 1fr; gap: var(--space-3); }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
  .field { display: flex; flex-direction: column; gap: var(--space-1); }

  label { font-size: var(--text-xs); font-weight: 600; color: var(--text-muted); }
  input, select {
    background: var(--bg-secondary); border: 1px solid var(--border);
    border-radius: var(--radius-md); padding: 8px 12px;
    font-size: var(--text-sm); color: var(--text-primary); outline: none;
  }
  input:focus { border-color: var(--accent); }

  .field-check { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
  .field-check input { width: auto; }
  .field-check label { font-weight: 400; color: var(--text-secondary); cursor: pointer; }

  footer { display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-8); }
  .acoes-fim { display: flex; gap: var(--space-3); }
  .btn-danger { color: var(--status-danger); background: none; border: none; font-size: var(--text-sm); cursor: pointer; }
</style>
