import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockCommitmentsData } from '../data/mockCommitmentsData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Filter, AlertTriangle, Clock, CheckCircle, Calendar, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { Commitment, CommitmentGroup } from '../types/commitments.types';
import { ORIGIN_LABELS, ORIGIN_COLORS, LIFE_AREA_LABELS } from '../types/commitments.types';

import {
    CommitmentsHeader,
    CommitmentItem,
    CommitmentDetailSheet,
} from '../components/mobile';

type FilterType = 'all' | 'today' | 'week' | 'overdue' | 'critical' | 'completed' | 'no-date';

export function Commitments() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [groupBy, setGroupBy] = useState<'day' | 'area' | 'origin'>('day');

    const data = mockCommitmentsData;

    const handleCommitmentClick = (commitment: Commitment) => {
        setSelectedCommitment(commitment);
        setIsDetailOpen(true);
    };

    // Filter logic
    const getFilteredCommitments = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);

        switch (activeFilter) {
            case 'today':
                return data.commitments.filter(c => c.dueDate?.toDateString() === today.toDateString());
            case 'week':
                return data.commitments.filter(c => c.dueDate && c.dueDate >= today && c.dueDate <= weekEnd);
            case 'overdue':
                return data.commitments.filter(c => c.status === 'overdue');
            case 'critical':
                return data.commitments.filter(c => c.priority === 'critical' && c.status !== 'completed');
            case 'completed':
                return data.commitments.filter(c => c.status === 'completed');
            case 'no-date':
                return data.commitments.filter(c => !c.dueDate && c.status !== 'completed');
            default:
                return data.commitments.filter(c => c.status !== 'completed');
        }
    };

    const filteredCommitments = getFilteredCommitments();

    const filters: { key: FilterType; label: string; count?: number }[] = [
        { key: 'all', label: 'Ativos', count: data.summary.totalActive },
        { key: 'today', label: 'Hoje', count: data.summary.dueToday },
        { key: 'week', label: 'Semana', count: data.summary.dueThisWeek },
        { key: 'overdue', label: 'Atrasados', count: data.summary.overdueCount },
        { key: 'critical', label: 'Críticos', count: data.summary.criticalCount },
        { key: 'no-date', label: 'Sem data', count: data.summary.withoutDateCount },
    ];

    if (isMobileView) {
        return (
            <div className="space-y-4 pb-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Compromissos</h1>
                    <p className="text-sm text-muted-foreground">
                        O que você precisa cumprir
                    </p>
                </div>

                {/* Summary Header */}
                <CommitmentsHeader summary={data.summary} />

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
                            {filter.count !== undefined && filter.count > 0 && (
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

                {/* Grouped Commitments */}
                {groupBy === 'day' && data.groupedByDay.map(group => {
                    const groupCommitments = activeFilter === 'all'
                        ? group.commitments
                        : group.commitments.filter(c => filteredCommitments.includes(c));

                    if (groupCommitments.length === 0) return null;

                    return (
                        <Card key={group.key} className="overflow-hidden">
                            <div className={cn(
                                "px-4 py-2 border-b flex items-center justify-between",
                                group.key === 'overdue' && "bg-red-500/5"
                            )}>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{group.icon}</span>
                                    <span className="text-sm font-semibold">{group.label}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{groupCommitments.length}</span>
                            </div>
                            <div className="divide-y divide-border/30">
                                {groupCommitments.map(commitment => (
                                    <CommitmentItem
                                        key={commitment.id}
                                        commitment={commitment}
                                        onClick={() => handleCommitmentClick(commitment)}
                                    />
                                ))}
                            </div>
                        </Card>
                    );
                })}

                {/* Empty state */}
                {filteredCommitments.length === 0 && (
                    <Card className="p-8 text-center">
                        <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                        <p className="text-lg font-semibold">Tudo em dia!</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Nenhum compromisso {activeFilter === 'overdue' ? 'atrasado' : 'pendente'}.
                        </p>
                    </Card>
                )}

                {/* Detail Sheet */}
                <CommitmentDetailSheet
                    commitment={selectedCommitment}
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    onComplete={(c) => console.log('Complete', c)}
                    onReschedule={(c) => console.log('Reschedule', c)}
                    onConvertToBlock={(c) => console.log('Convert to block', c)}
                    onEdit={(c) => console.log('Edit', c)}
                    onDelete={(c) => console.log('Delete', c)}
                />

                {/* FAB */}
                <FAB
                    onClick={() => console.log('Add commitment')}
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
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Compromissos</h1>
                    <p className="text-muted-foreground">
                        O que você realmente precisa cumprir
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                        {(['day', 'area', 'origin'] as const).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setGroupBy(mode)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                    groupBy === mode ? "bg-background shadow-sm" : "text-muted-foreground"
                                )}
                            >
                                {mode === 'day' ? 'Por Data' : mode === 'area' ? 'Por Área' : 'Por Origem'}
                            </button>
                        ))}
                    </div>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Compromisso
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className={cn(
                    "border-l-4",
                    data.summary.overdueCount > 0 ? "border-l-red-500" : "border-l-green-500"
                )}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
                        <AlertTriangle className={cn(
                            "h-4 w-4",
                            data.summary.overdueCount > 0 ? "text-red-500" : "text-muted-foreground"
                        )} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn(
                            "text-2xl font-bold",
                            data.summary.overdueCount > 0 && "text-red-500"
                        )}>
                            {data.summary.overdueCount}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Críticos</CardTitle>
                        <Flame className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">{data.summary.criticalCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hoje</CardTitle>
                        <Clock className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.dueToday}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.dueThisWeek}</div>
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
                        {filter.count !== undefined && filter.count > 0 && (
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
                {data.groupedByDay.map(group => {
                    const groupCommitments = activeFilter === 'all'
                        ? group.commitments
                        : group.commitments.filter(c => filteredCommitments.includes(c));

                    if (groupCommitments.length === 0) return null;

                    return (
                        <Card key={group.key} className="overflow-hidden">
                            <CardHeader className={cn(
                                "pb-3",
                                group.key === 'overdue' && "bg-red-500/5"
                            )}>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <span>{group.icon}</span>
                                        {group.label}
                                    </CardTitle>
                                    <span className="text-xs text-muted-foreground">{groupCommitments.length}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/30">
                                    {groupCommitments.map(commitment => (
                                        <CommitmentItem
                                            key={commitment.id}
                                            commitment={commitment}
                                            onClick={() => handleCommitmentClick(commitment)}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Detail Sheet */}
            <CommitmentDetailSheet
                commitment={selectedCommitment}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onComplete={(c) => console.log('Complete', c)}
                onReschedule={(c) => console.log('Reschedule', c)}
                onConvertToBlock={(c) => console.log('Convert to block', c)}
                onEdit={(c) => console.log('Edit', c)}
                onDelete={(c) => console.log('Delete', c)}
            />
        </div>
    );
}
