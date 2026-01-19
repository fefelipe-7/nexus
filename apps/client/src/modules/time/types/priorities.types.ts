// Priority types
export type PriorityType = 'strategic' | 'operational' | 'emergency' | 'maintenance';
export type PriorityHorizon = 'today' | 'week' | 'month' | 'quarter';
export type PriorityStatus = 'active' | 'paused' | 'completed' | 'archived';
export type PriorityOrigin = 'goal' | 'manual' | 'context' | 'system';
export type DispersionLevel = 'low' | 'medium' | 'high';

export interface LinkedItem {
    id: string;
    type: 'task' | 'commitment' | 'habit' | 'routine';
    title: string;
    status: 'pending' | 'in_progress' | 'completed';
}

export interface Priority {
    id: string;
    name: string;
    description?: string;
    type: PriorityType;
    horizon: PriorityHorizon;
    lifeArea: 'work' | 'personal' | 'health' | 'finance' | 'relationships' | 'learning' | 'projects';
    status: PriorityStatus;
    origin: PriorityOrigin;
    impact: string;
    linkedItems: LinkedItem[];
    linkedGoalId?: string;
    order: number;
    isDominant: boolean;
    color: string;
    icon: string;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
}

export interface PriorityConflict {
    type: 'too_many_strategic' | 'no_actions' | 'orphan_actions' | 'conflicting_horizons';
    message: string;
    severity: 'info' | 'warning' | 'critical';
    relatedPriorityIds?: string[];
}

export interface PrioritiesSummary {
    totalActive: number;
    dominantPriority?: Priority;
    dispersionLevel: DispersionLevel;
    byType: { type: PriorityType; count: number }[];
    conflicts: PriorityConflict[];
    insight: {
        type: 'success' | 'warning' | 'info' | 'suggestion';
        message: string;
    };
}

export interface PrioritiesData {
    summary: PrioritiesSummary;
    priorities: Priority[];
    byHorizon: { horizon: PriorityHorizon; priorities: Priority[] }[];
    history: { date: Date; priority: Priority; action: 'created' | 'completed' | 'paused' }[];
}

// Labels
export const TYPE_LABELS: Record<PriorityType, string> = {
    strategic: 'Estratégica',
    operational: 'Operacional',
    emergency: 'Emergencial',
    maintenance: 'Manutenção',
};

export const TYPE_ICONS: Record<PriorityType, string> = {
    strategic: '🎯',
    operational: '⚙️',
    emergency: '🚨',
    maintenance: '🔧',
};

export const TYPE_COLORS: Record<PriorityType, string> = {
    strategic: '#8b5cf6',
    operational: '#3b82f6',
    emergency: '#ef4444',
    maintenance: '#6b7280',
};

export const HORIZON_LABELS: Record<PriorityHorizon, string> = {
    today: 'Hoje',
    week: 'Semana',
    month: 'Mês',
    quarter: 'Trimestre',
};

export const STATUS_LABELS: Record<PriorityStatus, string> = {
    active: 'Ativa',
    paused: 'Pausada',
    completed: 'Concluída',
    archived: 'Arquivada',
};

export const ORIGIN_LABELS: Record<PriorityOrigin, string> = {
    goal: 'Meta',
    manual: 'Manual',
    context: 'Contexto',
    system: 'Sistema',
};

export const DISPERSION_LABELS: Record<DispersionLevel, string> = {
    low: 'Foco claro',
    medium: 'Moderado',
    high: 'Disperso',
};

export const DISPERSION_COLORS: Record<DispersionLevel, string> = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
};

export const LIFE_AREA_LABELS: Record<string, string> = {
    work: 'Trabalho',
    personal: 'Pessoal',
    health: 'Saúde',
    finance: 'Finanças',
    relationships: 'Relacionamentos',
    learning: 'Aprendizado',
    projects: 'Projetos',
};

export const LIFE_AREA_COLORS: Record<string, string> = {
    work: '#3b82f6',
    personal: '#f97316',
    health: '#14b8a6',
    finance: '#6366f1',
    relationships: '#ec4899',
    learning: '#8b5cf6',
    projects: '#f59e0b',
};
