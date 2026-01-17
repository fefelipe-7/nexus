import { Card } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Target, BarChart2, Percent, Calendar } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { FinancialKPIs } from '../../types/reports.types';

interface KPIsCardProps {
    kpis: FinancialKPIs;
}

export function KPIsCard({ kpis }: KPIsCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(value);
    };

    const kpiItems = [
        {
            label: 'Crescimento Patrimonial',
            value: `+${kpis.netWorthGrowth.toFixed(1)}%`,
            subValue: formatCurrency(kpis.netWorthGrowthAmount),
            icon: TrendingUp,
            color: '#10b981',
            positive: true,
        },
        {
            label: 'Taxa de Poupança',
            value: `${kpis.savingsRate}%`,
            subValue: `${formatCurrency(kpis.averageMonthlySavings)}/mês`,
            icon: PiggyBank,
            color: '#3b82f6',
            positive: kpis.savingsRate >= 20,
        },
        {
            label: 'Retorno Total',
            value: formatCurrency(kpis.totalReturn),
            subValue: `Real: ${formatCurrency(kpis.realReturn)}`,
            icon: BarChart2,
            color: '#8b5cf6',
            positive: true,
        },
        {
            label: 'Redução de Dívidas',
            value: `-${kpis.debtReduction.toFixed(1)}%`,
            subValue: 'no período',
            icon: TrendingDown,
            color: '#22c55e',
            positive: true,
        },
        {
            label: 'Consistência de Aportes',
            value: `${kpis.contributionConsistency}%`,
            subValue: 'dos meses',
            icon: Calendar,
            color: '#6366f1',
            positive: kpis.contributionConsistency >= 80,
        },
        {
            label: 'Metas Concluídas',
            value: `${kpis.goalCompletionRate.toFixed(0)}%`,
            subValue: `~${kpis.averageGoalDelay}d atraso`,
            icon: Target,
            color: kpis.goalCompletionRate >= 50 ? '#10b981' : '#f59e0b',
            positive: kpis.goalCompletionRate >= 50,
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3">
            {kpiItems.map((kpi, index) => (
                <Card
                    key={index}
                    className="p-3"
                >
                    <div className="flex items-start gap-2">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${kpi.color}15` }}
                        >
                            <kpi.icon className="h-4 w-4" style={{ color: kpi.color }} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] text-muted-foreground truncate">{kpi.label}</p>
                            <p className="text-lg font-bold" style={{ color: kpi.positive ? kpi.color : '#ef4444' }}>
                                {kpi.value}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{kpi.subValue}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
