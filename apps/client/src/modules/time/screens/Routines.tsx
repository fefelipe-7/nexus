import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockRoutinesData } from '../data/mockRoutinesData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Activity, Clock, CheckCircle, Target, Pause, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { Routine } from '../types/routines.types';
import { PERIOD_LABELS, PERIOD_ICONS, PERIOD_COLORS } from '../types/routines.types';

import {
    RoutinesHeader,
    RoutineCard,
} from '../components/mobile';

type FilterType = 'all' | 'today' | 'active' | 'paused';

export function Routines() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const [activeFilter, setActiveFilter] = useState<FilterType>('today');

    const data = mockRoutinesData;

    // Filter logic
    const getFilteredRoutines = () => {
        switch (activeFilter) {
            case 'today':
                return data.today.map(tr => tr.routine);
            case 'active':
                return data.routines.filter(r => r.status === 'active');
            case 'paused':
                return data.routines.filter(r => r.status === 'paused');
            default:
                return data.routines;
        }
    };

    const filteredRoutines = getFilteredRoutines();

    const filters: { key: FilterType; label: string; count?: number }[] = [
        { key: 'today', label: 'Hoje', count: data.today.length },
        { key: 'active', label: 'Ativas', count: data.summary.totalActive },
        { key: 'paused', label: 'Pausadas', count: data.summary.pausedCount },
        { key: 'all', label: 'Todas', count: data.routines.length },
    ];

    const getTodayExecution = (routineId: string) => {
        return data.today.find(tr => tr.routine.id === routineId);
    };

    if (isMobileView) {
        return (
            <div className="space-y-4 pb-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Rotinas</h1>
                    <p className="text-sm text-muted-foreground">
                        Como seus dias funcionam
                    </p>
                </div>

                {/* Summary Header */}
                <RoutinesHeader summary={data.summary} />

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

                {/* Today's Routines */}
                {activeFilter === 'today' && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">Rotinas de Hoje</h3>
                        {data.today.map(({ routine, execution, suggestedStartTime }) => (
                            <RoutineCard
                                key={routine.id}
                                routine={routine}
                                todayExecution={{ routine, execution, isScheduledToday: true, suggestedStartTime }}
                                onClick={() => console.log('Routine clicked', routine.id)}
                                onStart={() => console.log('Start routine', routine.id)}
                            />
                        ))}
                    </div>
                )}

                {/* Routines List */}
                {activeFilter !== 'today' && (
                    <div className="space-y-3">
                        {filteredRoutines.map(routine => (
                            <RoutineCard
                                key={routine.id}
                                routine={routine}
                                todayExecution={getTodayExecution(routine.id)}
                                onClick={() => console.log('Routine clicked', routine.id)}
                                onStart={() => console.log('Start routine', routine.id)}
                            />
                        ))}
                    </div>
                )}

                {/* By Period */}
                <Card className="p-4">
                    <h3 className="text-sm font-semibold mb-3">Por Período</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {(['morning', 'afternoon', 'evening', 'night'] as const).map(period => {
                            const count = data.routines.filter(r => r.period === period && r.status === 'active').length;
                            return (
                                <div
                                    key={period}
                                    className="p-3 rounded-xl bg-muted/30 flex items-center gap-2"
                                >
                                    <span className="text-xl">{PERIOD_ICONS[period]}</span>
                                    <div>
                                        <p className="text-sm font-medium">{PERIOD_LABELS[period]}</p>
                                        <p className="text-xs text-muted-foreground">{count} rotina{count !== 1 && 's'}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Empty state */}
                {filteredRoutines.length === 0 && (
                    <Card className="p-8 text-center">
                        <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-lg font-semibold">Nenhuma rotina</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Crie sua primeira rotina para estruturar o dia.
                        </p>
                    </Card>
                )}

                {/* FAB */}
                <FAB
                    onClick={() => console.log('Add routine')}
                    icon={Plus}
                    label="Nova"
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
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Rotinas</h1>
                    <p className="text-muted-foreground">
                        Como seus dias normalmente funcionam
                    </p>
                </div>
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Rotina
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Previsibilidade</CardTitle>
                        <Target className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.predictabilityScore}%</div>
                        <p className="text-xs text-muted-foreground">do seu dia é estruturado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hoje</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.executedToday}/{data.summary.scheduledToday}</div>
                        <p className="text-xs text-muted-foreground">rotinas executadas</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa Média</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{data.summary.averageExecutionRate}%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ativas</CardTitle>
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredRoutines.map(routine => (
                    <RoutineCard
                        key={routine.id}
                        routine={routine}
                        todayExecution={getTodayExecution(routine.id)}
                        onClick={() => console.log('Routine clicked', routine.id)}
                        onStart={() => console.log('Start routine', routine.id)}
                    />
                ))}
            </div>

            {/* By Period */}
            <Card className="p-6">
                <h3 className="text-base font-semibold mb-4">Estrutura do Dia</h3>
                <div className="grid grid-cols-4 gap-4">
                    {(['morning', 'afternoon', 'evening', 'night'] as const).map(period => {
                        const periodRoutines = data.routines.filter(r => r.period === period && r.status === 'active');
                        const totalDuration = periodRoutines.reduce((sum, r) => sum + r.totalDuration, 0);

                        return (
                            <div
                                key={period}
                                className="p-4 rounded-xl"
                                style={{ backgroundColor: `${PERIOD_COLORS[period]}10` }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">{PERIOD_ICONS[period]}</span>
                                    <span className="font-medium">{PERIOD_LABELS[period]}</span>
                                </div>
                                <p className="text-2xl font-bold" style={{ color: PERIOD_COLORS[period] }}>
                                    {periodRoutines.length}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {totalDuration > 0 ? `~${Math.round(totalDuration / 60)}h de rotinas` : 'Nenhuma rotina'}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}
