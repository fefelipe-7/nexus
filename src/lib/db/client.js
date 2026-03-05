import Database from '@tauri-apps/plugin-sql';
import { runMigrations } from './migrations.js';

let db = null;

export async function initDb() {
    console.log('[db] carregando nexus.db...');
    db = await Database.load('sqlite:nexus.db');
    console.log('[db] rodando migracoes...');
    await runMigrations(db);
    await db.execute('PRAGMA foreign_keys = ON');
    console.log('[db] pronto');
    return db;
}

export function getDb() {
    if (!db) throw new Error('banco nao inicializado. chame initDb() primeiro.');
    return db;
}
