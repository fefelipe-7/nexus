import { LifeAreaId } from './life-goals.types';

export type PlanComplexity = 'simple' | 'medium' | 'complex';
export type PlanStatus = 'on_track' | 'needs_attention' | 'blocked' | 'inactive' | 'completed';
export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';
export type DependencyType = 'time' | 'money' | 'people' | 'information' | 'energy';

export interface PlanDependency {
    id: string;
    type: DependencyType;
    description: string;
    isResolved: boolean;
}

export interface PlanAction {
    id: string;
    title: string;
    effortEstimate: 'low' | 'medium' | 'high';
    isRecurrent: boolean;
    isCompleted: boolean;
    relatedTaskId?: string;
}

export interface PlanStep {
    id: string;
    order: number;
    title: string;
    status: StepStatus;
    criteriaForCompletion: string;
    actions: PlanAction[];
    dependencies: PlanDependency[];
}

export interface ActionPlan {
    id: string;
    title: string;
    areaId: LifeAreaId;
    shortTermGoalId: string;
    yearlyGoalId?: string;

    description: string;
    expectedResult: string;
    deadline?: Date;

    status: PlanStatus;
    progress: number; // 0-100
    complexity: PlanComplexity;
    impact: 'high' | 'medium' | 'low';

    steps: PlanStep[];

    createdAt: Date;
    updatedAt: Date;
    lastProgressAt?: Date;
}

export interface ActionPlansSummary {
    activeCount: number;
    completedCount: number;
    blockedCount: number;
    needsAttentionCount: number;
    trends: {
        period: string; // ex: "7 dias"
        direction: 'stable' | 'improving' | 'declining';
    };
}

export interface ActionPlansData {
    summary: ActionPlansSummary;
    plans: ActionPlan[];
}
