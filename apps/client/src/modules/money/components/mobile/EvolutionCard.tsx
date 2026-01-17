import { Card } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { PatrimonyHistory } from '../../types/patrimony.types';

interface EvolutionCardProps {
    history: PatrimonyHistory[];
}

export function EvolutionCard({ history }: EvolutionCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            notation: 'compact',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatMonth = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            month: 'short',
        }).replace('.', '');
    };

    if (history.length === 0) return null;

    // Find min and max for scaling
    const values = history.map(h => h.netWorth);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    // Calculate changes
    const firstValue = history[0].netWorth;
    const lastValue = history[history.length - 1].netWorth;
    const totalChange = lastValue - firstValue;
    const totalChangePercentage = (totalChange / firstValue) * 100;

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Evolução do Patrimônio</h3>
                <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    totalChange >= 0 ? "text-green-500" : "text-red-500"
                )}>
                    {totalChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {totalChange >= 0 ? '+' : ''}{totalChangePercentage.toFixed(1)}%
                </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="flex items-end gap-2 h-28 mb-2">
                {history.map((item, index) => {
                    const height = ((item.netWorth - minValue) / range) * 80 + 20;
                    const isLast = index === history.length - 1;
                    const prevValue = history[index - 1]?.netWorth || item.netWorth;
                    const isUp = item.netWorth >= prevValue;

                    return (
                        <div
                            key={index}
                            className="flex-1 flex flex-col items-center gap-1"
                        >
                            <div
                                className={cn(
                                    "w-full rounded-t-md transition-all",
                                    isLast ? "bg-primary" : isUp ? "bg-green-500/50" : "bg-red-500/50"
                                )}
                                style={{ height: `${height}%` }}
                            />
                            <span className="text-[10px] text-muted-foreground">
                                {formatMonth(item.date)}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Value Range */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(minValue)}</span>
                <span>{formatCurrency(maxValue)}</span>
            </div>
        </Card>
    );
}
