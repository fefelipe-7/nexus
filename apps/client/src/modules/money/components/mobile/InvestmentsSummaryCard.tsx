import { Card } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Wallet, PieChart, Shield, BarChart2 } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { InvestmentsSummary } from '../../types/investments.types';
import { RISK_LABELS, RISK_COLORS } from '../../types/investments.types';

interface InvestmentsSummaryCardProps {
    summary: InvestmentsSummary;
}

export function InvestmentsSummaryCard({ summary }: InvestmentsSummaryCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const isPositive = summary.totalProfitability >= 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;
    const trendColor = isPositive ? 'text-green-500' : 'text-red-500';
    const trendBg = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';

    return (
        <Card className="overflow-hidden">
            <div className="p-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                {/* Patrimônio Total */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Patrimônio Investido
                        </p>
                        <p className="text-3xl font-bold tracking-tight mt-1">
                            {formatCurrency(summary.currentValue)}
                        </p>
                    </div>
                    <div className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-full', trendBg, trendColor)}>
                        <TrendIcon className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">
                            {isPositive ? '+' : ''}{summary.totalProfitabilityPercentage.toFixed(1)}%
                        </span>
                    </div>
                </div>

                {/* Rentabilidade */}
                <div className="p-3 bg-muted/50 rounded-xl mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Rentabilidade Total</span>
                        </div>
                        <span className={cn("text-lg font-bold", trendColor)}>
                            {isPositive ? '+' : ''}{formatCurrency(summary.totalProfitability)}
                        </span>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
                        <Wallet className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-bold">{summary.assetsCount}</p>
                        <p className="text-[10px] text-muted-foreground">Ativos</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
                        <BarChart2 className="h-4 w-4 mx-auto text-green-500 mb-1" />
                        <p className="text-sm font-bold text-green-500">+{summary.monthlyProfitabilityPercentage.toFixed(1)}%</p>
                        <p className="text-[10px] text-muted-foreground">Este Mês</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
                        <Shield
                            className="h-4 w-4 mx-auto mb-1"
                            style={{ color: RISK_COLORS[summary.globalRiskLevel] }}
                        />
                        <p className="text-sm font-bold" style={{ color: RISK_COLORS[summary.globalRiskLevel] }}>
                            {RISK_LABELS[summary.globalRiskLevel]}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Risco</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
