import { Card } from '@/ui/components/components/ui';
import { SubscriptionListItem } from './SubscriptionListItem';
import type { Subscription } from '../../types/subscriptions.types';

interface SubscriptionsListProps {
    subscriptions: Subscription[];
    onSubscriptionClick?: (subscription: Subscription) => void;
    groupBy?: 'category' | 'date' | 'none';
}

export function SubscriptionsList({ subscriptions, onSubscriptionClick, groupBy = 'none' }: SubscriptionsListProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    if (subscriptions.length === 0) {
        return (
            <Card className="p-8">
                <div className="text-center">
                    <p className="text-sm font-medium">Nenhuma assinatura encontrada</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Adicione suas assinaturas para ter controle total
                    </p>
                </div>
            </Card>
        );
    }

    if (groupBy === 'category') {
        const grouped = subscriptions.reduce((acc, sub) => {
            const key = sub.category.id;
            if (!acc[key]) {
                acc[key] = {
                    category: sub.category,
                    subscriptions: [],
                    total: 0,
                };
            }
            acc[key].subscriptions.push(sub);
            acc[key].total += sub.amount;
            return acc;
        }, {} as Record<string, { category: typeof subscriptions[0]['category']; subscriptions: Subscription[]; total: number }>);

        return (
            <div className="space-y-4">
                {Object.values(grouped).map((group) => (
                    <div key={group.category.id}>
                        <div className="flex items-center justify-between px-1 mb-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: group.category.color }}
                                />
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    {group.category.name}
                                </p>
                            </div>
                            <p className="text-xs font-medium text-muted-foreground">
                                {formatCurrency(group.total)}/mês
                            </p>
                        </div>
                        <Card className="overflow-hidden divide-y divide-border/50">
                            {group.subscriptions.map((sub) => (
                                <SubscriptionListItem
                                    key={sub.id}
                                    subscription={sub}
                                    onClick={() => onSubscriptionClick?.(sub)}
                                />
                            ))}
                        </Card>
                    </div>
                ))}
            </div>
        );
    }

    // Default: no grouping
    return (
        <Card className="overflow-hidden divide-y divide-border/50">
            {subscriptions.map((sub) => (
                <SubscriptionListItem
                    key={sub.id}
                    subscription={sub}
                    onClick={() => onSubscriptionClick?.(sub)}
                />
            ))}
        </Card>
    );
}
