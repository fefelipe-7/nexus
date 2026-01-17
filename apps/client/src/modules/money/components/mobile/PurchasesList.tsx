import { Card } from '@/ui/components/components/ui';
import { PurchaseListItem } from './PurchaseListItem';
import type { DayGroup, Purchase } from '../../types/purchases.types';

interface PurchasesListProps {
    dayGroups: DayGroup[];
    onPurchaseClick?: (purchase: Purchase) => void;
}

export function PurchasesList({ dayGroups, onPurchaseClick }: PurchasesListProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    if (dayGroups.length === 0) {
        return (
            <Card className="p-8">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Nenhuma compra encontrada
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Tente ajustar os filtros ou registre uma nova compra
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {dayGroups.map((group) => (
                <div key={group.date.toISOString()}>
                    {/* Day Header */}
                    <div className="flex items-center justify-between px-1 mb-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            {group.dateLabel}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground">
                            {formatCurrency(group.totalSpent)}
                        </p>
                    </div>

                    {/* Purchases */}
                    <Card className="overflow-hidden divide-y divide-border/50">
                        {group.purchases.map((purchase) => (
                            <PurchaseListItem
                                key={purchase.id}
                                purchase={purchase}
                                onClick={() => onPurchaseClick?.(purchase)}
                            />
                        ))}
                    </Card>
                </div>
            ))}
        </div>
    );
}
