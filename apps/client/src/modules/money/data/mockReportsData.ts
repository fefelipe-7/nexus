import type {
    ReportsData,
    FinancialKPIs,
    PatrimonyDataPoint,
    CashFlowDataPoint,
    ExpenseCategoryTrend,
    InvestmentPerformance,
    GoalHistory,
    FinancialEvent,
    FinancialInsight
} from '../types/reports.types';

// Generate 12 months of patrimony data
const patrimonyEvolution: PatrimonyDataPoint[] = [];
for (let i = 11; i >= 0; i--) {
    const date = new Date(2026, 0 - i, 1);
    const baseMultiplier = 1 + (11 - i) * 0.015;

    patrimonyEvolution.push({
        date,
        cash: Math.round(35000 * baseMultiplier),
        investments: Math.round(140000 * baseMultiplier * 1.02),
        property: 545000,
        liabilities: Math.round(400000 - (11 - i) * 5000),
        netWorth: Math.round(320000 + (11 - i) * 8000),
    });
}

// Add events to some data points
patrimonyEvolution[3].event = {
    id: 'e1',
    type: 'investment_started',
    date: patrimonyEvolution[3].date,
    title: 'Início de investimento em ETF',
    description: 'Primeiro aporte no IVVB11',
    amount: 5000,
    impact: 'positive',
    icon: '📈',
};

patrimonyEvolution[7].event = {
    id: 'e2',
    type: 'milestone_reached',
    date: patrimonyEvolution[7].date,
    title: 'Patrimônio ultrapassou R$ 380k',
    description: 'Marco importante atingido',
    amount: 380000,
    impact: 'positive',
    icon: '🎯',
};

patrimonyEvolution[10].event = {
    id: 'e3',
    type: 'goal_completed',
    date: patrimonyEvolution[10].date,
    title: 'Reserva 90% completa',
    description: 'Reserva de emergência quase concluída',
    amount: 27000,
    impact: 'positive',
    icon: '🛡️',
};

// Cash flow history
const cashFlowHistory: CashFlowDataPoint[] = [];
for (let i = 11; i >= 0; i--) {
    const date = new Date(2026, 0 - i, 1);
    const income = 12000 + Math.random() * 3000;
    const baseExpense = 8000 + Math.random() * 2000;
    const seasonalFactor = [10, 11, 0].includes(date.getMonth()) ? 1.3 : 1;
    const expenses = baseExpense * seasonalFactor;
    const savings = income - expenses;

    cashFlowHistory.push({
        date,
        income: Math.round(income),
        expenses: Math.round(expenses),
        savings: Math.round(savings),
        savingsRate: Math.round((savings / income) * 100),
    });
}

// Expense trends by category
const expenseTrends: ExpenseCategoryTrend[] = [
    {
        category: 'Moradia',
        color: '#3b82f6',
        data: cashFlowHistory.map(cf => ({ date: cf.date, amount: 2500 + Math.random() * 200 })),
        averageMonthly: 2600,
        trend: 'stable',
        trendPercentage: 2,
    },
    {
        category: 'Alimentação',
        color: '#10b981',
        data: cashFlowHistory.map(cf => ({ date: cf.date, amount: 1200 + Math.random() * 400 })),
        averageMonthly: 1400,
        trend: 'up',
        trendPercentage: 12,
    },
    {
        category: 'Transporte',
        color: '#f59e0b',
        data: cashFlowHistory.map(cf => ({ date: cf.date, amount: 800 + Math.random() * 300 })),
        averageMonthly: 950,
        trend: 'down',
        trendPercentage: -8,
    },
    {
        category: 'Lazer',
        color: '#8b5cf6',
        data: cashFlowHistory.map(cf => ({ date: cf.date, amount: 600 + Math.random() * 500 })),
        averageMonthly: 850,
        trend: 'up',
        trendPercentage: 18,
    },
    {
        category: 'Saúde',
        color: '#ec4899',
        data: cashFlowHistory.map(cf => ({ date: cf.date, amount: 400 + Math.random() * 200 })),
        averageMonthly: 500,
        trend: 'stable',
        trendPercentage: 3,
    },
];

