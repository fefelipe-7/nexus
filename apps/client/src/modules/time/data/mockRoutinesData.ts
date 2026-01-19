import type {
    RoutinesData,
    Routine,
    RoutineItem,
    RoutineExecution,
    TodayRoutine,
    RoutinesSummary
} from '../types/routines.types';

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const addDays = (days: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() + days);
    return date;
};

const routines: Routine[] = [
    {
        id: '1',
        name: 'Rotina da Manhã',
        description: 'Preparação para um dia produtivo',
        period: 'morning',
        frequency: 'daily',
        status: 'active',
        items: [
            { id: '1-1', type: 'habit', title: 'Acordar às 6h', duration: 5, isOptional: false, order: 1 },
            { id: '1-2', type: 'habit', title: 'Beber água', duration: 2, isOptional: false, linkedHabitId: '6', order: 2 },
            { id: '1-3', type: 'habit', title: 'Meditação', duration: 10, isOptional: false, linkedHabitId: '2', order: 3 },
            { id: '1-4', type: 'block', title: 'Alongamento', duration: 10, isOptional: true, order: 4 },
            { id: '1-5', type: 'task', title: 'Revisar agenda do dia', duration: 5, isOptional: false, order: 5 },
            { id: '1-6', type: 'block', title: 'Café da manhã', duration: 20, isOptional: false, order: 6 },
            { id: '1-7', type: 'task', title: 'Preparar para sair', duration: 15, isOptional: false, order: 7 },
        ],
        totalDuration: 67,
        averageExecutionRate: 82,
        currentStreak: 5,
        bestStreak: 21,
        color: '#f59e0b',
        icon: '🌅',
        createdAt: addDays(-90),
        lastExecutedAt: addDays(-1),
    },
    {
        id: '2',
        name: 'Início do Trabalho',
        description: 'Transição suave para o modo produtivo',
        period: 'morning',
        frequency: 'weekdays',
        status: 'active',
        items: [
            { id: '2-1', type: 'task', title: 'Revisar emails prioritários', duration: 15, isOptional: false, order: 1 },
            { id: '2-2', type: 'task', title: 'Planejar tarefas do dia', duration: 10, isOptional: false, order: 2 },
            { id: '2-3', type: 'reminder', title: 'Daily standup', duration: 15, isOptional: false, order: 3 },
            { id: '2-4', type: 'block', title: 'Primeiro bloco de foco', duration: 90, isOptional: false, order: 4 },
        ],
        totalDuration: 130,
        averageExecutionRate: 75,
        currentStreak: 3,
        bestStreak: 15,
        color: '#3b82f6',
        icon: '💼',
        createdAt: addDays(-60),
        lastExecutedAt: addDays(-1),
    },
    {
        id: '3',
        name: 'Rotina da Noite',
        description: 'Descompressão e preparação para dormir',
        period: 'evening',
        frequency: 'daily',
        status: 'active',
        items: [
            { id: '3-1', type: 'task', title: 'Desligar telas', duration: 5, isOptional: false, order: 1 },
            { id: '3-2', type: 'habit', title: 'Leitura', duration: 30, isOptional: false, linkedHabitId: '3', order: 2 },
            { id: '3-3', type: 'task', title: 'Preparar roupa do dia seguinte', duration: 5, isOptional: true, order: 3 },
            { id: '3-4', type: 'task', title: 'Revisar dia e gratidão', duration: 10, isOptional: true, order: 4 },
            { id: '3-5', type: 'habit', title: 'Skincare', duration: 10, isOptional: false, order: 5 },
        ],
        totalDuration: 60,
        averageExecutionRate: 65,
        currentStreak: 2,
        bestStreak: 14,
        color: '#8b5cf6',
        icon: '🌆',
        createdAt: addDays(-45),
        lastExecutedAt: addDays(-1),
    },
    {
        id: '4',
        name: 'Sessão de Treino',
        description: 'Aquecimento, treino e recuperação',
        period: 'afternoon',
        frequency: 'custom',
        specificDays: [1, 2, 4, 5], // Seg, Ter, Qui, Sex
        status: 'active',
        items: [
            { id: '4-1', type: 'block', title: 'Aquecimento', duration: 10, isOptional: false, order: 1 },
            { id: '4-2', type: 'habit', title: 'Treino musculação', duration: 45, isOptional: false, linkedHabitId: '1', order: 2 },
            { id: '4-3', type: 'block', title: 'Alongamento final', duration: 10, isOptional: true, order: 3 },
            { id: '4-4', type: 'task', title: 'Hidratação pós-treino', duration: 5, isOptional: false, order: 4 },
        ],
        totalDuration: 70,
        averageExecutionRate: 88,
        currentStreak: 8,
        bestStreak: 20,
        color: '#14b8a6',
        icon: '💪',
        createdAt: addDays(-120),
        lastExecutedAt: addDays(-1),
    },
    {
        id: '5',
        name: 'Revisão Semanal',
        description: 'Reflexão e planejamento',
        period: 'custom',
        frequency: 'custom',
        specificDays: [0], // Domingo
        status: 'active',
        items: [
            { id: '5-1', type: 'task', title: 'Revisar semana passada', duration: 20, isOptional: false, order: 1 },
            { id: '5-2', type: 'habit', title: 'Revisar finanças', duration: 30, isOptional: false, linkedHabitId: '4', order: 2 },
            { id: '5-3', type: 'task', title: 'Planejar próxima semana', duration: 30, isOptional: false, order: 3 },
            { id: '5-4', type: 'task', title: 'Ajustar metas', duration: 15, isOptional: true, order: 4 },
        ],
        totalDuration: 95,
        averageExecutionRate: 70,
        currentStreak: 4,
        bestStreak: 8,
        color: '#6366f1',
        icon: '📋',
        createdAt: addDays(-60),
        lastExecutedAt: addDays(-7),
    },
    {
        id: '6',
        name: 'Rotina de Energia Baixa',
        description: 'Para dias difíceis - versão simplificada',
        period: 'morning',
        frequency: 'custom',
        status: 'paused',
        items: [
            { id: '6-1', type: 'habit', title: 'Beber água', duration: 2, isOptional: false, order: 1 },
            { id: '6-2', type: 'block', title: 'Café', duration: 10, isOptional: false, order: 2 },
            { id: '6-3', type: 'task', title: 'Uma tarefa simples', duration: 15, isOptional: false, order: 3 },
        ],
        totalDuration: 27,
        averageExecutionRate: 45,
        currentStreak: 0,
        bestStreak: 3,
        color: '#6b7280',
        icon: '🔋',
        createdAt: addDays(-30),
    },
];

