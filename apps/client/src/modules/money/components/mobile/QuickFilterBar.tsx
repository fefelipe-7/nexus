import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { PurchasesFilters } from '../../types/purchases.types';
import { PAYMENT_METHOD_LABELS, PURCHASE_TYPE_LABELS } from '../../types/purchases.types';

interface QuickFilterBarProps {
    filters: PurchasesFilters;
    onFiltersChange: (filters: PurchasesFilters) => void;
    onOpenFilters: () => void;
    activeCount: number;
}

const PERIOD_LABELS: Record<string, string> = {
    today: 'Hoje',
    week: 'Semana',
    month: 'Mês',
    custom: 'Personalizado',
};

export function QuickFilterBar({ filters, onFiltersChange, onOpenFilters, activeCount }: QuickFilterBarProps) {
    const removeType = (type: string) => {
        onFiltersChange({
            ...filters,
            types: filters.types.filter(t => t !== type),
        });
    };

    const removePayment = (method: string) => {
        onFiltersChange({
            ...filters,
            paymentMethods: filters.paymentMethods.filter(m => m !== method),
        });
    };

    const hasActiveFilters = filters.types.length > 0 || filters.paymentMethods.length > 0 || filters.categories.length > 0;

    return (
        <div className="space-y-2">
            {/* Period Tabs + Filter Button */}
            <div className="flex items-center gap-2">
                <div className="flex-1 flex gap-1 bg-muted/50 p-1 rounded-xl">
                    {(['today', 'week', 'month'] as const).map(period => (
                        <button
                            key={period}
                            onClick={() => onFiltersChange({ ...filters, period })}
                            className={cn(
                                "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all",
                                filters.period === period
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {PERIOD_LABELS[period]}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onOpenFilters}
                    className={cn(
                        "relative p-2.5 rounded-xl transition-all",
                        activeCount > 0
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-accent"
                    )}
                >
                    <SlidersHorizontal className="h-5 w-5" />
                    {activeCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {activeCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Active Filter Pills */}
            {hasActiveFilters && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {filters.types.map(type => (
                        <button
                            key={type}
                            onClick={() => removeType(type)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium whitespace-nowrap"
                        >
                            {PURCHASE_TYPE_LABELS[type]}
                            <X className="h-3 w-3" />
                        </button>
                    ))}
                    {filters.paymentMethods.map(method => (
                        <button
                            key={method}
                            onClick={() => removePayment(method)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium whitespace-nowrap"
                        >
                            {PAYMENT_METHOD_LABELS[method]}
                            <X className="h-3 w-3" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
