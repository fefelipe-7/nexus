export type LifeAreaId =
    | 'health'
    | 'finance'
    | 'career'
    | 'relationships'
    | 'personal_development'
    | 'leisure'
    | 'purpose';

export type GoalStatus = 'active' | 'building' | 'paused' | 'archived';

export type AlignmentLevel = 'low' | 'medium' | 'high';

export interface LifeArea {
    id: LifeAreaId;
    name: string;
    icon: string;
    color: string;
}

export interface LifeGoalRevision {
    id: string;
    date: Date;
    note: string;
    changesMade: boolean;
}

export interface LifeGoal {
    id: string;
    title: string;
    description: string; // En primeira pessoa
    fullDescription?: string;
    areaId: LifeAreaId;
    horizon: string; // ex: "5-10 anos", "Contínuo"
    status: GoalStatus;
    clarityDegree: number; // 0-100
    whyItMatters: string;
    successIndicators: string[];
    whatIsNotIncluded: string[];
    relatedMetaIds: string[]; // Conexão com metas mensuráveis
    clarity: number; // Indicador qualitativo 0-100
    progessPerception: number; // 0-100
    consistency: number; // 0-100
    createdAt: Date;
    updatedAt: Date;
    lastReviewedAt?: Date;
    revisions: LifeGoalRevision[];
}

export interface LifeGoalsSummary {
    activeCount: number;
    lastReviewDate?: Date;
    alignmentLevel: AlignmentLevel;
    alignmentMessage: string;
    distribution: Record<LifeAreaId, number>;
}

export interface LifeGoalsData {
    summary: LifeGoalsSummary;
    goals: LifeGoal[];
    areas: LifeArea[];
}
