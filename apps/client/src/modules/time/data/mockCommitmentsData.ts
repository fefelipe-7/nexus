import type {
    CommitmentsData,
    Commitment,
    CommitmentGroup,
    CommitmentsSummary,
    PressureLevel
} from '../types/commitments.types';

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

// Helper to create dates
const addDays = (days: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() + days);
    return date;
};

const commitments: Commitment[] = [
    // Today - Critical
    {
        id: '1',
        title: 'Reunião de alinhamento Q1',
        description: 'Definir OKRs do trimestre',
        dueDate: today,
        dueTime: '10:00',
        origin: 'calendar',
        type: 'meeting',
        status: 'pending',
        priority: 'critical',
        lifeArea: 'work',
        isRecurring: false,
        createdAt: addDays(-7),
        rescheduledCount: 0,
    },
    {
        id: '2',
        title: 'Pagar fatura Nubank',
        description: 'Vencimento hoje',
        dueDate: today,
        origin: 'financial',
        type: 'payment',
        status: 'pending',
        priority: 'critical',
        lifeArea: 'finance',
        isRecurring: true,
        recurringPattern: 'Mensal',
        createdAt: addDays(-30),
        rescheduledCount: 0,
        tags: ['cartão', 'nubank'],
    },
    // Today - Other
    {
        id: '3',
        title: 'Enviar relatório semanal',
        dueDate: today,
        dueTime: '18:00',
        origin: 'manual',
        type: 'deadline',
        status: 'in_progress',
        priority: 'high',
        lifeArea: 'work',
        isRecurring: true,
        recurringPattern: 'Semanal',
        createdAt: addDays(-2),
        rescheduledCount: 0,
    },
    // Overdue
    {
        id: '4',
        title: 'Responder email do cliente',
        dueDate: addDays(-2),
        origin: 'manual',
        type: 'task',
        status: 'overdue',
        priority: 'high',
        lifeArea: 'work',
        isRecurring: false,
        createdAt: addDays(-5),
        rescheduledCount: 1,
    },
    {
        id: '5',
        title: 'Agendar consulta médica',
        dueDate: addDays(-3),
        origin: 'manual',
        type: 'reminder',
        status: 'overdue',
        priority: 'medium',
        lifeArea: 'health',
        isRecurring: false,
        createdAt: addDays(-10),
        rescheduledCount: 2,
    },
    // This week
    {
        id: '6',
        title: 'Aporte mensal investimentos',
        description: 'R$ 1.500 - Tesouro SELIC',
        dueDate: addDays(2),
        origin: 'financial',
        type: 'payment',
        status: 'pending',
        priority: 'high',
        lifeArea: 'finance',
        linkedGoalId: 'investments',
        isRecurring: true,
        recurringPattern: 'Mensal',
        createdAt: addDays(-25),
        rescheduledCount: 0,
    },
    {
        id: '7',
        title: 'Entrega do projeto Nexus',
        description: 'MVP completo',
        dueDate: addDays(3),
        origin: 'projects',
        type: 'delivery',
        status: 'in_progress',
        priority: 'critical',
        lifeArea: 'work',
        linkedProjectId: 'nexus',
        isRecurring: false,
        createdAt: addDays(-30),
        rescheduledCount: 0,
    },
    {
        id: '8',
        title: 'Check-in meta de reserva',
        description: 'Revisar progresso',
        dueDate: addDays(5),
        origin: 'goals',
        type: 'checkpoint',
        status: 'pending',
        priority: 'medium',
        lifeArea: 'finance',
        linkedGoalId: 'emergency-fund',
        isRecurring: true,
        recurringPattern: 'Semanal',
        createdAt: addDays(-7),
        rescheduledCount: 0,
    },
    // Future
    {
        id: '9',
        title: 'Aniversário da mãe',
        dueDate: addDays(10),
        origin: 'calendar',
        type: 'reminder',
        status: 'pending',
        priority: 'high',
        lifeArea: 'relationships',
        isRecurring: false,
        createdAt: addDays(-60),
        rescheduledCount: 0,
    },
    {
        id: '10',
        title: 'Renovar assinatura Netflix',
        dueDate: addDays(15),
        origin: 'financial',
        type: 'payment',
        status: 'pending',
        priority: 'low',
        lifeArea: 'leisure',
        isRecurring: true,
        recurringPattern: 'Anual',
        createdAt: addDays(-350),
        rescheduledCount: 0,
    },
    // Without date
    {
        id: '11',
        title: 'Organizar fotos do celular',
        origin: 'manual',
        type: 'task',
        status: 'pending',
        priority: 'low',
        lifeArea: 'personal',
        isRecurring: false,
        createdAt: addDays(-20),
        rescheduledCount: 0,
    },
    {
        id: '12',
        title: 'Pesquisar curso de Python',
        origin: 'manual',
        type: 'task',
        status: 'pending',
        priority: 'medium',
        lifeArea: 'learning',
        linkedGoalId: 'learning-2024',
        isRecurring: false,
        createdAt: addDays(-5),
        rescheduledCount: 0,
    },
    // Completed today
    {
        id: '13',
        title: 'Daily standup',
        dueDate: today,
        dueTime: '09:00',
        origin: 'calendar',
        type: 'meeting',
        status: 'completed',
        priority: 'medium',
        lifeArea: 'work',
        isRecurring: true,
        recurringPattern: 'Diário',
        createdAt: addDays(-30),
        completedAt: new Date(),
        rescheduledCount: 0,
    },
];

