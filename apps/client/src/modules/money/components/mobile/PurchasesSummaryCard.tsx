import { Card } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { PurchasesSummary } from '../../types/purchases.types';

interface PurchasesSummaryCardProps {
    summary: PurchasesSummary;
}

export function PurchasesSummaryCard({ summary }: PurchasesSummaryCardProps) {
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
        ? 'text-red-500' // Gastar mais é ruim
        : summary.comparison.direction === 'down'
            ? 'text-green-500' // Gastar menos é bom
            : 'text-muted-foreground';

    return (
        <Card className="bg-gradient-to-br from-muted/50 to-transparent">
            <div className="p-4 space-y-3">
                {/* Total gasto */}
                <div className="flex items-baseline justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            {summary.period.label}
                        </p>
                        <p className="text-2xl font-bold tracking-tight">
                            {formatCurrency(summary.totalSpent)}
                        </p>
                    </div>
                    <div className={cn('flex items-center gap-1', trendColor)}>
                        <TrendIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                            {summary.comparison.percentage}%
                        </span>
                    </div>
                </div>

                {/* Métricas secundárias */}
                <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Média diária</p>
                        <p className="text-sm font-semibold">
                            {formatCurrency(summary.dailyAverage)}
                        </p>
                    </div>
                    <div className="w-px h-8 bg-border/50" />
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Transações</p>
                        <p className="text-sm font-semibold">
                            {summary.transactionCount}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