// Active routines
const activeRoutines = routines.filter(r => r.status === 'active');

// Today's routines
const dayOfWeek = today.getDay();
const todayRoutines: TodayRoutine[] = activeRoutines
    .filter(r => {
        if (r.frequency === 'daily') return true;
        if (r.frequency === 'weekdays') return dayOfWeek >= 1 && dayOfWeek <= 5;
        if (r.frequency === 'weekends') return dayOfWeek === 0 || dayOfWeek === 6;
        if (r.specificDays) return r.specificDays.includes(dayOfWeek);
        return true;
    })
    .map(routine => ({
        routine,
        execution: Math.random() > 0.5 ? {
            date: today,
            routineId: routine.id,
            status: 'completed' as const,
            completedItems: routine.items.map(i => i.id),
            skippedItems: [],
            actualDuration: routine.totalDuration + Math.floor(Math.random() * 20 - 10),
            startedAt: new Date(today.getTime() + 6 * 60 * 60 * 1000),
            completedAt: new Date(today.getTime() + 7 * 60 * 60 * 1000),
        } : undefined,
        isScheduledToday: true,
        suggestedStartTime: routine.period === 'morning' ? '06:00' :
            routine.period === 'afternoon' ? '14:00' :
                routine.period === 'evening' ? '21:00' : '18:00',
    }));

const executedToday = todayRoutines.filter(tr => tr.execution?.status === 'completed').length;

// Recent executions
const recentExecutions: RoutineExecution[] = [];
for (let i = 1; i <= 7; i++) {
    activeRoutines.forEach(routine => {
        if (Math.random() > 0.3) {
            const completedCount = Math.floor(routine.items.length * (0.6 + Math.random() * 0.4));
            recentExecutions.push({
                date: addDays(-i),
                routineId: routine.id,
                status: completedCount === routine.items.length ? 'completed' : 'partial',
                completedItems: routine.items.slice(0, completedCount).map(i => i.id),
                skippedItems: routine.items.slice(completedCount).map(i => i.id),
                actualDuration: routine.totalDuration + Math.floor(Math.random() * 30 - 15),
            });
        }
    });
}

// Calculate averages
const avgExecutionRate = Math.round(
    activeRoutines.reduce((sum, r) => sum + r.averageExecutionRate, 0) / activeRoutines.length
);

// Predictability score based on execution consistency
const predictabilityScore = Math.min(100, Math.round(avgExecutionRate * 1.1));

// Insight
let insight = {
    type: 'info' as const,
    message: 'Suas rotinas estão estruturadas.',
};

if (avgExecutionRate >= 80) {
    insight = {
        type: 'success',
        message: `Excelente previsibilidade: ${predictabilityScore}% de consistência.`,
    };
} else if (avgExecutionRate < 60) {
    insight = {
        type: 'suggestion',
        message: 'Simplifique algumas rotinas para aumentar a execução.',
    };
}

// Summary
const summary: RoutinesSummary = {
    totalActive: activeRoutines.length,
    pausedCount: routines.filter(r => r.status === 'paused').length,
    executedToday,
    scheduledToday: todayRoutines.length,
    averageExecutionRate: avgExecutionRate,
    weeklyTrend: avgExecutionRate >= 70 ? 'up' : avgExecutionRate >= 50 ? 'stable' : 'down',
    predictabilityScore,
    insight,
};

export const mockRoutinesData: RoutinesData = {
    summary,
    routines,
    today: todayRoutines,
    recentExecutions,
};
