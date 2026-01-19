// Task types
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low' | 'none';
export type TaskEffort = 'short' | 'medium' | 'long';
export type TaskViewMode = 'list' | 'kanban' | 'project' | 'area' | 'focus';

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
    completedAt?: Date;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    effort?: TaskEffort;
    dueDate?: Date;
    lifeArea?: 'work' | 'personal' | 'health' | 'finance' | 'relationships' | 'learning' | 'leisure';
    linkedProjectId?: string;
    linkedGoalId?: string;
    linkedCommitmentId?: string;
    subtasks: Subtask[];
    tags?: string[];
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    postponedCount: number;
    estimatedMinutes?: number;
    actualMinutes?: number;
}

export interface TaskGroup {
    key: string;
    label: string;
    icon?: string;
    color?: string;
    tasks: Task[];
    count: number;
}

export interface TasksSummary {
    totalActive: number;
    todoCount: number;
    inProgressCount: number;
    overdueCount: number;
    noPriorityCount: number;
    completedToday: number;
    averageCompletionRate: number;
    currentFocus?: Task;
    insight: {
        type: 'warning' | 'success' | 'info' | 'suggestion';
        message: string;
    };
}

export interface TasksData {
    summary: TasksSummary;
    tasks: Task[];
    byStatus: TaskGroup[];
    byProject: TaskGroup[];
    byArea: TaskGroup[];
}

// Labels
export const STATUS_LABELS: Record<TaskStatus, string> = {
    backlog: 'Backlog',
    todo: 'A fazer',
    in_progress: 'Em andamento',
    paused: 'Pausada',
    completed: 'Concluída',
    cancelled: 'Cancelada',
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
    backlog: '#6b7280',
    todo: '#3b82f6',
    in_progress: '#f59e0b',
    paused: '#8b5cf6',
    completed: '#10b981',
    cancelled: '#9ca3af',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
    critical: 'Crítica',
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
    none: 'Sem prioridade',
};

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
    critical: '#ef4444',
    high: '#f59e0b',
    medium: '#3b82f6',
    low: '#6b7280',
    none: '#9ca3af',
};

export const EFFORT_LABELS: Record<TaskEffort, string> = {
    short: 'Curto',
    medium: 'Médio',
    long: 'Longo',
};

export const EFFORT_ICONS: Record<TaskEffort, string> = {
    short: '⚡',
    medium: '⏱️',
    long: '🕐',
};

export const LIFE_AREA_LABELS: Record<string, string> = {
    work: 'Trabalho',
    personal: 'Pessoal',
    health: 'Saúde',
    finance: 'Finanças',
    relationships: 'Relacionamentos',
    learning: 'Aprendizado',
    leisure: 'Lazer',
};

export const LIFE_AREA_COLORS: Record<string, string> = {
    work: '#3b82f6',
    personal: '#f97316',
    health: '#14b8a6',
    finance: '#6366f1',
    relationships: '#ec4899',
    learning: '#8b5cf6',
    leisure: '#10b981',
};
