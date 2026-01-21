export type ReviewType = 'weekly' | 'monthly' | 'quarterly' | 'annual';
export type ReviewStatus = 'scheduled' | 'in_progress' | 'completed' | 'skipped' | 'overdue';
export type AdjustmentType = 'goal_adjustment' | 'plan_revision' | 'archive_goal' | 'new_plan' | 'priority_shift';

export interface AdjustmentDecision {
    id: string;
    type: AdjustmentType;
    title: string;
    description: string;
    targetId?: string; // ID da meta ou plano afetado
    status: 'applied' | 'scheduled' | 'reflecting';
}

export interface ReviewBlock {
    id: string;
    title: string;
    content: string;
    tags?: string[];
    sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface PeriodicReview {
    id: string;
    type: ReviewType;
    title: string;
    date: Date;
    status: ReviewStatus;

    // Reflection Content
    summary: string;
    reflectionBlocks: ReviewBlock[];
    learnings: string[];
    decisions: AdjustmentDecision[];

    // Context Snapshot (at the time of review)
    scoreAtReview: number;
    activeGoalsCount: number;

    createdAt: Date;
    updatedAt: Date;
}

export interface ReviewAgendaItem {
    id: string;
    type: ReviewType;
    scheduledDate: Date;
    status: ReviewStatus;
    lastReviewDate?: Date;
}

export interface ReviewsData {
    agenda: ReviewAgendaItem[];
    history: PeriodicReview[];
}
