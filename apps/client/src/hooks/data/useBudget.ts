import { useState, useEffect, useCallback } from 'react';
import { budgetService } from '@/lib/data/supabase.service';

interface UseBudgetReturn {
    budgets: any[];
    isLoading: boolean;
    error: Error | null;
    addBudget: (budget: any) => Promise<void>;
    updateBudget: (id: string, updates: any) => Promise<void>;
    deleteBudget: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
}

export function useBudget(): UseBudgetReturn {
    const [budgets, setBudgets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await budgetService.getAll();
            setBudgets(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching budgets:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addBudget = useCallback(async (budget: any) => {
        try {
            setError(null);
            await budgetService.create(budget);
            await fetchData();
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const updateBudget = useCallback(async (id: string, updates: any) => {
        try {
            setError(null);
            await budgetService.update(id, updates);
            await fetchData();
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const deleteBudget = useCallback(async (id: string) => {
        try {
            setError(null);
            await budgetService.delete(id);
            await fetchData();
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const refresh = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    return {
        budgets,
        isLoading,
        error,
        addBudget,
        updateBudget,
        deleteBudget,
        refresh
    };
}
