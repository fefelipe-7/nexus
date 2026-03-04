export async function runMigrations(db) {
  // cria tabela de controle se nao existir
  await db.execute(`
    create table if not exists schema_version (
      version    integer primary key,
      applied_at text not null default (datetime('now'))
    )
  `);

  // funcao auxiliar para aplicar migracao apenas se nao aplicada
  async function apply(version, migrationFn) {
    const [row] = await db.select('select version from schema_version where version = ?', [version]);
    if (!row) {
      console.log(`[db] aplicando migracao v${version}...`);
      await migrationFn(db);
      await db.execute('insert into schema_version (version) values (?)', [version]);
    }
  }

  await apply(1, migration_001_areas);
  await apply(2, migration_002_config);
  await apply(3, migration_003_tarefas);
  await apply(4, migration_004_eventos);
  await apply(5, migration_005_metas);
  await apply(6, migration_006_habitos);
}

async function migration_001_areas(db) {
  await db.execute(`
    create table if not exists areas_de_vida (
      id        integer primary key autoincrement,
      nome      text    not null,
      cor       text    not null,
      icone     text    not null,
      ordem     integer not null default 0,
      ativa     integer not null default 1,
      criado_em text    not null default (datetime('now'))
    )
  `);
  const result = await db.select('select count(*) as count from areas_de_vida');
  if (result[0].count === 0) {
    const defaults = [
      { nome: 'trabalho', cor: '#3b82f6', icone: 'briefcase', ordem: 1 },
      { nome: 'saude', cor: '#22c55e', icone: 'heart', ordem: 2 },
      { nome: 'financas', cor: '#f59e0b', icone: 'dollar', ordem: 3 },
      { nome: 'pessoal', cor: '#8b5cf6', icone: 'user', ordem: 4 },
      { nome: 'aprendizado', cor: '#ec4899', icone: 'book', ordem: 5 },
    ];
    for (const area of defaults) {
      await db.execute(
        'insert into areas_de_vida (nome, cor, icone, ordem) values (?, ?, ?, ?)',
        [area.nome, area.cor, area.icone, area.ordem]
      );
    }
  }
}

async function migration_002_config(db) {
  await db.execute(`
    create table if not exists config (
      chave      text primary key,
      valor      text not null,
      updated_at text not null default (datetime('now'))
    )
  `);
  const defaults = [
    ['sidebar_collapsed', '0'],
    ['active_tab', 'dia'],
    ['theme', 'light'],
    ['window_width', '0'],
    ['window_height', '0'],
    ['window_x', ''],
    ['window_y', ''],
    ['window_maximized', '0'],
  ];
  for (const [chave, valor] of defaults) {
    await db.execute(
      'insert or ignore into config (chave, valor) values (?, ?)',
      [chave, valor]
    );
  }
}

async function migration_003_tarefas(db) {
  await db.execute(`
    create table if not exists tarefas (
      id               integer primary key autoincrement,
      titulo           text    not null,
      descricao        text,
      area_id          integer references areas_de_vida(id) on delete set null,
      prioridade       text    not null default 'media'
                       check(prioridade in ('critica', 'alta', 'media', 'baixa')),
      status           text    not null default 'pendente'
                       check(status in ('pendente', 'em_progresso', 'concluida', 'cancelada')),
      data_prevista    text,
      hora_prevista    text,
      data_conclusao   text,
      meta_id          integer,
      valor            real,
      recorrente       integer not null default 0,
      recorrencia_tipo text,
      criado_em        text    not null default (datetime('now')),
      atualizado_em    text    not null default (datetime('now'))
    )
  `);

  await db.execute(`create index if not exists idx_tarefas_data      on tarefas(data_prevista)`);
  await db.execute(`create index if not exists idx_tarefas_status    on tarefas(status)`);
  await db.execute(`create index if not exists idx_tarefas_area      on tarefas(area_id)`);
  await db.execute(`create index if not exists idx_tarefas_prioridade on tarefas(prioridade)`);
}

async function migration_004_eventos(db) {
  await db.execute(`
    create table if not exists eventos (
      id          integer primary key autoincrement,
      titulo      text    not null,
      descricao   text,
      local       text,
      inicio      text    not null,
      fim         text,
      dia_inteiro integer not null default 0,
      area_id     integer references areas_de_vida(id) on delete set null,
      cor         text,
      tarefa_id   integer references tarefas(id) on delete cascade,
      recorrente  integer not null default 0,
      criado_em   text    not null default (datetime('now')),
      atualizado_em text  not null default (datetime('now'))
    )
  `);

  await db.execute(`create index if not exists idx_eventos_inicio  on eventos(inicio)`);
  await db.execute(`create index if not exists idx_eventos_area    on eventos(area_id)`);
  await db.execute(`create index if not exists idx_eventos_tarefa  on eventos(tarefa_id)`);
}

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
