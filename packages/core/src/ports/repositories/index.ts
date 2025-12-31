import { ID } from '@nexus/shared';

export interface Repository<T> {
  findById(id: ID): Promise<T | undefined>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}

export interface PersonalStateRepository extends Repository<any> {
  findRecent(limit: number): Promise<any[]>;
}

export interface ActionRepository extends Repository<any> {
  findByStatus(status: string): Promise<any[]>;
  findByDate(date: Date): Promise<any[]>;
}

export interface GoalRepository extends Repository<any> {
  findActive(): Promise<any[]>;
}
