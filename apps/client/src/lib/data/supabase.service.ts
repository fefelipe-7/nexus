import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Account, AccountTransaction } from '@/modules/money/types/accounts.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =====================================================
// ACCOUNTS
// =====================================================

export const accountsService = {
    async getAll(): Promise<Account[]> {
        const { data, error } = await supabase
            .from('accounts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getById(id: string): Promise<Account | null> {
        const { data, error } = await supabase
            .from('accounts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(account: Omit<Account, 'id'>): Promise<Account> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('accounts')
            .insert([{ ...account, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, updates: Partial<Account>): Promise<Account> {
        const { data, error } = await supabase
            .from('accounts')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('accounts')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async updateBalance(id: string, newBalance: number): Promise<void> {
        await this.update(id, { balance: newBalance });
    }
};

// =====================================================
// TRANSACTIONS
// =====================================================

export const transactionsService = {
    async getAll(accountId?: string): Promise<AccountTransaction[]> {
        let query = supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

        if (accountId) {
            query = query.eq('account_id', accountId);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    },

    async getById(id: string): Promise<AccountTransaction | null> {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(transaction: Omit<AccountTransaction, 'id'>): Promise<AccountTransaction> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('transactions')
            .insert([{ ...transaction, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;

        // Update account balance
        const account = await accountsService.getById(transaction.accountId);
        if (account) {
            const newBalance = account.balance + transaction.amount;
            await accountsService.updateBalance(transaction.accountId, newBalance);
        }

        return data;
    },

    async update(id: string, updates: Partial<AccountTransaction>): Promise<AccountTransaction> {
        const { data, error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        // Get transaction to reverse balance
        const transaction = await this.getById(id);

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Reverse balance update
        if (transaction) {
            const account = await accountsService.getById(transaction.accountId);
            if (account) {
                const newBalance = account.balance - transaction.amount;
                await accountsService.updateBalance(transaction.accountId, newBalance);
            }
        }
    },

    async getRecent(limit: number = 10): Promise<AccountTransaction[]> {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    }
};

// =====================================================
// SUMMARY CALCULATIONS
// =====================================================

export const summaryService = {
    async getAccountsSummary() {
        const accounts = await accountsService.getAll();
        const activeAccounts = accounts.filter(a => a.status === 'active');

        const totalBalance = activeAccounts.reduce((sum, acc) => sum + acc.balance, 0);

        // Get transactions from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: recentTransactions } = await supabase
            .from('transactions')
            .select('*')
            .gte('date', thirtyDaysAgo.toISOString());

        const totalIncome = (recentTransactions || [])
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = Math.abs((recentTransactions || [])
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0));

        // Calculate trend (simplified)
        const trend = totalIncome > totalExpenses
            ? { direction: 'up' as const, percentage: ((totalIncome - totalExpenses) / totalExpenses * 100) }
            : { direction: 'down' as const, percentage: ((totalExpenses - totalIncome) / totalIncome * 100) };

        return {
            totalBalance,
            totalIncome,
            totalExpenses,
            accountsCount: accounts.length,
            activeAccounts: activeAccounts.length,
            trend
        };
    }
};
