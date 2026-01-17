import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockReportsData } from '../data/mockReportsData';
import { Calendar, BarChart2, TrendingUp, PieChart, Target, Clock, Download } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { ReportType } from '../types/reports.types';
import { REPORT_TYPE_LABELS } from '../types/reports.types';

import {
    KPIsCard,
    InsightCard,
    InsightsList,
    FinancialTimeline,
    PatrimonyChart,
    GoalHistoryCard,
} from '../components/mobile';

export function Reports() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const [activeTab, setActiveTab] = useState<ReportType>('patrimony');
    const [period, setPeriod] = useState<'12m' | '6m' | '3m' | 'year'>('12m');

    const data = mockReportsData;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const periodLabels = {
        '12m': 'Últimos 12 meses',
        '6m': 'Últimos 6 meses',
        '3m': 'Últimos 3 meses',
        'year': '2025',
    };

    const tabs: { key: ReportType; icon: React.ElementType }[] = [
        { key: 'patrimony', icon: TrendingUp },
        { key: 'cashflow', icon: BarChart2 },
        { key: 'investments', icon: PieChart },
        { key: 'goals', icon: Target },
        { key: 'timeline', icon: Clock },
    ];

    if (isMobileView) {
        return (
            <div className="space-y-4 pb-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Relatórios & Histórico</h1>
                    <p className="text-sm text-muted-foreground">
                        Como você chegou até aqui
                    </p>
                </div>

                {/* Period Selector */}
                <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl">
                    {(['12m', '6m', '3m', 'year'] as const).map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={cn(
                                "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all",
                                period === p
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {p === '12m' ? '12M' : p === '6m' ? '6M' : p === '3m' ? '3M' : '2025'}
                        </button>
                    ))}
                </div>

                {/* Main Insight */}
                <InsightCard insight={data.mainInsight} isMain />

                {/* Tabs */}
                <div className="flex gap-1 bg-muted/50 p-1 rounded-xl overflow-x-auto scrollbar-hide">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                                activeTab === tab.key
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <tab.icon className="h-3.5 w-3.5" />
                            {REPORT_TYPE_LABELS[tab.key].split(' ')[0]}
                        </button>
                    ))}
                </div>

                {/* Content by Tab */}
                {activeTab === 'patrimony' && (
                    <div className="space-y-4">
                        <PatrimonyChart data={data.patrimonyEvolution} />
                        <KPIsCard kpis={data.kpis} />
                    </div>
                )}

                {activeTab === 'cashflow' && (
                    <div className="space-y-4">
                        {/* Cash Flow Summary */}
                        <Card className="p-4">
                            <h3 className="text-sm font-semibold mb-3">Fluxo de Caixa Médio</h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-3 bg-green-500/10 rounded-xl">
                                    <p className="text-xs text-muted-foreground mb-1">Receita</p>
                                    <p className="text-lg font-bold text-green-500">{formatCurrency(data.kpis.averageMonthlyIncome)}</p>
                                </div>
                                <div className="text-center p-3 bg-red-500/10 rounded-xl">
                                    <p className="text-xs text-muted-foreground mb-1">Despesa</p>
                                    <p className="text-lg font-bold text-red-500">{formatCurrency(data.kpis.averageMonthlyExpense)}</p>
                                </div>
                                <div className="text-center p-3 bg-blue-500/10 rounded-xl">
                                    <p className="text-xs text-muted-foreground mb-1">Poupança</p>
                                    <p className="text-lg font-bold text-blue-500">{formatCurrency(data.kpis.averageMonthlySavings)}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Best/Worst Months */}
                        <Card className="p-4">
                            <h3 className="text-sm font-semibold mb-3">Extremos</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-green-500/10 rounded-xl">
                                    <p className="text-xs text-muted-foreground mb-1">🏆 Melhor mês</p>
                                    <p className="text-sm font-bold text-green-500">{formatCurrency(data.bestMonth.savings)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {data.bestMonth.date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="p-3 bg-red-500/10 rounded-xl">
                                    <p className="text-xs text-muted-foreground mb-1">📉 Pior mês</p>
                                    <p className="text-sm font-bold text-red-500">{formatCurrency(data.worstMonth.savings)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {data.worstMonth.date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Expense Trends */}
                        <Card className="p-4">
                            <h3 className="text-sm font-semibold mb-3">Tendência de Gastos</h3>
                            <div className="space-y-3">
                                {data.expenseTrends.map(trend => (
                                    <div key={trend.category} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: trend.color }}
                                            />
                                            <span className="text-sm">{trend.category}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{formatCurrency(trend.averageMonthly)}/mês</span>
                                            <span className={cn(
                                                "text-xs font-medium px-1.5 py-0.5 rounded",
                                                trend.trend === 'up' && "bg-red-500/10 text-red-500",
                                                trend.trend === 'down' && "bg-green-500/10 text-green-500",
                                                trend.trend === 'stable' && "bg-muted text-muted-foreground"
                                            )}>
                                                {trend.trend === 'up' ? '↑' : trend.trend === 'down' ? '↓' : '→'} {Math.abs(trend.trendPercentage)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'investments' && (
                    <div className="space-y-4">
                        {/* Investment Performance */}
                        <Card className="p-4">
                            <h3 className="text-sm font-semibold mb-3">Performance por Classe</h3>
                            <div className="space-y-3">
                                {data.investmentPerformance.map(inv => (
                                    <div key={inv.assetClass} className="p-3 bg-muted/30 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: inv.color }}
                                                />
                                                <span className="text-sm font-medium">{inv.assetClass}</span>
                                            </div>
                                            <span className={cn(
                                                "text-sm font-bold",
                                                inv.return >= 0 ? "text-green-500" : "text-red-500"
                                            )}>
                                                +{inv.returnPercentage.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Investido: {formatCurrency(inv.invested)}</span>
                                            <span>Atual: {formatCurrency(inv.currentValue)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Total Return */}
                        <Card className="p-4">
                            <h3 className="text-sm font-semibold mb-3">Retorno Total</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-green-500/10 rounded-xl text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Nominal</p>
                                    <p className="text-lg font-bold text-green-500">{formatCurrency(data.kpis.totalReturn)}</p>
                                </div>
                                <div className="p-3 bg-blue-500/10 rounded-xl text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Real (- inflação)</p>
                                    <p className="text-lg font-bold text-blue-500">{formatCurrency(data.kpis.realReturn)}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'goals' && (
                    <GoalHistoryCard goals={data.goalHistory} />
                )}

                {activeTab === 'timeline' && (
                    <FinancialTimeline events={data.timeline} />
                )}

                {/* Insights */}
                <InsightsList insights={data.insights} />
            </div>
        );
    }

    // Desktop
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Relatórios & Histórico</h1>
                    <p className="text-muted-foreground">
                        Entenda como você chegou até aqui
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                        {(['12m', '6m', '3m', 'year'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                    period === p ? "bg-background shadow-sm" : "text-muted-foreground"
                                )}
                            >
                                {periodLabels[p]}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Main Insight */}
            <InsightCard insight={data.mainInsight} isMain />

            {/* KPIs */}
            <KPIsCard kpis={data.kpis} />

            {/* Charts Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                <PatrimonyChart data={data.patrimonyEvolution} />
                <FinancialTimeline events={data.timeline} maxItems={5} />
            </div>

            {/* Goal History */}
            <GoalHistoryCard goals={data.goalHistory} />

            {/* Insights */}
            <InsightsList insights={data.insights} />
        </div>
    );
}
