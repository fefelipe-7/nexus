import type {
    AgendaData,
    TimeBlock,
    DaySchedule,
    WeekSchedule,
    AgendaSummary,
    TimeDistribution,
    AgendaInsight
} from '../types/agenda.types';

// Helper to create time blocks
const createTimeBlock = (
    id: string,
    title: string,
    hour: number,
    duration: number,
    overrides: Partial<TimeBlock> = {}
): TimeBlock => {
    const now = new Date();
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    return {
        id,
        title,
        startTime,
        endTime,
        intention: 'work',
        eventType: 'meeting',
        energyLevel: 'medium',
        status: 'scheduled',
        lifeArea: 'work',
        priority: 'medium',
        color: '#3b82f6',
        isFlexible: false,
        isRecurring: false,
        ...overrides,
    };
};

// Today's blocks
const todayBlocks: TimeBlock[] = [
    createTimeBlock('1', 'Daily Standup', 9, 30, {
        eventType: 'meeting',
        intention: 'work',
        lifeArea: 'work',
        color: '#3b82f6',
        isRecurring: true,
        recurringPattern: 'Diário',
    }),
    createTimeBlock('2', 'Foco - Projeto Nexus', 10, 120, {
        eventType: 'focus',
        intention: 'work',
        lifeArea: 'work',
        color: '#6366f1',
        energyLevel: 'high',
        priority: 'high',
        linkedProjectId: 'nexus',
        description: 'Desenvolvimento das telas de Agenda',
    }),
    createTimeBlock('3', 'Almoço', 12, 60, {
        eventType: 'rest',
        intention: 'rest',
        lifeArea: 'personal',
        color: '#10b981',
        energyLevel: 'low',
        isFlexible: true,
    }),
    createTimeBlock('4', 'Reunião 1:1 com gestor', 14, 45, {
        eventType: 'meeting',
        intention: 'connect',
        lifeArea: 'work',
        color: '#ec4899',
        priority: 'high',
    }),
    createTimeBlock('5', 'Revisão de investimentos', 15, 30, {
        eventType: 'focus',
        intention: 'financial',
        lifeArea: 'finance',
        color: '#6366f1',
        linkedGoalId: 'investments',
        description: 'Analisar alocação de ativos',
    }),
    createTimeBlock('6', 'Academia', 18, 60, {
        eventType: 'recurring',
        intention: 'health',
        lifeArea: 'health',
        color: '#14b8a6',
        isRecurring: true,
        recurringPattern: 'Seg, Qua, Sex',
        location: 'Smart Fit',
    }),
    createTimeBlock('7', 'Estudo de Inglês', 20, 45, {
        eventType: 'focus',
        intention: 'learn',
        lifeArea: 'learning',
        color: '#8b5cf6',
        linkedGoalId: 'english',
        isRecurring: true,
        recurringPattern: 'Diário',
    }),
];

// Calculate today's schedule
const todayTotalMinutes = todayBlocks.reduce((sum, b) => {
    return sum + (b.endTime.getTime() - b.startTime.getTime()) / 60000;
}, 0);

const today: DaySchedule = {
    date: new Date(),
    blocks: todayBlocks,
    totalScheduledMinutes: todayTotalMinutes,
    totalFreeMinutes: 480 - todayTotalMinutes, // 8h day
    occupancyRate: (todayTotalMinutes / 480) * 100,
    focusBlocks: todayBlocks.filter(b => b.eventType === 'focus').length,
    restBlocks: todayBlocks.filter(b => b.eventType === 'rest').length,
};

