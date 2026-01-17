export type DebtType = 'loan' | 'financing' | 'overdraft' | 'credit_card' | 'agreement' | 'other';
export type DebtStatus = 'active' | 'paid' | 'overdue' | 'negotiating';
export type InstallmentStatus = 'active' | 'completed' | 'overdue';

export interface Debt {
    id: string;
    name: string;
    description?: string;
    type: DebtType;
    originalAmount: number;
    currentBalance: number;
    monthlyPayment: number;
    interestRate?: number;
    startDate: Date;
    endDate?: Date;
    nextDueDate: Date;
    totalPaid: number;
    remainingPayments: number;
    status: DebtStatus;
    isPriority: boolean;
    creditor?: string;
    paymentMethod?: {
        type: string;
        label: string;
    };
    notes?: string;
    paymentHistory?: Array<{
        date: Date;
        amount: number;
        status: 'paid' | 'pending' | 'overdue';
    }>;
}

export interface Installment {
    id: string;
    description: string;
    establishment?: string;
    originalAmount: number;
    installmentAmount: number;
    totalInstallments: number;
    paidInstallments: number;
    remainingAmount: number;
    startDate: Date;
    nextDueDate: Date;
    cardId?: string;
    cardLabel?: string;
    category?: {
        id: string;
        name: string;
        color: string;
    };
    status: InstallmentStatus;
}

export interface DebtsSummary {
    totalCommitted: number;
    monthlyCommitment: number;
    activeDebtsCount: number;
    activeInstallmentsCount: number;
    liberationDate: Date | null;
    criticalDebtsCount: number;
    overdueAmount: number;
}

export interface DebtsData {
    summary: DebtsSummary;
    debts: Debt[];
    installments: Installment[];
}

export const DEBT_TYPE_LABELS: Record<DebtType, string> = {
    loan: 'Empréstimo',
    financing: 'Financiamento',
    overdraft: 'Cheque Especial',
    credit_card: 'Cartão de Crédito',
    agreement: 'Acordo',
    other: 'Outro',
};

export const DEBT_TYPE_ICONS: Record<DebtType, string> = {
    loan: '🏦',
    financing: '🏠',
    overdraft: '⚠️',
    credit_card: '💳',
    agreement: '📋',
    other: '📄',
};
