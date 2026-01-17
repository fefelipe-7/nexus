import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockSubscriptionsData } from '../data/mockSubscriptionsData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Search, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { Subscription } from '../types/subscriptions.types';

import {
    SubscriptionsSummaryCard,
    SubscriptionsList,
    SubscriptionRiskCard,
    SubscriptionDetailSheet,
} from '../components/mobile';

export function Subscriptions() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'grouped'>('list');
    const [sortBy, setSortBy] = useState<'next_billing' | 'amount' | 'name'>('next_billing');

    const data = mockSubscriptionsData;

    const handleSubscriptionClick = (subscription: Subscription) => {
        setSelectedSubscription(subscription);
        setIsDetailOpen(true);
    };

    // Filter subscriptions
    const filteredSubscriptions = data.subscriptions.filter(sub => {
        if (!searchQuery) return true;
        return (
            sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.category.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Sort subscriptions
    const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
        switch (sortBy) {
            case 'next_billing':
                return a.nextBillingDate.getTime() - b.nextBillingDate.getTime();
            case 'amount':
                return b.amount - a.amount;
            case 'name':
                return a.name.localeCompare(b.name);
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
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Assinaturas</h1>
                    <p className="text-sm text-muted-foreground">
                        Controle total sobre seus gastos recorrentes
                    </p>
                </div>

                {/* Summary Card */}
                <SubscriptionsSummaryCard summary={data.summary} />

                {/* Risk Card */}
                {data.atRiskSubscriptions.length > 0 && (
                    <SubscriptionRiskCard
                        atRiskSubscriptions={data.atRiskSubscriptions}
                        onSubscriptionClick={handleSubscriptionClick}
                    />
                )}

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar assinaturas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 bg-muted/50 border-0"
                    />
                </div>

                {/* View Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-2 rounded-md transition-all",
                                viewMode === 'list' ? "bg-background shadow-sm" : "text-muted-foreground"
                            )}
                        >
                            <List className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('grouped')}
                            className={cn(
                                "p-2 rounded-md transition-all",
                                viewMode === 'grouped' ? "bg-background shadow-sm" : "text-muted-foreground"
                            )}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                        {(['next_billing', 'amount', 'name'] as const).map(sort => (
                            <button
                                key={sort}
                                onClick={() => setSortBy(sort)}
                                className={cn(
                                    "px-2 py-1.5 rounded-md text-xs font-medium transition-all",
                                    sortBy === sort ? "bg-background shadow-sm" : "text-muted-foreground"
                                )}
                            >
                                {sort === 'next_billing' ? 'Data' : sort === 'amount' ? 'Valor' : 'Nome'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subscriptions List */}
                <SubscriptionsList
                    subscriptions={sortedSubscriptions}
                    onSubscriptionClick={handleSubscriptionClick}
                    groupBy={viewMode === 'grouped' ? 'category' : 'none'}
                />

                {/* Detail Sheet */}
                <SubscriptionDetailSheet
                    subscription={selectedSubscription}
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    onToggleEssential={(s) => console.log('Toggle essential', s)}
                    onPause={(s) => console.log('Pause', s)}
                    onCancel={(s) => console.log('Cancel', s)}
                    onEdit={(s) => console.log('Edit', s)}
                />

                {/* FAB */}
                <FAB
                    onClick={() => console.log('Add subscription')}
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
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Assinaturas</h1>
                    <p className="text-muted-foreground">
                        Controle total sobre seus gastos recorrentes
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
                    <Button variant="outline" size="sm">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filtros
                    </Button>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Assinatura
                    </Button>
                </div>
            </div>

            {/* Desktop Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Mensal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.summary.totalMonthly)}</div>
                        <p className="text-xs text-muted-foreground">{formatCurrency(data.summary.totalAnnual)}/ano</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.activeCount}</div>
                        <p className="text-xs text-muted-foreground">serviços recorrentes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">% do Orçamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.budgetPercentage.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">comprometido</p>
                    </CardContent>
                </Card>
                <Card className={cn(data.summary.atRiskCount > 0 && "border-amber-500/50")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Em Atenção</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", data.summary.atRiskCount > 0 && "text-amber-500")}>
                            {data.summary.atRiskCount}
                        </div>
                        <p className="text-xs text-muted-foreground">requerem análise</p>
                    </CardContent>
                </Card>
            </div>

            {/* Risk Alert */}
            {data.atRiskSubscriptions.length > 0 && (
                <SubscriptionRiskCard
                    atRiskSubscriptions={data.atRiskSubscriptions}
                    onSubscriptionClick={handleSubscriptionClick}
                />
            )}

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Todas as Assinaturas</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <SubscriptionsList
                        subscriptions={sortedSubscriptions}
                        onSubscriptionClick={handleSubscriptionClick}
                        groupBy="none"
                    />
                </CardContent>
            </Card>

            {/* Detail Sheet */}
            <SubscriptionDetailSheet
                subscription={selectedSubscription}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onToggleEssential={(s) => console.log('Toggle essential', s)}
                onPause={(s) => console.log('Pause', s)}
                onCancel={(s) => console.log('Cancel', s)}
                onEdit={(s) => console.log('Edit', s)}
            />
        </div>
    );
}
