export interface Alert {
  id: string;
  title: string;
  description: string;
  reason: string;
  severity: 'positive' | 'neutral' | 'attention' | 'critical';
  domain: 'money' | 'health' | 'time' | 'legal' | 'goals';
  linkedEntity?: {
    type: 'record' | 'event' | 'project';
    id: string;
    label: string;
  };
  suggestedAction?: {
    label: string;
    action: () => void;
  };
}

export interface DailySummary {
  commitments: number;
  pendingTasks: number;
  plannedExpense?: {
    amount: number;
    category: string;
  };
  narrative: string;
}

export interface CriticalPendingItem {
  id: string;
  title: string;
  deadline: Date;
  whyCritical: string;
  linkedEntity: {
    type: 'record' | 'event' | 'project';
    id: string;
  };
}

export interface UpcomingEvent {
  id: string;
  title: string;
  dateTime: Date;
  participants: Array<{
    name: string;
    avatar?: string;
  }>;
  eventType: string;
}

export interface QuickIndicator {
  domain: 'money' | 'health' | 'time' | 'mood' | 'goals' | 'projects';
  label: string;
  status: 'positive' | 'neutral' | 'attention' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  icon: string;
}

export interface WeeklySummary {
  highlights: string[];
  concerns: string[];
  trends: {
    money: 'up' | 'down' | 'stable';
    health: 'up' | 'down' | 'stable';
    time: 'up' | 'down' | 'stable';
  };
  aiSummary: string;
}

export interface Suggestion {
  id: string;
  type: 'organizational' | 'preventive' | 'optimization' | 'reflective';
  message: string;
  reason: string;
  action?: {
    label: string;
    callback: () => void;
  };
}

export interface ContextData {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: number;
  stressLevel: 'low' | 'medium' | 'high';
  pendingCount: number;
  recentActivityLevel: 'low' | 'medium' | 'high';
}

export interface OverviewState {
  greeting: string;
  dateContext: string;
  lifeSummary: string;
  alerts: Alert[];
  dailySummary: DailySummary;
  criticalPending: CriticalPendingItem[];
  upcomingEvents: UpcomingEvent[];
  indicators: QuickIndicator[];
  weeklySummary: WeeklySummary;
  suggestions: Suggestion[];
  context: ContextData;
}
