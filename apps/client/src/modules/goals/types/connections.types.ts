import { LifeAreaId } from './life-goals.types';

export type ConnectionImpact = 'high' | 'medium' | 'low' | 'bottleneck';
export type RelationType = 'direct' | 'indirect' | 'support' | 'conflicting';
export type ProjectPriority = 'essential' | 'important' | 'accessory' | 'distraction';

export interface HabitRelation {
    id: string;
    title: string;
    impact: ConnectionImpact;
    type: RelationType;
    consistency: number; // 0-100
    isSustaining: boolean;
}

export interface ProjectRelation {
    id: string;
    title: string;
    impact: ConnectionImpact;
    priority: ProjectPriority;
    status: string;
    progress: number;
}

export interface GoalConnection {
    goalId: string;
    goalTitle: string;
    level: 'life' | 'yearly' | 'short_term';
    areaId: LifeAreaId;

    habits: HabitRelation[];
    projects: ProjectRelation[];

    alignmentScore: number; // 0-100
}

export interface CoherenceIssue {
    id: string;
    title: string;
    type: 'orphan_habit' | 'vague_goal' | 'overloaded_goal' | 'orphan_project' | 'conflicting_habit';
    risk: 'high' | 'medium' | 'low';
    description: string;
    suggestion: string;
}

export interface ConnectionsData {
    metrics: {
        goalsWithHabitsPct: number;
        goalsWithProjectsPct: number;
        strategicProjectPct: number;
        systemCoherence: number;
    };
    connections: GoalConnection[];
    diagnostics: CoherenceIssue[];
}
