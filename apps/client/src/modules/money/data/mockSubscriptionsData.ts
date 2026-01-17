import type { SubscriptionsData, Subscription, SubscriptionCategory, SubscriptionsSummary } from '../types/subscriptions.types';

const categories: SubscriptionCategory[] = [
    { id: 'streaming', name: 'Streaming', color: '#ef4444' },
    { id: 'software', name: 'Software', color: '#3b82f6' },
    { id: 'gaming', name: 'Games', color: '#8b5cf6' },
    { id: 'music', name: 'Música', color: '#10b981' },
    { id: 'cloud', name: 'Armazenamento', color: '#06b6d4' },
    { id: 'fitness', name: 'Fitness', color: '#f59e0b' },
    { id: 'education', name: 'Educação', color: '#ec4899' },
    { id: 'services', name: 'Serviços', color: '#6b7280' },
];

const subscriptions: Subscription[] = [
    {
        id: '1',
        name: 'Netflix',
        description: 'Streaming de filmes e séries',
        amount: 55.90,
        frequency: 'monthly',
        category: categories[0],
        paymentMethod: { type: 'credit_card', label: 'Nubank •••• 1234' },
        nextBillingDate: new Date(2026, 0, 20),
        lastBillingDate: new Date(2025, 11, 20),
        startDate: new Date(2022, 5, 15),
        status: 'active',
        isEssential: true,
        risks: [],
        usageMetrics: { lastUsed: new Date(2026, 0, 16), usageLevel: 'high' },
    },
    {
        id: '2',
        name: 'Spotify',
        description: 'Streaming de música',
        amount: 21.90,
        frequency: 'monthly',
        category: categories[3],
        paymentMethod: { type: 'credit_card', label: 'Nubank •••• 1234' },
        nextBillingDate: new Date(2026, 0, 22),
        lastBillingDate: new Date(2025, 11, 22),
        startDate: new Date(2020, 2, 10),
        status: 'active',
        isEssential: true,
        risks: [],
        usageMetrics: { lastUsed: new Date(2026, 0, 17), usageLevel: 'high' },
    },
    {
        id: '3',
        name: 'ChatGPT Plus',
        description: 'IA para produtividade',
        amount: 100.00,
        frequency: 'monthly',
        category: categories[1],
        paymentMethod: { type: 'credit_card', label: 'Inter •••• 5678' },
        nextBillingDate: new Date(2026, 0, 25),
        lastBillingDate: new Date(2025, 11, 25),
        startDate: new Date(2024, 8, 1),
        status: 'active',
        isEssential: true,
        risks: ['expensive'],
        usageMetrics: { lastUsed: new Date(2026, 0, 17), usageLevel: 'high' },
    },
    {
        id: '4',
        name: 'Apple One',
        description: 'Apple Music, TV+, Arcade, iCloud',
        amount: 37.90,
        frequency: 'monthly',
        category: categories[3],
        paymentMethod: { type: 'credit_card', label: 'Nubank •••• 1234' },
        nextBillingDate: new Date(2026, 0, 18),
        lastBillingDate: new Date(2025, 11, 18),
        startDate: new Date(2023, 3, 5),
        status: 'active',
        isEssential: false,
        risks: ['redundant'],
        usageMetrics: { lastUsed: new Date(2025, 11, 30), usageLevel: 'low' },
        notes: 'Possível redundância com Spotify',
    },
    {
        id: '5',
        name: 'Amazon Prime',
        description: 'Frete grátis, Prime Video, Music',
        amount: 14.90,
        frequency: 'monthly',
        category: categories[0],
        paymentMethod: { type: 'credit_card', label: 'Nubank •••• 1234' },
        nextBillingDate: new Date(2026, 0, 28),
        lastBillingDate: new Date(2025, 11, 28),
        startDate: new Date(2021, 6, 1),
        status: 'active',
        isEssential: true,
        risks: [],
        usageMetrics: { lastUsed: new Date(2026, 0, 15), usageLevel: 'medium' },
    },
    {
        id: '6',
        name: 'iCloud+ 200GB',
        description: 'Armazenamento na nuvem',
        amount: 10.90,
        frequency: 'monthly',
        category: categories[4],
        paymentMethod: { type: 'credit_card', label: 'Nubank •••• 1234' },
        nextBillingDate: new Date(2026, 0, 19),
        lastBillingDate: new Date(2025, 11, 19),
        startDate: new Date(2022, 1, 10),
        status: 'active',
        isEssential: true,
        risks: [],
        usageMetrics: { usageLevel: 'high' },
    },
    {
        id: '7',
        name: 'Adobe Creative Cloud',
        description: 'Photoshop, Illustrator, etc',
        amount: 224.00,
        frequency: 'monthly',
        category: categories[1],
        paymentMethod: { type: 'credit_card', label: 'Inter •••• 5678' },
        nextBillingDate: new Date(2026, 1, 3),
        lastBillingDate: new Date(2026, 0, 3),
        startDate: new Date(2023, 9, 1),
        status: 'active',
        isEssential: false,
        risks: ['expensive', 'unused'],
        usageMetrics: { lastUsed: new Date(2025, 10, 15), usageLevel: 'none' },
        notes: 'Não uso há 2 meses',
        priceHistory: [
            { date: new Date(2023, 9, 1), amount: 189.00 },
            { date: new Date(2024, 9, 1), amount: 224.00 },
        ],
    },
    {
        id: '8',
        name: 'Notion',
        description: 'Produtividade e notas',
        amount: 48.00,
        frequency: 'monthly',
        category: categories[1],
        paymentMethod: { type: 'credit_card', label: 'Nubank •••• 1234' },
        nextBillingDate: new Date(2026, 0, 30),
        lastBillingDate: new Date(2025, 11, 30),
        startDate: new Date(2024, 0, 15),
        status: 'active',
        isEssential: true,
        risks: [],
        usageMetrics: { lastUsed: new Date(2026, 0, 17), usageLevel: 'high' },
    },
    {
        id: '9',
        name: 'Duolingo Plus',
        description: 'Aprendizado de idiomas',
        amount: 399.00,
        frequency: 'annual',
        category: categories[6],
        paymentMethod: { type: 'credit_card', label: 'Nubank •••• 1234' },
        nextBillingDate: new Date(2026, 1, 15),
        lastBillingDate: new Date(2025, 1, 15),
        startDate: new Date(2024, 1, 15),
        status: 'active',
        isEssential: false,
        risks: ['annual_due', 'unused'],
        usageMetrics: { lastUsed: new Date(2025, 8, 20), usageLevel: 'none' },
        notes: 'Renovação anual em menos de 30 dias',
    },
    {
        id: '10',
        name: 'Smart Fit',
        description: 'Plano Black',
        amount: 129.90,
        frequency: 'monthly',
        category: categories[5],
        paymentMethod: { type: 'debit_card', label: 'Débito Itaú' },
        nextBillingDate: new Date(2026, 0, 5),
        lastBillingDate: new Date(2025, 11, 5),
        startDate: new Date(2024, 5, 1),
        status: 'active',
        isEssential: true,
        risks: [],
        usageMetrics: { lastUsed: new Date(2026, 0, 16), usageLevel: 'high' },
    },
];

