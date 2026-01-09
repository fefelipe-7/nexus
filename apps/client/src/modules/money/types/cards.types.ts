export type CardType = 'credit' | 'debit';
export type CardStatus = 'normal' | 'attention' | 'critical';
export type CardBrand = 'visa' | 'mastercard' | 'elo' | 'amex' | 'other';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  brand: CardBrand;
  lastDigits: string;
  limit: number;
  availableLimit: number;
  usedLimit: number;
  currentInvoice: number;
  dueDate: Date;
  closingDate: Date;
  minimumPayment?: number;
  status: CardStatus;
  color: string;
  institution: string;
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
