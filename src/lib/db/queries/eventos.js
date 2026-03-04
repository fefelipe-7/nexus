// src/lib/db/queries/eventos.js

import { getDb } from '../client.js';

// retorna todos os eventos de um intervalo, incluindo tarefas com hora
export async function getEventosDoIntervalo(dataInicio, dataFim) {
    const db = getDb();

    // eventos reais
    const eventosReais = await db.select(`
    select
      e.id,
      e.titulo,
      e.descricao,
      e.local,
      e.inicio,
      e.fim,
      e.dia_inteiro,
      e.cor,
      e.tarefa_id,
      a.nome  as area_nome,
      a.cor   as area_cor,
      'evento' as tipo
    from eventos e
    left join areas_de_vida a on e.area_id = a.id
    where date(e.inicio) between ? and ?
    order by e.inicio asc
  `, [dataInicio, dataFim]);

    // tarefas com hora (viram eventos automaticamente)
    const tarefasComoEventos = await db.select(`
    select
      t.id,
      t.titulo,
      t.descricao,
      null          as local,
      (t.data_prevista || ' ' || t.hora_prevista) as inicio,
      null          as fim,
      0             as dia_inteiro,
      a.cor,
      null          as tarefa_id,
      a.nome        as area_nome,
      a.cor         as area_cor,
      'tarefa'      as tipo
    from tarefas t
    left join areas_de_vida a on t.area_id = a.id
    where t.data_prevista between ? and ?
    and t.hora_prevista is not null
    and t.hora_prevista != ''
    and t.status != 'cancelada'
    order by t.data_prevista asc, t.hora_prevista asc
  `, [dataInicio, dataFim]);

    // une e ordena por inicio
    return [...eventosReais, ...tarefasComoEventos]
        .sort((a, b) => a.inicio.localeCompare(b.inicio));
}

// retorna proximos eventos para o painel lateral (a partir de hoje)
export async function getProximosEventos(limite = 8) {
    const db = getDb();
    const hoje = new Date().toISOString().slice(0, 10);
    const em30dias = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
    return getEventosDoIntervalo(hoje, em30dias).then(lista => lista.slice(0, limite));
}

export async function criarEvento(evento) {
    const db = getDb();

    const areaId = evento.areaId && evento.areaId !== 'null'
        ? Number(evento.areaId)
        : null;

    const result = await db.execute(`
    insert into eventos (titulo, descricao, local, inicio, fim, dia_inteiro, area_id, cor)
    values (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
        evento.titulo,
        evento.descricao ?? null,
        evento.local ?? null,
        evento.inicio,
        evento.fim ?? null,
        evento.diaInteiro ? 1 : 0,
        areaId,
        evento.cor ?? null,
    ]);

    return result.lastInsertId;
}

export async function atualizarEvento(id, campos) {
    const db = getDb();
    const sets = [];
    const valores = [];

    if (campos.titulo !== undefined) { sets.push('titulo = ?'); valores.push(campos.titulo); }
    if (campos.descricao !== undefined) { sets.push('descricao = ?'); valores.push(campos.descricao); }
    if (campos.local !== undefined) { sets.push('local = ?'); valores.push(campos.local); }
    if (campos.inicio !== undefined) { sets.push('inicio = ?'); valores.push(campos.inicio); }
    if (campos.fim !== undefined) { sets.push('fim = ?'); valores.push(campos.fim); }
    if (campos.diaInteiro !== undefined) { sets.push('dia_inteiro = ?'); valores.push(campos.diaInteiro ? 1 : 0); }
    if (campos.areaId !== undefined) {
        const areaIdSanitizado = campos.areaId && campos.areaId !== 'null' ? Number(campos.areaId) : null;
        sets.push('area_id = ?');
        valores.push(areaIdSanitizado);
    }

    sets.push("atualizado_em = datetime('now')");
    valores.push(id);

    await db.execute(
        `update eventos set ${sets.join(', ')} where id = ?`,
        valores
    );
}

export async function deletarEvento(id) {
    const db = getDb();
    await db.execute('delete from eventos where id = ?', [id]);
}
