import { useState } from 'react';
import { Card } from '@/ui/components/components/ui';
import { ChevronDown, CreditCard, Calendar, AlertTriangle, TrendingUp, Percent } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { SubscriptionsSummary, Subscription } from '../../types/subscriptions.types';

interface SubscriptionsSummaryCardProps {
    summary: SubscriptionsSummary;
}

export function SubscriptionsSummaryCard({ summary }: SubscriptionsSummaryCardProps) {
    const [showUpcoming, setShowUpcoming] = useState(false);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    // Determine health color
    const healthColor = summary.budgetPercentage > 25
        ? 'text-red-500'
        : summary.budgetPercentage > 15
            ? 'text-amber-500'
            : 'text-green-500';

    const healthBg = summary.budgetPercentage > 25
        ? 'bg-red-500/10'
        : summary.budgetPercentage > 15
            ? 'bg-amber-500/10'
            : 'bg-green-500/10';

    return (
        <Card className="overflow-hidden">
            {/* Main Summary */}
            <div className="p-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                {/* Total Mensal */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Total Mensal
                        </p>
                        <p className="text-3xl font-bold tracking-tight mt-1">
                            {formatCurrency(summary.totalMonthly)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {formatCurrency(summary.totalAnnual)}/ano
                        </p>
                    </div>
                    <div className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-full', healthBg, healthColor)}>
                        <Percent className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">
                            {summary.budgetPercentage.toFixed(1)}% do orçamento
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-500",
                                summary.budgetPercentage > 25 ? "bg-red-500" :
                                    summary.budgetPercentage > 15 ? "bg-amber-500" : "bg-primary"
                            )}
                            style={{ width: `${Math.min(summary.budgetPercentage * 2, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
                        <CreditCard className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-bold">{summary.activeCount}</p>
                        <p className="text-[10px] text-muted-foreground">Ativas</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
                        <AlertTriangle className={cn("h-4 w-4 mx-auto mb-1", summary.atRiskCount > 0 ? "text-amber-500" : "text-muted-foreground")} />
                        <p className={cn("text-lg font-bold", summary.atRiskCount > 0 && "text-amber-500")}>{summary.atRiskCount}</p>
                        <p className="text-[10px] text-muted-foreground">Em Risco</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
                        <Calendar className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-bold">{summary.upcomingBillings.length}</p>
                        <p className="text-[10px] text-muted-foreground">Esta Semana</p>
                    </div>
                </div>
            </div>

            {/* Upcoming Billings */}
            {summary.upcomingBillings.length > 0 && (
                <>
                    <button
                        onClick={() => setShowUpcoming(!showUpcoming)}
                        className="w-full flex items-center justify-between px-4 py-3 border-t bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                        <span className="text-xs font-medium text-muted-foreground">
                            {showUpcoming ? 'Ocultar próximas' : `${summary.upcomingBillings.length} cobranças esta semana`}
                        </span>
                        <ChevronDown className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform",
                            showUpcoming && "rotate-180"
                        )} />
                    </button>

                    {showUpcoming && (
                        <div className="px-4 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                            {summary.upcomingBillings.map((item) => (
                                <div
                                    key={item.subscription.id}
                                    className="flex items-center justify-between p-3 bg-background rounded-xl border"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: `${item.subscription.category.color}20` }}
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: item.subscription.category.color }}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{item.subscription.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                em {item.daysUntil} dia{item.daysUntil !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold">
                                        {formatCurrency(item.subscription.amount)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </Card>
    );
}
