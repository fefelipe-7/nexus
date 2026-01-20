import type {
    PrioritiesData,
    Priority,
    PrioritiesSummary,
    PriorityConflict,
    LinkedItem
} from '../types/priorities.types';

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const addDays = (days: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() + days);
    return date;
};

const priorities: Priority[] = [
    {
        id: '1',
        name: 'Quitar dívidas',
        description: 'Eliminar todas as dívidas de cartão e empréstimos',
        type: 'strategic',
        horizon: 'quarter',
        lifeArea: 'finance',
        status: 'active',
        origin: 'goal',
        impact: 'Liberdade financeira e redução de estresse',
        linkedItems: [
            { id: 't1', type: 'task', title: 'Revisar extrato do cartão', status: 'completed' },
            { id: 't2', type: 'task', title: 'Negociar juros do empréstimo', status: 'pending' },
            { id: 'c1', type: 'commitment', title: 'Pagamento parcela empréstimo', status: 'pending' },
            { id: 'h1', type: 'habit', title: 'Revisar finanças', status: 'in_progress' },
        ],
        linkedGoalId: 'debt-free',
        order: 1,
        isDominant: true,
        color: '#6366f1',
        icon: '💰',
        createdAt: addDays(-60),
        updatedAt: addDays(-2),
    },
    {
        id: '2',
        name: 'Entregar projeto Nexus',
        description: 'Finalizar MVP do módulo Tempo',
        type: 'operational',
        horizon: 'week',
        lifeArea: 'work',
        status: 'active',
        origin: 'manual',
        impact: 'Progresso profissional e satisfação pessoal',
        linkedItems: [
            { id: 't3', type: 'task', title: 'Implementar tela de Prioridades', status: 'in_progress' },
            { id: 't4', type: 'task', title: 'Testes de integração', status: 'pending' },
            { id: 'r1', type: 'routine', title: 'Início do trabalho', status: 'in_progress' },
        ],
        linkedGoalId: 'nexus-mvp',
        order: 2,
        isDominant: false,
        color: '#3b82f6',
        icon: '💼',
        createdAt: addDays(-14),
        updatedAt: addDays(-1),
    },
    {
        id: '3',
        name: 'Manter consistência de treino',
        description: '4x por semana na academia',
        type: 'maintenance',
        horizon: 'month',
        lifeArea: 'health',
        status: 'active',
        origin: 'goal',
        impact: 'Saúde física e energia para outras áreas',
        linkedItems: [
            { id: 'h2', type: 'habit', title: 'Treino na academia', status: 'in_progress' },
            { id: 'r2', type: 'routine', title: 'Sessão de treino', status: 'in_progress' },
        ],
        linkedGoalId: 'health-habits',
        order: 3,
        isDominant: false,
        color: '#14b8a6',
        icon: '💪',
        createdAt: addDays(-90),
        updatedAt: addDays(-7),
    },
    {
        id: '4',
        name: 'Resolver problema de internet',
        description: 'Contatar operadora e resolver instabilidade',
        type: 'emergency',
        horizon: 'today',
        lifeArea: 'personal',
        status: 'active',
        origin: 'context',
        impact: 'Estabilidade para trabalho remoto',
        linkedItems: [
            { id: 't5', type: 'task', title: 'Ligar para suporte', status: 'pending' },
        ],
        order: 4,
        isDominant: false,
        color: '#ef4444',
        icon: '🚨',
        createdAt: today,
        updatedAt: today,
    },
    {
        id: '5',
        name: 'Estudar para certificação',
        description: 'AWS Solutions Architect',
        type: 'strategic',
        horizon: 'quarter',
        lifeArea: 'learning',
        status: 'paused',
        origin: 'goal',
        impact: 'Evolução profissional e novas oportunidades',
        linkedItems: [
            { id: 'h3', type: 'habit', title: 'Estudar 1h/dia', status: 'pending' },
        ],
        linkedGoalId: 'aws-cert',
        order: 5,
        isDominant: false,
        color: '#8b5cf6',
        icon: '📚',
        createdAt: addDays(-30),
        updatedAt: addDays(-10),
    },
];

// Active priorities
const activePriorities = priorities.filter(p => p.status === 'active');

// Dominant priority
const dominantPriority = priorities.find(p => p.isDominant);

// Dispersion level
let dispersionLevel: 'low' | 'medium' | 'high' = 'low';
if (activePriorities.length > 5) dispersionLevel = 'high';
else if (activePriorities.length > 3) dispersionLevel = 'medium';

// By type
const byType = [
    { type: 'strategic' as const, count: activePriorities.filter(p => p.type === 'strategic').length },
    { type: 'operational' as const, count: activePriorities.filter(p => p.type === 'operational').length },
    { type: 'emergency' as const, count: activePriorities.filter(p => p.type === 'emergency').length },
    { type: 'maintenance' as const, count: activePriorities.filter(p => p.type === 'maintenance').length },
].filter(t => t.count > 0);

// Conflicts
const conflicts: PriorityConflict[] = [];
const strategicCount = activePriorities.filter(p => p.type === 'strategic').length;
if (strategicCount > 2) {
    conflicts.push({
        type: 'too_many_strategic',
        message: `${strategicCount} prioridades estratégicas ativas. Considere focar em menos.`,
        severity: 'warning',
        relatedPriorityIds: activePriorities.filter(p => p.type === 'strategic').map(p => p.id),
    });
}

const noActionsPriorities = activePriorities.filter(p => p.linkedItems.length === 0);
if (noActionsPriorities.length > 0) {
    conflicts.push({
        type: 'no_actions',
        message: `${noActionsPriorities.length} prioridade(s) sem ações vinculadas.`,
        severity: 'info',
        relatedPriorityIds: noActionsPriorities.map(p => p.id),
    });
}

// Insight
let insight: PrioritiesSummary['insight'] = {
    type: 'info',
    message: 'Suas prioridades estão equilibradas.',
};

if (dominantPriority) {
    insight = {
        type: 'success',
        message: `Foco principal: ${dominantPriority.name}`,
    };
}

if (dispersionLevel === 'high') {
    insight = {
        type: 'warning',
        message: 'Muitas prioridades concorrentes. Simplifique para manter o foco.',
    };
}

// Summary
const summary: PrioritiesSummary = {
    totalActive: activePriorities.length,
    dominantPriority,
    dispersionLevel,
    byType,
    conflicts,
    insight,
};

// By horizon
const byHorizon = [
    { horizon: 'today' as const, priorities: priorities.filter(p => p.horizon === 'today' && p.status === 'active') },
    { horizon: 'week' as const, priorities: priorities.filter(p => p.horizon === 'week' && p.status === 'active') },
    { horizon: 'month' as const, priorities: priorities.filter(p => p.horizon === 'month' && p.status === 'active') },
    { horizon: 'quarter' as const, priorities: priorities.filter(p => p.horizon === 'quarter' && p.status === 'active') },
].filter(h => h.priorities.length > 0);

// History
const history = [
    { date: addDays(-60), priority: priorities[0], action: 'created' as const },
    { date: addDays(-30), priority: priorities[4], action: 'created' as const },
    { date: addDays(-10), priority: priorities[4], action: 'paused' as const },
    { date: addDays(-14), priority: priorities[1], action: 'created' as const },
];

export const mockPrioritiesData: PrioritiesData = {
    summary,
    priorities,
    byHorizon,
    history,
};
