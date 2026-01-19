// Habit types
export type HabitFrequency = 'daily' | 'weekly' | 'custom';
export type HabitStatus = 'active' | 'paused' | 'archived';
export type HabitType = 'positive' | 'negative';
export type CheckStatus = 'done' | 'partial' | 'skipped' | 'missed' | 'pending';

export interface HabitCheck {
    date: Date;
    status: CheckStatus;
    note?: string;
}

export interface Habit {
    id: string;
    title: string;
    description?: string;
    type: HabitType;
    frequency: HabitFrequency;
    targetPerWeek?: number;
    specificDays?: number[]; // 0-6 for Sun-Sat
    lifeArea: 'health' | 'mind' | 'finance' | 'relationships' | 'learning' | 'work' | 'personal';
    status: HabitStatus;
    currentStreak: number;
    bestStreak: number;
    consistencyRate: number;
    createdAt: Date;
    pausedAt?: Date;
    checks: HabitCheck[];
    linkedGoalId?: string;
    reminderTime?: string;
    color: string;
    icon: string;
}

export interface DayHabits {
    date: Date;
    habits: {
        habit: Habit;
        todayCheck?: HabitCheck;
        isScheduledToday: boolean;
    }[];
    completedCount: number;
    totalCount: number;
}

export interface HabitsSummary {
    totalActive: number;
    averageConsistency: number;
    activeStreaks: number;
    pausedCount: number;
    todayCompleted: number;
    todayTotal: number;
    weeklyTrend: 'up' | 'down' | 'stable';
    insight: {
        type: 'success' | 'warning' | 'info' | 'suggestion';
        message: string;
    };
}

export interface WeeklyConsistency {
    day: Date;
    completed: number;
    total: number;
    rate: number;
}

export interface HabitsData {
    summary: HabitsSummary;
    habits: Habit[];
    today: DayHabits;
    weeklyConsistency: WeeklyConsistency[];
    byArea: { area: string; habits: Habit[]; avgConsistency: number }[];
}

// Labels
export const FREQUENCY_LABELS: Record<HabitFrequency, string> = {
    daily: 'Diário',
    weekly: 'Semanal',
    custom: 'Personalizado',
};

export const STATUS_LABELS: Record<HabitStatus, string> = {
    active: 'Ativo',
    paused: 'Pausado',
    archived: 'Arquivado',
};

export const CHECK_STATUS_LABELS: Record<CheckStatus, string> = {
    done: 'Feito',
    partial: 'Parcial',
    skipped: 'Pulado',
    missed: 'Perdido',
    pending: 'Pendente',
};

export const CHECK_STATUS_COLORS: Record<CheckStatus, string> = {
    done: '#10b981',
    partial: '#f59e0b',
    skipped: '#6b7280',
    missed: '#ef4444',
    pending: '#3b82f6',
};

export const LIFE_AREA_LABELS: Record<string, string> = {
    health: 'Saúde',
    mind: 'Mente',
    finance: 'Finanças',
    relationships: 'Relacionamentos',
    learning: 'Aprendizado',
    work: 'Trabalho',
    personal: 'Pessoal',
};

export const LIFE_AREA_COLORS: Record<string, string> = {
    health: '#14b8a6',
    mind: '#8b5cf6',
    finance: '#6366f1',
    relationships: '#ec4899',
    learning: '#f59e0b',
    work: '#3b82f6',
    personal: '#f97316',
};

export const DAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
