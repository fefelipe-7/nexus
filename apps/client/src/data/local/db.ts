import Dexie, { Table } from 'dexie';

export interface PersonalState {
  id?: number;
  timestamp: Date;
  mood?: number;
  energy?: number;
  stress?: number;
  notes?: string;
  tags?: string[];
}

export interface Action {
  id?: number;
  title: string;
  description?: string;
  type: 'task' | 'habit' | 'activity';
  status: 'planned' | 'in-progress' | 'completed' | 'abandoned';
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  tags?: string[];
  relatedGoalId?: number;
}

export interface Event {
  id?: number;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  type: 'scheduled' | 'unexpected';
  category?: string;
  tags?: string[];
}

export interface Goal {
  id?: number;
  title: string;
  description?: string;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  priority?: number;
  createdAt: Date;
  targetDate?: Date;
  completedAt?: Date;
  progress?: number;
  tags?: string[];
}

export interface Routine {
  id?: number;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetDays?: number[];
  active: boolean;
  createdAt: Date;
  tags?: string[];
}

export interface RoutineLog {
  id?: number;
  routineId: number;
  timestamp: Date;
  completed: boolean;
  notes?: string;
}

export interface Knowledge {
  id?: number;
  title: string;
  content: string;
  type: 'note' | 'idea' | 'learning' | 'documentation';
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  relatedIds?: number[];
}

export interface Reflection {
  id?: number;
  title?: string;
  content: string;
  type: 'journal' | 'review' | 'retrospective';
  timestamp: Date;
  period?: string;
  tags?: string[];
  relatedDomains?: string[];
}

export interface AIInsight {
  id?: number;
  type: 'summary' | 'pattern' | 'correlation' | 'anomaly';
  domain: string;
  content: string;
  confidence: number;
  generatedAt: Date;
  period: string;
  metadata?: any;
}

export class NexusDB extends Dexie {
  personalStates!: Table<PersonalState>;
  actions!: Table<Action>;
  events!: Table<Event>;
  goals!: Table<Goal>;
  routines!: Table<Routine>;
  routineLogs!: Table<RoutineLog>;
  knowledge!: Table<Knowledge>;
  reflections!: Table<Reflection>;
  aiInsights!: Table<AIInsight>;

  constructor() {
    super('nexusDB');
    this.version(1).stores({
      personalStates: '++id, timestamp, mood, energy, stress',
      actions: '++id, title, type, status, createdAt, completedAt, dueDate, relatedGoalId',
      events: '++id, title, startTime, endTime, type',
      goals: '++id, title, status, priority, createdAt, targetDate, completedAt',
      routines: '++id, title, frequency, active, createdAt',
      routineLogs: '++id, routineId, timestamp, completed',
      knowledge: '++id, title, type, createdAt, updatedAt',
      reflections: '++id, type, timestamp',
      aiInsights: '++id, type, domain, generatedAt, period',
    });
  }
}

export const db = new NexusDB();
