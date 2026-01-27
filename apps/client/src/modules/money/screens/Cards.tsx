import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useCards } from '@/hooks/data/useCards';
import { useAccounts } from '@/hooks/data/useAccounts';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';

import { CardWizard } from '../components/wizards/CardWizard';
import { EmptyCards } from '../components/empty-states/EmptyCards';

export function Cards() {
  const { isMobile, isTablet } = useDeviceDetection();
  const isMobileView = isMobile || isTablet;

  const { cards, isLoading, error, addCard, refresh } = useCards();
  const { accounts } = useAccounts();
  const [showWizard, setShowWizard] = useState(false);

  const handleAddCard = () => {
    setShowWizard(true);
  };

  const handleWizardComplete = async (cardData: any) => {
    await addCard(cardData);
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
        <p className="text-rose-600 mb-4">Erro ao carregar cartões: {error.message}</p>
        <Button onClick={refresh}>Tentar Novamente</Button>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <>
        <EmptyCards onAddCard={handleAddCard} />
        {showWizard && (
          <CardWizard
            accounts={accounts.map(a => ({ id: a.id, name: a.name }))}
            onComplete={handleWizardComplete}
            onCancel={() => setShowWizard(false)}
          />
        )}
      </>
    );
  }

  const CardsList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.id} className="relative overflow-hidden p-6 rounded-2xl shadow-lg border border-border"
          style={{ backgroundColor: card.color || '#1f2937', color: 'white' }}>
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-bold text-lg">{card.name}</h3>
              <p className="text-sm opacity-80">{card.brand}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70 uppercase tracking-widest">{card.type === 'credit' ? 'Crédito' : 'Débito'}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-mono opacity-90 text-sm tracking-wider">
              •••• •••• •••• <span className="text-lg font-bold">{card.last_digits || '0000'}</span>
            </p>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] opacity-70 uppercase mb-0.5">Vencimento</p>
              <p className="font-medium text-sm">Dia {card.due_day || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] opacity-70 uppercase mb-0.5">Limite</p>
              <p className="font-bold text-lg">
                {card.limit_amount ? `R$ ${card.limit_amount}` : 'N/A'}
              </p>
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
            <h1 className="text-2xl font-bold tracking-tight mb-1">Meus Cartões</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie seus cartões de crédito e débito
            </p>
          </div>

          <CardsList />

          <FAB
            onClick={handleAddCard}
            icon={Plus}
            label="Novo Cartão"
          />
        </div>

        {showWizard && (
          <CardWizard
            accounts={accounts.map(a => ({ id: a.id, name: a.name }))}
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
            <h1 className="text-3xl font-bold tracking-tight mb-1">Meus Cartões</h1>
            <p className="text-muted-foreground">
              Centralize o controle dos seus cartões
            </p>
          </div>
          <Button size="sm" onClick={handleAddCard}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cartão
          </Button>
        </div>

        <CardsList />
      </div>

      {showWizard && (
        <CardWizard
          accounts={accounts.map(a => ({ id: a.id, name: a.name }))}
          onComplete={handleWizardComplete}
          onCancel={() => setShowWizard(false)}
        />
      )}
    </>
  );
}
