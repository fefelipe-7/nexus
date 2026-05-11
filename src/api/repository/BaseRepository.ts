export type DB = any; // placeholder for expo‑sqlite DB instance

export abstract class BaseRepository<T> {
  protected db: DB;
  protected table: string;

  constructor(db: DB, table: string) {
    this.db = db;
    this.table = table;
  }

  async getAll(): Promise<T[]> {
    const rows = await this.db.getAllAsync(`SELECT * FROM ${this.table} WHERE deletedAt IS NULL`);
    return rows as T[];
  }

  async getById(id: string): Promise<T | undefined> {
    const row = await this.db.getFirstAsync(`SELECT * FROM ${this.table} WHERE id = ? AND deletedAt IS NULL`, [id]);
    return row as T | undefined;
  }

  async insert(item: T): Promise<void> {
    // simplistic: assumes item matches table columns exactly
    const keys = Object.keys(item as any);
    const placeholders = keys.map(() => '?').join(',');
    const values = keys.map(k => (item as any)[k]);
    await this.db.runAsync(`INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${placeholders})`, values);
  }

  async update(id: string, changes: Partial<T>): Promise<void> {
    const keys = Object.keys(changes);
    const setClause = keys.map(k => `${k} = ?`).join(',');
    const values = keys.map(k => (changes as any)[k]);
    await this.db.runAsync(`UPDATE ${this.table} SET ${setClause} WHERE id = ?`, [...values, id]);
  }

  async softDelete(id: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db.runAsync(`UPDATE ${this.table} SET deletedAt = ? WHERE id = ?`, [now, id]);
  }
}
