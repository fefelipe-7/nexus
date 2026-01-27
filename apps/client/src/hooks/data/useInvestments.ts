import { useState, useEffect, useCallback } from 'react';
import { investmentsService } from '@/lib/data/supabase.service';

interface UseInvestmentsReturn {
    investments: any[];
    isLoading: boolean;
    error: Error | null;
    addInvestment: (investment: any) => Promise<void>;
    updateInvestment: (id: string, updates: any) => Promise<void>;
    deleteInvestment: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
}

export function useInvestments(): UseInvestmentsReturn {
    const [investments, setInvestments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await investmentsService.getAll();
            setInvestments(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching investments:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addInvestment = useCallback(async (investment: any) => {
        try {
            setError(null);
            await investmentsService.create(investment);
            await fetchData();
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const updateInvestment = useCallback(async (id: string, updates: any) => {
        try {
            setError(null);
            await investmentsService.update(id, updates);
            await fetchData();
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const deleteInvestment = useCallback(async (id: string) => {
        try {
            setError(null);
            await investmentsService.delete(id);
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
        investments,
        isLoading,
        error,
        addInvestment,
        updateInvestment,
        deleteInvestment,
        refresh
    };
}
