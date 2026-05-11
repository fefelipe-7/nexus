import { BaseRepository, DB } from './BaseRepository';

export type ModuleEntity = {
  id: string;
  name: string;
  description?: string;
  orderIdx?: number;
  createdAt: string;
  updatedAt: string;
};

export class ModuleRepository extends BaseRepository<ModuleEntity> {
  constructor(db: DB) {
    super(db, 'module');
  }

  // additional query examples
  async findByName(name: string): Promise<ModuleEntity | undefined> {
    const row = await this.db.getFirstAsync(`SELECT * FROM module WHERE name = ? AND deletedAt IS NULL`, [name]);
    return row as ModuleEntity | undefined;
  }
}
