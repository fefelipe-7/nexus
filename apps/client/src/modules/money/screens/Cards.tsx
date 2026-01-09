import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockCardsData } from '../data/mockCardsData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Download, Settings } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';

import {
  CreditHealthCard,
  CardListItem,
  InstallmentsCard,
} from '../components/mobile';

import {
  CreditHealthOverview,
  CardsGrid,
  CurrentInvoice,
  FutureCommitments,
} from '../components/desktop';

export function Cards() {
  const { isMobile, isTablet } = useDeviceDetection();
  const isMobileView = isMobile || isTablet;

  const data = mockCardsData;

  const handleAddPurchase = () => {
    console.log('Registrar compra');
  };

  if (isMobileView) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Cartões</h1>
          <p className="text-sm text-muted-foreground">
            Controle e previsibilidade do seu crédito
          </p>
        </div>

        <CreditHealthCard health={data.creditHealth} />

        <div>
          <h2 className="text-lg font-semibold mb-3">Seus Cartões</h2>
          <div className="space-y-3">
            {data.cards.map((card) => (
              <CardListItem key={card.id} card={card} />
            ))}
          </div>
        </div>

        <InstallmentsCard installments={data.installments} />

        <FAB
          onClick={handleAddPurchase}
          icon={Plus}
          label="Registrar"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Ações */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Cartões</h1>
          <p className="text-muted-foreground">
            Painel de risco, controle e previsibilidade de crédito
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm" onClick={handleAddPurchase}>
            <Plus className="h-4 w-4 mr-2" />
            Registrar Compra
          </Button>
        </div>
      </div>

      {/* Saúde do Crédito */}
      <CreditHealthOverview health={data.creditHealth} />

      {/* Grid de Cartões */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Seus Cartões</h2>
        <CardsGrid cards={data.cards} />
      </div>

      {/* Layout 2 Colunas */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CurrentInvoice items={data.currentInvoiceItems} />
        <FutureCommitments commitments={data.futureCommitments} />
      </div>
    </div>
  );
}
