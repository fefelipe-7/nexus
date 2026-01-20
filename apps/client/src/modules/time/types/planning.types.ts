// Weekly Planning Types

export type PlanningStepId = 'review' | 'focus' | 'capacity' | 'blocks' | 'tasks' | 'routines' | 'confirmation';

export interface WeeklyPriority {
    id: string;
    name: string;
    icon: string;
    isDominant: boolean;
    type: 'strategic' | 'tactical' | 'operational';
    areaId?: string;
}

export interface CapacityMetrics {
    totalHours: number;
    fixedCommitmentsHours: number;
    availableHours: number;
    recommendedFocusHours: number;
    currentAllocatedFocusHours: number;
}

export interface PreviousWeekSummary {
    period: string;
    completedPriorities: number;
    totalPriorities: number;
    adherencePercentage: number;
    topAchievements: string[];
    pendingHighPriorityItems: string[];
    mainInsight: string;
}

export interface WeeklyPlan {
    id: string;
    period: {
        start: Date;
        end: Date;
        label: string;
    };
    status: 'draft' | 'confirmed' | 'active' | 'completed';
    priorities: WeeklyPriority[];
    metrics: CapacityMetrics;
    lastWeekSummary: PreviousWeekSummary;
    loadIndicator: 'low' | 'moderate' | 'high' | 'critical';
}

export interface PlanningStep {
    id: PlanningStepId;
    title: string;
    description: string;
    isOptional: boolean;
}

export const PLANNING_STEPS: PlanningStep[] = [
    {
        id: 'review',
        title: 'Revisão',
        description: 'Como foi sua última semana?',
        isOptional: false,
    },
    {
        id: 'focus',
        title: 'Foco Mensal',
        description: 'O que é prioridade agora?',
        isOptional: false,
    },
    {
        id: 'capacity',
        title: 'Capacidade',
        description: 'Quanto tempo você tem?',
        isOptional: false,
    },
    {
        id: 'blocks',
        title: 'Estruturação',
        description: 'Defina seus blocos de foco.',
        isOptional: false,
    },
    {
        id: 'tasks',
        title: 'Execução',
        description: 'Aloque tarefas críticas.',
        isOptional: true,
    },
    {
        id: 'routines',
        title: 'Sustentação',
        description: 'Ajuste rotinas e hábitos.',
        isOptional: true,
    },
    {
        id: 'confirmation',
        title: 'Compromisso',
        description: 'Confirme seu plano semanal.',
        isOptional: false,
    },
];
