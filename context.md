# nexus — fase 5: metas e habitos

documento de referencia completo para construcao da fase 5 do app nexus.
este arquivo assume que as fases 1 a 4 foram concluidas e todos os seus criterios foram atendidos.

---

## objetivo da fase 5

esta fase marca a virada estrategica do nexus. ate aqui o app gerenciava o que voce tem para fazer. a partir daqui ele comeca a orientar para onde voce esta indo.

duas entregas interdependentes:

1. **modulo de metas** — hierarquia temporal, submetas, multiplos modos de progresso, vinculacao automatica com tarefas
2. **modulo de habitos** — frequencia configuravel, streak com logica de graca, vinculacao com areas de vida

ao final da fase 5, o bloco diretivo do dashboard finalmente fala sobre o que realmente importa: nao so o que voce tem para fazer hoje, mas se voce esta no caminho certo para o que quer alcançar.

---

## convencoes — lembrete obrigatorio

as mesmas de sempre. nao mudam nunca:

- **todo texto visivel ao usuario em letras minusculas, sem excecao**
- nada hard-coded nos componentes — tudo via variaveis css
- sql em snake_case, js/svelte em camelCase

---

## decisoes de design — metas

### modos de progresso

uma meta pode usar um dos quatro modos abaixo. o modo e escolhido na criacao e nao muda depois (para nao corromper o historico):

| modo | descricao | exemplo |
|---|---|---|
| `numerico` | valor atual vs valor alvo, qualquer unidade | "ler 12 livros — 4/12" |
| `percentual` | porcentagem de 0 a 100 | "conclusao do curso — 65%" |
| `binario` | feito ou nao feito | "lancar o app — nao" |
| `tarefas` | progresso calculado automaticamente pelas tarefas vinculadas | "sprint de março — 8/15 tarefas" |

no modo `tarefas`, o progresso e somente leitura — calculado em tempo real. nos outros modos, o usuario atualiza manualmente. em todos os modos, tarefas podem ser vinculadas — a diferenca e que so no modo `tarefas` elas afetam o numero.

### hierarquia de metas

metas podem ter submetas, que por sua vez podem ter suas proprias submetas. nao ha limite de profundidade no schema, mas a interface mostra no maximo 3 niveis para nao virar uma arvore ilegivel.

regras de propagacao:
- quando uma submeta e concluida, o pai nao e concluido automaticamente — o usuario decide
- quando todas as submetas de uma meta estao concluidas, o sistema sugere concluir a meta pai (notificacao suave no bloco diretivo, nao popup)
- o progresso do pai nao e calculado como media das submetas — cada meta tem seu proprio progresso independente

### prazos

- metas com prazo tem um `prazo_tipo` (semana, mes, trimestre, semestre, ano) E uma `data_fim` calculada automaticamente
- metas abertas tem `prazo_tipo = null` e `data_fim = null`
- o sistema calcula automaticamente `dias_restantes` e `percentual_tempo_decorrido` para exibicao

---

## decisoes de design — habitos

### frequencia

| tipo | descricao | exemplo |
|---|---|---|
| `diaria` | precisa ser feito todo dia | "meditar" |
| `semanal` | X vezes por semana | "academia 3x por semana" |
| `mensal` | X vezes por mes | "revisar financas 2x por mes" |
| `trimestral` | X vezes por trimestre | "consulta medica 1x por trimestre" |
| `semestral` | X vezes por semestre | "exame de sangue 1x por semestre" |
| `anual` | X vezes por ano | "viagem 2x por ano" |

todos os tipos tem um `frequencia_alvo` (inteiro). para diaria, o alvo e sempre 1. para os outros, o usuario define o numero.

### logica de streak e graca

**streak** = quantos periodos consecutivos o habito foi cumprido no alvo.

o periodo depende do tipo de frequencia:
- diaria → periodo = dia
- semanal → periodo = semana
- mensal → periodo = mes
- trimestral → periodo = trimestre
- semestral → periodo = semestre
- anual → periodo = ano

**regra de graca:** aplicada somente a habitos diarios e semanais (os mais sensiveis a falhas pontuais):
- **diario:** pode pular 1 dia por semana sem quebrar o streak. se pular 2 dias ou mais na mesma semana, o streak quebra
- **semanal:** pode nao cumprir o alvo em 1 semana a cada 4 semanas sem quebrar. se falhar 2 semanas seguidas, quebra
- **mensal e acima:** sem graca — se nao cumprir no periodo, o streak quebra

**streak congelado:** quando o periodo atual ainda nao terminou e o alvo ainda nao foi atingido, o streak e exibido como "em andamento" (nao quebrado ainda). so quebra quando o periodo fecha sem o alvo ter sido cumprido.

---

## schema — fase 5

### migration_005_metas

```sql
create table if not exists metas (
  id                  integer primary key autoincrement,

  -- conteudo
  titulo              text    not null,
  descricao           text,

  -- hierarquia
  meta_pai_id         integer references metas(id) on delete set null,

  -- classificacao
  area_id             integer references areas_de_vida(id) on delete set null,

  -- prazo (null = meta aberta)
  prazo_tipo          text    check(prazo_tipo in ('semana','mes','trimestre','semestre','ano') or prazo_tipo is null),
  data_inicio         text,   -- ISO 'YYYY-MM-DD'
  data_fim            text,   -- ISO 'YYYY-MM-DD', calculada automaticamente do prazo_tipo

  -- modo de progresso
  modo_progresso      text    not null default 'tarefas'
                      check(modo_progresso in ('numerico','percentual','binario','tarefas')),

  -- progresso (usado em modo numerico)
  valor_alvo          real,
  valor_atual         real    not null default 0,
  unidade             text,   -- 'livros', 'km', 'horas', etc — livre

  -- progresso percentual (usado em modo percentual)
  percentual_atual    real    not null default 0
                      check(percentual_atual between 0 and 100),

  -- progresso binario (usado em modo binario)
  binario_concluido   integer not null default 0,

  -- status
  status              text    not null default 'ativa'
                      check(status in ('ativa','concluida','abandonada','pausada')),

  -- metadados
  criado_em           text    not null default (datetime('now')),
  atualizado_em       text    not null default (datetime('now'))
);

create index if not exists idx_metas_pai        on metas(meta_pai_id);
create index if not exists idx_metas_area       on metas(area_id);
create index if not exists idx_metas_status     on metas(status);
create index if not exists idx_metas_prazo_tipo on metas(prazo_tipo);
create index if not exists idx_metas_data_fim   on metas(data_fim);
```

