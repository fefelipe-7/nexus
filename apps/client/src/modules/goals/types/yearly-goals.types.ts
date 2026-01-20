import { LifeAreaId } from './life-goals.types';

export type GoalImportance = 'high' | 'medium';
export type YearlyStatus = 'planned' | 'active' | 'paused' | 'completed' | 'abandoned';
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Year' | 'H1' | 'H2';

export interface YearlyGoalRevision {
    id: string;
    date: Date;
    note: string;
    type: 'scope_adjustment' | 'priority_change' | 'status_update';
}

export interface YearlyGoal {
    id: string;
    title: string;
    description: string;
    whyThisYear: string;
    impactIfAchieved: string;
    riskIfIgnored: string;
    areaId: LifeAreaId;
    relatedLifeGoalId: string;
    importance: GoalImportance;
    status: YearlyStatus;
    period: Quarter;
    successCriteria: string[];

    // Connections/Metrics
    activeMetaIds: string[];
    perceivedConsistency: number; // 0-100
    timeInvestedHours?: number;
    financialImpact?: number;

    createdAt: Date;
    updatedAt: Date;
    lastReviewedAt?: Date;
    revisions: YearlyGoalRevision[];
}

export interface YearlyGoalsSummary {
    year: number;
    activeCount: number;
    completedCount: number;
    yearProgress: number; // 0-100 (percentage of the year elapsed)
    status: 'balanced' | 'overloaded' | 'fragmented';
    messages: string[];
    distribution: Record<LifeAreaId, number>;
}

export interface YearlyGoalsData {
    summary: YearlyGoalsSummary;
    goals: YearlyGoal[];
}
