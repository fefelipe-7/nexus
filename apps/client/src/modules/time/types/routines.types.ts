// Routine types
export type RoutinePeriod = 'morning' | 'afternoon' | 'evening' | 'night' | 'custom';
export type RoutineStatus = 'active' | 'paused' | 'archived';
export type RoutineFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type RoutineItemType = 'habit' | 'task' | 'block' | 'reminder';
export type ExecutionStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'partial';

export interface RoutineItem {
    id: string;
    type: RoutineItemType;
    title: string;
    description?: string;
    duration: number; // minutes
    isOptional: boolean;
    linkedHabitId?: string;
    order: number;
}

export interface Routine {
    id: string;
    name: string;
    description?: string;
    period: RoutinePeriod;
    frequency: RoutineFrequency;
    specificDays?: number[];
    status: RoutineStatus;
    items: RoutineItem[];
    totalDuration: number;
    averageExecutionRate: number;
    currentStreak: number;
    bestStreak: number;
    color: string;
    icon: string;
    createdAt: Date;
    lastExecutedAt?: Date;
}

export interface RoutineExecution {
    date: Date;
    routineId: string;
    status: ExecutionStatus;
    completedItems: string[];
    skippedItems: string[];
    actualDuration: number;
    startedAt?: Date;
    completedAt?: Date;
}

export interface TodayRoutine {
    routine: Routine;
    execution?: RoutineExecution;
    isScheduledToday: boolean;
    suggestedStartTime?: string;
}

export interface RoutinesSummary {
    totalActive: number;
    pausedCount: number;
    executedToday: number;
    scheduledToday: number;
    averageExecutionRate: number;
    weeklyTrend: 'up' | 'down' | 'stable';
    predictabilityScore: number; // 0-100
    insight: {
        type: 'success' | 'warning' | 'info' | 'suggestion';
        message: string;
    };
}

export interface RoutinesData {
    summary: RoutinesSummary;
    routines: Routine[];
    today: TodayRoutine[];
    recentExecutions: RoutineExecution[];
}

// Labels
export const PERIOD_LABELS: Record<RoutinePeriod, string> = {
    morning: 'Manhã',
    afternoon: 'Tarde',
    evening: 'Noite',
    night: 'Madrugada',
    custom: 'Personalizado',
};

export const PERIOD_ICONS: Record<RoutinePeriod, string> = {
    morning: '🌅',
    afternoon: '☀️',
    evening: '🌆',
    night: '🌙',
    custom: '⏰',
};

export const PERIOD_COLORS: Record<RoutinePeriod, string> = {
    morning: '#f59e0b',
    afternoon: '#3b82f6',
    evening: '#8b5cf6',
    night: '#6366f1',
    custom: '#6b7280',
};

export const STATUS_LABELS: Record<RoutineStatus, string> = {
    active: 'Ativa',
    paused: 'Pausada',
    archived: 'Arquivada',
};

export const FREQUENCY_LABELS: Record<RoutineFrequency, string> = {
    daily: 'Diário',
    weekdays: 'Dias úteis',
    weekends: 'Fins de semana',
    custom: 'Personalizado',
};

export const ITEM_TYPE_LABELS: Record<RoutineItemType, string> = {
    habit: 'Hábito',
    task: 'Tarefa',
    block: 'Bloco de tempo',
    reminder: 'Lembrete',
};

export const ITEM_TYPE_ICONS: Record<RoutineItemType, string> = {
    habit: '🔄',
    task: '✅',
    block: '📦',
    reminder: '🔔',
};

export const EXECUTION_STATUS_LABELS: Record<ExecutionStatus, string> = {
    pending: 'Pendente',
    in_progress: 'Em andamento',
    completed: 'Concluída',
    skipped: 'Pulada',
    partial: 'Parcial',
};

export const EXECUTION_STATUS_COLORS: Record<ExecutionStatus, string> = {
    pending: '#6b7280',
    in_progress: '#f59e0b',
    completed: '#10b981',
    skipped: '#9ca3af',
    partial: '#3b82f6',
};
