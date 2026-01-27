import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useDebts } from '@/hooks/data/useDebts';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';

import { DebtWizard } from '../components/wizards/DebtWizard';
import { EmptyDebts } from '../components/empty-states/EmptyDebts';

export function Debts() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const { debts, isLoading, error, addDebt, refresh } = useDebts();
    const [showWizard, setShowWizard] = useState(false);

    const handleAddDebt = () => {
        setShowWizard(true);
    };

    const handleWizardComplete = async (debtData: any) => {
        await addDebt(debtData);
        setShowWizard(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
                <p className="text-rose-600 mb-4">Erro ao carregar dívidas: {error.message}</p>
                <Button onClick={refresh}>Tentar Novamente</Button>
            </div>
        );
    }

    if (debts.length === 0) {
        return (
            <>
                <EmptyDebts onAddDebt={handleAddDebt} />
                {showWizard && (
                    <DebtWizard
                        onComplete={handleWizardComplete}
                        onCancel={() => setShowWizard(false)}
                    />
                )}
            </>
        );
    }

    const DebtsList = () => (
        <div className="space-y-3">
            {debts.map((debt) => (
                <div key={debt.id} className="p-4 rounded-xl border border-border bg-background">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold">{debt.name}</h3>
                            <p className="text-xs text-muted-foreground">Vence em: {new Date(debt.due_date).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-rose-600">R$ {debt.remaining_amount}</p>
                            <p className="text-xs text-muted-foreground">Total: R$ {debt.total_amount}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (isMobileView) {
        return (
            <>
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight mb-1">Dívidas</h1>
                        <p className="text-sm text-muted-foreground">
                            Acompanhe seus débitos
                        </p>
                    </div>

                    <DebtsList />

                    <FAB
                        onClick={handleAddDebt}
                        icon={Plus}
                        label="Nova Dívida"
                    />
                </div>

                {showWizard && (
                    <DebtWizard
                        onComplete={handleWizardComplete}
                        onCancel={() => setShowWizard(false)}
                    />
                )}
            </>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">Dívidas</h1>
                        <p className="text-muted-foreground">
                            Gerencie e quite suas dívidas
                        </p>
                    </div>
                    <Button size="sm" onClick={handleAddDebt}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Dívida
                    </Button>
                </div>

                <DebtsList />
            </div>

            {showWizard && (
                <DebtWizard
                    onComplete={handleWizardComplete}
                    onCancel={() => setShowWizard(false)}
                />
            )}
        </>
    );
}
