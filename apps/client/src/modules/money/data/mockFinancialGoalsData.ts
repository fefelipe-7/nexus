import type { FinancialGoalsData, FinancialGoal, GoalsSummary } from '../types/goals.types';

const goals: FinancialGoal[] = [
    {
        id: '1',
        name: 'Reserva de Emergência',
        description: '6 meses de despesas',
        category: 'emergency',
        targetAmount: 30000,
        currentAmount: 27850,
        startDate: new Date(2024, 0, 1),
        status: 'on_track',
        priority: 'high',
        icon: '🛡️',
        color: '#10b981',
        monthlyContribution: 1000,
        requiredMonthlyContribution: 400,
        linkedAssetIds: ['tesouro-selic'],
        milestones: [
            { percentage: 25, reached: true, reachedAt: new Date(2024, 3, 1) },
            { percentage: 50, reached: true, reachedAt: new Date(2024, 6, 1) },
            { percentage: 75, reached: true, reachedAt: new Date(2024, 9, 1) },
            { percentage: 100, reached: false },
        ],
    },
    {
        id: '2',
        name: 'Aposentadoria',
        description: 'Independência financeira aos 55',
        category: 'retirement',
        targetAmount: 1000000,
        currentAmount: 61900,
        startDate: new Date(2020, 5, 1),
        deadline: new Date(2050, 0, 1),
        status: 'on_track',
        priority: 'high',
        icon: '🏖️',
        color: '#6366f1',
        monthlyContribution: 1500,
        requiredMonthlyContribution: 1200,
        linkedAssetIds: ['ivvb11', 'previdencia'],
        notes: 'Combinação de PGBL e ETFs',
    },
    {
        id: '3',
        name: 'Viagem Europa',
        description: '3 semanas - França, Itália, Espanha',
        category: 'travel',
        targetAmount: 25000,
        currentAmount: 5000,
        startDate: new Date(2025, 8, 1),
        deadline: new Date(2027, 6, 1),
        status: 'behind',
        priority: 'medium',
        icon: '✈️',
        color: '#8b5cf6',
        monthlyContribution: 500,
        requiredMonthlyContribution: 1100,
        milestones: [
            { percentage: 25, reached: false },
            { percentage: 50, reached: false },
            { percentage: 75, reached: false },
            { percentage: 100, reached: false },
        ],
        notes: 'Preciso aumentar aporte ou estender prazo',
    },
    {
        id: '4',
        name: 'Entrada Apartamento',
        description: 'Apartamento maior - 3 quartos',
        category: 'property',
        targetAmount: 150000,
        currentAmount: 16250,
        startDate: new Date(2024, 6, 1),
        deadline: new Date(2028, 0, 1),
        status: 'on_track',
        priority: 'high',
        icon: '🏠',
        color: '#ec4899',
        monthlyContribution: 2500,
        requiredMonthlyContribution: 2400,
        linkedAssetIds: ['cdb-inter'],
    },
    {
        id: '5',
        name: 'Quitar Carro',
        description: 'Liquidar financiamento antecipado',
        category: 'debt_payoff',
        targetAmount: 62500,
        currentAmount: 0,
        startDate: new Date(2025, 10, 1),
        deadline: new Date(2026, 11, 31),
        status: 'critical',
        priority: 'medium',
        icon: '🚗',
        color: '#f59e0b',
        monthlyContribution: 0,
        requiredMonthlyContribution: 5200,
        notes: 'Analisar se vale a pena vs investir',
    },
    {
        id: '6',
        name: 'Fundo para Mac Studio',
        description: 'Upgrade de setup de trabalho',
        category: 'custom',
        targetAmount: 35000,
        currentAmount: 12000,
        startDate: new Date(2025, 6, 1),
        deadline: new Date(2026, 6, 1),
        status: 'on_track',
        priority: 'low',
        icon: '💻',
        color: '#3b82f6',
        monthlyContribution: 2000,
        requiredMonthlyContribution: 1900,
    },
];

// Calculate summary
const activeGoals = goals.filter(g => g.status !== 'completed' && g.status !== 'paused');
const completedGoals = goals.filter(g => g.status === 'completed');

const totalTargetAmount = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
const totalCurrentAmount = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
const averageProgress = activeGoals.length > 0
    ? activeGoals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount) * 100, 0) / activeGoals.length
    : 0;

// Find next critical goal
const goalsWithDeadline = activeGoals.filter(g => g.deadline).sort((a, b) => a.deadline!.getTime() - b.deadline!.getTime());
const nextCritical = goalsWithDeadline[0];
const daysLeft = nextCritical?.deadline
    ? Math.ceil((nextCritical.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

// Count conflicting (behind ou critical)
const conflictingGoals = activeGoals.filter(g => g.status === 'behind' || g.status === 'critical').length;

const summary: GoalsSummary = {
    activeCount: activeGoals.length,
    completedCount: completedGoals.length,
    averageProgress,
    totalTargetAmount,
    totalCurrentAmount,
    nextCriticalGoal: nextCritical ? {
        id: nextCritical.id,
        name: nextCritical.name,
        deadline: nextCritical.deadline!,
        daysLeft,
    } : undefined,
    conflictingGoals,
};

export const mockFinancialGoalsData: FinancialGoalsData = {
    summary,
    goals,
};
