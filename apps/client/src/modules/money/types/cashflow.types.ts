export type TransactionType = 'income' | 'expense';
export type FlowHealth = 'stable' | 'tight' | 'unbalanced' | 'positive';
export type Period = 'today' | 'week' | 'month' | 'custom';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: Date;
  isRecurring?: boolean;
  linkedTo?: {
    type: 'event' | 'task' | 'project';
    id: string;
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  total: number;
  percentage: number;
  color: string;
  transactions: Transaction[];
}

export interface RecurringCommitment {
  id: string;
  name: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDate: Date;
  category: string;
  isActive: boolean;
}

export interface FlowSummary {
  period: Period;
  totalIncome: number;
  totalExpenses: number;
  netFlow: number;
  trend: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
  health: FlowHealth;
}

export interface TimelineDay {
  date: Date;
  income: number;
  expenses: number;
  balance: number;
  isPeak: boolean;
  events?: Array<{
    type: 'income' | 'expense';
    amount: number;
    description: string;
  }>;
}

export interface FutureFlow {
  date: Date;
  expectedIncome: number;
  expectedExpenses: number;
  projectedBalance: number;
  hasRisk: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface CashFlowData {
  summary: FlowSummary;
  timeline: TimelineDay[];
  categories: Category[];
  recurringCommitments: RecurringCommitment[];
  futureFlow: FutureFlow[];
}
