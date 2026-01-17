import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Minus, Receipt, Activity } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { PurchasesSummary } from '../../types/purchases.types';

interface PurchasesSummaryProps {
    summary: PurchasesSummary;
}

export function PurchasesSummary({ summary }: PurchasesSummaryProps) {
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

    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Receipt className="h-4 w-4 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(summary.totalSpent)}</div>
                    <p className="text-xs text-muted-foreground">{summary.period.label}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Média Diária</CardTitle>
                    <div className="p-2 bg-muted rounded-lg">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(summary.dailyAverage)}</div>
                    <p className="text-xs text-muted-foreground">Por dia</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Transações</CardTitle>
                    <div className="p-2 bg-muted rounded-lg">
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.transactionCount}</div>
                    <p className="text-xs text-muted-foreground">Registros</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">vs Período Anterior</CardTitle>
                    <div className={cn("p-2 rounded-lg", trendColor === 'text-green-500' ? 'bg-green-500/10' : 'bg-red-500/10')}>
                        <TrendIcon className={cn("h-4 w-4", trendColor)} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className={cn("text-2xl font-bold", trendColor)}>
                        {summary.comparison.direction === 'up' ? '+' : summary.comparison.direction === 'down' ? '-' : ''}
                        {summary.comparison.percentage}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {formatCurrency(Math.abs(summary.comparison.difference))}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
