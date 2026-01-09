export type BudgetStatus = 'not_configured' | 'within_budget' | 'near_limit' | 'exceeded';
export type BudgetPeriod = 'monthly' | 'weekly' | 'custom';
export type AlertBehavior = 'warn_only' | 'create_critical' | 'ignore';

export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  percentage: number;
  remaining: number;
  status: 'normal' | 'near_limit' | 'exceeded';
  color: string;
  isActive: boolean;
  alertBehavior: AlertBehavior;
}

export interface BudgetOverview {
  totalBudgeted: number;
  totalSpent: number;
  percentageUsed: number;
  remaining: number;
  status: BudgetStatus;
  period: BudgetPeriod;
}

export interface BudgetMonth {
  month: string;
  year: number;
  planned: number;
  actual: number;
  status: BudgetStatus;
  startDate: Date;
  endDate: Date;
}

export interface BudgetAlert {
  id: string;
  type: 'category_exceeded' | 'category_near_limit' | 'budget_compromised' | 'unusual_spending';
  categoryId?: string;
  categoryName?: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  percentage?: number;
  amount?: number;
}

export interface BudgetConfig {
  isConfigured: boolean;
  totalBudget: number;
  categories: BudgetCategory[];
  period: BudgetPeriod;
  startDay?: number;
}

export interface BudgetData {
  overview: BudgetOverview;
  currentMonth: BudgetMonth;
  categories: BudgetCategory[];
  alerts: BudgetAlert[];
  config: BudgetConfig;
}
