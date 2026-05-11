import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('nexus.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS modules (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      "order" INTEGER DEFAULT 0,
      enabled INTEGER DEFAULT 1,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS submodules (
      id TEXT PRIMARY KEY,
      moduleId TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      inputType TEXT NOT NULL,
      createsData INTEGER DEFAULT 1,
      enabled INTEGER DEFAULT 1,
      "order" INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (moduleId) REFERENCES modules(id)
    );

    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      moduleId TEXT NOT NULL,
      submoduleId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      occurredAt INTEGER NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      deletedAt INTEGER,
      source TEXT DEFAULT 'manual',
      metadata TEXT DEFAULT '{}',
      FOREIGN KEY (moduleId) REFERENCES modules(id),
      FOREIGN KEY (submoduleId) REFERENCES submodules(id)
    );

    CREATE TABLE IF NOT EXISTS metrics (
      id TEXT PRIMARY KEY,
      entryId TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      unit TEXT,
      scaleMin REAL,
      scaleMax REAL,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (entryId) REFERENCES entries(id)
    );

    CREATE TABLE IF NOT EXISTS relations (
      id TEXT PRIMARY KEY,
      fromEntityType TEXT NOT NULL,
      fromEntityId TEXT NOT NULL,
      toEntityType TEXT NOT NULL,
      toEntityId TEXT NOT NULL,
      relationType TEXT NOT NULL,
      strength REAL DEFAULT 0.5,
      confidence TEXT DEFAULT 'medium',
      source TEXT DEFAULT 'user',
      note TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS insights (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      confidence TEXT DEFAULT 'medium',
      source TEXT DEFAULT 'system_generated',
      sourceDataRange TEXT,
      relatedEntities TEXT DEFAULT '[]',
      createdAt INTEGER NOT NULL,
      dismissedAt INTEGER
    );

    CREATE TABLE IF NOT EXISTS entries_tags (
      entryId TEXT NOT NULL,
      tagId TEXT NOT NULL,
      PRIMARY KEY (entryId, tagId),
      FOREIGN KEY (entryId) REFERENCES entries(id),
      FOREIGN KEY (tagId) REFERENCES tags(id)
    );

    CREATE INDEX IF NOT EXISTS idx_entries_module ON entries(moduleId);
    CREATE INDEX IF NOT EXISTS idx_entries_submodule ON entries(submoduleId);
    CREATE INDEX IF NOT EXISTS idx_entries_occurred ON entries(occurredAt);
    CREATE INDEX IF NOT EXISTS idx_metrics_entry ON metrics(entryId);
    CREATE INDEX IF NOT EXISTS idx_relations_from ON relations(fromEntityType, fromEntityId);
    CREATE INDEX IF NOT EXISTS idx_relations_to ON relations(toEntityType, toEntityId);
  `);

  await seedInitialData(db);

  return db;
}

async function seedInitialData(database: SQLite.SQLiteDatabase): Promise<void> {
  const existingModules = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM modules');
  if (existingModules && existingModules.count > 0) return;

  const now = Date.now();

  const modules = [
    { id: 'saude', name: 'saude', description: 'Saúde física, fisiológica e bem-estar', order: 1 },
    { id: 'mente', name: 'mente', description: 'Emocional, cognitivo e subjetivo', order: 2 },
    { id: 'acao', name: 'acao', description: 'Execução, intenção e planejamento', order: 3 },
    { id: 'financa', name: 'financa', description: 'Dinheiro, receitas e despesas', order: 4 },
    { id: 'vida', name: 'vida', description: 'Relações, experiências e propósito', order: 5 },
  ];

  for (const mod of modules) {
    await database.runAsync(
      'INSERT INTO modules (id, name, description, "order", enabled, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [mod.id, mod.name, mod.description, mod.order, 1, now, now]
    );
  }

  const submodules = [
    // Saúde
    { id: 'sono', moduleId: 'saude', name: 'Sono', description: 'Horas de sono e qualidade', inputType: 'numeric', order: 1 },
    { id: 'hidratacao', moduleId: 'saude', name: 'Hidratação', description: 'Consumo de água', inputType: 'numeric', order: 2 },
    { id: 'alimentacao', moduleId: 'saude', name: 'Alimentação', description: 'Refeições e nutrientes', inputType: 'select', order: 3 },
    { id: 'treino', moduleId: 'saude', name: 'Treino físico', description: 'Exercícios e atividades', inputType: 'numeric', order: 4 },
    { id: 'sintomas', moduleId: 'saude', name: 'Sintomas', description: 'Sinais e sintomas corporais', inputType: 'text', order: 5 },
    
    // Mente
    { id: 'journal', moduleId: 'mente', name: 'Journal', description: 'Reflexões e escritos', inputType: 'text', order: 1 },
    { id: 'humor', moduleId: 'mente', name: 'Humor', description: 'Estado emocional', inputType: 'select', order: 2 },
    { id: 'foco', moduleId: 'mente', name: 'Foco', description: 'Nível de concentração', inputType: 'numeric', order: 3 },
    { id: 'ansiedade', moduleId: 'mente', name: 'Ansiedade', description: 'Nível de ansiedade', inputType: 'numeric', order: 4 },
    { id: 'meditacao', moduleId: 'mente', name: 'Meditação', description: 'Práticas de mindfulness', inputType: 'numeric', order: 5 },
    
    // Ação
    { id: 'tarefas', moduleId: 'acao', name: 'Tarefas', description: 'To-dos e ações', inputType: 'select', order: 1 },
    { id: 'projetos', moduleId: 'acao', name: 'Projetos', description: 'Iniciativas e entregas', inputType: 'select', order: 2 },
    { id: 'metas', moduleId: 'acao', name: 'Metas', description: 'Objetivos a alcançar', inputType: 'select', order: 3 },
    { id: 'habitos', moduleId: 'acao', name: 'Hábitos', description: 'Rotinas e comportamentos', inputType: 'select', order: 4 },
    { id: 'foco_tempo', moduleId: 'acao', name: 'Tempo de foco', description: 'Blocos de concentração', inputType: 'numeric', order: 5 },
    
    // Finanças
    { id: 'receitas', moduleId: 'financa', name: 'Receitas', description: 'Entradas de dinheiro', inputType: 'numeric', order: 1 },
    { id: 'despesas', moduleId: 'financa', name: 'Despesas', description: 'Gastos e saídas', inputType: 'numeric', order: 2 },
    { id: 'investimentos', moduleId: 'financa', name: 'Investimentos', description: 'Aplicações financeiras', inputType: 'numeric', order: 3 },
    { id: 'dividas', moduleId: 'financa', name: 'Dívidas', description: 'Empréstimos e financiamentos', inputType: 'numeric', order: 4 },
    { id: 'orcamento', moduleId: 'financa', name: 'Orçamento', description: 'Limites por categoria', inputType: 'numeric', order: 5 },
    
    // Vida
    { id: 'relacionamentos', moduleId: 'vida', name: 'Relacionamentos', description: 'Conexões interpessoais', inputType: 'text', order: 1 },
    { id: 'familia', moduleId: 'vida', name: 'Família', description: 'Dinâmica familiar', inputType: 'text', order: 2 },
    { id: 'social', moduleId: 'vida', name: 'Vida social', description: 'Interações e eventos', inputType: 'text', order: 3 },
    { id: 'lazer', moduleId: 'vida', name: 'Lazer', description: 'Atividades de diversão', inputType: 'text', order: 4 },
    { id: 'aprendizado', moduleId: 'vida', name: 'Aprendizado', description: 'Estudos e desenvolvimento', inputType: 'text', order: 5 },
  ];

  for (const sub of submodules) {
    await database.runAsync(
      'INSERT INTO submodules (id, moduleId, name, description, inputType, createsData, enabled, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [sub.id, sub.moduleId, sub.name, sub.description, sub.inputType, 1, 1, sub.order, now, now]
    );
  }
}

export function getDatabase(): SQLite.SQLiteDatabase | null {
  return db;
}
