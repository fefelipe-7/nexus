import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useSubscriptions } from '@/hooks/data/useSubscriptions';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';

import { SubscriptionWizard } from '../components/wizards/SubscriptionWizard';
import { EmptySubscriptions } from '../components/empty-states/EmptySubscriptions';

export function Subscriptions() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const { subscriptions, isLoading, error, addSubscription, refresh } = useSubscriptions();
    const [showWizard, setShowWizard] = useState(false);

    const handleAddSubscription = () => {
        setShowWizard(true);
    };

    const handleWizardComplete = async (subscriptionData: any) => {
        await addSubscription(subscriptionData);
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
                <p className="text-rose-600 mb-4">Erro ao carregar assinaturas: {error.message}</p>
                <Button onClick={refresh}>Tentar Novamente</Button>
            </div>
        );
    }

    if (subscriptions.length === 0) {
        return (
            <>
                <EmptySubscriptions onAddSubscription={handleAddSubscription} />
                {showWizard && (
                    <SubscriptionWizard
                        onComplete={handleWizardComplete}
                        onCancel={() => setShowWizard(false)}
                    />
                )}
            </>
        );
    }

    const SubscriptionsList = () => (
        <div className="space-y-3">
            {subscriptions.map((sub) => (
                <div key={sub.id} className="p-4 rounded-xl border border-border bg-background flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold">{sub.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{sub.frequency} • Próx: {new Date(sub.next_billing_date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <span className="font-bold">R$ {sub.amount}</span>
                </div>
            ))}
        </div>
    );

    if (isMobileView) {
        return (
            <>
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight mb-1">Assinaturas</h1>
                        <p className="text-sm text-muted-foreground">
                            Seus pagamentos recorrentes
                        </p>
                    </div>

                    <SubscriptionsList />

                    <FAB
                        onClick={handleAddSubscription}
                        icon={Plus}
                        label="Nova Assinatura"
                    />
                </div>

                {showWizard && (
                    <SubscriptionWizard
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
                        <h1 className="text-3xl font-bold tracking-tight mb-1">Assinaturas</h1>
                        <p className="text-muted-foreground">
                            Gerencie todos os seus serviços recorrentes
                        </p>
                    </div>
                    <Button size="sm" onClick={handleAddSubscription}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Assinatura
                    </Button>
                </div>

                <SubscriptionsList />
            </div>

            {showWizard && (
                <SubscriptionWizard
                    onComplete={handleWizardComplete}
                    onCancel={() => setShowWizard(false)}
                />
            )}
        </>
    );
}
