import { LifeAreaId } from './life-goals.types';

export type TrendDirection = 'improving' | 'stable' | 'declining';
export type ProgressContext = 'general' | 'life_goal' | 'yearly_goal' | 'short_term_goal';

export interface ProgressScore {
    value: number; // 0-100
    trend: TrendDirection;
    interpretation: string; // Ex: "Progresso consistente"
    narrative: string; // Ex: "Você está mantendo um ritmo acima da média..."
}

export interface LifeKPI {
    id: string;
    title: string;
    value: string | number;
    unit?: string;
    variation?: string; // Ex: "+15%"
    trend: TrendDirection;
    interpretation: string;
    category: 'rhythm' | 'completion' | 'consistency' | 'focus';
}

export interface GoalLayerProgress {
    id: string;
    title: string;
    level: 'life' | 'yearly' | 'short_term' | 'action_plan';
    progress: number;
    status: 'on_track' | 'needs_attention' | 'at_risk';
    bottleneck?: string;
    children?: GoalLayerProgress[];
}

export interface Bottleneck {
    id: string;
    title: string;
    impact: 'high' | 'medium' | 'low';
    origin: 'time' | 'energy' | 'money' | 'structure';
    description: string;
    suggestion: string;
}

export interface TemporalTrend {
    date: Date;
    planned: number;
    real: number;
}

export interface ProgressIndicatorsData {
    score: ProgressScore;
    kpis: LifeKPI[];
    hierarchy: GoalLayerProgress[];
    bottlenecks: Bottleneck[];
    temporalTrends: TemporalTrend[];
    recommendations: {
        title: string;
        description: string;
        action: string;
    }[];
}
