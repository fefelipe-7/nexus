import type {
    HabitsData,
    Habit,
    DayHabits,
    HabitsSummary,
    HabitCheck,
    WeeklyConsistency
} from '../types/habits.types';

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const addDays = (days: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() + days);
    return date;
};

// Generate checks for last 30 days
const generateChecks = (consistency: number): HabitCheck[] => {
    const checks: HabitCheck[] = [];
    for (let i = 30; i >= 1; i--) {
        const random = Math.random();
        let status: HabitCheck['status'] = 'done';
        if (random > consistency) {
            status = random > 0.9 ? 'skipped' : 'missed';
        }
        checks.push({
            date: addDays(-i),
            status,
        });
    }
    return checks;
};

const habits: Habit[] = [
    {
        id: '1',
        title: 'Treino na academia',
        description: '45min de musculação ou cardio',
        type: 'positive',
        frequency: 'weekly',
        targetPerWeek: 4,
        specificDays: [1, 2, 4, 5], // Seg, Ter, Qui, Sex
        lifeArea: 'health',
        status: 'active',
        currentStreak: 8,
        bestStreak: 21,
        consistencyRate: 85,
        createdAt: addDays(-90),
        checks: generateChecks(0.85),
        reminderTime: '18:00',
        color: '#14b8a6',
        icon: '💪',
    },
    {
        id: '2',
        title: 'Meditação',
        description: '10 minutos de mindfulness',
        type: 'positive',
        frequency: 'daily',
        lifeArea: 'mind',
        status: 'active',
        currentStreak: 15,
        bestStreak: 30,
        consistencyRate: 78,
        createdAt: addDays(-60),
        checks: generateChecks(0.78),
        reminderTime: '07:00',
        color: '#8b5cf6',
        icon: '🧘',
    },
    {
        id: '3',
        title: 'Leitura',
        description: '20 páginas/dia',
        type: 'positive',
        frequency: 'daily',
        lifeArea: 'learning',
        status: 'active',
        currentStreak: 5,
        bestStreak: 12,
        consistencyRate: 65,
        createdAt: addDays(-45),
        checks: generateChecks(0.65),
        linkedGoalId: 'reading-goal',
        color: '#f59e0b',
        icon: '📚',
    },
    {
        id: '4',
        title: 'Revisar finanças',
        description: 'Conferir gastos e orçamento',
        type: 'positive',
        frequency: 'weekly',
        targetPerWeek: 1,
        specificDays: [0], // Domingo
        lifeArea: 'finance',
        status: 'active',
        currentStreak: 4,
        bestStreak: 8,
        consistencyRate: 90,
        createdAt: addDays(-120),
        checks: generateChecks(0.90),
        linkedGoalId: 'finance-control',
        color: '#6366f1',
        icon: '💰',
    },
    {
        id: '5',
        title: 'Estudar inglês',
        description: '15min no Duolingo ou curso',
        type: 'positive',
        frequency: 'daily',
        lifeArea: 'learning',
        status: 'active',
        currentStreak: 0,
        bestStreak: 45,
        consistencyRate: 52,
        createdAt: addDays(-180),
        checks: generateChecks(0.52),
        linkedGoalId: 'english-fluency',
        color: '#10b981',
        icon: '🌎',
    },
    {
        id: '6',
        title: 'Beber água',
        description: '2L por dia',
        type: 'positive',
        frequency: 'daily',
        lifeArea: 'health',
        status: 'active',
        currentStreak: 3,
        bestStreak: 14,
        consistencyRate: 70,
        createdAt: addDays(-30),
        checks: generateChecks(0.70),
        color: '#0ea5e9',
        icon: '💧',
    },
    {
        id: '7',
        title: 'Limitar redes sociais',
        description: 'Máximo 30min/dia',
        type: 'negative',
        frequency: 'daily',
        lifeArea: 'mind',
        status: 'active',
        currentStreak: 2,
        bestStreak: 7,
        consistencyRate: 55,
        createdAt: addDays(-20),
        checks: generateChecks(0.55),
        color: '#ef4444',
        icon: '📱',
    },
    {
        id: '8',
        title: 'Gratidão diária',
        description: 'Escrever 3 coisas boas do dia',
        type: 'positive',
        frequency: 'daily',
        lifeArea: 'mind',
        status: 'paused',
        currentStreak: 0,
        bestStreak: 21,
        consistencyRate: 40,
        createdAt: addDays(-90),
        pausedAt: addDays(-10),
        checks: generateChecks(0.40),
        color: '#ec4899',
        icon: '🙏',
    },
];

// Active habits
const activeHabits = habits.filter(h => h.status === 'active');

// Today's habits
const dayOfWeek = today.getDay();
const todayHabits = activeHabits.filter(h => {
    if (h.frequency === 'daily') return true;
    if (h.specificDays) return h.specificDays.includes(dayOfWeek);
    return true;
});

// Check what's done today
const todayChecks = todayHabits.map(habit => {
    const random = Math.random();
    return {
        habit,
        todayCheck: random > 0.6 ? { date: today, status: 'done' as const } : undefined,
        isScheduledToday: true,
    };
});

const completedToday = todayChecks.filter(tc => tc.todayCheck?.status === 'done').length;

const todayData: DayHabits = {
    date: today,
    habits: todayChecks,
    completedCount: completedToday,
    totalCount: todayHabits.length,
};

// Weekly consistency
const weeklyConsistency: WeeklyConsistency[] = [];
for (let i = 6; i >= 0; i--) {
    const date = addDays(-i);
    const total = 5 + Math.floor(Math.random() * 3);
    const completed = Math.floor(total * (0.5 + Math.random() * 0.4));
    weeklyConsistency.push({
        day: date,
        completed,
        total,
        rate: (completed / total) * 100,
    });
}

// Average consistency
const avgConsistency = Math.round(
    activeHabits.reduce((sum, h) => sum + h.consistencyRate, 0) / activeHabits.length
);

// Active streaks
const activeStreaks = activeHabits.filter(h => h.currentStreak > 0).length;

// Insight
let insight: HabitsSummary['insight'] = {
    type: 'info',
    message: 'Continue construindo seus hábitos.',
};

if (avgConsistency >= 75) {
    insight = {
        type: 'success',
        message: `Excelente! Consistência média de ${avgConsistency}%.`,
    };
} else if (avgConsistency < 50) {
    insight = {
        type: 'warning',
        message: 'Alguns hábitos precisam de atenção. Simplifique se necessário.',
    };
}

// Summary
const summary: HabitsSummary = {
    totalActive: activeHabits.length,
    averageConsistency: avgConsistency,
    activeStreaks,
    pausedCount: habits.filter(h => h.status === 'paused').length,
    todayCompleted: completedToday,
    todayTotal: todayHabits.length,
    weeklyTrend: avgConsistency >= 70 ? 'up' : avgConsistency >= 50 ? 'stable' : 'down',
    insight,
};

// By area
const areaMap: Record<string, Habit[]> = {};
activeHabits.forEach(h => {
    if (!areaMap[h.lifeArea]) areaMap[h.lifeArea] = [];
    areaMap[h.lifeArea].push(h);
});

const byArea = Object.entries(areaMap).map(([area, list]) => ({
    area,
    habits: list,
    avgConsistency: Math.round(list.reduce((s, h) => s + h.consistencyRate, 0) / list.length),
}));

export const mockHabitsData: HabitsData = {
    summary,
    habits,
    today: todayData,
    weeklyConsistency,
    byArea,
};
