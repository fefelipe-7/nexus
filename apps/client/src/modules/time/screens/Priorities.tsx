import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockPrioritiesData } from '../data/mockPrioritiesData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Target, Focus, Star, Clock, AlertTriangle, LayoutGrid } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { Priority, PriorityHorizon } from '../types/priorities.types';
import { HORIZON_LABELS, TYPE_LABELS, TYPE_ICONS, TYPE_COLORS, DISPERSION_LABELS, DISPERSION_COLORS } from '../types/priorities.types';

import {
    PrioritiesHeader,
    PriorityCard,
} from '../components/mobile';

type FilterType = 'all' | 'active' | 'paused' | 'completed';
type ViewMode = 'list' | 'horizon';

export function Priorities() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const [activeFilter, setActiveFilter] = useState<FilterType>('active');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedHorizon, setSelectedHorizon] = useState<PriorityHorizon | 'all'>('all');

    const data = mockPrioritiesData;

    // Filter logic
    const getFilteredPriorities = () => {
        let filtered = data.priorities;

        switch (activeFilter) {
            case 'active':
                filtered = filtered.filter(p => p.status === 'active');
                break;
            case 'paused':
                filtered = filtered.filter(p => p.status === 'paused');
                break;
            case 'completed':
                filtered = filtered.filter(p => p.status === 'completed');
                break;
        }

        if (selectedHorizon !== 'all') {
            filtered = filtered.filter(p => p.horizon === selectedHorizon);
        }

        return filtered.sort((a, b) => a.order - b.order);
    };

    const filteredPriorities = getFilteredPriorities();

    const filters: { key: FilterType; label: string; count?: number }[] = [
        { key: 'active', label: 'Ativas', count: data.priorities.filter(p => p.status === 'active').length },
        { key: 'paused', label: 'Pausadas', count: data.priorities.filter(p => p.status === 'paused').length },
        { key: 'completed', label: 'Concluídas' },
        { key: 'all', label: 'Todas', count: data.priorities.length },
    ];

    const horizonTabs: { key: PriorityHorizon | 'all'; label: string }[] = [
        { key: 'all', label: 'Todas' },
        { key: 'today', label: 'Hoje' },
        { key: 'week', label: 'Semana' },
        { key: 'month', label: 'Mês' },
        { key: 'quarter', label: 'Trimestre' },
    ];

    if (isMobileView) {
        return (
            <div className="space-y-4 pb-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Prioridades</h1>
                    <p className="text-sm text-muted-foreground">
                        O que realmente importa agora
                    </p>
                </div>

                {/* Summary Header */}
                <PrioritiesHeader summary={data.summary} />

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

                {/* Horizon Tabs */}
                <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
                    {horizonTabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setSelectedHorizon(tab.key)}
                            className={cn(
                                "px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                                selectedHorizon === tab.key
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Priority Cards */}
                <div className="space-y-3">
                    {filteredPriorities.map(priority => (
                        <PriorityCard
                            key={priority.id}
                            priority={priority}
                            onClick={() => console.log('Priority clicked', priority.id)}
                            onSetDominant={() => console.log('Set dominant', priority.id)}
                        />
                    ))}
                </div>

                {/* Empty state */}
                {filteredPriorities.length === 0 && (
                    <Card className="p-8 text-center">
                        <Target className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-lg font-semibold">Nenhuma prioridade</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Defina o que realmente importa agora.
                        </p>
                    </Card>
                )}

                {/* FAB */}
                <FAB
                    onClick={() => console.log('Add priority')}
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
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Prioridades</h1>
                    <p className="text-muted-foreground">
                        No meio de tudo isso, o que realmente importa agora?
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                        {(['list', 'horizon'] as const).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                    viewMode === mode ? "bg-background shadow-sm" : "text-muted-foreground"
                                )}
                            >
                                {mode === 'list' ? 'Lista' : 'Por Horizonte'}
                            </button>
                        ))}
                    </div>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Prioridade
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ativas</CardTitle>
                        <Target className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.totalActive}</div>
                        <p className="text-xs text-muted-foreground">prioridades em foco</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dispersão</CardTitle>
                        <Focus className="h-4 w-4" style={{ color: DISPERSION_COLORS[data.summary.dispersionLevel] }} />
                    </CardHeader>
                    <CardContent>
                        <div
                            className="text-2xl font-bold"
                            style={{ color: DISPERSION_COLORS[data.summary.dispersionLevel] }}
                        >
                            {DISPERSION_LABELS[data.summary.dispersionLevel]}
                        </div>
                    </CardContent>
                </Card>
                {data.summary.dominantPriority && (
                    <Card className="md:col-span-2 border-l-4 border-l-amber-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Foco Principal</CardTitle>
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{data.summary.dominantPriority.icon}</span>
                                <span className="text-lg font-bold">{data.summary.dominantPriority.name}</span>
                            </div>
                        </CardContent>
                    </Card>
                )}
                {!data.summary.dominantPriority && (
                    <Card className="md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conflitos</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.summary.conflicts.length}</div>
                            <p className="text-xs text-muted-foreground">requer atenção</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between">
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
                <div className="flex gap-1">
                    {horizonTabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setSelectedHorizon(tab.key)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                                selectedHorizon === tab.key
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            {viewMode === 'horizon' ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {data.byHorizon.map(({ horizon, priorities }) => (
                        <Card key={horizon} className="overflow-hidden">
                            <CardHeader className="pb-3" style={{ backgroundColor: `${TYPE_COLORS.strategic}10` }}>
                                <CardTitle className="flex items-center justify-between text-base">
                                    <span>{HORIZON_LABELS[horizon]}</span>
                                    <span className="text-sm text-muted-foreground">{priorities.length}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 space-y-2 min-h-[200px]">
                                {priorities.map(priority => (
                                    <div
                                        key={priority.id}
                                        className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span>{priority.icon}</span>
                                            <p className="text-sm font-medium truncate">{priority.name}</p>
                                            {priority.isDominant && (
                                                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{TYPE_LABELS[priority.type]}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPriorities.map(priority => (
                        <PriorityCard
                            key={priority.id}
                            priority={priority}
                            onClick={() => console.log('Priority clicked', priority.id)}
                            onSetDominant={() => console.log('Set dominant', priority.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
