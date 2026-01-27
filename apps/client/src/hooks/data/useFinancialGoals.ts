import { useState, useEffect, useCallback } from 'react';
import { financialGoalsService } from '@/lib/data/supabase.service';

interface UseFinancialGoalsReturn {
    goals: any[];
    isLoading: boolean;
    error: Error | null;
    addGoal: (goal: any) => Promise<void>;
    updateGoal: (id: string, updates: any) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
}

export function useFinancialGoals(): UseFinancialGoalsReturn {
    const [goals, setGoals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await financialGoalsService.getAll();
            setGoals(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching financial goals:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addGoal = useCallback(async (goal: any) => {
        try {
            setError(null);
            await financialGoalsService.create(goal);
            await fetchData();
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const updateGoal = useCallback(async (id: string, updates: any) => {
        try {
            setError(null);
            await financialGoalsService.update(id, updates);
            await fetchData();
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const deleteGoal = useCallback(async (id: string) => {
        try {
            setError(null);
            await financialGoalsService.delete(id);
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
        goals,
        isLoading,
        error,
        addGoal,
        updateGoal,
        deleteGoal,
        refresh
    };
}