// Calculate summary
const activeCommitments = commitments.filter(c => c.status !== 'completed' && c.status !== 'cancelled');
const overdueCount = activeCommitments.filter(c => c.status === 'overdue').length;
const dueToday = activeCommitments.filter(c => c.dueDate?.toDateString() === today.toDateString()).length;
const dueThisWeek = activeCommitments.filter(c => {
    if (!c.dueDate) return false;
    const weekEnd = addDays(7);
    return c.dueDate >= today && c.dueDate <= weekEnd;
}).length;
const criticalCount = activeCommitments.filter(c => c.priority === 'critical').length;
const completedToday = commitments.filter(c => c.completedAt?.toDateString() === today.toDateString()).length;
const withoutDateCount = activeCommitments.filter(c => !c.dueDate).length;

// Determine pressure level
let pressureLevel: PressureLevel = 'light';
if (overdueCount >= 3 || criticalCount >= 3) {
    pressureLevel = 'high';
} else if (overdueCount >= 1 || criticalCount >= 2 || dueToday >= 4) {
    pressureLevel = 'moderate';
}

// Generate insight
let insight = {
    type: 'info' as const,
    message: 'Sua carga está equilibrada.',
};
if (overdueCount > 0) {
    insight = {
        type: 'warning',
        message: `Você tem ${overdueCount} compromisso${overdueCount > 1 ? 's' : ''} atrasado${overdueCount > 1 ? 's' : ''}.`,
    };
} else if (criticalCount > 0) {
    insight = {
        type: 'warning',
        message: `${criticalCount} compromisso${criticalCount > 1 ? 's' : ''} crítico${criticalCount > 1 ? 's' : ''} hoje.`,
    };
} else if (completedToday > 0) {
    insight = {
        type: 'success',
        message: `Ótimo! Você já concluiu ${completedToday} compromisso${completedToday > 1 ? 's' : ''} hoje.`,
    };
}

const summary: CommitmentsSummary = {
    totalActive: activeCommitments.length,
    overdueCount,
    dueToday,
    dueThisWeek,
    criticalCount,
    completedToday,
    withoutDateCount,
    pressureLevel,
    insight,
};

// Group by day
const groupedByDay: CommitmentGroup[] = [
    {
        key: 'overdue',
        label: 'Atrasados',
        icon: '⚠️',
        commitments: activeCommitments.filter(c => c.status === 'overdue'),
        count: overdueCount,
    },
    {
        key: 'today',
        label: 'Hoje',
        icon: '📌',
        commitments: activeCommitments.filter(c => c.dueDate?.toDateString() === today.toDateString() && c.status !== 'overdue'),
        count: dueToday,
    },
    {
        key: 'this-week',
        label: 'Esta semana',
        icon: '📅',
        commitments: activeCommitments.filter(c => {
            if (!c.dueDate || c.status === 'overdue') return false;
            if (c.dueDate.toDateString() === today.toDateString()) return false;
            const weekEnd = addDays(7);
            return c.dueDate > today && c.dueDate <= weekEnd;
        }),
        count: 0,
    },
    {
        key: 'later',
        label: 'Mais tarde',
        icon: '🗓️',
        commitments: activeCommitments.filter(c => {
            if (!c.dueDate || c.status === 'overdue') return false;
            return c.dueDate > addDays(7);
        }),
        count: 0,
    },
    {
        key: 'no-date',
        label: 'Sem data',
        icon: '❓',
        commitments: activeCommitments.filter(c => !c.dueDate),
        count: withoutDateCount,
    },
];
groupedByDay.forEach(g => g.count = g.commitments.length);

// Group by area
const areaMap: Record<string, Commitment[]> = {};
activeCommitments.forEach(c => {
    if (!areaMap[c.lifeArea]) areaMap[c.lifeArea] = [];
    areaMap[c.lifeArea].push(c);
});
const groupedByArea: CommitmentGroup[] = Object.entries(areaMap).map(([key, comms]) => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    commitments: comms,
    count: comms.length,
}));

// Group by origin
const originMap: Record<string, Commitment[]> = {};
activeCommitments.forEach(c => {
    if (!originMap[c.origin]) originMap[c.origin] = [];
    originMap[c.origin].push(c);
});
const groupedByOrigin: CommitmentGroup[] = Object.entries(originMap).map(([key, comms]) => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    commitments: comms,
    count: comms.length,
}));

export const mockCommitmentsData: CommitmentsData = {
    summary,
    commitments,
    groupedByDay: groupedByDay.filter(g => g.count > 0),
    groupedByArea,
    groupedByOrigin,
};
