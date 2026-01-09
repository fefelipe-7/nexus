export type AccountType = 'checking' | 'savings' | 'investment' | 'credit' | 'cash';
export type AccountStatus = 'active' | 'inactive' | 'blocked';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  status: AccountStatus;
  balance: number;
  currency: string;
  institution?: string;
  lastSync?: Date;
  color: string;
  icon?: string;
}

export interface AccountTransaction {
  id: string;
  accountId: string;
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category?: string;
  pending?: boolean;
}

export interface AccountSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  accountsCount: number;
  activeAccounts: number;
  trend: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
}

export interface AccountsData {
  summary: AccountSummary;
  accounts: Account[];
  recentTransactions: AccountTransaction[];
}
