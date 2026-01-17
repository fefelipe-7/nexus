import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { CreditCard, Smartphone, Banknote, MoreHorizontal, AlertCircle, Repeat, TrendingUp, ChevronRight } from 'lucide-react';
import type { DayGroup, Purchase, PaymentMethod } from '../../types/purchases.types';

interface EnhancedPurchasesListProps {
    dayGroups: DayGroup[];
    onPurchaseClick?: (purchase: Purchase) => void;
}

const PAYMENT_ICONS: Record<PaymentMethod, React.ReactNode> = {
    credit_card: <CreditCard className="h-3 w-3" />,
    debit_card: <CreditCard className="h-3 w-3" />,
    pix: <Smartphone className="h-3 w-3" />,
    cash: <Banknote className="h-3 w-3" />,
    bank_transfer: <Smartphone className="h-3 w-3" />,
    other: <MoreHorizontal className="h-3 w-3" />,
};

function PurchaseItem({ purchase, onClick }: { purchase: Purchase; onClick?: () => void }) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const hasStatus = purchase.status.some(s =>
        ['uncategorized', 'recurring', 'above_pattern'].includes(s)
    );

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 p-3.5 transition-all",
                "active:bg-accent/50 hover:bg-accent/30"
            )}
        >
            {/* Category Color + Icon */}
            <div
                className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${purchase.category?.color || '#6b7280'}20` }}
            >
                <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: purchase.category?.color || '#6b7280' }}
                />
                {/* Status Badge */}
                {hasStatus && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-background flex items-center justify-center">
                        {purchase.status.includes('uncategorized') && (
                            <AlertCircle className="h-3 w-3 text-amber-500" />
                        )}
                        {purchase.status.includes('recurring') && (
                            <Repeat className="h-3 w-3 text-blue-500" />
                        )}
                        {purchase.status.includes('above_pattern') && (
                            <TrendingUp className="h-3 w-3 text-red-500" />
                        )}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                        {purchase.establishment || purchase.description}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <span>{formatTime(purchase.date)}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                    <span className="flex items-center gap-0.5">
                        {PAYMENT_ICONS[purchase.paymentMethod]}
                    </span>
                    {purchase.category && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                            <span className="truncate">{purchase.category.name}</span>
                        </>
                    )}
                    {purchase.installments && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                            <span className="text-primary font-medium">
                                {purchase.installments.current}/{purchase.installments.total}x
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Amount + Arrow */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right">
                    <p className="text-sm font-semibold">
                        {formatCurrency(purchase.amount)}
                    </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
        </button>
    );
}

export function EnhancedPurchasesList({ dayGroups, onPurchaseClick }: EnhancedPurchasesListProps) {
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
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Nenhuma compra encontrada</p>
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
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                <span className="text-xs font-bold">
                                    {group.date.getDate()}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-semibold">
                                    {group.dateLabel}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    {group.purchases.length} transações
                                </p>
                            </div>
                        </div>
                        <p className="text-sm font-semibold">
                            {formatCurrency(group.totalSpent)}
                        </p>
                    </div>

                    {/* Purchases */}
                    <Card className="overflow-hidden divide-y divide-border/50">
                        {group.purchases.map((purchase) => (
                            <PurchaseItem
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
