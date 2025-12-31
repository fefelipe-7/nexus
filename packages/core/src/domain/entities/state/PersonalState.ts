import { BaseEntity, ID, Timestamp } from '@nexus/shared';

export interface PersonalState extends BaseEntity {
  mood?: number;
  energy?: number;
  stress?: number;
  focus?: number;
  notes?: string;
  timestamp: Timestamp;
  tags?: string[];
}

export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;
export type StressLevel = 1 | 2 | 3 | 4 | 5;
export type FocusLevel = 1 | 2 | 3 | 4 | 5;
