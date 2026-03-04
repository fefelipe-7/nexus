// src/lib/db/queries/tarefas.js
import { getDb } from '../client.js';

// ── leitura ───────────────────────────────────────────────────────────────────

// busca tarefas de um dia especifico
export async function getTarefasDoDia(data) {
  const db = getDb();
  return db.select(`
    select t.*, a.nome as area_nome, a.cor as area_cor
    from tarefas t
    left join areas_de_vida a on t.area_id = a.id
    where t.data_prevista = ?
    and t.status != 'cancelada'
    order by
      case t.prioridade
        when 'critica' then 1
        when 'alta'    then 2
        when 'media'   then 3
        when 'baixa'   then 4
      end,
      t.hora_prevista asc nulls last,
      t.criado_em asc
  `, [data]);
}

// busca tarefas de um intervalo de datas
export async function getTarefasDoIntervalo(dataInicio, dataFim) {
  const db = getDb();
  return db.select(`
    select t.*, a.nome as area_nome, a.cor as area_cor
    from tarefas t
    left join areas_de_vida a on t.area_id = a.id
    where t.data_prevista between ? and ?
    and t.status != 'cancelada'
    order by t.data_prevista asc,
      case t.prioridade
        when 'critica' then 1
        when 'alta'    then 2
        when 'media'   then 3
        when 'baixa'   then 4
      end
  `, [dataInicio, dataFim]);
}

// busca tarefas atrasadas (data passada, nao concluidas)
export async function getTarefasAtrasadas(hoje) {
  const db = getDb();
  return db.select(`
    select t.*, a.nome as area_nome, a.cor as area_cor
    from tarefas t
    left join areas_de_vida a on t.area_id = a.id
    where t.data_prevista < ?
    and t.status in ('pendente', 'em_progresso')
    order by t.data_prevista asc
  `, [hoje]);
}

// estatisticas para o bloco diretivo
export async function getEstatisticasDoDia(data) {
  const db = getDb();
  const [stats] = await db.select(`
    select
      count(*) as total,
      sum(case when status = 'concluida' then 1 else 0 end) as concluidas,
      sum(case when status in ('pendente','em_progresso') then 1 else 0 end) as pendentes,
      sum(case when prioridade in ('critica','alta') and status != 'concluida' then 1 else 0 end) as alta_prioridade
    from tarefas
    where data_prevista = ?
    and status != 'cancelada'
  `, [data]);
  return stats;
}

// ── escrita ───────────────────────────────────────────────────────────────────

export async function criarTarefa(tarefa) {
  const db = getDb();
  const result = await db.execute(`
    insert into tarefas (titulo, descricao, area_id, prioridade, data_prevista, hora_prevista)
    values (?, ?, ?, ?, ?, ?)
  `, [
    tarefa.titulo,
    tarefa.descricao ?? null,
    tarefa.areaId === 'null' ? null : (tarefa.areaId ?? null),
    tarefa.prioridade ?? 'media',
    tarefa.dataPrevista ?? null,
    tarefa.horaPrevista ?? null,
  ]);
  return result.lastInsertId;
}

export async function atualizarTarefa(id, campos) {
  const db = getDb();
  const sets = [];
  const valores = [];

  if (campos.titulo !== undefined) { sets.push('titulo = ?'); valores.push(campos.titulo); }
  if (campos.descricao !== undefined) { sets.push('descricao = ?'); valores.push(campos.descricao); }
  if (campos.areaId !== undefined) { sets.push('area_id = ?'); valores.push(campos.areaId); }
  if (campos.prioridade !== undefined) { sets.push('prioridade = ?'); valores.push(campos.prioridade); }
  if (campos.status !== undefined) { sets.push('status = ?'); valores.push(campos.status); }
  if (campos.dataPrevista !== undefined) { sets.push('data_prevista = ?'); valores.push(campos.dataPrevista); }
  if (campos.horaPrevista !== undefined) { sets.push('hora_prevista = ?'); valores.push(campos.horaPrevista); }

  sets.push("atualizado_em = datetime('now')");
  valores.push(id);

  await db.execute(
    `update tarefas set ${sets.join(', ')} where id = ?`,
    valores
  );
}

export async function concluirTarefa(id) {
  const db = getDb();
  await db.execute(`
    update tarefas
    set status = 'concluida',
        data_conclusao = date('now'),
        atualizado_em = datetime('now')
    where id = ?
  `, [id]);
}

export async function reabrirTarefa(id) {
  const db = getDb();
  await db.execute(`
    update tarefas
    set status = 'pendente',
        data_conclusao = null,
        atualizado_em = datetime('now')
    where id = ?
  `, [id]);
}

export async function deletarTarefa(id) {
  const db = getDb();
  await db.execute('delete from tarefas where id = ?', [id]);
}

// busca com filtros combinados
export async function buscarTarefas({ texto, areaId, prioridade, status, dataInicio, dataFim }) {
  const db = getDb();

  const condicoes = ["t.status != 'cancelada'"];
  const params = [];

  if (texto) {
    condicoes.push("t.titulo like ?");
    params.push(`%${texto}%`);
  }
  if (areaId) {
    condicoes.push("t.area_id = ?");
    params.push(areaId);
  }
  if (prioridade) {
    condicoes.push("t.prioridade = ?");
    params.push(prioridade);
  }
  if (status) {
    condicoes.push("t.status = ?");
    params.push(status);
  }
  if (dataInicio && dataFim) {
    condicoes.push("(t.data_prevista between ? and ? or t.data_prevista is null)");
    params.push(dataInicio, dataFim);
  }

  const where = condicoes.length ? `where ${condicoes.join(' and ')}` : '';

  return db.select(`
    select t.*, a.nome as area_nome, a.cor as area_cor
    from tarefas t
    left join areas_de_vida a on t.area_id = a.id
    ${where}
    order by
      t.data_prevista asc nulls last,
      case t.prioridade
        when 'critica' then 1
        when 'alta'    then 2
        when 'media'   then 3
        when 'baixa'   then 4
      end,
      t.hora_prevista asc nulls last
  `, params);
}

// query para adiar tarefa
export async function adiarTarefa(id, novaData) {
  const db = getDb();
  await db.execute(`
    update tarefas
    set data_prevista = ?,
        status = case when status = 'concluida' then 'pendente' else status end,
        data_conclusao = null,
        atualizado_em = datetime('now')
    where id = ?
  `, [novaData, id]);
}
