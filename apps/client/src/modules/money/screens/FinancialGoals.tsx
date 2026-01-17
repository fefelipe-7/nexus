import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockFinancialGoalsData } from '../data/mockFinancialGoalsData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Search, Filter, Target, AlertTriangle } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { FinancialGoal, GoalStatus, GoalPriority } from '../types/goals.types';
import { GOAL_STATUS_LABELS, GOAL_STATUS_COLORS, GOAL_PRIORITY_LABELS } from '../types/goals.types';

import {
    GoalsSummaryCard,
    GoalListItem,
    GoalDetailSheet,
} from '../components/mobile';

export function FinancialGoals() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<GoalStatus | 'all'>('all');
    const [sortBy, setSortBy] = useState<'priority' | 'deadline' | 'progress'>('priority');

    const data = mockFinancialGoalsData;

    const handleGoalClick = (goal: FinancialGoal) => {
        setSelectedGoal(goal);
        setIsDetailOpen(true);
    };

    // Filter goals
    const filteredGoals = data.goals.filter(g => {
        if (searchQuery && !g.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        if (filterStatus !== 'all' && g.status !== filterStatus) {
            return false;
        }
        return true;
    });

    // Sort goals
    const sortedGoals = [...filteredGoals].sort((a, b) => {
        switch (sortBy) {
            case 'priority': {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            case 'deadline': {
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return a.deadline.getTime() - b.deadline.getTime();
            }
            case 'progress': {
                const progressA = a.currentAmount / a.targetAmount;
                const progressB = b.currentAmount / b.targetAmount;
                return progressB - progressA;
            }
            default:
                return 0;
        }
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    if (isMobileView) {
        return (
            <div className="space-y-4 pb-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Metas Financeiras</h1>
                    <p className="text-sm text-muted-foreground">
                        Seus objetivos financeiros em um só lugar
                    </p>
                </div>

                {/* Summary Card */}
                <GoalsSummaryCard summary={data.summary} />

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar metas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 bg-muted/50 border-0"
                    />
                </div>

                {/* Filters & Sort */}
                <div className="flex items-center justify-between">
                    {/* Status Filter */}
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        {(['all', 'on_track', 'behind', 'critical'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                                    filterStatus === status
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted hover:bg-accent"
                                )}
                            >
                                {status === 'all' ? 'Todas' : GOAL_STATUS_LABELS[status]}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                        {(['priority', 'deadline', 'progress'] as const).map(sort => (
                            <button
                                key={sort}
                                onClick={() => setSortBy(sort)}
                                className={cn(
                                    "px-2 py-1.5 rounded-md text-xs font-medium transition-all",
                                    sortBy === sort ? "bg-background shadow-sm" : "text-muted-foreground"
                                )}
                            >
                                {sort === 'priority' ? '🎯' : sort === 'deadline' ? '📅' : '📊'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Goals List */}
                {sortedGoals.length > 0 ? (
                    <Card className="overflow-hidden divide-y divide-border/50">
                        {sortedGoals.map((goal) => (
                            <GoalListItem
                                key={goal.id}
                                goal={goal}
                                onClick={() => handleGoalClick(goal)}
                            />
                        ))}
                    </Card>
                ) : (
                    <Card className="p-8">
                        <div className="text-center">
                            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm font-medium">Nenhuma meta encontrada</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Crie sua primeira meta financeira
                            </p>
                        </div>
                    </Card>
                )}

                {/* Detail Sheet */}
                <GoalDetailSheet
                    goal={selectedGoal}
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    onEdit={(g) => console.log('Edit', g)}
                    onPause={(g) => console.log('Pause', g)}
                    onSimulate={(g) => console.log('Simulate', g)}
                    onDelete={(g) => console.log('Delete', g)}
                />

                {/* FAB */}
                <FAB
                    onClick={() => console.log('Add goal')}
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
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Metas Financeiras</h1>
                    <p className="text-muted-foreground">
                        Traduza seu patrimônio e fluxo em propósito
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 w-64"
                        />
                    </div>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Meta
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.averageProgress.toFixed(0)}%</div>
                        <p className="text-xs text-muted-foreground">das metas ativas</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Metas Ativas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.activeCount}</div>
                        <p className="text-xs text-muted-foreground">em andamento</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Acumulado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(data.summary.totalCurrentAmount)}</div>
                        <p className="text-xs text-muted-foreground">de {formatCurrency(data.summary.totalTargetAmount)}</p>
                    </CardContent>
                </Card>
                <Card className={data.summary.conflictingGoals > 0 ? "border-amber-500/50" : ""}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Atenção</CardTitle>
                        {data.summary.conflictingGoals > 0 && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", data.summary.conflictingGoals > 0 && "text-amber-500")}>
                            {data.summary.conflictingGoals}
                        </div>
                        <p className="text-xs text-muted-foreground">metas atrasadas</p>
                    </CardContent>
                </Card>
            </div>

            {/* Goals List */}
            <Card>
                <CardHeader>
                    <CardTitle>Todas as Metas</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                        {sortedGoals.map((goal) => (
                            <GoalListItem
                                key={goal.id}
                                goal={goal}
                                onClick={() => handleGoalClick(goal)}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Detail Sheet */}
            <GoalDetailSheet
                goal={selectedGoal}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onEdit={(g) => console.log('Edit', g)}
                onPause={(g) => console.log('Pause', g)}
                onSimulate={(g) => console.log('Simulate', g)}
                onDelete={(g) => console.log('Delete', g)}
            />
        </div>
    );
}
