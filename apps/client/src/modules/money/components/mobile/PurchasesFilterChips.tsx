import { cn } from '@nexus/shared';
import { CreditCard, Smartphone, Banknote, Calendar, ShoppingBag, Repeat, Receipt } from 'lucide-react';
import type { PurchasesFilters, PaymentMethod, PurchaseType } from '../../types/purchases.types';

interface PurchasesFilterChipsProps {
    filters: PurchasesFilters;
    onFiltersChange: (filters: PurchasesFilters) => void;
}

interface ChipProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
}

function Chip({ label, isActive, onClick, icon }: ChipProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
                'active:scale-95',
                isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
            )}
        >
            {icon}
            {label}
        </button>
    );
}

const PERIOD_OPTIONS = [
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mês' },
] as const;

const TYPE_OPTIONS: Array<{ value: PurchaseType; label: string; icon: React.ReactNode }> = [
    { value: 'purchase', label: 'Compras', icon: <ShoppingBag className="h-3 w-3" /> },
    { value: 'service', label: 'Serviços', icon: <Receipt className="h-3 w-3" /> },
    { value: 'subscription', label: 'Assinaturas', icon: <Repeat className="h-3 w-3" /> },
];

const PAYMENT_OPTIONS: Array<{ value: PaymentMethod; label: string; icon: React.ReactNode }> = [
    { value: 'credit_card', label: 'Crédito', icon: <CreditCard className="h-3 w-3" /> },
    { value: 'debit_card', label: 'Débito', icon: <CreditCard className="h-3 w-3" /> },
    { value: 'pix', label: 'PIX', icon: <Smartphone className="h-3 w-3" /> },
    { value: 'cash', label: 'Dinheiro', icon: <Banknote className="h-3 w-3" /> },
];

export function PurchasesFilterChips({ filters, onFiltersChange }: PurchasesFilterChipsProps) {
    const togglePeriod = (period: typeof filters.period) => {
        onFiltersChange({ ...filters, period });
    };

    const toggleType = (type: PurchaseType) => {
        const types = filters.types.includes(type)
            ? filters.types.filter(t => t !== type)
            : [...filters.types, type];
        onFiltersChange({ ...filters, types });
    };

    const togglePayment = (method: PaymentMethod) => {
        const methods = filters.paymentMethods.includes(method)
            ? filters.paymentMethods.filter(m => m !== method)
            : [...filters.paymentMethods, method];
        onFiltersChange({ ...filters, paymentMethods: methods });
    };

    return (
        <div className="space-y-3">
            {/* Período */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {PERIOD_OPTIONS.map(option => (
                    <Chip
                        key={option.value}
                        label={option.label}
                        isActive={filters.period === option.value}
                        onClick={() => togglePeriod(option.value)}
                        icon={<Calendar className="h-3 w-3" />}
                    />
                ))}
            </div>

            {/* Tipo e Pagamento */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {TYPE_OPTIONS.map(option => (
                    <Chip
                        key={option.value}
                        label={option.label}
                        isActive={filters.types.includes(option.value)}
                        onClick={() => toggleType(option.value)}
                        icon={option.icon}
                    />
                ))}
                <div className="w-px bg-border mx-1 flex-shrink-0" />
                {PAYMENT_OPTIONS.map(option => (
                    <Chip
                        key={option.value}
                        label={option.label}
                        isActive={filters.paymentMethods.includes(option.value)}
                        onClick={() => togglePayment(option.value)}
                        icon={option.icon}
                    />
                ))}
            </div>
        </div>
    );
}
