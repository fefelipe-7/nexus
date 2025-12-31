import { BaseEntity, Timestamp } from '@nexus/shared';

export type ReflectionType = 'daily' | 'weekly' | 'monthly' | 'project' | 'free';

export interface Reflection extends BaseEntity {
  title: string;
  content: string;
  type: ReflectionType;
  date: Timestamp;
  mood?: number;
  tags?: string[];
  insights?: string[];
}
