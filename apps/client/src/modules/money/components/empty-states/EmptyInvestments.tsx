import { Button } from '@/ui/components/components/ui';
import { TrendingUp, Plus } from 'lucide-react';

interface EmptyInvestmentsProps {
    onAddInvestment: () => void;
}

export function EmptyInvestments({ onAddInvestment }: EmptyInvestmentsProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            <div className="mb-6 p-6 rounded-full bg-muted/30">
                <TrendingUp className="h-16 w-16 text-muted-foreground/40" />
            </div>

            <h2 className="text-2xl font-bold mb-2">
                Faça seu dinheiro render
            </h2>

            <p className="text-muted-foreground mb-8 max-w-md">
                Acompanhe a performance da sua carteira de investimentos em renda fixa, variável e outros ativos.
            </p>

            <Button onClick={onAddInvestment} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Novo Investimento
            </Button>
        </div>
    );
}
