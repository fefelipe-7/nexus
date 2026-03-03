export async function runMigrations(db) {
  await db.execute(`
    create table if not exists schema_version (
      version    integer primary key,
      applied_at text not null default (datetime('now'))
    )
  `);
  await migration_001_areas(db);
  await migration_002_config(db);
  await migration_003_tarefas(db);
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

