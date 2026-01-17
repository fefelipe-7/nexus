// Event intention types
export type EventIntention = 'work' | 'rest' | 'learn' | 'resolve' | 'connect' | 'health' | 'financial' | 'personal';
export type EventType = 'meeting' | 'focus' | 'rest' | 'flexible' | 'recurring' | 'reminder' | 'deadline';
export type EnergyLevel = 'high' | 'medium' | 'low';
export type EventStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
export type LifeArea = 'work' | 'personal' | 'health' | 'finance' | 'relationships' | 'learning' | 'leisure';
export type ViewMode = 'day' | 'week' | 'month' | 'timeline';

export interface TimeBlock {
    id: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    intention: EventIntention;
    eventType: EventType;
    energyLevel: EnergyLevel;
    status: EventStatus;
    lifeArea: LifeArea;
    priority: 'high' | 'medium' | 'low';
    color: string;
    isFlexible: boolean;
    isRecurring: boolean;
    recurringPattern?: string;
    linkedGoalId?: string;
    linkedProjectId?: string;
    location?: string;
    notes?: string;
    completedAt?: Date;
    actualDuration?: number; // minutes
    tags?: string[];
}

export interface DaySchedule {
    date: Date;
    blocks: TimeBlock[];
    totalScheduledMinutes: number;
    totalFreeMinutes: number;
    occupancyRate: number;
    focusBlocks: number;
    restBlocks: number;
}

export interface WeekSchedule {
    startDate: Date;
    endDate: Date;
    days: DaySchedule[];
    totalOccupancyRate: number;
    dominantArea: LifeArea;
    insight: string;
}

export interface TimeDistribution {
    area: LifeArea;
    minutes: number;
    percentage: number;
    color: string;
    trend?: 'up' | 'down' | 'stable';
}

export interface AgendaInsight {
    id: string;
    type: 'warning' | 'suggestion' | 'achievement' | 'reminder';
    title: string;
    description: string;
    actionable: boolean;
    action?: string;
}

export interface AgendaSummary {
    todayOccupancy: number;
    weekOccupancy: number;
    focusBlocksThisWeek: number;
    restBlocksThisWeek: number;
    upcomingDeadlines: number;
    conflictingEvents: number;
    timeDistribution: TimeDistribution[];
    mainInsight: AgendaInsight;
    insights: AgendaInsight[];
}

export interface AgendaData {
    summary: AgendaSummary;
    today: DaySchedule;
    week: WeekSchedule;
    upcomingBlocks: TimeBlock[];
}

// Labels and colors
export const INTENTION_LABELS: Record<EventIntention, string> = {
    work: 'Trabalhar',
    rest: 'Descansar',
    learn: 'Aprender',
    resolve: 'Resolver',
    connect: 'Conectar',
    health: 'Saúde',
    financial: 'Financeiro',
    personal: 'Pessoal',
};

export const INTENTION_COLORS: Record<EventIntention, string> = {
    work: '#3b82f6',
    rest: '#10b981',
    learn: '#8b5cf6',
    resolve: '#f59e0b',
    connect: '#ec4899',
    health: '#14b8a6',
    financial: '#6366f1',
    personal: '#f97316',
};

export const LIFE_AREA_LABELS: Record<LifeArea, string> = {
    work: 'Trabalho',
    personal: 'Pessoal',
    health: 'Saúde',
    finance: 'Finanças',
    relationships: 'Relacionamentos',
    learning: 'Aprendizado',
    leisure: 'Lazer',
};

export const LIFE_AREA_COLORS: Record<LifeArea, string> = {
    work: '#3b82f6',
    personal: '#f97316',
    health: '#14b8a6',
    finance: '#6366f1',
    relationships: '#ec4899',
    learning: '#8b5cf6',
    leisure: '#10b981',
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
    meeting: 'Reunião',
    focus: 'Foco',
    rest: 'Descanso',
    flexible: 'Flexível',
    recurring: 'Recorrente',
    reminder: 'Lembrete',
    deadline: 'Prazo',
};

export const ENERGY_LABELS: Record<EnergyLevel, string> = {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
};

export const STATUS_LABELS: Record<EventStatus, string> = {
    scheduled: 'Agendado',
    in_progress: 'Em andamento',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    rescheduled: 'Reagendado',
};
