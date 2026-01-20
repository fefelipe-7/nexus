import type { WeeklyPlan, WeeklyPriority, PreviousWeekSummary, CapacityMetrics } from '../types/planning.types';

const now = new Date();
const startOfNextWeek = new Date(now);
startOfNextWeek.setDate(now.getDate() + (7 - now.getDay())); // Assuming next Sunday or Monday

const endOfNextWeek = new Date(startOfNextWeek);
endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

const lastWeekSummary: PreviousWeekSummary = {
    period: '12 - 18 Jan',
    completedPriorities: 3,
    totalPriorities: 4,
    adherencePercentage: 78,
    topAchievements: [
        'Conclusão da arquitetura do Módulo Tempo',
        '3 sessões de foco profundo (Realizado: 15h)',
        'Melhoria na rotina de sono (Média 7.5h)',
    ],
    pendingHighPriorityItems: [
        'Refatoração da camada de API',
        'Revisão de performance das listas',
    ],
    mainInsight: 'Você tende a ser mais produtivo nas manhãs de terça e quinta. Use esses blocos para tarefas estratégicas.',
};

const priorities: WeeklyPriority[] = [
    {
        id: 'p1',
        name: 'Finalizar MVP Nexus',
        icon: '🚀',
        isDominant: true,
        type: 'strategic',
        areaId: 'work',
    },
    {
        id: 'p2',
        name: 'Preparação para Maratona',
        icon: '🏃',
        isDominant: false,
        type: 'operational',
        areaId: 'health',
    },
    {
        id: 'p3',
        name: 'Estudos de Rust',
        icon: '🦀',
        isDominant: false,
        type: 'tactical',
        areaId: 'learning',
    },
];

const metrics: CapacityMetrics = {
    totalHours: 168,
    fixedCommitmentsHours: 42, // Sleep, work, basic routines
    availableHours: 45, // Time left after essentials
    recommendedFocusHours: 20,
    currentAllocatedFocusHours: 8,
};

export const mockPlanningData: WeeklyPlan = {
    id: 'plan-2026-04',
    period: {
        start: startOfNextWeek,
        end: endOfNextWeek,
        label: '20 - 26 de Jan',
    },
    status: 'draft',
    priorities,
    metrics,
    lastWeekSummary,
    loadIndicator: 'moderate',
};
