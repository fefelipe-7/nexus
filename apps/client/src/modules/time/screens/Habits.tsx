import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockHabitsData } from '../data/mockHabitsData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, List, Grid, Flame, Activity, TrendingUp, Pause, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { Habit } from '../types/habits.types';
import { LIFE_AREA_LABELS, LIFE_AREA_COLORS } from '../types/habits.types';

import {
    HabitsHeader,
    HabitItem,
    ConsistencyChart,
} from '../components/mobile';

type FilterType = 'all' | 'today' | 'active' | 'paused';
type ViewMode = 'list' | 'area';

export function Habits() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const [activeFilter, setActiveFilter] = useState<FilterType>('today');
    const [viewMode, setViewMode] = useState<ViewMode>('list');

    const data = mockHabitsData;

    // Filter logic
    const getFilteredHabits = () => {
        switch (activeFilter) {
            case 'today':
                return data.today.habits.map(h => h.habit);
            case 'active':
                return data.habits.filter(h => h.status === 'active');
            case 'paused':
                return data.habits.filter(h => h.status === 'paused');
            default:
                return data.habits;
        }
    };

    const filteredHabits = getFilteredHabits();

    const filters: { key: FilterType; label: string; count?: number }[] = [
        { key: 'today', label: 'Hoje', count: data.today.totalCount },
        { key: 'active', label: 'Ativos', count: data.summary.totalActive },
        { key: 'paused', label: 'Pausados', count: data.summary.pausedCount },
        { key: 'all', label: 'Todos', count: data.habits.length },
    ];

    const getTodayCheck = (habitId: string) => {
        const todayHabit = data.today.habits.find(h => h.habit.id === habitId);
        return todayHabit?.todayCheck;
    };

    if (isMobileView) {
        return (
            <div className="space-y-4 pb-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Hábitos</h1>
                    <p className="text-sm text-muted-foreground">
                        Quem você está se tornando
                    </p>
                </div>

                {/* Summary Header */}
                <HabitsHeader summary={data.summary} />

                {/* Filters */}
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                    {filters.map(filter => (
                        <button
                            key={filter.key}
                            onClick={() => setActiveFilter(filter.key)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                                activeFilter === filter.key
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {filter.label}
                            {filter.count !== undefined && (
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-full text-[10px]",
                                    activeFilter === filter.key
                                        ? "bg-primary-foreground/20"
                                        : "bg-background"
                                )}>
                                    {filter.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Today's Check-in */}
                {activeFilter === 'today' && (
                    <Card className="overflow-hidden">
                        <div className="px-4 py-2 border-b flex items-center justify-between bg-primary/5">
                            <span className="text-sm font-semibold">Check-in de Hoje</span>
                            <span className="text-xs text-muted-foreground">
                                {data.today.completedCount}/{data.today.totalCount}
                            </span>
                        </div>
                        <div className="divide-y divide-border/30">
                            {data.today.habits.map(({ habit, todayCheck }) => (
                                <HabitItem
                                    key={habit.id}
                                    habit={habit}
                                    todayCheck={todayCheck}
                                    onClick={() => console.log('Habit clicked', habit.id)}
                                    onCheck={() => console.log('Check habit', habit.id)}
                                />
                            ))}
                        </div>
                    </Card>
                )}

                {/* List View */}
                {activeFilter !== 'today' && (
                    <Card className="overflow-hidden">
                        <div className="divide-y divide-border/30">
                            {filteredHabits.map(habit => (
                                <HabitItem
                                    key={habit.id}
                                    habit={habit}
                                    todayCheck={getTodayCheck(habit.id)}
                                    onClick={() => console.log('Habit clicked', habit.id)}
                                    onCheck={() => console.log('Check habit', habit.id)}
                                />
                            ))}
                        </div>
                    </Card>
                )}

                {/* Consistency Chart */}
                <ConsistencyChart data={data.weeklyConsistency} />

                {/* By Area */}
                <Card className="p-4">
                    <h3 className="text-sm font-semibold mb-3">Por Área</h3>
                    <div className="space-y-3">
                        {data.byArea.map(({ area, habits, avgConsistency }) => (
                            <div key={area} className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                    style={{ backgroundColor: LIFE_AREA_COLORS[area] }}
                                >
                                    {habits.length}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{LIFE_AREA_LABELS[area]}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${avgConsistency}%`,
                                                    backgroundColor: LIFE_AREA_COLORS[area]
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">{avgConsistency}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Empty state */}
                {filteredHabits.length === 0 && (
                    <Card className="p-8 text-center">
                        <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-lg font-semibold">Nenhum hábito</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Comece criando seu primeiro hábito.
                        </p>
                    </Card>
                )}

                {/* FAB */}
                <FAB
                    onClick={() => console.log('Add habit')}
                    icon={Plus}
                    label="Novo"
                />
            </div>
        );
    }

    // Desktop
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Hábitos</h1>
                    <p className="text-muted-foreground">
                        Quem você está se tornando com o que faz todos os dias
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                        {(['list', 'area'] as const).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                    viewMode === mode ? "bg-background shadow-sm" : "text-muted-foreground"
                                )}
                            >
                                {mode === 'list' ? 'Lista' : 'Por Área'}
                            </button>
                        ))}
                    </div>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Hábito
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Consistência</CardTitle>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.averageConsistency}%</div>
                        <p className="text-xs text-muted-foreground">média geral</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sequências Ativas</CardTitle>
                        <Flame className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">{data.summary.activeStreaks}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hoje</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.summary.todayCompleted}/{data.summary.todayTotal}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ativos</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.totalActive}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {filters.map(filter => (
                    <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        className={cn(
                            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            activeFilter === filter.key
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        )}
                    >
                        {filter.label}
                        {filter.count !== undefined && (
                            <span className={cn(
                                "px-1.5 py-0.5 rounded-full text-xs",
                                activeFilter === filter.key ? "bg-primary-foreground/20" : "bg-background"
                            )}>
                                {filter.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                    {/* Habits List */}
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-3">
                            <CardTitle>
                                {activeFilter === 'today' ? 'Check-in de Hoje' : 'Hábitos'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/30">
                                {filteredHabits.map(habit => (
                                    <HabitItem
                                        key={habit.id}
                                        habit={habit}
                                        todayCheck={getTodayCheck(habit.id)}
                                        onClick={() => console.log('Habit clicked', habit.id)}
                                        onCheck={() => console.log('Check habit', habit.id)}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <ConsistencyChart data={data.weeklyConsistency} />

                    {/* By Area */}
                    <Card className="p-4">
                        <h3 className="text-sm font-semibold mb-3">Por Área</h3>
                        <div className="space-y-3">
                            {data.byArea.map(({ area, habits, avgConsistency }) => (
                                <div key={area} className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                        style={{ backgroundColor: LIFE_AREA_COLORS[area] }}
                                    >
                                        {habits.length}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{LIFE_AREA_LABELS[area]}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${avgConsistency}%`,
                                                        backgroundColor: LIFE_AREA_COLORS[area]
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">{avgConsistency}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