// Investment performance
const investmentPerformance: InvestmentPerformance[] = [
    {
        assetClass: 'Renda Fixa',
        color: '#10b981',
        invested: 60000,
        currentValue: 65900,
        return: 5900,
        returnPercentage: 9.8,
        contributions: cashFlowHistory.map(cf => ({ date: cf.date, amount: 1000 + Math.random() * 500 })),
    },
    {
        assetClass: 'Ações',
        color: '#3b82f6',
        invested: 32000,
        currentValue: 37980,
        return: 5980,
        returnPercentage: 18.7,
        contributions: cashFlowHistory.map(cf => ({ date: cf.date, amount: 500 + Math.random() * 300 })),
    },
    {
        assetClass: 'Fundos',
        color: '#8b5cf6',
        invested: 10000,
        currentValue: 11200,
        return: 1200,
        returnPercentage: 12,
        contributions: [],
    },
    {
        assetClass: 'Cripto',
        color: '#f59e0b',
        invested: 13000,
        currentValue: 23000,
        return: 10000,
        returnPercentage: 76.9,
        contributions: [
            { date: new Date(2023, 10, 1), amount: 8000 },
            { date: new Date(2024, 1, 1), amount: 5000 },
        ],
    },
    {
        assetClass: 'Previdência',
        color: '#6366f1',
        invested: 35000,
        currentValue: 38500,
        return: 3500,
        returnPercentage: 10,
        contributions: cashFlowHistory.map(cf => ({ date: cf.date, amount: 500 })),
    },
];

// Goal history
const goalHistory: GoalHistory[] = [
    {
        id: '1',
        name: 'Reserva de Emergência',
        icon: '🛡️',
        targetAmount: 30000,
        status: 'active',
        startDate: new Date(2024, 0, 1),
        plannedDuration: 365,
        hadAutoContribution: true,
    },
    {
        id: '2',
        name: 'Viagem Chile',
        icon: '✈️',
        targetAmount: 8000,
        status: 'completed',
        startDate: new Date(2024, 6, 1),
        completedDate: new Date(2025, 5, 15),
        plannedDuration: 180,
        actualDuration: 350,
        hadAutoContribution: false,
    },
    {
        id: '3',
        name: 'Curso de Inglês',
        icon: '📚',
        targetAmount: 5000,
        status: 'completed',
        startDate: new Date(2025, 0, 1),
        completedDate: new Date(2025, 8, 1),
        plannedDuration: 180,
        actualDuration: 240,
        hadAutoContribution: true,
    },
    {
        id: '4',
        name: 'Fundo PS5',
        icon: '🎮',
        targetAmount: 4500,
        status: 'abandoned',
        startDate: new Date(2024, 8, 1),
        plannedDuration: 120,
        hadAutoContribution: false,
    },
];

// Financial timeline events
const timeline: FinancialEvent[] = [
    {
        id: 't1',
        type: 'investment_started',
        date: new Date(2024, 2, 15),
        title: 'Início investimento IVVB11',
        description: 'Primeiro aporte em ETF do S&P 500',
        amount: 5000,
        impact: 'positive',
        icon: '📈',
    },
    {
        id: 't2',
        type: 'major_purchase',
        date: new Date(2024, 5, 20),
        title: 'Maior gasto do semestre',
        description: 'Compra de MacBook Pro',
        amount: 18000,
        impact: 'negative',
        icon: '💻',
    },
    {
        id: 't3',
        type: 'goal_completed',
        date: new Date(2025, 5, 15),
        title: 'Meta concluída: Viagem Chile',
        description: 'Primeira meta de viagem atingida',
        amount: 8000,
        impact: 'positive',
        icon: '✈️',
    },
    {
        id: 't4',
        type: 'milestone_reached',
        date: new Date(2025, 8, 1),
        title: 'Patrimônio R$ 350k',
        description: 'Patrimônio líquido ultrapassou R$ 350.000',
        amount: 350000,
        impact: 'positive',
        icon: '🎯',
    },
    {
        id: 't5',
        type: 'debt_paid',
        date: new Date(2025, 10, 1),
        title: 'Cheque especial quitado',
        description: 'Eliminação do cheque especial',
        amount: 3500,
        impact: 'positive',
        icon: '✅',
    },
    {
        id: 't6',
        type: 'income_change',
        date: new Date(2025, 11, 1),
        title: 'Aumento salarial',
        description: 'Novo cargo com aumento de 15%',
        amount: 1800,
        impact: 'positive',
        icon: '💰',
    },
    {
        id: 't7',
        type: 'goal_completed',
        date: new Date(2025, 8, 1),
        title: 'Meta concluída: Curso Inglês',
        description: 'Investimento em educação concluído',
        amount: 5000,
        impact: 'positive',
        icon: '📚',
    },
];

