// Commitment types
export type CommitmentOrigin = 'calendar' | 'financial' | 'goals' | 'projects' | 'manual';
export type CommitmentType = 'meeting' | 'deadline' | 'payment' | 'delivery' | 'reminder' | 'task' | 'checkpoint';
export type CommitmentStatus = 'pending' | 'in_progress' | 'completed' | 'overdue' | 'rescheduled' | 'cancelled';
export type CommitmentPriority = 'critical' | 'high' | 'medium' | 'low';
export type PressureLevel = 'light' | 'moderate' | 'high';

export interface Commitment {
    id: string;
    title: string;
    description?: string;
    dueDate?: Date;
    dueTime?: string;
    origin: CommitmentOrigin;
    type: CommitmentType;
    status: CommitmentStatus;
    priority: CommitmentPriority;
    lifeArea: 'work' | 'personal' | 'health' | 'finance' | 'relationships' | 'learning' | 'leisure';
    isRecurring: boolean;
    recurringPattern?: string;
    linkedGoalId?: string;
    linkedProjectId?: string;
    notes?: string;
    createdAt: Date;
    completedAt?: Date;
    rescheduledCount: number;
    tags?: string[];
}

export interface CommitmentGroup {
    key: string;
    label: string;
    icon?: string;
    commitments: Commitment[];
    count: number;
}

export interface CommitmentsSummary {
    totalActive: number;
    overdueCount: number;
    dueToday: number;
    dueThisWeek: number;
    criticalCount: number;
    completedToday: number;
    withoutDateCount: number;
    pressureLevel: PressureLevel;
    insight: {
        type: 'warning' | 'success' | 'info';
        message: string;
    };
}

export interface CommitmentsData {
    summary: CommitmentsSummary;
    commitments: Commitment[];
    groupedByDay: CommitmentGroup[];
    groupedByArea: CommitmentGroup[];
    groupedByOrigin: CommitmentGroup[];
}

// Labels
export const ORIGIN_LABELS: Record<CommitmentOrigin, string> = {
    calendar: 'Agenda',
    financial: 'Financeiro',
    goals: 'Metas',
    projects: 'Projetos',
    manual: 'Manual',
};

export const ORIGIN_COLORS: Record<CommitmentOrigin, string> = {
    calendar: '#3b82f6',
    financial: '#6366f1',
    goals: '#10b981',
    projects: '#8b5cf6',
    manual: '#6b7280',
};

export const TYPE_LABELS: Record<CommitmentType, string> = {
    meeting: 'Reunião',
    deadline: 'Prazo',
    payment: 'Pagamento',
    delivery: 'Entrega',
    reminder: 'Lembrete',
    task: 'Tarefa',
    checkpoint: 'Marco',
};

export const TYPE_ICONS: Record<CommitmentType, string> = {
    meeting: '👥',
    deadline: '⏰',
    payment: '💳',
    delivery: '📦',
    reminder: '🔔',
    task: '✅',
    checkpoint: '🎯',
};

export const STATUS_LABELS: Record<CommitmentStatus, string> = {
    pending: 'Pendente',
    in_progress: 'Em andamento',
    completed: 'Concluído',
    overdue: 'Atrasado',
    rescheduled: 'Reagendado',
    cancelled: 'Cancelado',
};

export const STATUS_COLORS: Record<CommitmentStatus, string> = {
    pending: '#6b7280',
    in_progress: '#3b82f6',
    completed: '#10b981',
    overdue: '#ef4444',
    rescheduled: '#f59e0b',
    cancelled: '#9ca3af',
};

export const PRIORITY_LABELS: Record<CommitmentPriority, string> = {
    critical: 'Crítico',
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
};

export const PRIORITY_COLORS: Record<CommitmentPriority, string> = {
    critical: '#ef4444',
    high: '#f59e0b',
    medium: '#3b82f6',
    low: '#6b7280',
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
