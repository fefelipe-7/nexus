import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useInvestments } from '@/hooks/data/useInvestments';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';

import { InvestmentWizard } from '../components/wizards/InvestmentWizard';
import { EmptyInvestments } from '../components/empty-states/EmptyInvestments';

export function Investments() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const { investments, isLoading, error, addInvestment, refresh } = useInvestments();
    const [showWizard, setShowWizard] = useState(false);

    const handleAddInvestment = () => {
        setShowWizard(true);
    };

    const handleWizardComplete = async (investmentData: any) => {
        await addInvestment(investmentData);
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
                <p className="text-rose-600 mb-4">Erro ao carregar investimentos: {error.message}</p>
                <Button onClick={refresh}>Tentar Novamente</Button>
            </div>
        );
    }

    if (investments.length === 0) {
        return (
            <>
                <EmptyInvestments onAddInvestment={handleAddInvestment} />
                {showWizard && (
                    <InvestmentWizard
                        onComplete={handleWizardComplete}
                        onCancel={() => setShowWizard(false)}
                    />
                )}
            </>
        );
    }

    const InvestmentsList = () => (
        <div className="space-y-3">
            {investments.map((inv) => (
                <div key={inv.id} className="p-4 rounded-xl border border-border bg-background flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold">{inv.name}</h3>
                        <p className="text-xs text-muted-foreground">{inv.type} • {inv.institution}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold">R$ {inv.current_value}</p>
                        <p className="text-xs text-emerald-600 font-medium">Investido: R$ {inv.amount}</p>
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
                        <h1 className="text-2xl font-bold tracking-tight mb-1">Investimentos</h1>
                        <p className="text-sm text-muted-foreground">
                            Acompanhe seu patrimônio
                        </p>
                    </div>

                    <InvestmentsList />

                    <FAB
                        onClick={handleAddInvestment}
                        icon={Plus}
                        label="Novo Investimento"
                    />
                </div>

                {showWizard && (
                    <InvestmentWizard
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
                        <h1 className="text-3xl font-bold tracking-tight mb-1">Investimentos</h1>
                        <p className="text-muted-foreground">
                            Carteira de ativos e rentabilidade
                        </p>
                    </div>
                    <Button size="sm" onClick={handleAddInvestment}>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Investimento
                    </Button>
                </div>

                <InvestmentsList />
            </div>

            {showWizard && (
                <InvestmentWizard
                    onComplete={handleWizardComplete}
                    onCancel={() => setShowWizard(false)}
                />
            )}
        </>
    );
}