// Generate week schedule
const generateWeekDays = (): DaySchedule[] => {
    const days: DaySchedule[] = [];
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);

        const isToday = date.toDateString() === now.toDateString();
        const isWeekend = i === 0 || i === 6;

        const occupancy = isWeekend ? 30 : (70 + Math.random() * 25);
        const scheduledMins = (occupancy / 100) * 480;

        days.push({
            date,
            blocks: isToday ? todayBlocks : [],
            totalScheduledMinutes: scheduledMins,
            totalFreeMinutes: 480 - scheduledMins,
            occupancyRate: occupancy,
            focusBlocks: isWeekend ? 1 : 2 + Math.floor(Math.random() * 2),
            restBlocks: isWeekend ? 3 : 1,
        });
    }

    return days;
};

const weekDays = generateWeekDays();
const avgOccupancy = weekDays.reduce((sum, d) => sum + d.occupancyRate, 0) / 7;

const week: WeekSchedule = {
    startDate: weekDays[0].date,
    endDate: weekDays[6].date,
    days: weekDays,
    totalOccupancyRate: avgOccupancy,
    dominantArea: 'work',
    insight: avgOccupancy > 80
        ? 'Semana com carga alta. Considere ajustar alguns compromissos.'
        : avgOccupancy > 60
            ? 'Semana equilibrada com espaço para foco.'
            : 'Semana tranquila - boa oportunidade para projetos pessoais.',
};

// Time distribution
const timeDistribution: TimeDistribution[] = [
    { area: 'work', minutes: 1800, percentage: 45, color: '#3b82f6', trend: 'stable' },
    { area: 'personal', minutes: 600, percentage: 15, color: '#f97316', trend: 'down' },
    { area: 'health', minutes: 360, percentage: 9, color: '#14b8a6', trend: 'up' },
    { area: 'finance', minutes: 200, percentage: 5, color: '#6366f1', trend: 'stable' },
    { area: 'learning', minutes: 420, percentage: 10.5, color: '#8b5cf6', trend: 'up' },
    { area: 'relationships', minutes: 240, percentage: 6, color: '#ec4899', trend: 'down' },
    { area: 'leisure', minutes: 380, percentage: 9.5, color: '#10b981', trend: 'stable' },
];

// Insights
const mainInsight: AgendaInsight = {
    id: 'main',
    type: 'suggestion',
    title: 'Semana com carga de 82%',
    description: 'Você tem 3 blocos de foco profundo agendados, mas nenhum bloco de descanso consciente fora das refeições.',
    actionable: true,
    action: 'Adicionar pausa',
};

const insights: AgendaInsight[] = [
    {
        id: '1',
        type: 'warning',
        title: '6 horas seguidas de reuniões quarta-feira',
        description: 'Considere redistribuir algumas reuniões.',
        actionable: true,
        action: 'Ver dia',
    },
    {
        id: '2',
        type: 'achievement',
        title: 'Consistência em blocos de saúde',
        description: 'Você manteve 90% dos blocos de exercício este mês.',
        actionable: false,
    },
    {
        id: '3',
        type: 'reminder',
        title: 'Nenhum bloco para metas financeiras',
        description: 'Esta semana não tem tempo reservado para revisão financeira.',
        actionable: true,
        action: 'Agendar',
    },
    {
        id: '4',
        type: 'suggestion',
        title: 'Tempo de aprendizado aumentou 25%',
        description: 'Ótimo progresso nos estudos de Inglês.',
        actionable: false,
    },
];

// Summary
const summary: AgendaSummary = {
    todayOccupancy: today.occupancyRate,
    weekOccupancy: week.totalOccupancyRate,
    focusBlocksThisWeek: weekDays.reduce((sum, d) => sum + d.focusBlocks, 0),
    restBlocksThisWeek: weekDays.reduce((sum, d) => sum + d.restBlocks, 0),
    upcomingDeadlines: 2,
    conflictingEvents: 0,
    timeDistribution,
    mainInsight,
    insights,
};

// Upcoming blocks for timeline
const upcomingBlocks = todayBlocks.filter(b => b.startTime > new Date());

export const mockAgendaData: AgendaData = {
    summary,
    today,
    week,
    upcomingBlocks,
};
