import type { PurchasesData, Purchase, PurchaseCategory, DayGroup } from '../types/purchases.types';

const categories: PurchaseCategory[] = [
    { id: 'food', name: 'Alimentação', color: '#10b981' },
    { id: 'transport', name: 'Transporte', color: '#f59e0b' },
    { id: 'housing', name: 'Moradia', color: '#3b82f6' },
    { id: 'health', name: 'Saúde', color: '#ef4444' },
    { id: 'entertainment', name: 'Lazer', color: '#8b5cf6' },
    { id: 'shopping', name: 'Compras', color: '#ec4899' },
    { id: 'services', name: 'Serviços', color: '#6366f1' },
    { id: 'others', name: 'Outros', color: '#6b7280' },
];

const purchases: Purchase[] = [
    // Hoje
    {
        id: '1',
        description: 'Almoço',
        establishment: 'Restaurante Sabor Caseiro',
        amount: 42.90,
        date: new Date(2026, 0, 17, 12, 35),
        category: categories[0],
        paymentMethod: 'credit_card',
        cardId: 'nubank',
        type: 'purchase',
        status: ['normal'],
    },
    {
        id: '2',
        description: 'Café da tarde',
        establishment: 'Starbucks',
        amount: 28.50,
        date: new Date(2026, 0, 17, 15, 10),
        category: categories[0],
        paymentMethod: 'debit_card',
        type: 'purchase',
        status: ['normal'],
    },
    {
        id: '3',
        description: 'Uber para reunião',
        establishment: 'Uber',
        amount: 24.80,
        date: new Date(2026, 0, 17, 9, 45),
        category: categories[1],
        paymentMethod: 'pix',
        type: 'service',
        status: ['normal'],
    },
    // Ontem
    {
        id: '4',
        description: 'Supermercado',
        establishment: 'Extra Hipermercado',
        amount: 287.45,
        date: new Date(2026, 0, 16, 18, 20),
        category: categories[0],
        paymentMethod: 'credit_card',
        cardId: 'nubank',
        type: 'purchase',
        status: ['above_pattern'],
    },
    {
        id: '5',
        description: 'Farmácia',
        establishment: 'Drogasil',
        amount: 89.90,
        date: new Date(2026, 0, 16, 14, 0),
        category: categories[3],
        paymentMethod: 'credit_card',
        type: 'purchase',
        status: ['normal'],
    },
    {
        id: '6',
        description: 'Gasolina',
        establishment: 'Posto Ipiranga',
        amount: 180.00,
        date: new Date(2026, 0, 16, 8, 30),
        category: categories[1],
        paymentMethod: 'debit_card',
        type: 'purchase',
        status: ['recurring'],
    },
    // 15 de Janeiro
    {
        id: '7',
        description: 'Netflix',
        establishment: 'Netflix',
        amount: 55.90,
        date: new Date(2026, 0, 15, 0, 0),
        category: categories[4],
        paymentMethod: 'credit_card',
        type: 'subscription',
        status: ['recurring'],
        linkedTo: {
            type: 'subscription',
            id: 'netflix',
            name: 'Assinatura Netflix',
        },
    },
    {
        id: '8',
        description: 'Jantar',
        establishment: 'Outback Steakhouse',
        amount: 189.00,
        date: new Date(2026, 0, 15, 20, 30),
        category: categories[0],
        paymentMethod: 'credit_card',
        installments: { current: 1, total: 2 },
        type: 'purchase',
        status: ['above_pattern'],
    },
    {
        id: '9',
        description: 'Pagamento não identificado',
        amount: 67.00,
        date: new Date(2026, 0, 15, 16, 45),
        paymentMethod: 'pix',
        type: 'purchase',
        status: ['uncategorized'],
        isAutoSuggested: false,
    },
    // 14 de Janeiro
    {
        id: '10',
        description: 'Curso Online',
        establishment: 'Udemy',
        amount: 27.90,
        date: new Date(2026, 0, 14, 10, 0),
        category: { id: 'education', name: 'Educação', color: '#06b6d4' },
        paymentMethod: 'credit_card',
        type: 'service',
        status: ['normal'],
    },
    {
        id: '11',
        description: 'Internet',
        establishment: 'Vivo Fibra',
        amount: 149.90,
        date: new Date(2026, 0, 14, 0, 0),
        category: categories[2],
        paymentMethod: 'debit_card',
        type: 'bill',
        status: ['recurring'],
        linkedTo: {
            type: 'subscription',
            id: 'vivo',
            name: 'Internet Vivo',
        },
    },
    // 13 de Janeiro
    {
        id: '12',
        description: 'Cinema + Pipoca',
        establishment: 'Cinemark',
        amount: 78.00,
        date: new Date(2026, 0, 13, 19, 0),
        category: categories[4],
        paymentMethod: 'credit_card',
        type: 'purchase',
        status: ['normal'],
    },
    {
        id: '13',
        description: 'Academia',
        establishment: 'Smart Fit',
        amount: 99.90,
        date: new Date(2026, 0, 13, 0, 0),
        category: categories[3],
        paymentMethod: 'credit_card',
        type: 'subscription',
        status: ['recurring'],
    },
];

// Agrupar por dia
const groupByDay = (purchases: Purchase[]): DayGroup[] => {
    const groups: Record<string, DayGroup> = {};

    purchases.forEach(purchase => {
        const dateKey = purchase.date.toDateString();

        if (!groups[dateKey]) {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            let dateLabel = purchase.date.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
            });

            if (purchase.date.toDateString() === today.toDateString()) {
                dateLabel = 'Hoje';
            } else if (purchase.date.toDateString() === yesterday.toDateString()) {
                dateLabel = 'Ontem';
            }

            groups[dateKey] = {
                date: new Date(purchase.date.setHours(0, 0, 0, 0)),
                dateLabel,
                totalSpent: 0,
                purchases: [],
            };
        }

        groups[dateKey].purchases.push(purchase);
        groups[dateKey].totalSpent += purchase.amount;
    });

    // Ordenar grupos por data (mais recente primeiro)
    return Object.values(groups)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .map(group => ({
            ...group,
            purchases: group.purchases.sort((a, b) => b.date.getTime() - a.date.getTime()),
        }));
};

// Calcular totais
const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
const daysInPeriod = 5;
const dailyAverage = totalSpent / daysInPeriod;

export const mockPurchasesData: PurchasesData = {
    summary: {
        period: {
            label: 'Esta semana',
            start: new Date(2026, 0, 13),
            end: new Date(2026, 0, 17),
        },
        totalSpent,
        dailyAverage,
        comparison: {
            previousPeriod: totalSpent * 0.85,
            difference: totalSpent * 0.15,
            percentage: 15,
            direction: 'up',
        },
        transactionCount: purchases.length,
    },
    purchases,
    categories,
    dayGroups: groupByDay(purchases),
};
