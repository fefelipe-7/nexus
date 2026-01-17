import { cn } from '@nexus/shared';
import { ChevronRight, AlertTriangle, Clock, Star } from 'lucide-react';
import type { Subscription } from '../../types/subscriptions.types';
import { FREQUENCY_LABELS, RISK_LABELS } from '../../types/subscriptions.types';

interface SubscriptionListItemProps {
    subscription: Subscription;
    onClick?: () => void;
}

export function SubscriptionListItem({ subscription, onClick }: SubscriptionListItemProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
        });
    };

    const daysUntilBilling = Math.ceil(
        (subscription.nextBillingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    const hasRisks = subscription.risks.length > 0;
    const primaryRisk = subscription.risks[0];

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 p-4 transition-all",
                "active:bg-accent/50 hover:bg-accent/30"
            )}
        >
            {/* Logo/Icon */}
            <div
                className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${subscription.category.color}15` }}
            >
                <span
                    className="text-lg font-bold"
                    style={{ color: subscription.category.color }}
                >
                    {subscription.name.charAt(0)}
                </span>
                {subscription.isEssential && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center">
                        <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">{subscription.name}</p>
                    {hasRisks && (
                        <span className="flex items-center gap-0.5 text-amber-500">
                            <AlertTriangle className="h-3 w-3" />
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{
                            backgroundColor: `${subscription.category.color}15`,
                            color: subscription.category.color
                        }}
                    >
                        {subscription.category.name}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                    <span>{FREQUENCY_LABELS[subscription.frequency]}</span>
                </div>
                {hasRisks && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {RISK_LABELS[primaryRisk]}
                    </p>
                )}
            </div>

            {/* Amount & Date */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <p className="text-sm font-bold">
                    {formatCurrency(subscription.amount)}
                </p>
                <p className={cn(
                    "text-xs flex items-center gap-1",
                    daysUntilBilling <= 3 ? "text-amber-500" : "text-muted-foreground"
                )}>
                    <Clock className="h-3 w-3" />
                    {daysUntilBilling <= 0 ? 'Hoje' : daysUntilBilling === 1 ? 'Amanhã' : `${daysUntilBilling}d`}
                </p>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </button>
    );
}
