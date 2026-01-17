import { useState } from 'react';
import { X, Calendar, CreditCard, Smartphone, Banknote, ShoppingBag, Receipt, Repeat, Tag, Check, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { cn } from '@nexus/shared';
import { Button } from '@/ui/components/components/ui';
import type { PurchasesFilters, PaymentMethod, PurchaseType, PurchaseCategory } from '../../types/purchases.types';

interface FilterSheetProps {
    isOpen: boolean;
    onClose: () => void;
    filters: PurchasesFilters;
    onApply: (filters: PurchasesFilters) => void;
    categories: PurchaseCategory[];
}

const PERIOD_OPTIONS = [
    { value: 'today', label: 'Hoje', icon: Calendar },
    { value: 'week', label: 'Esta semana', icon: Calendar },
    { value: 'month', label: 'Este mês', icon: Calendar },
    { value: 'custom', label: 'Personalizado', icon: Calendar },
] as const;

const TYPE_OPTIONS: Array<{ value: PurchaseType; label: string; icon: typeof ShoppingBag }> = [
    { value: 'purchase', label: 'Compras', icon: ShoppingBag },
    { value: 'service', label: 'Serviços', icon: Receipt },
    { value: 'subscription', label: 'Assinaturas', icon: Repeat },
    { value: 'bill', label: 'Contas', icon: Receipt },
];

const PAYMENT_OPTIONS: Array<{ value: PaymentMethod; label: string; icon: typeof CreditCard }> = [
    { value: 'credit_card', label: 'Crédito', icon: CreditCard },
    { value: 'debit_card', label: 'Débito', icon: CreditCard },
    { value: 'pix', label: 'PIX', icon: Smartphone },
    { value: 'cash', label: 'Dinheiro', icon: Banknote },
];

export function FilterSheet({ isOpen, onClose, filters, onApply, categories }: FilterSheetProps) {
    const [localFilters, setLocalFilters] = useState<PurchasesFilters>(filters);

    if (!isOpen) return null;

    const toggleType = (type: PurchaseType) => {
        const types = localFilters.types.includes(type)
            ? localFilters.types.filter(t => t !== type)
            : [...localFilters.types, type];
        setLocalFilters({ ...localFilters, types });
    };

    const togglePayment = (method: PaymentMethod) => {
        const methods = localFilters.paymentMethods.includes(method)
            ? localFilters.paymentMethods.filter(m => m !== method)
            : [...localFilters.paymentMethods, method];
        setLocalFilters({ ...localFilters, paymentMethods: methods });
    };

    const toggleCategory = (categoryId: string) => {
        const cats = localFilters.categories.includes(categoryId)
            ? localFilters.categories.filter(c => c !== categoryId)
            : [...localFilters.categories, categoryId];
        setLocalFilters({ ...localFilters, categories: cats });
    };

    const resetFilters = () => {
        setLocalFilters({
            period: 'week',
            types: [],
            paymentMethods: [],
            categories: [],
            statuses: [],
        });
    };

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const activeFiltersCount =
        localFilters.types.length +
        localFilters.paymentMethods.length +
        localFilters.categories.length;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
                <div className="bg-background rounded-t-2xl border-t shadow-xl max-h-[85vh] flex flex-col">
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 pb-3 border-b">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
                            <h2 className="text-lg font-semibold">Filtros</h2>
                            {activeFiltersCount > 0 && (
                                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            aria-label="Fechar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Período */}
                        <div>
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                Período
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {PERIOD_OPTIONS.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => setLocalFilters({ ...localFilters, period: option.value })}
                                        className={cn(
                                            "flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-all",
                                            localFilters.period === option.value
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted hover:bg-accent"
                                        )}
                                    >
                                        {localFilters.period === option.value && <Check className="h-4 w-4" />}
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tipo de Gasto */}
                        <div>
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                Tipo de Gasto
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {TYPE_OPTIONS.map(option => {
                                    const Icon = option.icon;
                                    const isActive = localFilters.types.includes(option.value);
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => toggleType(option.value)}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                                                isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted hover:bg-accent"
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Forma de Pagamento */}
                        <div>
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                Forma de Pagamento
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {PAYMENT_OPTIONS.map(option => {
                                    const Icon = option.icon;
                                    const isActive = localFilters.paymentMethods.includes(option.value);
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => togglePayment(option.value)}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                                                isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted hover:bg-accent"
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Categorias */}
                        <div>
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                Categorias
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => {
                                    const isActive = localFilters.categories.includes(cat.id);
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => toggleCategory(cat.id)}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                                                isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted hover:bg-accent"
                                            )}
                                        >
                                            <div
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: isActive ? 'currentColor' : cat.color }}
                                            />
                                            {cat.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t p-4 bg-muted/30 flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={resetFilters}
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Limpar
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleApply}
                        >
                            <Check className="h-4 w-4 mr-2" />
                            Aplicar Filtros
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
