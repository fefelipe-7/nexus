// src/lib/db/queries/habitos.js
import { getDb } from '../client.js';
import { hoje } from '$lib/utils/dates.js';
import { calcularStreakLocal } from '$lib/utils/streak.js';

// ── leitura ───────────────────────────────────────────────

// busca todos os habitos ativos com status do dia de hoje
export async function getHabitosComStatusHoje() {
    const db = getDb();
    const h = hoje();

    return db.select(`
    select
      hab.*,
      a.nome as area_nome,
      a.cor  as area_cor,
      -- check-in de hoje
      rh.concluido as concluido_hoje,
      rh.id        as registro_hoje_id,
      -- contagem de check-ins no periodo atual (para frequencias nao-diarias)
      (
        select count(*) from registros_habitos rh2
        where rh2.habito_id = hab.id
        and rh2.concluido = 1
        and rh2.data between ? and ?
      ) as checkins_periodo
    from habitos hab
    left join areas_de_vida a on hab.area_id = a.id
    left join registros_habitos rh
      on rh.habito_id = hab.id and rh.data = ?
    where hab.ativo = 1
    order by
      -- habitos diarios primeiro, depois por area
      case hab.frequencia_tipo
        when 'diaria'      then 1
        when 'semanal'     then 2
        when 'mensal'      then 3
        when 'trimestral'  then 4
        when 'semestral'   then 5
        when 'anual'       then 6
      end,
      a.ordem asc
  `, [h, h, h]); // os dois primeiros ? sao inicio/fim do dia atual (simplificado)
}

// busca habitos com seus registros para um periodo (para o modulo completo)
export async function getHabitosComRegistros(dataInicio, dataFim) {
    const db = getDb();

    const habitos = await db.select(`
    select hab.*, a.nome as area_nome, a.cor as area_cor
    from habitos hab
    left join areas_de_vida a on hab.area_id = a.id
    where hab.ativo = 1
    order by hab.criado_em asc
  `);

    // busca registros do periodo para todos os habitos
    const registros = await db.select(`
    select * from registros_habitos
    where data between ? and ?
    order by data asc
  `, [dataInicio, dataFim]);

    // mapeia registros por habito
    const registrosPorHabito = registros.reduce((acc, r) => {
        if (!acc[r.habito_id]) acc[r.habito_id] = {};
        acc[r.habito_id][r.data] = r;
        return acc;
    }, {});

    return habitos.map(h => ({
        ...h,
        registros: registrosPorHabito[h.id] ?? {},
    }));
}

// calcula o streak atual de um habito
export async function calcularStreak(habitoId) {
    const db = getDb();
    const h = hoje();

    const [habito] = await db.select(
        'select frequencia_tipo, frequencia_alvo, graca_ativa from habitos where id = ?',
        [habitoId]
    );

    if (!habito) return 0;

    // busca os ultimos 365 registros
    const registros = await db.select(`
    select data, concluido from registros_habitos
    where habito_id = ? and data <= ?
    order by data desc
    limit 365
  `, [habitoId, h]);

    return calcularStreakLocal(habito, registros, h);
}

// ── escrita ───────────────────────────────────────────────

export async function criarHabito(habito) {
    const db = getDb();

    const areaId = sanitizarId(habito.areaId);

    const result = await db.execute(`
    insert into habitos (nome, descricao, icone, area_id, frequencia_tipo, frequencia_alvo, graca_ativa)
    values (?, ?, ?, ?, ?, ?, ?)
  `, [
        habito.nome,
        habito.descricao ?? null,
        habito.icone ?? null,
        areaId,
        habito.frequenciaTipo ?? 'diaria',
        habito.frequenciaAlvo ?? 1,
        habito.gracaAtiva !== false ? 1 : 0,
    ]);

    return result.lastInsertId;
}

export async function registrarCheckin(habitoId, data, concluido = true, nota = null) {
    const db = getDb();

    // insert or replace — se ja existe, atualiza
    await db.execute(`
    insert into registros_habitos (habito_id, data, concluido, nota)
    values (?, ?, ?, ?)
    on conflict(habito_id, data) do update set
      concluido = excluded.concluido,
      nota = excluded.nota
  `, [habitoId, data, concluido ? 1 : 0, nota]);
}

export async function removerCheckin(habitoId, data) {
    const db = getDb();
    await db.execute(
        'delete from registros_habitos where habito_id = ? and data = ?',
        [habitoId, data]
    );
}

export async function atualizarHabito(id, campos) {
    const db = getDb();
    const sets = [];
    const valores = [];

    if (campos.nome !== undefined) { sets.push('nome = ?'); valores.push(campos.nome); }
    if (campos.descricao !== undefined) { sets.push('descricao = ?'); valores.push(campos.descricao); }
    if (campos.icone !== undefined) { sets.push('icone = ?'); valores.push(campos.icone); }
    if (campos.frequenciaTipo !== undefined) { sets.push('frequencia_tipo = ?'); valores.push(campos.frequenciaTipo); }
    if (campos.frequenciaAlvo !== undefined) { sets.push('frequencia_alvo = ?'); valores.push(campos.frequenciaAlvo); }
    if (campos.gracaAtiva !== undefined) { sets.push('graca_ativa = ?'); valores.push(campos.gracaAtiva ? 1 : 0); }
    if (campos.ativo !== undefined) { sets.push('ativo = ?'); valores.push(campos.ativo ? 1 : 0); }

    if (campos.areaId !== undefined) {
        sets.push('area_id = ?');
        valores.push(sanitizarId(campos.areaId));
    }

    sets.push("atualizado_em = datetime('now')");
    valores.push(id);

    await db.execute(`update habitos set ${sets.join(', ')} where id = ?`, valores);
}

export async function deletarHabito(id) {
    const db = getDb();
    // registros sao deletados em cascata pelo on delete cascade
    await db.execute('delete from habitos where id = ?', [id]);
}

function sanitizarId(valor) {
    if (!valor || valor === 'null') return null;
    const n = Number(valor);
    return isNaN(n) ? null : n;
}
