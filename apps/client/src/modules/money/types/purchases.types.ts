export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash' | 'bank_transfer' | 'other';
export type PurchaseType = 'purchase' | 'service' | 'subscription' | 'bill';
export type PurchaseStatus = 'normal' | 'uncategorized' | 'recurring' | 'above_pattern' | 'linked_alert';

export interface Purchase {
    id: string;
    description: string;
    establishment?: string;
    amount: number;
    date: Date;
    category?: PurchaseCategory;
    paymentMethod: PaymentMethod;
    cardId?: string;
    type: PurchaseType;
    status: PurchaseStatus[];
    installments?: {
        current: number;
        total: number;
    };
    notes?: string;
    linkedTo?: {
        type: 'budget' | 'subscription' | 'pending' | 'alert';
        id: string;
        name: string;
    };
    isAutoSuggested?: boolean;
}

export interface PurchaseCategory {
    id: string;
    name: string;
    icon?: string;
    color: string;
}

export interface PurchasesSummary {
    period: {
        label: string;
        start: Date;
        end: Date;
    };
    totalSpent: number;
    dailyAverage: number;
    comparison: {
        previousPeriod: number;
        difference: number;
        percentage: number;
        direction: 'up' | 'down' | 'stable';
    };
    transactionCount: number;
}

export interface PurchasesFilters {
    period: 'today' | 'week' | 'month' | 'custom';
    dateRange?: {
        start: Date;
        end: Date;
    };
    types: PurchaseType[];
    paymentMethods: PaymentMethod[];
    categories: string[];
    statuses: PurchaseStatus[];
    searchQuery?: string;
}

export interface DayGroup {
    date: Date;
    dateLabel: string;
    totalSpent: number;
    purchases: Purchase[];
}

export interface PurchasesData {
    summary: PurchasesSummary;
    purchases: Purchase[];
    categories: PurchaseCategory[];
    dayGroups: DayGroup[];
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    pix: 'PIX',
    cash: 'Dinheiro',
    bank_transfer: 'Transferência',
    other: 'Outro',
};

export const PURCHASE_TYPE_LABELS: Record<PurchaseType, string> = {
    purchase: 'Compra',
    service: 'Serviço',
    subscription: 'Assinatura',
    bill: 'Conta',
};

export const DEFAULT_CATEGORIES: PurchaseCategory[] = [
    { id: 'food', name: 'Alimentação', color: '#10b981' },
    { id: 'transport', name: 'Transporte', color: '#f59e0b' },
    { id: 'housing', name: 'Moradia', color: '#3b82f6' },
    { id: 'health', name: 'Saúde', color: '#ef4444' },
    { id: 'entertainment', name: 'Lazer', color: '#8b5cf6' },
    { id: 'shopping', name: 'Compras', color: '#ec4899' },
    { id: 'education', name: 'Educação', color: '#06b6d4' },
    { id: 'services', name: 'Serviços', color: '#6366f1' },
    { id: 'others', name: 'Outros', color: '#6b7280' },
];
