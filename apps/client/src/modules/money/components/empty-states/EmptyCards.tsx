import { Button } from '@/ui/components/components/ui';
import { CreditCard, Plus } from 'lucide-react';

interface EmptyCardsProps {
    onAddCard: () => void;
}

export function EmptyCards({ onAddCard }: EmptyCardsProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            <div className="mb-6 p-6 rounded-full bg-muted/30">
                <CreditCard className="h-16 w-16 text-muted-foreground/40" />
            </div>

            <h2 className="text-2xl font-bold mb-2">
                Seus cartões em um só lugar
            </h2>

            <p className="text-muted-foreground mb-8 max-w-md">
                Cadastre seus cartões de crédito e débito para controlar faturas,
                limites e vencimentos de forma centralizada.
            </p>

            <Button onClick={onAddCard} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Cartão
            </Button>
        </div>
    );
}
