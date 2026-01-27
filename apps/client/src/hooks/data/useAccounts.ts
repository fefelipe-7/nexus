import { useState, useEffect, useCallback } from 'react';
import { accountsService, transactionsService, summaryService } from '@/lib/data/supabase.service';
import type { Account, AccountTransaction, AccountSummary } from '@/modules/money/types/accounts.types';

interface UseAccountsReturn {
    accounts: Account[];
    summary: AccountSummary | null;
    recentTransactions: AccountTransaction[];
    isLoading: boolean;
    error: Error | null;
    addAccount: (account: Omit<Account, 'id'>) => Promise<void>;
    updateAccount: (id: string, updates: Partial<Account>) => Promise<void>;
    deleteAccount: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
}

export function useAccounts(): UseAccountsReturn {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [summary, setSummary] = useState<AccountSummary | null>(null);
    const [recentTransactions, setRecentTransactions] = useState<AccountTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [accountsData, summaryData, transactionsData] = await Promise.all([
                accountsService.getAll(),
                summaryService.getAccountsSummary(),
                transactionsService.getRecent(10)
            ]);

            setAccounts(accountsData);
            setSummary(summaryData);
            setRecentTransactions(transactionsData);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching accounts data:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addAccount = useCallback(async (account: Omit<Account, 'id'>) => {
        try {
            setError(null);
            await accountsService.create(account);
            await fetchData(); // Refresh data
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const updateAccount = useCallback(async (id: string, updates: Partial<Account>) => {
        try {
            setError(null);
            await accountsService.update(id, updates);
            await fetchData(); // Refresh data
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const deleteAccount = useCallback(async (id: string) => {
        try {
            setError(null);
            await accountsService.delete(id);
            await fetchData(); // Refresh data
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const refresh = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    return {
        accounts,
        summary,
        recentTransactions,
        isLoading,
        error,
        addAccount,
        updateAccount,
        deleteAccount,
        refresh
    };
}
