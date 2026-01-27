import { createClient } from '@supabase/supabase-js';
import type { Account, AccountTransaction } from '@/modules/money/types/accounts.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get authenticated user
const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    return user;
};

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
        const user = await getUser();
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

    async create(transaction: Omit<AccountTransaction, 'id'>): Promise<AccountTransaction> {
        const user = await getUser();
        const { data, error } = await supabase
            .from('transactions')
            .insert([{ ...transaction, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;

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
        const transaction = await this.getById(id);
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) throw error;

        if (transaction) {
            const account = await accountsService.getById(transaction.accountId);
            if (account) {
                const newBalance = account.balance - transaction.amount;
                await accountsService.updateBalance(transaction.accountId, newBalance);
            }
        }
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
// CARDS
// =====================================================

export const cardsService = {
    async getAll(): Promise<any[]> {
        const { data, error } = await supabase.from('cards').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async create(card: any): Promise<any> {
        const user = await getUser();
        const { data, error } = await supabase.from('cards').insert([{ ...card, user_id: user.id }]).select().single();
        if (error) throw error;
        return data;
    },

    async update(id: string, updates: any): Promise<any> {
        const { data, error } = await supabase.from('cards').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from('cards').delete().eq('id', id);
        if (error) throw error;
    }
};

// =====================================================
// BUDGETS
// =====================================================

export const budgetService = {
    async getAll(): Promise<any[]> {
        const { data, error } = await supabase.from('budgets').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async create(budget: any): Promise<any> {
        const user = await getUser();
        const { data, error } = await supabase.from('budgets').insert([{ ...budget, user_id: user.id }]).select().single();
        if (error) throw error;
        return data;
    },

    async update(id: string, updates: any): Promise<any> {
        const { data, error } = await supabase.from('budgets').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from('budgets').delete().eq('id', id);
        if (error) throw error;
    }
};

// =====================================================
// SUBSCRIPTIONS
// =====================================================

export const subscriptionsService = {
    async getAll(): Promise<any[]> {
        const { data, error } = await supabase.from('subscriptions').select('*').order('next_billing_date', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async create(subscription: any): Promise<any> {
        const user = await getUser();
        const { data, error } = await supabase.from('subscriptions').insert([{ ...subscription, user_id: user.id }]).select().single();
        if (error) throw error;
        return data;
    },

    async update(id: string, updates: any): Promise<any> {
        const { data, error } = await supabase.from('subscriptions').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from('subscriptions').delete().eq('id', id);
        if (error) throw error;
    }
};

// =====================================================
// DEBTS
// =====================================================

export const debtsService = {
    async getAll(): Promise<any[]> {
        const { data, error } = await supabase.from('debts').select('*').order('due_date', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async create(debt: any): Promise<any> {
        const user = await getUser();
        const { data, error } = await supabase.from('debts').insert([{ ...debt, user_id: user.id }]).select().single();
        if (error) throw error;
        return data;
    },

    async update(id: string, updates: any): Promise<any> {
        const { data, error } = await supabase.from('debts').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from('debts').delete().eq('id', id);
        if (error) throw error;
    }
};

// =====================================================
// INVESTMENTS
// =====================================================

export const investmentsService = {
    async getAll(): Promise<any[]> {
        const { data, error } = await supabase.from('investments').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async create(investment: any): Promise<any> {
        const user = await getUser();
        const { data, error } = await supabase.from('investments').insert([{ ...investment, user_id: user.id }]).select().single();
        if (error) throw error;
        return data;
    },

    async update(id: string, updates: any): Promise<any> {
        const { data, error } = await supabase.from('investments').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from('investments').delete().eq('id', id);
        if (error) throw error;
    }
};

// =====================================================
// FINANCIAL GOALS
// =====================================================

export const financialGoalsService = {
    async getAll(): Promise<any[]> {
        const { data, error } = await supabase.from('financial_goals').select('*').order('deadline', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async create(goal: any): Promise<any> {
        const user = await getUser();
        const { data, error } = await supabase.from('financial_goals').insert([{ ...goal, user_id: user.id }]).select().single();
        if (error) throw error;
        return data;
    },

    async update(id: string, updates: any): Promise<any> {
        const { data, error } = await supabase.from('financial_goals').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from('financial_goals').delete().eq('id', id);
        if (error) throw error;
    }
};

// =====================================================
// PURCHASES
// =====================================================

export const purchasesService = {
    // Purchases logic can be complex, often linked to transaction planning.
    // For now, allow basic CRUD if a table exists, or integrate with transactions pending states.
    // Assuming a 'purchases' table might be added or using transactions with 'pending' status.
    // For this migration, we'll assume standard CRUD usage if specific purchase tracking is needed.
    async getAll(): Promise<any[]> {
        // Implementation would go here if a dedicated table exists
        return [];
    }
};

// =====================================================
// SUMMARY
// =====================================================

export const summaryService = {
    async getAccountsSummary() {
        const accounts = await accountsService.getAll();
        const activeAccounts = accounts.filter(a => a.status === 'active');

        const totalBalance = activeAccounts.reduce((sum, acc) => sum + acc.balance, 0);

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
