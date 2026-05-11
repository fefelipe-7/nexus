import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { up as migrateUp } from './migrations/V1__initial';

export class DBHelper {
  private static instance: DBHelper | null = null;
  private db: SQLite.SQLiteDatabase;

  private constructor() {
    this.db = SQLite.openDatabase('nexus.db');
  }

  static async getInstance(): Promise<DBHelper> {
    if (!DBHelper.instance) {
      const helper = new DBHelper();
      await helper.runMigrations();
      DBHelper.instance = helper;
    }
    return DBHelper.instance;
  }

  getDB(): SQLite.SQLiteDatabase {
    return this.db;
  }

  // Very simple migration runner – only V1 for now
  private async runMigrations(): Promise<void> {
    // In a real app we'd keep a migrations table; for MVP just run once if tables missing.
    await this.db.execAsync(`SELECT name FROM sqlite_master WHERE type='table' AND name='module'`).then(async res => {
      if (res.rows.length === 0) {
        // No tables yet – run initial migration
        await migrateUp(this.db);
      }
    });
  }
}
