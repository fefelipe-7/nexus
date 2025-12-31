import { BaseEntity, ID, Timestamp, Status, Priority } from '@nexus/shared';

export type ActionType = 'task' | 'habit' | 'activity';

export interface Action extends BaseEntity {
  title: string;
  description?: string;
  type: ActionType;
  status: Status;
  priority?: Priority;
  dueDate?: Timestamp;
  completedAt?: Timestamp;
  estimatedDuration?: number;
  actualDuration?: number;
  tags?: string[];
  relatedGoalId?: ID;
  relatedRoutineId?: ID;
}
