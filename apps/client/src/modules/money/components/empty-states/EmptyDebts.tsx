import { Button } from '@/ui/components/components/ui';
import { AlertTriangle, Plus } from 'lucide-react';

interface EmptyDebtsProps {
    onAddDebt: () => void;
}

export function EmptyDebts({ onAddDebt }: EmptyDebtsProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            <div className="mb-6 p-6 rounded-full bg-muted/30">
                <AlertTriangle className="h-16 w-16 text-muted-foreground/40" />
            </div>

            <h2 className="text-2xl font-bold mb-2">
                Gerencie suas dívidas
            </h2>

            <p className="text-muted-foreground mb-8 max-w-md">
                Cadastre empréstimos, financiamentos e pendências para planejar o pagamento e sair do vermelho.
            </p>

            <Button onClick={onAddDebt} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Dívida
            </Button>
        </div>
    );
}
