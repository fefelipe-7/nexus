import { BaseEntity, ID, Timestamp, Status } from '@nexus/shared';

export type GoalType = 'short-term' | 'medium-term' | 'long-term' | 'habit';
export type GoalCategory = 'personal' | 'professional' | 'health' | 'learning' | 'financial' | 'other';

export interface Goal extends BaseEntity {
  title: string;
  description?: string;
  type: GoalType;
  category: GoalCategory;
  status: Status;
  targetDate?: Timestamp;
  progress?: number;
  milestones?: Milestone[];
  tags?: string[];
  parentGoalId?: ID;
}

export interface Milestone {
  id: ID;
  title: string;
  completed: boolean;
  completedAt?: Timestamp;
}
