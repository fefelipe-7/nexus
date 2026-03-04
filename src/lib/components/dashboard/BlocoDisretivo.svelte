<!-- src/lib/components/dashboard/BlocoDisretivo.svelte -->
<script>
  export let tarefas   = [];
  export let atrasadas = [];
  export let stats     = null;
  export let eventos      = [];
  export let metas        = []; // novo
  export let habitos      = []; // novo
  export let tab          = 'dia';

  function gerarMensagem() {
    // metas proximas do prazo (so na tab dia)
    if (tab === 'dia' && metas.length > 0) {
      const urgentes = metas.filter(m =>
        m.dias_restantes !== null &&
        m.dias_restantes <= 3 &&
        m.dias_restantes >= 0 &&
        m.status === 'ativa'
      );
      if (urgentes.length > 0) {
        const n = urgentes.length;
        return `${n} ${n > 1 ? 'metas vencem' : 'meta vence'} em menos de 3 dias. verifique seu progresso.`;
      }
    }

    // habitos nao feitos ainda hoje (so na tab dia)
    if (tab === 'dia' && habitos.length > 0) {
      const naoFeitos = habitos.filter(h =>
        h.frequencia_tipo === 'diaria' && !h.concluido_hoje
      );
      if (naoFeitos.length === habitos.filter(h => h.frequencia_tipo === 'diaria').length
          && naoFeitos.length > 0) {
        return `voce ainda nao fez nenhum habito hoje. comece por qualquer um.`;
      }
    }

    if (tab !== 'dia' || !stats) {
      const total = tarefas.length;
      const concluidas = tarefas.filter(t => t.status === 'concluida').length;
      const pendentes = total - concluidas;
      if (total === 0) return 'nenhuma tarefa neste periodo. adicione o que precisa ser feito.';
      if (pendentes === 0) return `todas as ${total} tarefas do periodo foram concluidas.`;
      return `${pendentes} tarefa${pendentes > 1 ? 's' : ''} pendente${pendentes > 1 ? 's' : ''} neste periodo. ${concluidas} ja ${concluidas === 1 ? 'foi concluida' : 'foram concluidas'}.`;
    }

    const { total, concluidas, pendentes, alta_prioridade } = stats;

    if (atrasadas.length > 0) {
      const n = atrasadas.length;
      return `voce tem ${n} tarefa${n > 1 ? 's' : ''} atrasada${n > 1 ? 's' : ''} de dias anteriores. resolva isso antes de comecar.`;
    }

    if (total === 0) {
      return 'nenhuma tarefa para hoje. adicione o que precisa ser feito.';
    }

    if (concluidas === total) {
      return 'todas as tarefas do dia foram concluidas. voce pode planejar amanha.';
    }

    if (concluidas === 0 && alta_prioridade > 0) {
      return `nenhuma tarefa concluida ainda. ${alta_prioridade} ${alta_prioridade === 1 ? 'e' : 'sao'} de alta prioridade — comece por ${alta_prioridade === 1 ? 'ela' : 'elas'}.`;
    }

    return `${concluidas} de ${total} ${total === 1 ? 'tarefa concluida' : 'tarefas concluidas'}. faltam ${pendentes}.`;
  }

  $: mensagem = gerarMensagem();
  $: temAtrasadas = atrasadas.length > 0;
  $: todasConcluidas = stats && stats.concluidas === stats.total && stats.total > 0;
</script>

<div class="bloco-diretivo" class:alerta={temAtrasadas} class:ok={todasConcluidas}>
  <div class="bloco-icone">
    {#if temAtrasadas}!
    {:else if todasConcluidas}✓
    {:else}→
    {/if}
  </div>
  <p class="bloco-texto">{mensagem}</p>
</div>

<style>
  .bloco-diretivo {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-5);
    border-radius: var(--radius-lg);
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    transition: background var(--transition-base), border-color var(--transition-base);
  }

  .bloco-diretivo.alerta {
    background: #fff8f0;
    border-color: #fde8cc;
  }

  .bloco-diretivo.ok {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }

  .bloco-icone {
    font-size: var(--text-base);
    font-weight: 700;
    color: var(--text-muted);
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
  }

  .alerta .bloco-icone { color: #c2570a; }
  .ok .bloco-icone     { color: var(--status-ok); }

  .bloco-texto {
    font-size: var(--text-base);
    color: var(--text-primary);
    line-height: 1.5;
    font-weight: 400;
  }
</style>