### migration_006_habitos

```sql
create table if not exists habitos (
  id               integer primary key autoincrement,

  -- conteudo
  nome             text    not null,
  descricao        text,
  icone            text,   -- emoji ou nome de icone

  -- classificacao
  area_id          integer references areas_de_vida(id) on delete set null,

  -- frequencia
  frequencia_tipo  text    not null default 'diaria'
                   check(frequencia_tipo in ('diaria','semanal','mensal','trimestral','semestral','anual')),
  frequencia_alvo  integer not null default 1
                   check(frequencia_alvo >= 1),

  -- graca (aplica somente a diaria e semanal)
  graca_ativa      integer not null default 1,

  -- status
  ativo            integer not null default 1,

  -- metadados
  criado_em        text    not null default (datetime('now')),
  atualizado_em    text    not null default (datetime('now'))
);

-- registros de check-in dos habitos
create table if not exists registros_habitos (
  id          integer primary key autoincrement,
  habito_id   integer not null references habitos(id) on delete cascade,
  data        text    not null,  -- ISO 'YYYY-MM-DD'
  concluido   integer not null default 1,
  nota        text,              -- observacao opcional do check-in
  criado_em   text    not null default (datetime('now')),
  unique(habito_id, data)        -- um registro por habito por dia
);

create index if not exists idx_habitos_area          on habitos(area_id);
create index if not exists idx_registros_habito      on registros_habitos(habito_id);
create index if not exists idx_registros_data        on registros_habitos(data);
create index if not exists idx_registros_habito_data on registros_habitos(habito_id, data);
```

### migration_007_tarefas_metas (vinculacao)

a tabela `tarefas` ja tem a coluna `meta_id` desde a fase 2 (criada como null).
nesta fase ela passa a ser usada de verdade. nenhuma migration de schema necessaria — apenas garantir que as queries a utilizam.

### adicionar ao migrations.js

```javascript
// adicionar as chamadas em runMigrations():
await migration_005_metas(db);
await migration_006_habitos(db);

// implementar as funcoes:
async function migration_005_metas(db) {
  await db.execute(`
    create table if not exists metas (
      id                integer primary key autoincrement,
      titulo            text    not null,
      descricao         text,
      meta_pai_id       integer references metas(id) on delete set null,
      area_id           integer references areas_de_vida(id) on delete set null,
      prazo_tipo        text    check(prazo_tipo in ('semana','mes','trimestre','semestre','ano') or prazo_tipo is null),
      data_inicio       text,
      data_fim          text,
      modo_progresso    text    not null default 'tarefas'
                        check(modo_progresso in ('numerico','percentual','binario','tarefas')),
      valor_alvo        real,
      valor_atual       real    not null default 0,
      unidade           text,
      percentual_atual  real    not null default 0,
      binario_concluido integer not null default 0,
      status            text    not null default 'ativa'
                        check(status in ('ativa','concluida','abandonada','pausada')),
      criado_em         text    not null default (datetime('now')),
      atualizado_em     text    not null default (datetime('now'))
    )
  `);

  await db.execute(`create index if not exists idx_metas_pai        on metas(meta_pai_id)`);
  await db.execute(`create index if not exists idx_metas_area       on metas(area_id)`);
  await db.execute(`create index if not exists idx_metas_status     on metas(status)`);
  await db.execute(`create index if not exists idx_metas_prazo_tipo on metas(prazo_tipo)`);
  await db.execute(`create index if not exists idx_metas_data_fim   on metas(data_fim)`);
}

async function migration_006_habitos(db) {
  await db.execute(`
    create table if not exists habitos (
      id              integer primary key autoincrement,
      nome            text    not null,
      descricao       text,
      icone           text,
      area_id         integer references areas_de_vida(id) on delete set null,
      frequencia_tipo text    not null default 'diaria'
                      check(frequencia_tipo in ('diaria','semanal','mensal','trimestral','semestral','anual')),
      frequencia_alvo integer not null default 1,
      graca_ativa     integer not null default 1,
      ativo           integer not null default 1,
      criado_em       text    not null default (datetime('now')),
      atualizado_em   text    not null default (datetime('now'))
    )
  `);

  await db.execute(`
    create table if not exists registros_habitos (
      id        integer primary key autoincrement,
      habito_id integer not null references habitos(id) on delete cascade,
      data      text    not null,
      concluido integer not null default 1,
      nota      text,
      criado_em text    not null default (datetime('now')),
      unique(habito_id, data)
    )
  `);

  await db.execute(`create index if not exists idx_habitos_area          on habitos(area_id)`);
  await db.execute(`create index if not exists idx_registros_habito      on registros_habitos(habito_id)`);
  await db.execute(`create index if not exists idx_registros_data        on registros_habitos(data)`);
  await db.execute(`create index if not exists idx_registros_habito_data on registros_habitos(habito_id, data)`);
}
```

---

## queries — metas

```javascript
// src/lib/db/queries/metas.js
import { getDb } from '../client.js';

// ── leitura ───────────────────────────────────────────────

// busca todas as metas ativas com contagem de tarefas vinculadas
export async function getMetas({ status = 'ativa', areaId = null, prazoTipo = null } = {}) {
  const db = getDb();
  const condicoes = ['m.status = ?'];
  const params    = [status];

  if (areaId)    { condicoes.push('m.area_id = ?');    params.push(areaId); }
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

  const areaId    = sanitizarId(meta.areaId);
  const metaPaiId = sanitizarId(meta.metaPaiId);

  const result = await db.execute(`
    insert into metas (
      titulo, descricao, meta_pai_id, area_id,
      prazo_tipo, data_inicio, data_fim,
      modo_progresso, valor_alvo, unidade
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    meta.titulo,
    meta.descricao   ?? null,
    metaPaiId,
    areaId,
    meta.prazoTipo   ?? null,
    meta.dataInicio  ?? null,
    meta.dataFim     ?? null,
    meta.modoProgresso ?? 'tarefas',
    meta.valorAlvo   ?? null,
    meta.unidade     ?? null,
  ]);

  return result.lastInsertId;
}

