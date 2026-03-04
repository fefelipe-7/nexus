// src/lib/db/queries/metas.js
import { getDb } from '../client.js';

// ── leitura ───────────────────────────────────────────────

// busca todas as metas ativas com contagem de tarefas vinculadas
export async function getMetas({ status = 'ativa', areaId = null, prazoTipo = null } = {}) {
    const db = getDb();
    const condicoes = ['m.status = ?'];
    const params = [status];

    if (areaId) { condicoes.push('m.area_id = ?'); params.push(areaId); }
    if (prazoTipo) { condicoes.push('m.prazo_tipo = ?'); params.push(prazoTipo); }

    return db.select(`
    select
      m.*,
      a.nome  as area_nome,
      a.cor   as area_cor,
      -- contagem de tarefas vinculadas
      count(t.id)                                              as tarefas_total,
      sum(case when t.status = 'concluida' then 1 else 0 end) as tarefas_concluidas,
      -- progresso calculado para modo tarefas
      case
        when m.modo_progresso = 'tarefas' and count(t.id) > 0
        then round(cast(sum(case when t.status = 'concluida' then 1 else 0 end) as real) / count(t.id) * 100)
        else null
      end as progresso_tarefas_pct,
      -- dias restantes
      case
        when m.data_fim is not null
        then cast(julianday(m.data_fim) - julianday(date('now')) as integer)
        else null
      end as dias_restantes
    from metas m
    left join areas_de_vida a on m.area_id = a.id
    left join tarefas t on t.meta_id = m.id and t.status != 'cancelada'
    where ${condicoes.join(' and ')}
    group by m.id
    order by
      case when m.data_fim is null then 1 else 0 end,  -- metas com prazo primeiro
      m.data_fim asc,
      m.criado_em desc
  `, params);
}

// busca uma meta com suas submetas (1 nivel de profundidade)
export async function getMetaComSubmetas(id) {
    const db = getDb();

    const [meta] = await db.select(`
    select m.*, a.nome as area_nome, a.cor as area_cor
    from metas m
    left join areas_de_vida a on m.area_id = a.id
    where m.id = ?
  `, [id]);

    if (!meta) return null;

    meta.submetas = await db.select(`
    select m.*, a.nome as area_nome, a.cor as area_cor,
      count(t.id) as tarefas_total,
      sum(case when t.status = 'concluida' then 1 else 0 end) as tarefas_concluidas
    from metas m
    left join areas_de_vida a on m.area_id = a.id
    left join tarefas t on t.meta_id = m.id and t.status != 'cancelada'
    where m.meta_pai_id = ?
    group by m.id
    order by m.criado_em asc
  `, [id]);

    return meta;
}

// busca metas para o seletor ao vincular uma tarefa
export async function getMetasParaVinculo() {
    const db = getDb();
    return db.select(`
    select m.id, m.titulo, m.prazo_tipo, a.cor as area_cor
    from metas m
    left join areas_de_vida a on m.area_id = a.id
    where m.status = 'ativa'
    order by m.data_fim asc nulls last, m.criado_em desc
  `);
}

// ── escrita ───────────────────────────────────────────────

export async function criarMeta(meta) {
    const db = getDb();

    const areaId = sanitizarId(meta.areaId);
    const metaPaiId = sanitizarId(meta.metaPaiId);

    const result = await db.execute(`
    insert into metas (
      titulo, descricao, meta_pai_id, area_id,
      prazo_tipo, data_inicio, data_fim,
      modo_progresso, valor_alvo, unidade
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
        meta.titulo,
        meta.descricao ?? null,
        metaPaiId,
        areaId,
        meta.prazoTipo ?? null,
        meta.dataInicio ?? null,
        meta.dataFim ?? null,
        meta.modoProgresso ?? 'tarefas',
        meta.valorAlvo ?? null,
        meta.unidade ?? null,
    ]);

    return result.lastInsertId;
}

export async function atualizarMeta(id, campos) {
    const db = getDb();
    const sets = [];
    const valores = [];

    const mapa = {
        titulo: 'titulo',
        descricao: 'descricao',
        prazoTipo: 'prazo_tipo',
        dataInicio: 'data_inicio',
        dataFim: 'data_fim',
        valorAlvo: 'valor_alvo',
        valorAtual: 'valor_atual',
        unidade: 'unidade',
        percentualAtual: 'percentual_atual',
        binarioConcluido: 'binario_concluido',
        status: 'status',
    };

    for (const [chaveJs, colunaSql] of Object.entries(mapa)) {
        if (campos[chaveJs] !== undefined) {
            sets.push(`${colunaSql} = ?`);
            valores.push(campos[chaveJs]);
        }
    }

    if (campos.areaId !== undefined) {
        sets.push('area_id = ?');
        valores.push(sanitizarId(campos.areaId));
    }

    if (campos.metaPaiId !== undefined) {
        sets.push('meta_pai_id = ?');
        valores.push(sanitizarId(campos.metaPaiId));
    }

    sets.push("atualizado_em = datetime('now')");
    valores.push(id);

    await db.execute(
        `update metas set ${sets.join(', ')} where id = ?`,
        valores
    );
}

// atualiza o progresso de uma meta automaticamente quando uma tarefa e concluida
// chamado internamente apos concluirTarefa quando a tarefa tem meta_id
export async function recalcularProgressoMeta(metaId) {
    const db = getDb();

    const [meta] = await db.select(
        'select modo_progresso from metas where id = ?', [metaId]
    );

    if (!meta || meta.modo_progresso !== 'tarefas') return;

    // o progresso no modo 'tarefas' e calculado nas queries de leitura
    // nao precisa atualizar o banco — e sempre calculado em tempo real
    // mas atualiza o atualizado_em para sinalizar que houve mudanca
    await db.execute(
        `update metas set atualizado_em = datetime('now') where id = ?`,
        [metaId]
    );
}

export async function deletarMeta(id) {
    const db = getDb();
    // submetas tem meta_pai_id setado para null pelo on delete set null
    // tarefas vinculadas tem meta_id setado para null
    await db.execute('delete from metas where id = ?', [id]);
}

// helper
function sanitizarId(valor) {
    if (!valor || valor === 'null') return null;
    const n = Number(valor);
    return isNaN(n) ? null : n;
}
