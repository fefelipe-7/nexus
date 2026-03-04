import Database from '@tauri-apps/plugin-sql';
import { runMigrations } from './migrations.js';

let db = null;

export async function initDb() {
    db = await Database.load('sqlite:nexus.db');
    await runMigrations(db);
    await db.execute('PRAGMA foreign_keys = ON');
    return db;
}

export function getDb() {
    if (!db) throw new Error('banco nao inicializado. chame initDb() primeiro.');
    return db;
}
