import { Button } from '@/ui/components/components/ui';
import { Plus, Wallet } from 'lucide-react';

interface EmptyAccountsProps {
    onAddAccount: () => void;
}

export function EmptyAccounts({ onAddAccount }: EmptyAccountsProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            <div className="mb-6 p-6 rounded-full bg-muted/30">
                <Wallet className="h-16 w-16 text-muted-foreground/40" />
            </div>

            <h2 className="text-2xl font-bold mb-2">
                Nenhuma conta cadastrada
            </h2>

            <p className="text-muted-foreground mb-8 max-w-md">
                Comece adicionando sua primeira conta para ter uma visão completa das suas finanças.
                Você pode adicionar contas correntes, poupança, investimentos e mais.
            </p>

            <Button onClick={onAddAccount} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Primeira Conta
            </Button>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl text-left">
                <div className="space-y-2">
                    <div className="text-3xl">💳</div>
                    <h3 className="font-semibold text-sm">Contas Correntes</h3>
                    <p className="text-xs text-muted-foreground">
                        Acompanhe seu saldo e movimentações diárias
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="text-3xl">📈</div>
                    <h3 className="font-semibold text-sm">Investimentos</h3>
                    <p className="text-xs text-muted-foreground">
                        Monitore o crescimento do seu patrimônio
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="text-3xl">💰</div>
                    <h3 className="font-semibold text-sm">Poupança</h3>
                    <p className="text-xs text-muted-foreground">
                        Organize suas reservas e objetivos
                    </p>
                </div>
            </div>
        </div>
    );
}
