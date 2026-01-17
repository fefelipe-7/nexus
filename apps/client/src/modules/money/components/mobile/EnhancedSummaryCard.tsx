import { useState } from 'react';
import { Card } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Minus, ChevronDown, Receipt, Calendar, CreditCard, PieChart } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { PurchasesSummary, PurchaseCategory } from '../../types/purchases.types';

interface EnhancedSummaryCardProps {
    summary: PurchasesSummary;
    categories: PurchaseCategory[];
    topCategory?: { name: string; amount: number; percentage: number };
}

export function EnhancedSummaryCard({ summary, categories, topCategory }: EnhancedSummaryCardProps) {
    const [expanded, setExpanded] = useState(false);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const TrendIcon = summary.comparison.direction === 'up'
        ? TrendingUp
        : summary.comparison.direction === 'down'
            ? TrendingDown
            : Minus;

    const trendColor = summary.comparison.direction === 'up'
        ? 'text-red-500'
        : summary.comparison.direction === 'down'
            ? 'text-green-500'
            : 'text-muted-foreground';

    const trendBg = summary.comparison.direction === 'up'
        ? 'bg-red-500/10'
        : summary.comparison.direction === 'down'
            ? 'bg-green-500/10'
            : 'bg-muted';

    // Calculate spending bar percentage (max 100%)
    const spendingPercentage = Math.min(100, (summary.totalSpent / (summary.comparison.previousPeriod || summary.totalSpent)) * 100);

    return (
        <Card className="overflow-hidden">
            {/* Main Summary */}
            <div className="p-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                {/* Total */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {summary.period.label}
                        </p>
                        <p className="text-3xl font-bold tracking-tight mt-1">
                            {formatCurrency(summary.totalSpent)}
                        </p>
                    </div>
                    <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full', trendBg, trendColor)}>
                        <TrendIcon className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">
                            {summary.comparison.percentage}%
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Período anterior: {formatCurrency(summary.comparison.previousPeriod)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-500",
                                spendingPercentage > 100 ? "bg-red-500" : "bg-primary"
                            )}
                            style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
                        <Receipt className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-bold">{summary.transactionCount}</p>
                        <p className="text-[10px] text-muted-foreground">Transações</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
                        <CreditCard className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-bold">{formatCurrency(summary.dailyAverage).replace('R$', '').trim()}</p>
                        <p className="text-[10px] text-muted-foreground">Média/dia</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
                        <PieChart className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-bold">{categories.length}</p>
                        <p className="text-[10px] text-muted-foreground">Categorias</p>
                    </div>
                </div>
            </div>

            {/* Expandable Categories */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-4 py-3 border-t bg-muted/30 hover:bg-muted/50 transition-colors"
            >
                <span className="text-xs font-medium text-muted-foreground">
                    {expanded ? 'Ocultar categorias' : 'Ver categorias principais'}
                </span>
                <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    expanded && "rotate-180"
                )} />
            </button>

            {expanded && (
                <div className="px-4 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    {categories.slice(0, 5).map((cat, index) => {
                        const categoryTotal = 500 + Math.random() * 500; // Mock
                        const categoryPercentage = (categoryTotal / summary.totalSpent) * 100;

                        return (
                            <div key={cat.id} className="flex items-center gap-3">
                                <div
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: cat.color }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium truncate">{cat.name}</span>
                                        <span className="text-xs text-muted-foreground">{categoryPercentage.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${categoryPercentage}%`,
                                                backgroundColor: cat.color
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}
