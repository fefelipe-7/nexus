import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockAgendaData } from '../data/mockAgendaData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Calendar, List, LayoutGrid, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { TimeBlock, ViewMode } from '../types/agenda.types';
import { LIFE_AREA_LABELS, LIFE_AREA_COLORS } from '../types/agenda.types';

import {
    AgendaHeader,
    TimeBlockItem,
    DayView,
    WeekView,
    TimeDistributionCard,
    EventDetailSheet,
} from '../components/mobile';

export function Agenda() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const [viewMode, setViewMode] = useState<ViewMode>('day');
    const [selectedBlock, setSelectedBlock] = useState<TimeBlock | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const data = mockAgendaData;

    const handleBlockClick = (blockId: string) => {
        const block = data.today.blocks.find(b => b.id === blockId);
        if (block) {
            setSelectedBlock(block);
            setIsDetailOpen(true);
        }
    };

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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight mb-1">Agenda</h1>
                        <p className="text-sm text-muted-foreground">
                            Tempo, intenção e realidade
                        </p>
                    </div>
                    {/* View Toggle */}
                    <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('day')}
                            className={cn(
                                "p-2 rounded-md transition-all",
                                viewMode === 'day' ? "bg-background shadow-sm" : "text-muted-foreground"
                            )}
                        >
                            <List className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('week')}
                            className={cn(
                                "p-2 rounded-md transition-all",
                                viewMode === 'week' ? "bg-background shadow-sm" : "text-muted-foreground"
                            )}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Agenda Header */}
                <AgendaHeader
                    summary={data.summary}
                    currentDate={new Date()}
                />

                {/* View */}
                {viewMode === 'day' ? (
                    <div className="space-y-4">
                        {/* Today's blocks */}
                        <Card className="overflow-hidden">
                            <div className="p-4 border-b">
                                <h3 className="text-sm font-semibold">Hoje</h3>
                            </div>
                            <div className="divide-y divide-border/30">
                                {data.today.blocks.map(block => (
                                    <TimeBlockItem
                                        key={block.id}
                                        block={block}
                                        onClick={() => handleBlockClick(block.id)}
                                    />
                                ))}
                            </div>
                        </Card>

                        {/* Time Distribution */}
                        <TimeDistributionCard distribution={data.summary.timeDistribution} />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <WeekView
                            schedule={data.week}
                            onDayClick={(date) => console.log('Day clicked', date)}
                        />
                        <TimeDistributionCard distribution={data.summary.timeDistribution} />
                    </div>
                )}

                {/* Insights */}
                <Card className="p-4">
                    <h3 className="text-sm font-semibold mb-3">Insights</h3>
                    <div className="space-y-2">
                        {data.summary.insights.slice(0, 3).map(insight => (
                            <button
                                key={insight.id}
                                className={cn(
                                    "w-full p-3 rounded-xl text-left transition-colors",
                                    insight.type === 'warning' && "bg-amber-500/10",
                                    insight.type === 'suggestion' && "bg-blue-500/10",
                                    insight.type === 'achievement' && "bg-green-500/10",
                                    insight.type === 'reminder' && "bg-muted/50"
                                )}
                            >
                                <p className="text-sm font-medium">{insight.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Detail Sheet */}
                <EventDetailSheet
                    block={selectedBlock}
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    onEdit={(b) => console.log('Edit', b)}
                    onComplete={(b) => console.log('Complete', b)}
                    onCancel={(b) => console.log('Cancel', b)}
                    onDelete={(b) => console.log('Delete', b)}
                />

                {/* FAB */}
                <FAB
                    onClick={() => console.log('Add event')}
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
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Agenda</h1>
                    <p className="text-muted-foreground">
                        Onde tempo, intenção e realidade se encontram
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                        {(['day', 'week'] as const).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                    viewMode === mode ? "bg-background shadow-sm" : "text-muted-foreground"
                                )}
                            >
                                {mode === 'day' ? 'Dia' : 'Semana'}
                            </button>
                        ))}
                    </div>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Evento
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ocupação Hoje</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.todayOccupancy.toFixed(0)}%</div>
                        <p className="text-xs text-muted-foreground">{data.today.blocks.length} eventos</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Semana</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.weekOccupancy.toFixed(0)}%</div>
                        <p className="text-xs text-muted-foreground">de ocupação média</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Blocos de Foco</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{data.summary.focusBlocksThisWeek}</div>
                        <p className="text-xs text-muted-foreground">esta semana</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Blocos de Descanso</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{data.summary.restBlocksThisWeek}</div>
                        <p className="text-xs text-muted-foreground">esta semana</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Timeline / Week */}
                <div className="md:col-span-2">
                    {viewMode === 'day' ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Hoje</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/30">
                                    {data.today.blocks.map(block => (
                                        <TimeBlockItem
                                            key={block.id}
                                            block={block}
                                            onClick={() => handleBlockClick(block.id)}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <WeekView
                            schedule={data.week}
                            onDayClick={(date) => console.log('Day clicked', date)}
                        />
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <TimeDistributionCard distribution={data.summary.timeDistribution} />

                    {/* Insights */}
                    <Card className="p-4">
                        <h3 className="text-sm font-semibold mb-3">Insights</h3>
                        <div className="space-y-2">
                            {data.summary.insights.map(insight => (
                                <div
                                    key={insight.id}
                                    className={cn(
                                        "p-3 rounded-xl",
                                        insight.type === 'warning' && "bg-amber-500/10",
                                        insight.type === 'suggestion' && "bg-blue-500/10",
                                        insight.type === 'achievement' && "bg-green-500/10",
                                        insight.type === 'reminder' && "bg-muted/50"
                                    )}
                                >
                                    <p className="text-sm font-medium">{insight.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Detail Sheet */}
            <EventDetailSheet
                block={selectedBlock}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onEdit={(b) => console.log('Edit', b)}
                onComplete={(b) => console.log('Complete', b)}
                onCancel={(b) => console.log('Cancel', b)}
                onDelete={(b) => console.log('Delete', b)}
            />
        </div>
    );
}
