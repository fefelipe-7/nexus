import { useState, useEffect, useCallback } from 'react';
import { debtsService } from '@/lib/data/supabase.service';

interface UseDebtsReturn {
    debts: any[];
    isLoading: boolean;
    error: Error | null;
    addDebt: (debt: any) => Promise<void>;
    updateDebt: (id: string, updates: any) => Promise<void>;
    deleteDebt: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
}

export function useDebts(): UseDebtsReturn {
    const [debts, setDebts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await debtsService.getAll();
            setDebts(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching debts:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addDebt = useCallback(async (debt: any) => {
        try {
            setError(null);
            await debtsService.create(debt);
            await fetchData();
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const updateDebt = useCallback(async (id: string, updates: any) => {
        try {
            setError(null);
            await debtsService.update(id, updates);
            await fetchData();
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const deleteDebt = useCallback(async (id: string) => {
        try {
            setError(null);
            await debtsService.delete(id);
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
        debts,
        isLoading,
        error,
        addDebt,
        updateDebt,
        deleteDebt,
        refresh
    };
}
