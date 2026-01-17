import { cn } from '@nexus/shared';
import { CreditCard, Smartphone, Banknote, MoreHorizontal, AlertCircle, Repeat, TrendingUp } from 'lucide-react';
import type { Purchase, PaymentMethod } from '../../types/purchases.types';

interface PurchaseListItemProps {
    purchase: Purchase;
    onClick?: () => void;
}

const PAYMENT_ICONS: Record<PaymentMethod, React.ReactNode> = {
    credit_card: <CreditCard className="h-3.5 w-3.5" />,
    debit_card: <CreditCard className="h-3.5 w-3.5" />,
    pix: <Smartphone className="h-3.5 w-3.5" />,
    cash: <Banknote className="h-3.5 w-3.5" />,
    bank_transfer: <Smartphone className="h-3.5 w-3.5" />,
    other: <MoreHorizontal className="h-3.5 w-3.5" />,
};

export function PurchaseListItem({ purchase, onClick }: PurchaseListItemProps) {
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

    const hasSpecialStatus = purchase.status.some(s =>
        ['uncategorized', 'recurring', 'above_pattern', 'linked_alert'].includes(s)
    );

    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl transition-all',
                'active:scale-[0.98] active:bg-accent/50',
                'hover:bg-accent/30'
            )}
        >
            {/* Categoria Indicator */}
            <div
                className="w-1 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: purchase.category?.color || '#6b7280' }}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                        {purchase.establishment || purchase.description}
                    </p>
                    {/* Status Badges */}
                    {purchase.status.includes('uncategorized') && (
                        <span className="flex items-center gap-0.5 text-amber-500">
                            <AlertCircle className="h-3 w-3" />
                        </span>
                    )}
                    {purchase.status.includes('recurring') && (
                        <span className="text-blue-500">
                            <Repeat className="h-3 w-3" />
                        </span>
                    )}
                    {purchase.status.includes('above_pattern') && (
                        <span className="text-red-500">
                            <TrendingUp className="h-3 w-3" />
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatTime(purchase.date)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        {PAYMENT_ICONS[purchase.paymentMethod]}
                    </span>
                    {purchase.category && (
                        <>
                            <span>•</span>
                            <span className="truncate">{purchase.category.name}</span>
                        </>
                    )}
                    {purchase.installments && (
                        <>
                            <span>•</span>
                            <span>{purchase.installments.current}/{purchase.installments.total}x</span>
                        </>
                    )}
                </div>
            </div>

            {/* Amount */}
            <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold">
                    {formatCurrency(purchase.amount)}
                </p>
            </div>
        </button>
    );
}
