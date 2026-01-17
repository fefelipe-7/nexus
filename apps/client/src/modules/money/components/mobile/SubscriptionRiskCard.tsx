import { Card } from '@/ui/components/components/ui';
import { AlertTriangle, ArrowRight, TrendingUp, Clock, Ban, Repeat } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { Subscription } from '../../types/subscriptions.types';
import { RISK_LABELS } from '../../types/subscriptions.types';

interface SubscriptionRiskCardProps {
    atRiskSubscriptions: Subscription[];
    onSubscriptionClick?: (subscription: Subscription) => void;
}

const RISK_ICONS: Record<string, React.ReactNode> = {
    unused: <Ban className="h-4 w-4" />,
    expensive: <TrendingUp className="h-4 w-4" />,
    redundant: <Repeat className="h-4 w-4" />,
    annual_due: <Clock className="h-4 w-4" />,
    price_increase: <TrendingUp className="h-4 w-4" />,
};

const RISK_COLORS: Record<string, string> = {
    unused: 'text-red-500 bg-red-500/10',
    expensive: 'text-amber-500 bg-amber-500/10',
    redundant: 'text-purple-500 bg-purple-500/10',
    annual_due: 'text-blue-500 bg-blue-500/10',
    price_increase: 'text-orange-500 bg-orange-500/10',
};

export function SubscriptionRiskCard({ atRiskSubscriptions, onSubscriptionClick }: SubscriptionRiskCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    if (atRiskSubscriptions.length === 0) {
        return null;
    }

    // Group by primary risk
    const riskGroups = atRiskSubscriptions.reduce((acc, sub) => {
        const primaryRisk = sub.risks[0];
        if (!acc[primaryRisk]) {
            acc[primaryRisk] = [];
        }
        acc[primaryRisk].push(sub);
        return acc;
    }, {} as Record<string, Subscription[]>);

    const potentialSavings = atRiskSubscriptions
        .filter(s => ['unused', 'redundant'].includes(s.risks[0]))
        .reduce((sum, s) => sum + s.amount, 0);

    return (
        <Card className="border-amber-500/30 bg-amber-500/5">
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Assinaturas em Atenção</p>
                        <p className="text-xs text-muted-foreground">
                            {atRiskSubscriptions.length} assinatura{atRiskSubscriptions.length !== 1 ? 's' : ''} requer{atRiskSubscriptions.length === 1 ? '' : 'em'} sua análise
                        </p>
                    </div>
                </div>

                {/* Potential Savings */}
                {potentialSavings > 0 && (
                    <div className="p-3 bg-green-500/10 rounded-xl mb-3">
                        <p className="text-xs text-green-600 font-medium">
                            💡 Economia potencial de {formatCurrency(potentialSavings)}/mês
                        </p>
                    </div>
                )}

                {/* Risk Items */}
                <div className="space-y-2">
                    {Object.entries(riskGroups).map(([risk, subs]) => (
                        <div key={risk}>
                            {subs.map((sub) => (
                                <button
                                    key={sub.id}
                                    onClick={() => onSubscriptionClick?.(sub)}
                                    className="w-full flex items-center gap-3 p-3 bg-background rounded-xl hover:bg-accent/50 transition-all"
                                >
                                    <div className={cn(
                                        "p-2 rounded-lg",
                                        RISK_COLORS[risk]
                                    )}>
                                        {RISK_ICONS[risk]}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className="text-sm font-medium truncate">{sub.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {RISK_LABELS[risk as keyof typeof RISK_LABELS]}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold">{formatCurrency(sub.amount)}</p>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