export async function atualizarMeta(id, campos) {
  const db = getDb();
  const sets    = [];
  const valores = [];

  const mapa = {
    titulo:           'titulo',
    descricao:        'descricao',
    prazoTipo:        'prazo_tipo',
    dataInicio:       'data_inicio',
    dataFim:          'data_fim',
    valorAlvo:        'valor_alvo',
    valorAtual:       'valor_atual',
    unidade:          'unidade',
    percentualAtual:  'percentual_atual',
    binarioConcluido: 'binario_concluido',
    status:           'status',
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
```

---

## queries — habitos

```javascript
// src/lib/db/queries/habitos.js
import { getDb } from '../client.js';
import { hoje, getIntervalo } from '$lib/utils/dates.js';

// ── leitura ───────────────────────────────────────────────

// busca todos os habitos ativos com status do dia de hoje
export async function getHabitosComStatusHoje() {
  const db  = getDb();
  const h   = hoje();

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
  const db  = getDb();
  const h   = hoje();

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
    habito.descricao      ?? null,
    habito.icone          ?? null,
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
  const sets    = [];
  const valores = [];

  if (campos.nome           !== undefined) { sets.push('nome = ?');            valores.push(campos.nome); }
  if (campos.descricao      !== undefined) { sets.push('descricao = ?');       valores.push(campos.descricao); }
  if (campos.icone          !== undefined) { sets.push('icone = ?');           valores.push(campos.icone); }
  if (campos.frequenciaTipo !== undefined) { sets.push('frequencia_tipo = ?'); valores.push(campos.frequenciaTipo); }
  if (campos.frequenciaAlvo !== undefined) { sets.push('frequencia_alvo = ?'); valores.push(campos.frequenciaAlvo); }
  if (campos.gracaAtiva     !== undefined) { sets.push('graca_ativa = ?');     valores.push(campos.gracaAtiva ? 1 : 0); }
  if (campos.ativo          !== undefined) { sets.push('ativo = ?');           valores.push(campos.ativo ? 1 : 0); }

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
```

---

## logica de streak — utilitario

a logica de streak e complexa o suficiente para ter seu proprio arquivo.

```javascript
// src/lib/utils/streak.js

// calcula o streak dado o habito e seus registros ordenados por data desc
export function calcularStreakLocal(habito, registros, hoje) {
  const { frequencia_tipo, frequencia_alvo, graca_ativa } = habito;

  if (registros.length === 0) return 0;

  // para habitos diarios
  if (frequencia_tipo === 'diaria') {
    return calcularStreakDiario(registros, hoje, graca_ativa === 1);
  }

  // para habitos com periodo maior
  return calcularStreakPeriodico(frequencia_tipo, frequencia_alvo, registros, hoje, graca_ativa === 1);
}

function calcularStreakDiario(registros, hoje, comGraca) {
  // converte registros para um Set de datas concluidas
  const concluidos = new Set(
    registros.filter(r => r.concluido).map(r => r.data)
  );

  let streak        = 0;
  let falhasNaSemana = 0;
  let dataAtual     = parseISO(hoje);

  // verifica se hoje foi concluido ou ainda esta aberto
  const hojeConcluido = concluidos.has(hoje);
  const hojePassou    = new Date().getHours() >= 23; // considera dia fechado apos 23h

  if (!hojeConcluido && !hojePassou) {
    // dia atual ainda em andamento — nao conta como falha ainda
    dataAtual = addDias(dataAtual, -1);
  } else if (!hojeConcluido && hojePassou) {
    // dia passou e nao foi concluido
    if (!comGraca) return 0;
    falhasNaSemana++;
    if (falhasNaSemana > 1) return 0;
    dataAtual = addDias(dataAtual, -1);
  }

  // retroage dia a dia
  while (true) {
    const iso = toISO(dataAtual);

    // reseta falhas ao iniciar nova semana (domingo)
    if (dataAtual.getDay() === 0) falhasNaSemana = 0;

    if (concluidos.has(iso)) {
      streak++;
    } else {
      if (!comGraca || falhasNaSemana >= 1) break;
      falhasNaSemana++;
      streak++;
    }

    dataAtual = addDias(dataAtual, -1);

    // para de voltar apos 365 dias
    const diff = parseISO(hoje) - dataAtual;
    if (diff > 365 * 86400000) break;
  }

  return streak;
}

function calcularStreakPeriodico(tipo, alvo, registros, hoje, comGraca) {
  // agrupa check-ins por periodo
  const checkinsPorPeriodo = agruparPorPeriodo(registros, tipo);
  const periodos = Object.keys(checkinsPorPeriodo).sort().reverse();

  if (periodos.length === 0) return 0;

  let streak        = 0;
  let falhasPermitidas = comGraca && (tipo === 'semanal') ? 1 : 0;
  let falhasUsadas  = 0;

  const periodoAtual = getPeriodoAtual(tipo, hoje);

  for (const periodo of periodos) {
    const count = checkinsPorPeriodo[periodo];

    // periodo atual ainda aberto — nao conta como falha
    if (periodo === periodoAtual) {
      if (count >= alvo) streak++;
      // se nao atingiu ainda, continua mas nao adiciona ao streak
      continue;
    }

    if (count >= alvo) {
      streak++;
    } else {
      if (falhasUsadas < falhasPermitidas) {
        falhasUsadas++;
        // conta como graca mas nao incrementa streak
      } else {
        break;
      }
    }
  }

  return streak;
}

function agruparPorPeriodo(registros, tipo) {
  const mapa = {};
  for (const r of registros) {
    if (!r.concluido) continue;
    const chave = getPeriodoDaData(tipo, r.data);
    mapa[chave] = (mapa[chave] ?? 0) + 1;
  }
  return mapa;
}

function getPeriodoDaData(tipo, iso) {
  const [ano, mes, dia] = iso.split('-').map(Number);

  switch (tipo) {
    case 'semanal': {
      const d = new Date(ano, mes - 1, dia);
      const domingo = new Date(d);
      domingo.setDate(d.getDate() - d.getDay());
      return toISO(domingo); // inicio da semana como chave
    }
    case 'mensal':      return `${ano}-${String(mes).padStart(2,'0')}`;
    case 'trimestral':  return `${ano}-T${Math.ceil(mes/3)}`;
    case 'semestral':   return `${ano}-S${mes <= 6 ? 1 : 2}`;
    case 'anual':       return `${ano}`;
    default:            return iso;
  }
}

function getPeriodoAtual(tipo, hoje) {
  return getPeriodoDaData(tipo, hoje);
}

// helpers de data
function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDias(date, dias) {
  const d = new Date(date);
  d.setDate(d.getDate() + dias);
  return d;
}

function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
```

---

## atualizar queries de tarefas — vincular a meta

adicionar em `src/lib/db/queries/tarefas.js`:

```javascript
// versao atualizada de concluirTarefa que dispara recalculo da meta
export async function concluirTarefa(id) {
  const db = getDb();

  // busca meta_id antes de concluir
  const [tarefa] = await db.select('select meta_id from tarefas where id = ?', [id]);

  await db.execute(`
    update tarefas
    set status = 'concluida',
        data_conclusao = date('now'),
        atualizado_em  = datetime('now')
    where id = ?
  `, [id]);

  // dispara recalculo se tinha meta vinculada
  if (tarefa?.meta_id) {
    const { recalcularProgressoMeta } = await import('./metas.js');
    await recalcularProgressoMeta(tarefa.meta_id);
  }
}

// busca tarefas vinculadas a uma meta especifica
export async function getTarefasDaMeta(metaId) {
  const db = getDb();
  return db.select(`
    select t.*, a.nome as area_nome, a.cor as area_cor
    from tarefas t
    left join areas_de_vida a on t.area_id = a.id
    where t.meta_id = ?
    and t.status != 'cancelada'
    order by
      case t.status when 'concluida' then 1 else 0 end,
      t.data_prevista asc nulls last
  `, [metaId]);
}
```

---

## stores

### src/lib/stores/metas.js

```javascript
import { writable } from 'svelte/store';
import { getMetas, getMetaComSubmetas } from '$lib/db/queries/metas.js';

export const metas         = writable([]);
export const metaAtiva     = writable(null); // meta aberta no detalhe
export const carregandoMetas = writable(false);

export async function carregarMetas(filtros = {}) {
  carregandoMetas.set(true);
  try {
    const lista = await getMetas(filtros);
    metas.set(lista);
  } finally {
    carregandoMetas.set(false);
  }
}

export async function abrirMeta(id) {
  const meta = await getMetaComSubmetas(id);
  metaAtiva.set(meta);
}
```

### src/lib/stores/habitos.js

```javascript
import { writable } from 'svelte/store';
import { getHabitosComStatusHoje, getHabitosComRegistros, calcularStreak } from '$lib/db/queries/habitos.js';
import { hoje, getIntervalo } from '$lib/utils/dates.js';

export const habitos           = writable([]);
export const streaks           = writable({}); // { habitoId: numero }
export const carregandoHabitos = writable(false);

export async function carregarHabitosHoje() {
  carregandoHabitos.set(true);
  try {
    const lista = await getHabitosComStatusHoje();
    habitos.set(lista);
    await atualizarStreaks(lista.map(h => h.id));
  } finally {
    carregandoHabitos.set(false);
  }
}

export async function carregarHabitosComRegistros(dataInicio, dataFim) {
  carregandoHabitos.set(true);
  try {
    const lista = await getHabitosComRegistros(dataInicio, dataFim);
    habitos.set(lista);
    await atualizarStreaks(lista.map(h => h.id));
  } finally {
    carregandoHabitos.set(false);
  }
}

async function atualizarStreaks(ids) {
  const mapa = {};
  await Promise.all(ids.map(async id => {
    mapa[id] = await calcularStreak(id);
  }));
  streaks.set(mapa);
}
```

---

## atualizar ui.js

```javascript
// src/lib/stores/ui.js — versao fase 5
import { writable } from 'svelte/store';

export const sidebarCollapsed = writable(false);
export const activeModal      = writable(null);
// 'novaTarefa' | 'editarTarefa' | 'novoEvento' | 'editarEvento'
// 'novaMeta'   | 'editarMeta'   | 'novoHabito' | 'editarHabito'

export const tarefaEditando   = writable(null);
export const eventoEditando   = writable(null);
export const metaEditando     = writable(null); // novo
export const habitoEditando   = writable(null); // novo
export const painelVisivel    = writable(true);
```

---

## componentes — metas

### src/routes/Metas.svelte

```svelte
<!-- src/routes/Metas.svelte -->
<script>
  import { onMount } from 'svelte';
  import { metas, carregandoMetas, carregarMetas, abrirMeta, metaAtiva } from '$lib/stores/metas.js';
  import { activeModal, metaEditando } from '$lib/stores/ui.js';
  import { areas } from '$lib/stores/areas.js';

  import CardMeta from '$lib/components/metas/CardMeta.svelte';
  import ModalMeta from '$lib/components/metas/ModalMeta.svelte';
  import DetalheMeta from '$lib/components/metas/DetalheMeta.svelte';
  import FiltrosMetas from '$lib/components/metas/FiltrosMetas.svelte';

  let filtroStatus    = 'ativa';
  let filtroArea      = null;
  let filtroPrazo     = null;

  onMount(() => carregarMetas());

  $: carregarMetas({ status: filtroStatus, areaId: filtroArea, prazoTipo: filtroPrazo });

  // agrupa metas por prazo_tipo para exibicao
  $: grupos = agruparPorPrazo($metas);

  function agruparPorPrazo(lista) {
    const ordem = ['semana', 'mes', 'trimestre', 'semestre', 'ano', null];
    const mapa  = {};
    for (const m of lista) {
      const chave = m.prazo_tipo ?? 'abertas';
      if (!mapa[chave]) mapa[chave] = [];
      mapa[chave].push(m);
    }
    return ordem
      .map(tipo => ({ tipo: tipo ?? 'abertas', itens: mapa[tipo ?? 'abertas'] ?? [] }))
      .filter(g => g.itens.length > 0);
  }

  const LABEL_PRAZO = {
    semana:    'esta semana',
    mes:       'este mes',
    trimestre: 'este trimestre',
    semestre:  'este semestre',
    ano:       'este ano',
    abertas:   'sem prazo definido',
  };
</script>

<div class="page">
  <header class="page-header">
    <div class="page-title">
      <h1>metas</h1>
      <span class="badge-contador">{$metas.filter(m => m.status === 'ativa').length} ativas</span>
    </div>
    <button class="btn-primary" on:click={() => activeModal.set('novaMeta')}>
      + nova meta
    </button>
  </header>

  <FiltrosMetas
    bind:status={filtroStatus}
    bind:area={filtroArea}
    bind:prazo={filtroPrazo}
  />

  {#if $carregandoMetas}
    <div class="estado-loading">carregando metas...</div>

  {:else if $metas.length === 0}
    <div class="estado-vazio">
      <span class="vazio-icone">◎</span>
      <p>nenhuma meta encontrada</p>
      <button class="btn-ghost" on:click={() => activeModal.set('novaMeta')}>
        + criar primeira meta
      </button>
    </div>

  {:else}
    {#each grupos as grupo}
      <section class="grupo-metas">
        <div class="grupo-header">
          <span class="grupo-titulo">{LABEL_PRAZO[grupo.tipo]}</span>
          <span class="grupo-contador">{grupo.itens.length}</span>
        </div>
        <div class="metas-grid">
          {#each grupo.itens as meta (meta.id)}
            <CardMeta
              {meta}
              on:abrir={() => abrirMeta(meta.id)}
              on:editar={() => { metaEditando.set(meta); activeModal.set('editarMeta'); }}
              on:atualizar={() => carregarMetas({ status: filtroStatus })}
            />
          {/each}
        </div>
      </section>
    {/each}
  {/if}
</div>

{#if $metaAtiva}
  <DetalheMeta
    meta={$metaAtiva}
    on:fechar={() => metaAtiva.set(null)}
    on:atualizar={() => { carregarMetas(); abrirMeta($metaAtiva.id); }}
  />
{/if}

{#if $activeModal === 'novaMeta' || $activeModal === 'editarMeta'}
  <ModalMeta
    on:fechar={() => activeModal.set(null)}
    on:salvo={() => carregarMetas({ status: filtroStatus })}
  />
{/if}

<style>
  .page {
    padding: var(--space-8) var(--coluna-padding);
    min-height: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .page-title {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  h1 {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 600;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .badge-contador {
    background: var(--bg-active);
    color: var(--text-secondary);
    font-size: var(--text-xs);
    font-weight: 600;
    padding: 3px 8px;
    border-radius: var(--radius-full);
  }

  .btn-primary {
    background: var(--text-primary); color: var(--bg);
    border: none; border-radius: var(--radius-md);
    padding: 8px 14px; font-size: var(--text-sm);
    font-family: var(--font-body); font-weight: 500;
    cursor: pointer; transition: opacity var(--transition-fast);
  }
  .btn-primary:hover { opacity: 0.85; }

  .grupo-metas { display: flex; flex-direction: column; gap: var(--space-3); }

  .grupo-header {
    display: flex; align-items: center; gap: var(--space-2);
    padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--border);
  }

  .grupo-titulo {
    font-size: var(--text-sm); font-weight: 600; color: var(--text-primary);
  }

  .grupo-contador {
    font-size: var(--text-xs); color: var(--text-muted);
  }

  .metas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-4);
  }

  .estado-loading, .estado-vazio {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: var(--space-3);
    padding: var(--space-12) 0;
    color: var(--text-muted); font-size: var(--text-sm);
  }

  .vazio-icone { font-size: 28px; opacity: 0.25; }

  .btn-ghost {
    background: none; border: 1px solid var(--border);
    color: var(--text-secondary); border-radius: var(--radius-md);
    padding: 7px 14px; font-size: var(--text-sm);
    font-family: var(--font-body); cursor: pointer;
    transition: all var(--transition-fast); margin-top: var(--space-2);
  }
  .btn-ghost:hover { background: var(--bg-hover); }
</style>
```

### src/lib/components/metas/CardMeta.svelte

```svelte
<!-- src/lib/components/metas/CardMeta.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';

  export let meta;

  const dispatch = createEventDispatcher();

  // calcula o progresso para exibicao dependendo do modo
  $: progresso = calcularProgresso(meta);
  $: urgente   = meta.dias_restantes !== null && meta.dias_restantes <= 7 && meta.status === 'ativa';
  $: atrasada  = meta.dias_restantes !== null && meta.dias_restantes < 0  && meta.status === 'ativa';

  function calcularProgresso(m) {
    switch (m.modo_progresso) {
      case 'tarefas':
        return { pct: m.progresso_tarefas_pct ?? 0, label: `${m.tarefas_concluidas ?? 0}/${m.tarefas_total ?? 0} tarefas` };
      case 'numerico':
        const pct = m.valor_alvo ? Math.min(Math.round((m.valor_atual / m.valor_alvo) * 100), 100) : 0;
        return { pct, label: `${m.valor_atual} / ${m.valor_alvo} ${m.unidade ?? ''}`.trim() };
      case 'percentual':
        return { pct: m.percentual_atual, label: `${m.percentual_atual}%` };
      case 'binario':
        return { pct: m.binario_concluido ? 100 : 0, label: m.binario_concluido ? 'concluida' : 'em andamento' };
      default:
        return { pct: 0, label: '' };
    }
  }
</script>

<div
  class="card-meta"
  class:urgente
  class:atrasada
  class:concluida={meta.status === 'concluida'}
  on:click={() => dispatch('abrir')}
  on:keydown={() => {}}
  role="button"
  tabindex="0"
>
  <!-- linha superior: area + prazo -->
  <div class="meta-topo">
    {#if meta.area_nome}
      <span class="meta-area" style="color: {meta.area_cor}">{meta.area_nome}</span>
    {/if}
    <span class="meta-prazo" class:urgente class:atrasada>
      {#if meta.prazo_tipo}
        {meta.dias_restantes !== null
          ? (meta.dias_restantes < 0
              ? `${Math.abs(meta.dias_restantes)}d atrasada`
              : meta.dias_restantes === 0
                ? 'vence hoje'
                : `${meta.dias_restantes}d restantes`)
          : meta.prazo_tipo}
      {:else}
        sem prazo
      {/if}
    </span>
  </div>

  <!-- titulo -->
  <h3 class="meta-titulo">{meta.titulo}</h3>

  <!-- barra de progresso -->
  <div class="progresso-wrapper">
    <div class="progresso-barra">
      <div
        class="progresso-fill"
        style="width: {progresso.pct}%; background: {meta.area_cor ?? 'var(--accent)'}"
      />
    </div>
    <span class="progresso-label">{progresso.label}</span>
  </div>

  <!-- submetas (se houver) -->
  {#if meta.tem_submetas}
    <div class="meta-submetas-hint">
      <span>▸ tem submetas</span>
    </div>
  {/if}
</div>

<style>
  .card-meta {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: var(--space-4) var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  .card-meta:hover { border-color: var(--border-strong); box-shadow: var(--shadow-sm); }
  .card-meta.urgente  { border-color: #fde8cc; background: #fff8f0; }
  .card-meta.atrasada { border-color: #fecaca; background: #fff1f2; }
  .card-meta.concluida { opacity: 0.6; }

  .meta-topo {
    display: flex; align-items: center; justify-content: space-between;
  }

  .meta-area {
    font-size: var(--text-xs); font-weight: 600; opacity: 0.8;
  }

  .meta-prazo {
    font-size: var(--text-xs); color: var(--text-muted); font-weight: 500;
  }
  .meta-prazo.urgente  { color: #c2570a; }
  .meta-prazo.atrasada { color: var(--status-danger); }

  .meta-titulo {
    font-size: var(--text-md);
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
  }

  .progresso-wrapper {
    display: flex; flex-direction: column; gap: 5px;
  }

  .progresso-barra {
    height: 4px;
    background: var(--bg-active);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .progresso-fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width var(--transition-slow);
    min-width: 4px;
  }

  .progresso-label {
    font-size: var(--text-xs); color: var(--text-muted);
  }

  .meta-submetas-hint {
    font-size: var(--text-xs); color: var(--text-muted);
    margin-top: calc(-1 * var(--space-1));
  }
</style>
```

---

## componentes — habitos

### src/routes/Habitos.svelte

```svelte
<!-- src/routes/Habitos.svelte -->
<script>
  import { onMount } from 'svelte';
  import { habitos, streaks, carregandoHabitos, carregarHabitosHoje } from '$lib/stores/habitos.js';
  import { activeModal, habitoEditando } from '$lib/stores/ui.js';
  import { hoje } from '$lib/utils/dates.js';
  import { registrarCheckin, removerCheckin } from '$lib/db/queries/habitos.js';

  import ItemHabito from '$lib/components/habitos/ItemHabito.svelte';
  import ModalHabito from '$lib/components/habitos/ModalHabito.svelte';

  onMount(() => carregarHabitosHoje());

  async function toggleCheckin(habito) {
    const h = hoje();
    if (habito.concluido_hoje) {
      await removerCheckin(habito.id, h);
    } else {
      await registrarCheckin(habito.id, h);
    }
    await carregarHabitosHoje();
  }

  $: concluidos = $habitos.filter(h => h.concluido_hoje).length;
  $: total      = $habitos.length;
</script>

<div class="page">
  <header class="page-header">
    <div class="page-title">
      <h1>habitos</h1>
      {#if total > 0}
        <span class="badge-contador">{concluidos}/{total} hoje</span>
      {/if}
    </div>
    <button class="btn-primary" on:click={() => activeModal.set('novoHabito')}>
      + novo habito
    </button>
  </header>

  {#if $carregandoHabitos}
    <div class="estado-loading">carregando habitos...</div>

  {:else if $habitos.length === 0}
    <div class="estado-vazio">
      <span class="vazio-icone">~</span>
      <p>nenhum habito cadastrado</p>
      <button class="btn-ghost" on:click={() => activeModal.set('novoHabito')}>
        + criar primeiro habito
      </button>
    </div>

  {:else}
    <!-- barra de progresso geral do dia -->
    {#if total > 0}
      <div class="progresso-dia">
        <div class="progresso-barra">
          <div
            class="progresso-fill"
            style="width: {Math.round((concluidos/total)*100)}%"
          />
        </div>
        <span class="progresso-label">{Math.round((concluidos/total)*100)}% do dia concluido</span>
      </div>
    {/if}

    <div class="habitos-lista">
      {#each $habitos as habito (habito.id)}
        <ItemHabito
          {habito}
          streak={$streaks[habito.id] ?? 0}
          on:toggle={() => toggleCheckin(habito)}
          on:editar={() => { habitoEditando.set(habito); activeModal.set('editarHabito'); }}
        />
      {/each}
    </div>
  {/if}
</div>

{#if $activeModal === 'novoHabito' || $activeModal === 'editarHabito'}
  <ModalHabito
    on:fechar={() => activeModal.set(null)}
    on:salvo={() => carregarHabitosHoje()}
  />
{/if}

<style>
  .page {
    padding: var(--space-8) var(--coluna-padding);
    min-height: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .page-header {
    display: flex; align-items: center; justify-content: space-between;
  }

  .page-title { display: flex; align-items: center; gap: var(--space-3); }

  h1 {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 600;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .badge-contador {
    background: var(--bg-active); color: var(--text-secondary);
    font-size: var(--text-xs); font-weight: 600;
    padding: 3px 8px; border-radius: var(--radius-full);
  }

  .btn-primary {
    background: var(--text-primary); color: var(--bg);
    border: none; border-radius: var(--radius-md);
    padding: 8px 14px; font-size: var(--text-sm);
    font-family: var(--font-body); font-weight: 500;
    cursor: pointer; transition: opacity var(--transition-fast);
  }
  .btn-primary:hover { opacity: 0.85; }

  .progresso-dia {
    display: flex; flex-direction: column; gap: var(--space-2);
  }

  .progresso-barra {
    height: 6px; background: var(--bg-active);
    border-radius: var(--radius-full); overflow: hidden;
  }

  .progresso-fill {
    height: 100%; background: var(--status-ok);
    border-radius: var(--radius-full);
    transition: width var(--transition-slow);
  }

  .progresso-label {
    font-size: var(--text-xs); color: var(--text-muted);
  }

  .habitos-lista { display: flex; flex-direction: column; gap: 1px; }

  .estado-loading, .estado-vazio {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: var(--space-3);
    padding: var(--space-12) 0;
    color: var(--text-muted); font-size: var(--text-sm);
  }

  .vazio-icone { font-size: 28px; opacity: 0.25; }

  .btn-ghost {
    background: none; border: 1px solid var(--border);
    color: var(--text-secondary); border-radius: var(--radius-md);
    padding: 7px 14px; font-size: var(--text-sm);
    font-family: var(--font-body); cursor: pointer;
    transition: all var(--transition-fast); margin-top: var(--space-2);
  }
  .btn-ghost:hover { background: var(--bg-hover); }
</style>
```

### src/lib/components/habitos/ItemHabito.svelte

```svelte
<!-- src/lib/components/habitos/ItemHabito.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';

  export let habito;
  export let streak = 0;

  const dispatch = createEventDispatcher();

  const FREQ_LABEL = {
    diaria:      'diario',
    semanal:     'semanal',
    mensal:      'mensal',
    trimestral:  'trimestral',
    semestral:   'semestral',
    anual:       'anual',
  };
</script>

<div
  class="item-habito"
  class:concluido={habito.concluido_hoje}
>
  <!-- check -->
  <button
    class="check-btn"
    on:click={() => dispatch('toggle')}
    aria-label={habito.concluido_hoje ? 'desmarcar habito' : 'marcar habito'}
  >
    <span class="check-box" class:checked={habito.concluido_hoje}
      style={habito.concluido_hoje ? `background: ${habito.area_cor ?? 'var(--accent)'}; border-color: ${habito.area_cor ?? 'var(--accent)'}` : ''}>
      {#if habito.concluido_hoje}✓{/if}
    </span>
  </button>

  <!-- icone + nome -->
  <div class="habito-corpo">
    <div class="habito-linha-principal">
      {#if habito.icone}
        <span class="habito-icone">{habito.icone}</span>
      {/if}
      <span class="habito-nome">{habito.nome}</span>
    </div>
    <div class="habito-meta">
      <span class="habito-freq">{FREQ_LABEL[habito.frequencia_tipo]}</span>
      {#if habito.area_nome}
        <span class="habito-area" style="color: {habito.area_cor}">{habito.area_nome}</span>
      {/if}
    </div>
  </div>

  <!-- streak -->
  {#if streak > 0}
    <div class="streak-badge" title="{streak} periodos consecutivos">
      <span class="streak-fogo">🔥</span>
      <span class="streak-num">{streak}</span>
    </div>
  {/if}

  <!-- botao editar no hover -->
  <button
    class="btn-editar"
    on:click|stopPropagation={() => dispatch('editar')}
    aria-label="editar habito"
  >
    ···
  </button>
</div>

<style>
  .item-habito {
    display: flex; align-items: center; gap: var(--space-3);
    padding: 12px var(--space-3); border-radius: var(--radius-md);
    transition: background var(--transition-fast);
    position: relative;
  }
  .item-habito:hover { background: var(--bg-hover); }
  .item-habito.concluido .habito-nome { color: var(--text-muted); }

  .check-btn {
    background: none; border: none; cursor: pointer;
    flex-shrink: 0; display: flex; align-items: center; padding: 0;
  }

  .check-box {
    width: 20px; height: 20px;
    border: 1.5px solid var(--border-strong);
    border-radius: var(--radius-full);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; color: white;
    transition: all var(--transition-base);
  }

  .habito-corpo {
    flex: 1;
    display: flex; flex-direction: column; gap: 2px;
    min-width: 0;
  }

  .habito-linha-principal {
    display: flex; align-items: center; gap: var(--space-2);
  }

  .habito-icone { font-size: var(--text-md); line-height: 1; }

  .habito-nome {
    font-size: var(--text-sm); font-weight: 500; color: var(--text-primary);
    transition: color var(--transition-fast);
  }

  .habito-meta {
    display: flex; align-items: center; gap: var(--space-2);
  }

  .habito-freq, .habito-area {
    font-size: var(--text-xs); color: var(--text-muted);
  }
  .habito-area { font-weight: 500; }

  .streak-badge {
    display: flex; align-items: center; gap: 3px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    padding: 3px 8px;
    flex-shrink: 0;
  }

  .streak-fogo { font-size: 12px; line-height: 1; }

  .streak-num {
    font-size: var(--text-xs); font-weight: 700;
    color: var(--text-primary);
  }

  .btn-editar {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); font-size: var(--text-md);
    padding: 4px 8px; border-radius: var(--radius-sm);
    opacity: 0;
    transition: all var(--transition-fast);
    letter-spacing: 1px;
  }
  .item-habito:hover .btn-editar { opacity: 1; }
  .btn-editar:hover { color: var(--text-primary); background: var(--bg-active); }
</style>
```

---

## atualizar bloco diretivo

o `BlocoDisretivo.svelte` da fase 2 precisa ser expandido para incluir metas e habitos.
adicionar logica de mensagens:

```javascript
// logica adicional em gerarMensagem() — adicionar antes do return final:

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
    return `${n} meta${n > 1 ? 's vencem' : ' vence'} em menos de 3 dias. verifique seu progresso.`;
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
```

o `BlocoDisretivo` precisa receber `metas` e `habitos` como props adicionais.
atualizar o `Dashboard.svelte` para passar esses dados.

---

## ativar rotas e sidebar

### App.svelte — adicionar rotas

```javascript
import Metas   from './routes/Metas.svelte';
import Habitos from './routes/Habitos.svelte';

const views = {
  dashboard:  Dashboard,
  tarefas:    Tarefas,
  calendario: Calendario,
  metas:      Metas,     // novo
  habitos:    Habitos,   // novo
};
```

### Sidebar.svelte — ativar itens

```javascript
{ id: 'metas',   label: 'metas',   icon: Target, active: true },  // era false
{ id: 'habitos', label: 'habitos', icon: Flame,  active: true },  // era false
```

---

## estrutura de pastas — novos arquivos da fase 5

```
src/
├── lib/
│   ├── components/
│   │   ├── metas/
│   │   │   ├── CardMeta.svelte
│   │   │   ├── DetalheMeta.svelte
│   │   │   ├── FiltrosMetas.svelte
│   │   │   └── ModalMeta.svelte
│   │   └── habitos/
│   │       ├── ItemHabito.svelte
│   │       └── ModalHabito.svelte
│   ├── stores/
│   │   ├── metas.js
│   │   └── habitos.js
│   ├── db/
│   │   └── queries/
│   │       ├── metas.js
│   │       └── habitos.js
│   └── utils/
│       └── streak.js
└── routes/
    ├── Metas.svelte
    └── Habitos.svelte
```

---

## criterios de conclusao da fase 5

**metas**
- [ ] migration cria a tabela `metas` corretamente com todos os indices
- [ ] sidebar navega para o modulo de metas
- [ ] metas aparecem agrupadas por prazo (esta semana, este mes, etc.)
- [ ] metas abertas aparecem no grupo "sem prazo definido"
- [ ] card de meta exibe barra de progresso correta para cada modo
- [ ] modo `tarefas` exibe contagem de tarefas concluidas vs total
- [ ] modo `numerico` exibe valor atual / alvo com unidade
- [ ] modo `percentual` exibe porcentagem
- [ ] modo `binario` exibe "em andamento" ou "concluida"
- [ ] cards urgentes (<=7 dias) tem fundo amarelado
- [ ] cards atrasados (<0 dias) tem fundo avermelhado
- [ ] criar meta abre o modal corretamente
- [ ] modal permite escolher modo de progresso
- [ ] modal permite escolher prazo ou deixar aberto
- [ ] salvar meta funciona sem erro para todos os modos
- [ ] editar meta atualiza os dados corretamente
- [ ] submetas aparecem na tela de detalhe da meta
- [ ] criar submeta vincula automaticamente a meta pai
- [ ] ao concluir uma tarefa vinculada, o progresso da meta em modo `tarefas` atualiza
- [ ] deletar meta remove suas submetas e desvincula as tarefas (sem deletar as tarefas)

**habitos**
- [ ] migration cria as tabelas `habitos` e `registros_habitos` corretamente
- [ ] sidebar navega para o modulo de habitos
- [ ] habitos aparecem listados com frequencia e area
- [ ] barra de progresso do dia mostra percentual de conclusao
- [ ] clicar no check marca o habito como feito hoje
- [ ] clicar novamente desmarca
- [ ] streak aparece com numero e emoji de fogo quando > 0
- [ ] streak e calculado corretamente para habitos diarios
- [ ] logica de graca: pular 1 dia numa semana nao quebra streak diario
- [ ] pular 2 dias na mesma semana quebra o streak
- [ ] streak e calculado corretamente para habitos semanais e mensais
- [ ] criar habito abre o modal corretamente
- [ ] modal permite escolher frequencia e alvo
- [ ] habito com frequencia semanal permite definir quantas vezes por semana
- [ ] salvar habito funciona sem erro
- [ ] editar habito atualiza os dados corretamente
- [ ] deletar habito remove os registros de check-in em cascata

**integracao com dashboard**
- [ ] bloco diretivo menciona metas urgentes quando ha metas vencendo em 3 dias
- [ ] bloco diretivo menciona habitos nao feitos quando todos os diarios estao pendentes
- [ ] cards de metas e habitos no dashboard mostram dados reais (nao mais estado vazio)

**geral**
- [ ] todo texto visivel em letras minusculas
- [ ] nenhum valor hard-coded nos componentes

---

## o que nao entra na fase 5

- historico grafico de habitos (heatmap tipo github)
- exportacao de dados de metas e habitos
- modulo de financas
- notificacoes de metas proximas do prazo
- vinculo automatico de habito a meta
- modulo de notas
- modulo de pessoas

---

## ordem de implementacao sugerida

1. adicionar `migration_005_metas` e `migration_006_habitos` ao `migrations.js`
2. criar `src/lib/utils/streak.js`
3. criar `src/lib/db/queries/metas.js`
4. criar `src/lib/db/queries/habitos.js`
5. atualizar `src/lib/db/queries/tarefas.js` com `concluirTarefa` vinculada a metas
6. criar `src/lib/stores/metas.js`
7. criar `src/lib/stores/habitos.js`
8. atualizar `src/lib/stores/ui.js` com `metaEditando` e `habitoEditando`
9. criar `CardMeta.svelte`
10. criar `ModalMeta.svelte` (seguir o padrao visual do ModalTarefa da fase 3)
11. criar `DetalheMeta.svelte`
12. criar `FiltrosMetas.svelte`
13. criar `src/routes/Metas.svelte`
14. criar `ItemHabito.svelte`
15. criar `ModalHabito.svelte`
16. criar `src/routes/Habitos.svelte`
17. ativar rotas no `App.svelte` e itens na `Sidebar.svelte`
18. atualizar `BlocoDisretivo.svelte` com logica de metas e habitos
19. atualizar cards do dashboard para metas e habitos
20. testar fluxo de metas: criar > vincular tarefa > concluir tarefa > ver progresso atualizar
21. testar fluxo de habitos: criar > fazer check-in > verificar streak > pular dia > verificar graca
22. verificar checklist completo

---

nexus — fase 5 | referencia de desenvolvimento
proxima fase: fase 6 — modulo de financas com lancamentos manuais, categorias, vinculo com metas e dashboard financeiro