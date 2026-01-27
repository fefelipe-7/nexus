import { useState, useEffect, useCallback } from 'react';
import { cardsService } from '@/lib/data/supabase.service';
import type { Card } from '@/modules/money/types/cards.types';

interface UseCardsReturn {
    cards: Card[];
    isLoading: boolean;
    error: Error | null;
    addCard: (card: Omit<Card, 'id'>) => Promise<void>;
    updateCard: (id: string, updates: Partial<Card>) => Promise<void>;
    deleteCard: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
}

export function useCards(): UseCardsReturn {
    const [cards, setCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await cardsService.getAll();
            setCards(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching cards:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addCard = useCallback(async (card: Omit<Card, 'id'>) => {
        try {
            setError(null);
            await cardsService.create(card);
            await fetchData();
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const updateCard = useCallback(async (id: string, updates: Partial<Card>) => {
        try {
            setError(null);
            await cardsService.update(id, updates);
            await fetchData();
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }, [fetchData]);

    const deleteCard = useCallback(async (id: string) => {
        try {
            setError(null);
            await cardsService.delete(id);
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
        cards,
        isLoading,
        error,
        addCard,
        updateCard,
        deleteCard,
        refresh
    };
}
