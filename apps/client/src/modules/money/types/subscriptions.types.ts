export type SubscriptionFrequency = 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'pending_confirmation';
export type SubscriptionRisk = 'none' | 'unused' | 'expensive' | 'redundant' | 'price_increase' | 'annual_due';

export interface Subscription {
    id: string;
    name: string;
    description?: string;
    logo?: string;
    amount: number;
    frequency: SubscriptionFrequency;
    category: SubscriptionCategory;
    paymentMethod: {
        type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix';
        label: string;
        cardId?: string;
    };
    nextBillingDate: Date;
    lastBillingDate?: Date;
    startDate: Date;
    status: SubscriptionStatus;
    isEssential: boolean;
    risks: SubscriptionRisk[];
    notes?: string;
    usageMetrics?: {
        lastUsed?: Date;
        usageLevel: 'high' | 'medium' | 'low' | 'none';
    };
    priceHistory?: Array<{
        date: Date;
        amount: number;
    }>;
    linkedBudgetCategory?: string;
}

export interface SubscriptionCategory {
    id: string;
    name: string;
    icon?: string;
    color: string;
}

export interface SubscriptionsSummary {
    totalMonthly: number;
    totalAnnual: number;
    budgetPercentage: number;
    activeCount: number;
    atRiskCount: number;
    upcomingBillings: Array<{
        subscription: Subscription;
        daysUntil: number;
    }>;
}

export interface SubscriptionsData {
    summary: SubscriptionsSummary;
    subscriptions: Subscription[];
    categories: SubscriptionCategory[];
    atRiskSubscriptions: Subscription[];
}

export const FREQUENCY_LABELS: Record<SubscriptionFrequency, string> = {
    weekly: 'Semanal',
    monthly: 'Mensal',
    quarterly: 'Trimestral',
    semiannual: 'Semestral',
    annual: 'Anual',
};

export const FREQUENCY_MULTIPLIER: Record<SubscriptionFrequency, number> = {
    weekly: 4.33,
    monthly: 1,
    quarterly: 0.33,
    semiannual: 0.167,
    annual: 0.083,
};

export const RISK_LABELS: Record<SubscriptionRisk, string> = {
    none: 'OK',
    unused: 'Sem uso recente',
    expensive: 'Valor elevado',
    redundant: 'Possível redundância',
    price_increase: 'Aumento recente',
    annual_due: 'Cobrança anual próxima',
};

export const DEFAULT_SUBSCRIPTION_CATEGORIES: SubscriptionCategory[] = [
    { id: 'streaming', name: 'Streaming', color: '#ef4444' },
    { id: 'software', name: 'Software', color: '#3b82f6' },
    { id: 'gaming', name: 'Games', color: '#8b5cf6' },
    { id: 'news', name: 'Notícias/Mídia', color: '#6366f1' },
    { id: 'music', name: 'Música', color: '#10b981' },
    { id: 'cloud', name: 'Armazenamento', color: '#06b6d4' },
    { id: 'fitness', name: 'Fitness', color: '#f59e0b' },
    { id: 'education', name: 'Educação', color: '#ec4899' },
    { id: 'services', name: 'Serviços', color: '#6b7280' },
];