// Calculate KPIs
const kpis: FinancialKPIs = {
    netWorthGrowth: 18.4,
    netWorthGrowthAmount: 56000,
    savingsRate: 28,
    assetGrowth: 22.5,
    debtReduction: 13.7,
    averageMonthlyIncome: 13500,
    averageMonthlyExpense: 9700,
    averageMonthlySavings: 3800,
    incomeStability: 85,
    expenseStability: 72,
    totalReturn: 26580,
    realReturn: 20200,
    contributionConsistency: 92,
    goalCompletionRate: 66.7,
    averageGoalDelay: 75,
    budgetAdherence: 78,
};

// Insights
const mainInsight: FinancialInsight = {
    id: 'main',
    type: 'achievement',
    title: 'Seu patrimônio cresceu 18% neste período',
    description: 'Este foi seu melhor ano em crescimento patrimonial. Você manteve consistência nos aportes e reduziu dívidas.',
    value: 18.4,
    comparison: {
        previousValue: 12.3,
        percentageChange: 49.6,
    },
};

const insights: FinancialInsight[] = [
    {
        id: 'i1',
        type: 'trend',
        title: 'Taxa de poupança estável',
        description: 'Você manteve uma taxa de poupança média de 28%, acima da média brasileira de 15%.',
        metric: 'Taxa de Poupança',
        value: 28,
    },
    {
        id: 'i2',
        type: 'warning',
        title: 'Gastos com lazer aumentaram',
        description: 'Seus gastos com lazer cresceram 18% no período. Considerar se está alinhado com seus objetivos.',
        metric: 'Lazer',
        value: 18,
    },
    {
        id: 'i3',
        type: 'achievement',
        title: 'Consistência em aportes',
        description: 'Você fez aportes em 92% dos meses, mostrando excelente disciplina.',
        metric: 'Aportes',
        value: 92,
    },
    {
        id: 'i4',
        type: 'suggestion',
        title: 'Metas com aporte automático',
        description: 'Metas com aporte automático têm 80% mais chance de serem concluídas no seu histórico.',
    },
    {
        id: 'i5',
        type: 'trend',
        title: 'Redução de dívidas',
        description: 'Você reduziu suas dívidas em 13.7%, equivalente a R$ 55.000 no período.',
        value: 13.7,
    },
];

// Best and worst months
const sortedBysSavings = [...cashFlowHistory].sort((a, b) => b.savings - a.savings);
const bestMonth = { date: sortedBysSavings[0].date, savings: sortedBysSavings[0].savings };
const worstMonth = { date: sortedBysSavings[sortedBysSavings.length - 1].date, savings: sortedBysSavings[sortedBysSavings.length - 1].savings };

export const mockReportsData: ReportsData = {
    periodLabel: 'Últimos 12 meses',
    startDate: new Date(2025, 1, 1),
    endDate: new Date(2026, 0, 31),
    kpis,
    mainInsight,
    insights,
    patrimonyEvolution,
    cashFlowHistory,
    expenseTrends,
    investmentPerformance,
    goalHistory,
    timeline: timeline.sort((a, b) => b.date.getTime() - a.date.getTime()),
    bestMonth,
    worstMonth,
};
