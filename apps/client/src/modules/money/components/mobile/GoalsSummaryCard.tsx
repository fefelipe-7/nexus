import { Card } from '@/ui/components/components/ui';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { GoalsSummary } from '../../types/goals.types';

interface GoalsSummaryCardProps {
    summary: GoalsSummary;
}

export function GoalsSummaryCard({ summary }: GoalsSummaryCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            notation: 'compact',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const hasConflicts = summary.conflictingGoals > 0;

    return (
        <Card className="overflow-hidden">
            <div className="p-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                {/* Progress Overview */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Progresso Médio
                        </p>
                        <p className="text-3xl font-bold tracking-tight mt-1">
                            {summary.averageProgress.toFixed(0)}%
                        </p>
                    </div>
                    <div className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full",
                        hasConflicts ? "bg-amber-500/10 text-amber-500" : "bg-green-500/10 text-green-500"
                    )}>
                        {hasConflicts ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                        <span className="text-xs font-semibold">
                            {hasConflicts ? `${summary.conflictingGoals} atrasada${summary.conflictingGoals > 1 ? 's' : ''}` : 'Tudo em dia'}
                        </span>
                    </div>
                </div>

                {/* Totals */}
                <div className="p-3 bg-muted/50 rounded-xl mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Acumulado</span>
                        <span className="text-sm font-bold text-green-600">{formatCurrency(summary.totalCurrentAmount)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(summary.totalCurrentAmount / summary.totalTargetAmount) * 100}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">Meta total</span>
                        <span className="text-xs text-muted-foreground">{formatCurrency(summary.totalTargetAmount)}</span>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
                        <Target className="h-4 w-4 mx-auto text-primary mb-1" />
                        <p className="text-lg font-bold">{summary.activeCount}</p>
                        <p className="text-[10px] text-muted-foreground">Ativas</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
                        <CheckCircle className="h-4 w-4 mx-auto text-green-500 mb-1" />
                        <p className="text-lg font-bold">{summary.completedCount}</p>
                        <p className="text-[10px] text-muted-foreground">Concluídas</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
                        <Calendar className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <p className="text-sm font-bold">{summary.nextCriticalGoal?.daysLeft || '-'}d</p>
                        <p className="text-[10px] text-muted-foreground">Próx. prazo</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
