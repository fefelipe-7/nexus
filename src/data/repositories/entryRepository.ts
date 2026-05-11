import { getDatabase } from '@/data/sqlite';
import { Entry, Metric, EntrySource } from '@/domain/models';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export interface CreateEntryInput {
  moduleId: string;
  submoduleId: string;
  title: string;
  description?: string;
  occurredAt?: number;
  source?: EntrySource;
  tags?: string[];
  metrics?: { key: string; value: string | number; unit?: string }[];
}

export async function createEntry(input: CreateEntryInput): Promise<Entry> {
  const db = getDatabase();
  if (!db) throw new Error('Database not initialized');

  const now = Date.now();
  const entryId = generateId();

  await db.runAsync(
    `INSERT INTO entries (id, moduleId, submoduleId, title, description, occurredAt, createdAt, updatedAt, source, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entryId,
      input.moduleId,
      input.submoduleId,
      input.title,
      input.description || null,
      input.occurredAt || now,
      now,
      now,
      input.source || 'manual',
      JSON.stringify(input.metrics || []),
    ]
  );

  if (input.metrics && input.metrics.length > 0) {
    for (const metric of input.metrics) {
      const metricId = generateId();
      await db.runAsync(
        `INSERT INTO metrics (id, entryId, key, value, unit, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
        [metricId, entryId, metric.key, String(metric.value), metric.unit || null, now]
      );
    }
  }

  if (input.tags && input.tags.length > 0) {
    for (const tagName of input.tags) {
      let tagId = await db.getFirstAsync<{ id: string }>(
        'SELECT id FROM tags WHERE name = ?',
        [tagName]
      );
      if (!tagId) {
        tagId = { id: generateId() };
        await db.runAsync(
          'INSERT INTO tags (id, name, color, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
          [tagId.id, tagName, '#8B5CF6', now, now]
        );
      }
      await db.runAsync(
        'INSERT OR IGNORE INTO entries_tags (entryId, tagId) VALUES (?, ?)',
        [entryId, tagId.id]
      );
    }
  }

  return {
    id: entryId,
    moduleId: input.moduleId,
    submoduleId: input.submoduleId,
    title: input.title,
    description: input.description,
    occurredAt: input.occurredAt || now,
    createdAt: now,
    updatedAt: now,
    source: input.source || 'manual',
    tags: input.tags || [],
    metadata: {},
  };
}

export async function getEntriesByModule(moduleId: string, limit = 50): Promise<Entry[]> {
  const db = getDatabase();
  if (!db) return [];

  const rows = await db.getAllAsync<{
    id: string;
    moduleId: string;
    submoduleId: string;
    title: string;
    description: string | null;
    occurredAt: number;
    createdAt: number;
    updatedAt: number;
    source: string;
    metadata: string;
  }>(
    `SELECT * FROM entries WHERE moduleId = ? AND deletedAt IS NULL ORDER BY occurredAt DESC LIMIT ?`,
    [moduleId, limit]
  );

  return rows.map(row => ({
    id: row.id,
    moduleId: row.moduleId,
    submoduleId: row.submoduleId,
    title: row.title,
    description: row.description || undefined,
    occurredAt: row.occurredAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    source: row.source as EntrySource,
    tags: [],
    metadata: {},
  }));
}

export async function getEntriesBySubmodule(submoduleId: string, limit = 50): Promise<Entry[]> {
  const db = getDatabase();
  if (!db) return [];

  const rows = await db.getAllAsync<{
    id: string;
    moduleId: string;
    submoduleId: string;
    title: string;
    description: string | null;
    occurredAt: number;
    createdAt: number;
    updatedAt: number;
    source: string;
    metadata: string;
  }>(
    `SELECT * FROM entries WHERE submoduleId = ? AND deletedAt IS NULL ORDER BY occurredAt DESC LIMIT ?`,
    [submoduleId, limit]
  );

  return rows.map(row => ({
    id: row.id,
    moduleId: row.moduleId,
    submoduleId: row.submoduleId,
    title: row.title,
    description: row.description || undefined,
    occurredAt: row.occurredAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    source: row.source as EntrySource,
    tags: [],
    metadata: {},
  }));
}

export async function getRecentEntries(limit = 20): Promise<Entry[]> {
  const db = getDatabase();
  if (!db) return [];

  const rows = await db.getAllAsync<{
    id: string;
    moduleId: string;
    submoduleId: string;
    title: string;
    description: string | null;
    occurredAt: number;
    createdAt: number;
    updatedAt: number;
    source: string;
    metadata: string;
  }>(
    `SELECT * FROM entries WHERE deletedAt IS NULL ORDER BY occurredAt DESC LIMIT ?`,
    [limit]
  );

  return rows.map(row => ({
    id: row.id,
    moduleId: row.moduleId,
    submoduleId: row.submoduleId,
    title: row.title,
    description: row.description || undefined,
    occurredAt: row.occurredAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    source: row.source as EntrySource,
    tags: [],
    metadata: {},
  }));
}

export async function deleteEntry(entryId: string): Promise<void> {
  const db = getDatabase();
  if (!db) return;

  const now = Date.now();
  await db.runAsync('UPDATE entries SET deletedAt = ?, updatedAt = ? WHERE id = ?', [now, now, entryId]);
}

export async function getEntriesWithMetrics(entryId: string): Promise<{ entry: Entry; metrics: Metric[] } | null> {
  const db = getDatabase();
  if (!db) return null;

  const entry = await db.getFirstAsync<{
    id: string;
    moduleId: string;
    submoduleId: string;
    title: string;
    description: string | null;
    occurredAt: number;
    createdAt: number;
    updatedAt: number;
    source: string;
    metadata: string;
  }>('SELECT * FROM entries WHERE id = ?', [entryId]);

  if (!entry) return null;

  const metrics = await db.getAllAsync<{
    id: string;
    entryId: string;
    key: string;
    value: string;
    unit: string | null;
    scaleMin: number | null;
    scaleMax: number | null;
    createdAt: number;
  }>('SELECT * FROM metrics WHERE entryId = ?', [entryId]);

  return {
    entry: {
      id: entry.id,
      moduleId: entry.moduleId,
      submoduleId: entry.submoduleId,
      title: entry.title,
      description: entry.description || undefined,
      occurredAt: entry.occurredAt,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      source: entry.source as EntrySource,
      tags: [],
      metadata: {},
    },
    metrics: metrics.map(m => ({
      id: m.id,
      entryId: m.entryId,
      key: m.key,
      value: m.value as unknown as number | string,
      unit: m.unit || undefined,
      scaleMin: m.scaleMin || undefined,
      scaleMax: m.scaleMax || undefined,
      createdAt: m.createdAt,
    })),
  };
}