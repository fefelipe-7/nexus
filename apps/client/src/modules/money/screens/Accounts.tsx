import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockAccountsData } from '../data/mockAccountsData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Download, Settings } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';

import {
  AccountCard,
  AccountsSummaryCard,
} from '../components/mobile';

import {
  AccountsOverview,
  AccountsGrid,
  RecentTransactionsTable,
} from '../components/desktop';

export function Accounts() {
  const { isMobile, isTablet } = useDeviceDetection();
  const isMobileView = isMobile || isTablet;

  const data = mockAccountsData;

  const handleAddAccount = () => {
    console.log('Adicionar conta');
  };

  if (isMobileView) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Contas e Carteiras</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie todas as suas contas em um só lugar
          </p>
        </div>

        <AccountsSummaryCard summary={data.summary} />

        <div className="space-y-3">
          {data.accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>

        <FAB
          onClick={handleAddAccount}
          icon={Plus}
          label="Nova Conta"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Ações */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Contas e Carteiras</h1>
          <p className="text-muted-foreground">
            Visão consolidada de todas as suas contas financeiras
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
          <Button size="sm" onClick={handleAddAccount}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Conta
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <AccountsOverview summary={data.summary} />

      {/* Grid de Contas */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Suas Contas</h2>
        <AccountsGrid accounts={data.accounts} />
      </div>

      {/* Transações Recentes */}
      <RecentTransactionsTable transactions={data.recentTransactions} />
    </div>
  );
}
