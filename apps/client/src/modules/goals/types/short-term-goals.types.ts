import { LifeAreaId } from './life-goals.types';

export type GoalPriority = 'high' | 'medium' | 'low';
export type ShortTermStatus = 'in_progress' | 'upcoming' | 'at_risk' | 'completed' | 'paused';

export interface Milestone {
    id: string;
    title: string;
    isCompleted: boolean;
    dueDate?: Date;
}

export interface ShortTermGoal {
    id: string;
    title: string;
    areaId: LifeAreaId;
    parentYearlyGoalId: string; // Vínculo com objetivo anual
    parentLifeGoalId?: string;  // Vínculo direto opcional com objetivo de vida

    description: string;
    strategicContext: string; // Por que essa meta existe
    estimatedImpact: string; // Impacto se concluiída

    deadline: Date;
    status: ShortTermStatus;
    priority: GoalPriority;
    progress: number; // 0-100

    milestones: Milestone[];

    // Connections
    relatedTaskIds: string[];
    relatedHabitIds: string[];
    relatedTimeBlockIds: string[];

    // Health/Risk
    isAtRisk: boolean;
    riskReason?: string;
    stagnationDays?: number; // Dias sem progresso

    createdAt: Date;
    updatedAt: Date;
}

export interface ShortTermGoalsSummary {
    activeCount: number;
    completedCount: number;
    atRiskCount: number;
    upcomingCount: number;
    averageDeadlineDays: number;
    trends: {
        status: 'improving' | 'stable' | 'declining';
        message: string;
    };
}

export interface ShortTermGoalsData {
    summary: ShortTermGoalsSummary;
    goals: ShortTermGoal[];
}