// Calcular totais
const totalMonthly = subscriptions.reduce((sum, sub) => {
    if (sub.status !== 'active') return sum;
    switch (sub.frequency) {
        case 'weekly': return sum + sub.amount * 4.33;
        case 'monthly': return sum + sub.amount;
        case 'quarterly': return sum + sub.amount / 3;
        case 'semiannual': return sum + sub.amount / 6;
        case 'annual': return sum + sub.amount / 12;
        default: return sum + sub.amount;
    }
}, 0);

const atRiskSubscriptions = subscriptions.filter(s => s.risks.length > 0);

// Próximas cobranças
const today = new Date();
const upcomingBillings = subscriptions
    .filter(s => s.status === 'active')
    .map(s => ({
        subscription: s,
        daysUntil: Math.ceil((s.nextBillingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
    }))
    .filter(b => b.daysUntil <= 7 && b.daysUntil > 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);

const summary: SubscriptionsSummary = {
    totalMonthly,
    totalAnnual: totalMonthly * 12,
    budgetPercentage: (totalMonthly / 8500) * 100, // Assumindo orçamento de R$ 8.500
    activeCount: subscriptions.filter(s => s.status === 'active').length,
    atRiskCount: atRiskSubscriptions.length,
    upcomingBillings,
};

export const mockSubscriptionsData: SubscriptionsData = {
    summary,
    subscriptions,
    categories,
    atRiskSubscriptions,
};
