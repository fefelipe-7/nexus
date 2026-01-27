import { useState, useEffect, useCallback } from 'react';
import { transactionsService } from '@/lib/data/supabase.service';
import type { AccountTransaction } from '@/modules/money/types/accounts.types';

interface UseTransactionsOptions {
    accountId?: string;
    limit?: number;
}

interface UseTransactionsReturn {
    transactions: AccountTransaction[];
    isLoading: boolean;
    error: Error | null;
    addTransaction: (transaction: Omit<AccountTransaction, 'id'>) => Promise<void>;
    updateTransaction: (id: string, updates: Partial<AccountTransaction>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
}

export function useTransactions(options: UseTransactionsOptions = {}): UseTransactionsReturn {
    const { accountId, limit } = options;
    const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            let data: AccountTransaction[];

            if (limit) {
                data = await transactionsService.getRecent(limit);
            } else {
                data = await transactionsService.getAll(accountId);
            }

            setTransactions(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching transactions:', err);
        } finally {
            setIsLoading(false);
        }
    }, [accountId, limit]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addTransaction = useCallback(async (transaction: Omit<AccountTransaction, 'id'>) => {
        try {
            setError(null);
            await transactionsService.create(transaction);
            await fetchData(); // Refresh data
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const updateTransaction = useCallback(async (id: string, updates: Partial<AccountTransaction>) => {
        try {
            setError(null);
            await transactionsService.update(id, updates);
            await fetchData(); // Refresh data
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const deleteTransaction = useCallback(async (id: string) => {
        try {
            setError(null);
            await transactionsService.delete(id);
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
        transactions,
        isLoading,
        error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refresh
    };
}
