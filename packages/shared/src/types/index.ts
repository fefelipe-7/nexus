// Common types used across the application
export type ID = string;
export type Timestamp = Date;

export interface BaseEntity {
  id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId?: string;
}

export type Status = 'active' | 'completed' | 'archived' | 'deleted';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
