export const up = async (db: any) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS module (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      orderIdx INTEGER,
      createdAt TEXT,
      updatedAt TEXT
    );
    CREATE TABLE IF NOT EXISTS submodule (
      id TEXT PRIMARY KEY,
      moduleId TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      inputType TEXT,
      createsData INTEGER,
      orderIdx INTEGER,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY(moduleId) REFERENCES module(id)
    );
    CREATE TABLE IF NOT EXISTS entry (
      id TEXT PRIMARY KEY,
      moduleId TEXT NOT NULL,
      submoduleId TEXT NOT NULL,
      title TEXT,
      description TEXT,
      occurredAt TEXT,
      source TEXT,
      tags TEXT,
      metadata TEXT,
      deletedAt TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY(moduleId) REFERENCES module(id),
      FOREIGN KEY(submoduleId) REFERENCES submodule(id)
    );
    CREATE TABLE IF NOT EXISTS metric (
      id TEXT PRIMARY KEY,
      entryId TEXT NOT NULL,
      key TEXT,
      value TEXT,
      unit TEXT,
      scaleMin REAL,
      scaleMax REAL,
      createdAt TEXT,
      FOREIGN KEY(entryId) REFERENCES entry(id)
    );
    CREATE TABLE IF NOT EXISTS relation (
      id TEXT PRIMARY KEY,
      fromEntityType TEXT,
      fromEntityId TEXT,
      toEntityType TEXT,
      toEntityId TEXT,
      relationType TEXT,
      strength REAL,
      confidence TEXT,
      source TEXT,
      note TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );
    CREATE TABLE IF NOT EXISTS insight (
      id TEXT PRIMARY KEY,
      title TEXT,
      message TEXT,
      confidence TEXT,
      source TEXT,
      relatedEntityIds TEXT,
      createdAt TEXT,
      dismissedAt TEXT
    );
    CREATE TABLE IF NOT EXISTS tag (
      id TEXT PRIMARY KEY,
      name TEXT,
      color TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );
    CREATE TABLE IF NOT EXISTS attachment (
      id TEXT PRIMARY KEY,
      entryId TEXT,
      fileName TEXT,
      fileType TEXT,
      localUri TEXT,
      size INTEGER,
      hash TEXT,
      createdAt TEXT,
      FOREIGN KEY(entryId) REFERENCES entry(id)
    );
  `);
};

export const down = async (db: any) => {
  await db.exec(`
    DROP TABLE IF EXISTS attachment;
    DROP TABLE IF EXISTS tag;
    DROP TABLE IF EXISTS insight;
    DROP TABLE IF EXISTS relation;
    DROP TABLE IF EXISTS metric;
    DROP TABLE IF EXISTS entry;
    DROP TABLE IF EXISTS submodule;
    DROP TABLE IF EXISTS module;
  `);
};
