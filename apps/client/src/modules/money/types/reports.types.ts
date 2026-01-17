// Report period types
export type ReportPeriod = 'month' | 'quarter' | 'semester' | 'year' | 'custom';
export type ReportType = 'patrimony' | 'cashflow' | 'investments' | 'expenses' | 'goals' | 'timeline';

// Financial KPIs
export interface FinancialKPIs {
    // Patrimony KPIs
    netWorthGrowth: number; // percentage growth in period
    netWorthGrowthAmount: number;
    savingsRate: number; // percentage of income saved
    assetGrowth: number;
    debtReduction: number;

    // Cash Flow KPIs
    averageMonthlyIncome: number;
    averageMonthlyExpense: number;
    averageMonthlySavings: number;
    incomeStability: number; // 0-100 measure of consistency
    expenseStability: number;

    // Investment KPIs
    totalReturn: number;
    realReturn: number; // adjusted for inflation
    contributionConsistency: number; // percentage of months with contributions

    // Behavioral KPIs
    goalCompletionRate: number;
    averageGoalDelay: number; // days
    budgetAdherence: number; // percentage of months within budget
}

// Patrimony evolution data point
export interface PatrimonyDataPoint {
    date: Date;
    cash: number;
    investments: number;
    property: number;
    liabilities: number;
    netWorth: number;
    event?: FinancialEvent;
}

// Cash flow data point
export interface CashFlowDataPoint {
    date: Date;
    income: number;
    expenses: number;
    savings: number;
    savingsRate: number;
}

// Expense by category over time
export interface ExpenseCategoryTrend {
    category: string;
    color: string;
    data: Array<{
        date: Date;
        amount: number;
    }>;
    averageMonthly: number;
    trend: 'up' | 'down' | 'stable';
    trendPercentage: number;
}

// Investment performance
export interface InvestmentPerformance {
    assetClass: string;
    color: string;
    invested: number;
    currentValue: number;
    return: number;
    returnPercentage: number;
    contributions: Array<{
        date: Date;
        amount: number;
    }>;
}

// Goal history
export interface GoalHistory {
    id: string;
    name: string;
    icon: string;
    targetAmount: number;
    status: 'completed' | 'abandoned' | 'active';
    startDate: Date;
    completedDate?: Date;
    plannedDuration: number; // days
    actualDuration?: number; // days
    hadAutoContribution: boolean;
}

// Financial events for timeline
export type EventType =
    | 'goal_completed'
    | 'goal_started'
    | 'major_purchase'
    | 'investment_started'
    | 'debt_paid'
    | 'milestone_reached'
    | 'income_change'
    | 'expense_spike';

export interface FinancialEvent {
    id: string;
    type: EventType;
    date: Date;
    title: string;
    description: string;
    amount?: number;
    impact: 'positive' | 'negative' | 'neutral';
    icon: string;
}

// Automatic insight
export interface FinancialInsight {
    id: string;
    type: 'trend' | 'achievement' | 'warning' | 'suggestion';
    title: string;
    description: string;
    period?: string;
    metric?: string;
    value?: number;
    comparison?: {
        previousValue: number;
        percentageChange: number;
    };
}

// Period comparison
export interface PeriodComparison {
    period1: {
        label: string;
        startDate: Date;
        endDate: Date;
    };
    period2: {
        label: string;
        startDate: Date;
        endDate: Date;
    };
    metrics: {
        income: { period1: number; period2: number; change: number };
        expenses: { period1: number; period2: number; change: number };
        savings: { period1: number; period2: number; change: number };
        netWorth: { period1: number; period2: number; change: number };
        investments: { period1: number; period2: number; change: number };
    };
}

// Main report data structure
export interface ReportsData {
    periodLabel: string;
    startDate: Date;
    endDate: Date;
    kpis: FinancialKPIs;
    mainInsight: FinancialInsight;
    insights: FinancialInsight[];
    patrimonyEvolution: PatrimonyDataPoint[];
    cashFlowHistory: CashFlowDataPoint[];
    expenseTrends: ExpenseCategoryTrend[];
    investmentPerformance: InvestmentPerformance[];
    goalHistory: GoalHistory[];
    timeline: FinancialEvent[];
    bestMonth: { date: Date; savings: number };
    worstMonth: { date: Date; savings: number };
}

// Event type labels
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
    goal_completed: 'Meta Concluída',
    goal_started: 'Nova Meta',
    major_purchase: 'Compra Relevante',
    investment_started: 'Novo Investimento',
    debt_paid: 'Dívida Quitada',
    milestone_reached: 'Marco Atingido',
    income_change: 'Mudança de Renda',
    expense_spike: 'Pico de Gastos',
};

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
    goal_completed: '#10b981',
    goal_started: '#3b82f6',
    major_purchase: '#f59e0b',
    investment_started: '#8b5cf6',
    debt_paid: '#22c55e',
    milestone_reached: '#6366f1',
    income_change: '#14b8a6',
    expense_spike: '#ef4444',
};

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
    patrimony: 'Evolução Patrimonial',
    cashflow: 'Fluxo de Caixa',
    investments: 'Investimentos',
    expenses: 'Gastos',
    goals: 'Metas',
    timeline: 'Linha do Tempo',
};
