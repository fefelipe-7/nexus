export type GoalCategory = 'emergency' | 'property' | 'travel' | 'retirement' | 'debt_payoff' | 'freedom' | 'custom';
export type GoalStatus = 'on_track' | 'behind' | 'critical' | 'completed' | 'paused';
export type GoalPriority = 'high' | 'medium' | 'low';

export interface FinancialGoal {
    id: string;
    name: string;
    description?: string;
    category: GoalCategory;
    targetAmount: number;
    currentAmount: number;
    startDate: Date;
    deadline?: Date;
    status: GoalStatus;
    priority: GoalPriority;
    icon: string;
    color: string;
    monthlyContribution: number;
    requiredMonthlyContribution: number;
    linkedAssetIds?: string[];
    linkedBudgetCategoryId?: string;
    notes?: string;
    milestones?: Array<{
        percentage: number;
        reached: boolean;
        reachedAt?: Date;
    }>;
}

export interface GoalsSummary {
    activeCount: number;
    completedCount: number;
    averageProgress: number;
    totalTargetAmount: number;
    totalCurrentAmount: number;
    nextCriticalGoal?: {
        id: string;
        name: string;
        deadline: Date;
        daysLeft: number;
    };
    conflictingGoals: number;
}

export interface FinancialGoalsData {
    summary: GoalsSummary;
    goals: FinancialGoal[];
}

export const GOAL_CATEGORY_LABELS: Record<GoalCategory, string> = {
    emergency: 'Reserva de Emergência',
    property: 'Imóvel',
    travel: 'Viagem',
    retirement: 'Aposentadoria',
    debt_payoff: 'Quitar Dívidas',
    freedom: 'Liberdade Financeira',
    custom: 'Personalizado',
};

export const GOAL_CATEGORY_ICONS: Record<GoalCategory, string> = {
    emergency: '🛡️',
    property: '🏠',
    travel: '✈️',
    retirement: '🏖️',
    debt_payoff: '💳',
    freedom: '🎯',
    custom: '⭐',
};

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
    on_track: 'Em Dia',
    behind: 'Atrasada',
    critical: 'Crítica',
    completed: 'Concluída',
    paused: 'Pausada',
};

export const GOAL_STATUS_COLORS: Record<GoalStatus, string> = {
    on_track: '#10b981',
    behind: '#f59e0b',
    critical: '#ef4444',
    completed: '#3b82f6',
    paused: '#6b7280',
};

export const GOAL_PRIORITY_LABELS: Record<GoalPriority, string> = {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
};
