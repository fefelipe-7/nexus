<!-- src/lib/components/metas/DetalheMeta.svelte -->
<script>
  import { onMount } from 'svelte';
  import { getTarefasDaMeta } from '$lib/db/queries/tarefas.js';
  import { deletarMeta } from '$lib/db/queries/metas.js';
  import { activeModal, metaEditando } from '$lib/stores/ui.js';
  let { 
    meta, 
    onfechar, 
    onatualizar 
  } = $props();

  let tarefas = $state([]);

  onMount(async () => {
    tarefas = await getTarefasDaMeta(meta.id);
  });

  async function handleDeletar() {
    if (confirm('tem certeza que deseja excluir esta meta? submetas serao desvinculadas.')) {
      await deletarMeta(meta.id);
      onatualizar?.();
      onfechar?.();
    }
  }

  function editar() {
    metaEditando.set(meta);
    activeModal.set('editarMeta');
  }
</script>

<div class="detalhe-overlay" onclick={(e) => { if (e.target === e.currentTarget) onfechar?.(); }}>
  <div class="detalhe-painel">
    <header>
      <div class="topo">
        <span class="area" style="color: {meta.area_cor}">{meta.area_nome || 'sem area'}</span>
        <button class="btn-close" onclick={() => onfechar?.()}>×</button>
      </div>
      <h1>{meta.titulo}</h1>
      <p class="desc">{meta.descricao || 'sem descricao'}</p>
    </header>

    <div class="conteudo">
      <section>
        <h4>tarefas vinculadas ({tarefas.length})</h4>
        <div class="lista-tarefas">
          {#each tarefas as t}
            <div class="tarefa-item" class:concluida={t.status === 'concluida'}>
              <span class="status-bolinha" class:ok={t.status === 'concluida'}></span>
              {t.titulo}
            </div>
          {/each}
          {#if tarefas.length === 0}
            <p class="vazio">nenhuma tarefa vinculada</p>
          {/if}
        </div>
      </section>

      {#if meta.submetas && meta.submetas.length > 0}
        <section>
          <h4>submetas ({meta.submetas.length})</h4>
          <div class="lista-submetas">
            {#each meta.submetas as s}
              <div class="submeta-item">
                <span class="submeta-titulo">{s.titulo}</span>
                <span class="submeta-prog">{s.tarefas_concluidas || 0}/{s.tarefas_total || 0}</span>
              </div>
            {/each}
          </div>
        </section>
      {/if}
    </div>

    <footer>
      <button class="btn-danger" onclick={handleDeletar}>excluir meta</button>
      <button class="btn-secondary" onclick={editar}>editar</button>
    </footer>
  </div>
</div>

<style>
  .detalhe-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.2); backdrop-filter: blur(2px);
    display: flex; justify-content: flex-end; z-index: 900;
  }

  .detalhe-painel {
    width: 100%; max-width: 400px; height: 100%;
    background: var(--bg); border-left: 1px solid var(--border);
    display: flex; flex-direction: column; padding: var(--space-8) var(--space-6);
    box-shadow: var(--shadow-lg);
  }

  header { margin-bottom: var(--space-8); }
  .topo { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2); }
  .area { font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  h1 { font-size: var(--text-2xl); font-weight: 600; margin-bottom: var(--space-2); }
  .desc { color: var(--text-secondary); font-size: var(--text-sm); line-height: 1.5; }

  h4 { font-size: var(--text-xs); font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-bottom: var(--space-3); }
  section { margin-bottom: var(--space-8); }

  .lista-tarefas, .lista-submetas { display: flex; flex-direction: column; gap: 8px; }
  .tarefa-item, .submeta-item {
    font-size: var(--text-sm); display: flex; align-items: center; gap: 10px;
    padding: 8px; border-radius: var(--radius-md); background: var(--bg-hover);
  }
  .tarefa-item.concluida { opacity: 0.5; text-decoration: line-through; }
  .status-bolinha { width: 8px; height: 8px; border-radius: 50%; background: var(--border-strong); }
  .status-bolinha.ok { background: var(--status-ok); }

  .vazio { font-size: var(--text-xs); color: var(--text-muted); font-style: italic; }

  footer { margin-top: auto; display: flex; gap: var(--space-3); padding-top: var(--space-6); border-top: 1px solid var(--border); }
  .btn-danger { color: var(--status-danger); background: none; border: none; font-size: var(--text-sm); cursor: pointer; }
</style>
