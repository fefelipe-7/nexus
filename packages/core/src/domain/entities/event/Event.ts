import { BaseEntity, ID, Timestamp } from '@nexus/shared';

export type EventType = 'meeting' | 'deadline' | 'reminder' | 'milestone' | 'other';

export interface Event extends BaseEntity {
  title: string;
  description?: string;
  type: EventType;
  startTime: Timestamp;
  endTime?: Timestamp;
  location?: string;
  participants?: string[];
  tags?: string[];
  relatedGoalId?: ID;
  isAllDay?: boolean;
}
