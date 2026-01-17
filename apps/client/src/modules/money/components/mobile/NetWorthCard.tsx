import { Card } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Wallet, CreditCard, Scale } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { PatrimonySummary } from '../../types/patrimony.types';

interface NetWorthCardProps {
    summary: PatrimonySummary;
}

export function NetWorthCard({ summary }: NetWorthCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const isPositiveVariation = summary.variation.amount >= 0;
    const TrendIcon = isPositiveVariation ? TrendingUp : TrendingDown;
    const trendColor = isPositiveVariation ? 'text-green-500' : 'text-red-500';
    const trendBg = isPositiveVariation ? 'bg-green-500/10' : 'bg-red-500/10';

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
        });
    };

    return (
        <Card className="overflow-hidden">
            <div className="p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                {/* Patrimônio Líquido */}
                <div className="text-center mb-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Patrimônio Líquido
                    </p>
                    <p className="text-4xl font-bold tracking-tight">
                        {formatCurrency(summary.netWorth)}
                    </p>
                    <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-2",
                        trendBg, trendColor
                    )}>
                        <TrendIcon className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">
                            {isPositiveVariation ? '+' : ''}{formatCurrency(summary.variation.amount)} este mês
                        </span>
                    </div>
                </div>

                {/* Balance Bar */}
                <div className="mb-4">
                    <div className="h-3 rounded-full overflow-hidden flex">
                        <div
                            className="h-full bg-green-500"
                            style={{ width: `${(summary.totalAssets / (summary.totalAssets + summary.totalLiabilities)) * 100}%` }}
                        />
                        <div
                            className="h-full bg-red-500"
                            style={{ width: `${(summary.totalLiabilities / (summary.totalAssets + summary.totalLiabilities)) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Assets vs Liabilities */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Wallet className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-muted-foreground">Ativos</span>
                        </div>
                        <p className="text-xl font-bold text-green-600">
                            {formatCurrency(summary.totalAssets)}
                        </p>
                    </div>
                    <div className="bg-red-500/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="h-4 w-4 text-red-500" />
                            <span className="text-xs text-muted-foreground">Passivos</span>
                        </div>
                        <p className="text-xl font-bold text-red-600">
                            {formatCurrency(summary.totalLiabilities)}
                        </p>
                    </div>
                </div>

                {/* Last Updated */}
                <p className="text-[10px] text-muted-foreground text-center mt-4">
                    Atualizado em {formatDate(summary.lastUpdated)}
                </p>
            </div>
        </Card>
    );
}
