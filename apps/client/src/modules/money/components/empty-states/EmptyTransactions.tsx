import { Button } from '@/ui/components/components/ui';
import { Plus, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';

interface EmptyTransactionsProps {
    onAddTransaction: () => void;
}

export function EmptyTransactions({ onAddTransaction }: EmptyTransactionsProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            <div className="mb-6 p-6 rounded-full bg-muted/30">
                <ArrowRightLeft className="h-16 w-16 text-muted-foreground/40" />
            </div>

            <h2 className="text-2xl font-bold mb-2">
                Nenhuma transação registrada
            </h2>

            <p className="text-muted-foreground mb-8 max-w-md">
                Comece registrando sua primeira movimentação financeira para ter controle
                total sobre suas receitas e despesas.
            </p>

            <Button onClick={onAddTransaction} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Primeira Transação
            </Button>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl text-left">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <TrendingDown className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-sm">Receitas</h3>
                    <p className="text-xs text-muted-foreground">
                        Registre salários, freelances e outras entradas
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-8 w-8 text-rose-600" />
                    </div>
                    <h3 className="font-semibold text-sm">Despesas</h3>
                    <p className="text-xs text-muted-foreground">
                        Acompanhe todos os seus gastos por categoria
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <ArrowRightLeft className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-sm">Transferências</h3>
                    <p className="text-xs text-muted-foreground">
                        Movimente dinheiro entre suas contas
                    </p>
                </div>
            </div>
        </div>
    );
}
