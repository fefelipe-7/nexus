import { Button } from '@/ui/components/components/ui';
import { PieChart, Plus } from 'lucide-react';

interface EmptyBudgetProps {
    onAddBudget: () => void;
}

export function EmptyBudget({ onAddBudget }: EmptyBudgetProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            <div className="mb-6 p-6 rounded-full bg-muted/30">
                <PieChart className="h-16 w-16 text-muted-foreground/40" />
            </div>

            <h2 className="text-2xl font-bold mb-2">
                Controle seus gastos
            </h2>

            <p className="text-muted-foreground mb-8 max-w-md">
                Crie orçamentos por categoria para acompanhar seus despesas e evitar surpresas no fim do mês.
            </p>

            <Button onClick={onAddBudget} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Novo Orçamento
            </Button>
        </div>
    );
}
