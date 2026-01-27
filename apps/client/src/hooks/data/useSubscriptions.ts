import { useState, useEffect, useCallback } from 'react';
import { subscriptionsService } from '@/lib/data/supabase.service';

interface UseSubscriptionsReturn {
    subscriptions: any[];
    isLoading: boolean;
    error: Error | null;
    addSubscription: (subscription: any) => Promise<void>;
    updateSubscription: (id: string, updates: any) => Promise<void>;
    deleteSubscription: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
}

export function useSubscriptions(): UseSubscriptionsReturn {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await subscriptionsService.getAll();
            setSubscriptions(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching subscriptions:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addSubscription = useCallback(async (subscription: any) => {
        try {
            setError(null);
            await subscriptionsService.create(subscription);
            await fetchData();
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const updateSubscription = useCallback(async (id: string, updates: any) => {
        try {
            setError(null);
            await subscriptionsService.update(id, updates);
            await fetchData();
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const deleteSubscription = useCallback(async (id: string) => {
        try {
            setError(null);
            await subscriptionsService.delete(id);
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
        subscriptions,
        isLoading,
        error,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        refresh
    };
}
