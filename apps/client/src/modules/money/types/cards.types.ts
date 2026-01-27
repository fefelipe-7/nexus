export type CardType = 'credit' | 'debit';
export type CardStatus = 'normal' | 'attention' | 'critical';
export type CardBrand = 'visa' | 'mastercard' | 'elo' | 'amex' | 'other';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  brand: string;
  last_digits: string;
  limit_amount?: number;
  closing_day?: number;
  due_day?: number;
  account_id?: string;
  status: 'active' | 'blocked' | 'cancelled';
  color: string;
  created_at?: string;
  updated_at?: string;
}

export interface Installment {
  id: string;
  cardId: string;
  description: string;
  totalAmount: number;
  installmentAmount: number;
  currentInstallment: number;
  totalInstallments: number;
  remainingInstallments: number;
  category?: string;
  startDate: Date;
}

export interface InvoiceItem {
  id: string;
  cardId: string;
  date: Date;
  description: string;
  amount: number;
  category?: string;
  installment?: {
    current: number;
    total: number;
  };
}

export interface CreditHealth {
  totalLimit: number;
  totalUsed: number;
  totalAvailable: number;
  usagePercentage: number;
  status: CardStatus;
  activeCards: number;
  totalCards: number;
}

export interface FutureCommitment {
  month: string;
  totalAmount: number;
  installmentsCount: number;
  details: {
    cardId: string;
    cardName: string;
    amount: number;
  }[];
}

export interface CardsData {
  creditHealth: CreditHealth;
  cards: Card[];
  installments: Installment[];
  currentInvoiceItems: InvoiceItem[];
  futureCommitments: FutureCommitment[];
}
