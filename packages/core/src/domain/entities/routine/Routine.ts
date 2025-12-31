import { BaseEntity, ID, Timestamp } from '@nexus/shared';

export type RoutineFrequency = 'daily' | 'weekly' | 'monthly';

export interface Routine extends BaseEntity {
  title: string;
  description?: string;
  frequency: RoutineFrequency;
  timeOfDay?: string;
  duration?: number;
  tags?: string[];
  isActive: boolean;
}

export interface RoutineLog extends BaseEntity {
  routineId: ID;
  completedAt: Timestamp;
  notes?: string;
  mood?: number;
}
