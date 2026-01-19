// Time History Types

export type TimeArea = 'work' | 'personal' | 'health' | 'finance' | 'relationships' | 'learning' | 'projects' | 'untracked';
export type TimeType = 'focus' | 'rest' | 'obligation' | 'leisure' | 'maintenance' | 'gap' | 'interruption';
export type HistoryPeriod = 'today' | 'week' | 'month' | 'quarter' | 'custom';

export interface TimeRecord {
    id: string;
    title: string;
    area: TimeArea;
    type: TimeType;
    startTime: Date;
    endTime: Date;
    duration: number; // in minutes
    plannedId?: string; // ID of the planned event/task/routine
    wasPlanned: boolean;
    status: 'concluded' | 'skipped' | 'extrapolated' | 'cancelled';
    actualDuration?: number;
    interruptions?: number;
    priorityId?: string;
    notes?: string;
}

export interface AreaTimeSummary {
    area: TimeArea;
    totalTime: number; // minutes
    percentage: number;
    plannedTime: number;
    realTime: number;
}

export interface TypeTimeSummary {
    type: TimeType;
    totalTime: number;
    percentage: number;
}

export interface AdherenceMetrics {
    overallScore: number; // 0-100
    percentageConcluded: number;
    percentageSkipped: number;
    percentageExtrapolated: number;
    averageFragmentSize: number; // minutes
    totalDeepWorkTime: number; // minutes
    contextSwitches: number;
}

export interface TimeInsight {
    id: string;
    type: 'success' | 'warning' | 'info' | 'suggestion';
    title: string;
    message: string;
    actionLabel?: string;
}

export interface HistoryData {
    period: HistoryPeriod;
    startDate: Date;
    endDate: Date;
    totalRecordedTime: number;
    summaryByArea: AreaTimeSummary[];
    summaryByType: TypeTimeSummary[];
    records: TimeRecord[];
    metrics: AdherenceMetrics;
    insights: TimeInsight[];
    trend: {
        period: string;
        focusTime: number;
        fragmentation: number;
    }[];
}

// Labels and Constants
export const AREA_LABELS: Record<TimeArea, string> = {
    work: 'Trabalho',
    personal: 'Pessoal',
    health: 'Saúde',
    finance: 'Finanças',
    relationships: 'Relacionamentos',
    learning: 'Aprendizado',
    projects: 'Projetos',
    untracked: 'Não Rastreado',
};

export const TYPE_LABELS: Record<TimeType, string> = {
    focus: 'Foco Profundo',
    rest: 'Descanso e Sono',
    obligation: 'Obrigações',
    leisure: 'Lazer',
    maintenance: 'Manutenção',
    gap: 'Lacuna',
    interruption: 'Interrupção',
};

export const TYPE_COLORS: Record<TimeType, string> = {
    focus: '#8b5cf6',
    rest: '#3b82f6',
    obligation: '#f59e0b',
    leisure: '#10b981',
    maintenance: '#6366f1',
    gap: '#e2e8f0',
    interruption: '#ef4444',
};

export const PERIOD_LABELS: Record<HistoryPeriod, string> = {
    today: 'Hoje',
    week: 'Esta Semana',
    month: 'Este Mês',
    quarter: 'Este Trimestre',
    custom: 'Personalizado',
};
