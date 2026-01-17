import type { DebtsData, Debt, Installment, DebtsSummary } from '../types/debts.types';

const debts: Debt[] = [
    {
        id: '1',
        name: 'Financiamento Carro',
        description: 'Honda Civic 2023',
        type: 'financing',
        originalAmount: 85000,
        currentBalance: 62500,
        monthlyPayment: 1850,
        interestRate: 1.29,
        startDate: new Date(2023, 5, 15),
        endDate: new Date(2027, 5, 15),
        nextDueDate: new Date(2026, 0, 25),
        totalPaid: 22500,
        remainingPayments: 34,
        status: 'active',
        isPriority: false,
        creditor: 'Banco Santander',
        paymentMethod: { type: 'bank_transfer', label: 'Débito Automático' },
    },
    {
        id: '2',
        name: 'Empréstimo Pessoal',
        description: 'Reforma do apartamento',
        type: 'loan',
        originalAmount: 25000,
        currentBalance: 18200,
        monthlyPayment: 680,
        interestRate: 2.1,
        startDate: new Date(2024, 8, 1),
        endDate: new Date(2026, 8, 1),
        nextDueDate: new Date(2026, 0, 20),
        totalPaid: 6800,
        remainingPayments: 27,
        status: 'active',
        isPriority: true,
        creditor: 'Nubank',
        paymentMethod: { type: 'bank_transfer', label: 'Boleto' },
        notes: 'Juros altos - priorizar quitação',
    },
    {
        id: '3',
        name: 'Cheque Especial',
        description: 'Limite utilizado',
        type: 'overdraft',
        originalAmount: 3500,
        currentBalance: 2800,
        monthlyPayment: 500,
        interestRate: 8.5,
        startDate: new Date(2025, 10, 15),
        nextDueDate: new Date(2026, 0, 18),
        totalPaid: 700,
        remainingPayments: 6,
        status: 'active',
        isPriority: true,
        creditor: 'Itaú',
        paymentMethod: { type: 'debit', label: 'Débito Itaú' },
        notes: 'URGENTE: Juros muito altos!',
    },
];

const installments: Installment[] = [
    {
        id: '1',
        description: 'iPhone 15 Pro Max',
        establishment: 'Apple Store',
        originalAmount: 9499,
        installmentAmount: 791.58,
        totalInstallments: 12,
        paidInstallments: 4,
        remainingAmount: 6332.64,
        startDate: new Date(2025, 8, 15),
        nextDueDate: new Date(2026, 0, 15),
        cardId: 'nubank',
        cardLabel: 'Nubank •••• 1234',
        category: { id: 'tech', name: 'Tecnologia', color: '#3b82f6' },
        status: 'active',
    },
    {
        id: '2',
        description: 'MacBook Pro M3',
        establishment: 'Apple Store',
        originalAmount: 18999,
        installmentAmount: 1583.25,
        totalInstallments: 12,
        paidInstallments: 2,
        remainingAmount: 15832.50,
        startDate: new Date(2025, 10, 10),
        nextDueDate: new Date(2026, 0, 10),
        cardId: 'inter',
        cardLabel: 'Inter •••• 5678',
        category: { id: 'tech', name: 'Tecnologia', color: '#3b82f6' },
        status: 'active',
    },
    {
        id: '3',
        description: 'Geladeira Brastemp',
        establishment: 'Magazine Luiza',
        originalAmount: 4599,
        installmentAmount: 383.25,
        totalInstallments: 12,
        paidInstallments: 7,
        remainingAmount: 1916.25,
        startDate: new Date(2025, 5, 20),
        nextDueDate: new Date(2026, 0, 20),
        cardId: 'nubank',
        cardLabel: 'Nubank •••• 1234',
        category: { id: 'home', name: 'Casa', color: '#f59e0b' },
        status: 'active',
    },
    {
        id: '4',
        description: 'Sofá Retrátil',
        establishment: 'Tok&Stok',
        originalAmount: 3299,
        installmentAmount: 329.90,
        totalInstallments: 10,
        paidInstallments: 5,
        remainingAmount: 1649.50,
        startDate: new Date(2025, 7, 5),
        nextDueDate: new Date(2026, 0, 5),
        cardId: 'nubank',
        cardLabel: 'Nubank •••• 1234',
        category: { id: 'home', name: 'Casa', color: '#f59e0b' },
        status: 'active',
    },
    {
        id: '5',
        description: 'Passagem Aérea Paris',
        establishment: 'LATAM',
        originalAmount: 8500,
        installmentAmount: 850,
        totalInstallments: 10,
        paidInstallments: 3,
        remainingAmount: 5950,
        startDate: new Date(2025, 9, 1),
        nextDueDate: new Date(2026, 0, 1),
        cardId: 'inter',
        cardLabel: 'Inter •••• 5678',
        category: { id: 'travel', name: 'Viagem', color: '#8b5cf6' },
        status: 'active',
    },
];

// Calculate totals
const totalDebtBalance = debts.reduce((sum, d) => sum + d.currentBalance, 0);
const totalInstallmentBalance = installments.reduce((sum, i) => sum + i.remainingAmount, 0);
const monthlyDebtPayment = debts.reduce((sum, d) => sum + d.monthlyPayment, 0);
const monthlyInstallmentPayment = installments.reduce((sum, i) => sum + i.installmentAmount, 0);

// Find liberation date (when all commitments end)
const allEndDates = [
    ...debts.filter(d => d.endDate).map(d => d.endDate!.getTime()),
    ...installments.map(i => {
        const remaining = i.totalInstallments - i.paidInstallments;
        const endDate = new Date(i.nextDueDate);
        endDate.setMonth(endDate.getMonth() + remaining);
        return endDate.getTime();
    }),
];
const liberationDate = allEndDates.length > 0 ? new Date(Math.max(...allEndDates)) : null;

const criticalDebts = debts.filter(d => d.status === 'overdue' || (d.interestRate && d.interestRate > 5));
const overdueAmount = debts.filter(d => d.status === 'overdue').reduce((sum, d) => sum + d.monthlyPayment, 0);

const summary: DebtsSummary = {
    totalCommitted: totalDebtBalance + totalInstallmentBalance,
    monthlyCommitment: monthlyDebtPayment + monthlyInstallmentPayment,
    activeDebtsCount: debts.filter(d => d.status === 'active').length,
    activeInstallmentsCount: installments.filter(i => i.status === 'active').length,
    liberationDate,
    criticalDebtsCount: criticalDebts.length,
    overdueAmount,
};

export const mockDebtsData: DebtsData = {
    summary,
    debts,
    installments,
};
