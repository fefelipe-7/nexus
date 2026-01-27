import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useAccounts } from '@/hooks/data/useAccounts';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Download, Settings, Loader2 } from 'lucide-react';
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

import { AccountForm } from '../components/forms/AccountForm';
import { EmptyAccounts } from '../components/empty-states/EmptyAccounts';

export function Accounts() {
  const { isMobile, isTablet } = useDeviceDetection();
  const isMobileView = isMobile || isTablet;

  const {
    accounts,
    summary,
    recentTransactions,
    isLoading,
    error,
    addAccount,
    refresh
  } = useAccounts();

  const [showForm, setShowForm] = useState(false);

  const handleAddAccount = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (accountData: any) => {
    await addAccount(accountData);
    setShowForm(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <p className="text-rose-600 mb-4">Erro ao carregar contas: {error.message}</p>
        <Button onClick={refresh}>Tentar Novamente</Button>
      </div>
    );
  }

  // Empty state
  if (accounts.length === 0) {
    return (
      <>
        <EmptyAccounts onAddAccount={handleAddAccount} />
        {showForm && (
          <AccountForm
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}
      </>
    );
  }

  if (isMobileView) {
    return (
      <>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Contas e Carteiras</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie todas as suas contas em um só lugar
            </p>
          </div>

          {summary && <AccountsSummaryCard summary={summary} />}

          <div className="space-y-3">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>

          <FAB
            onClick={handleAddAccount}
            icon={Plus}
            label="Nova Conta"
          />
        </div>

        {showForm && (
          <AccountForm
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
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
        {summary && <AccountsOverview summary={summary} />}

        {/* Grid de Contas */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Suas Contas</h2>
          <AccountsGrid accounts={accounts} />
        </div>

        {/* Transações Recentes */}
        <RecentTransactionsTable transactions={recentTransactions} />
      </div>

      {showForm && (
        <AccountForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  );
}
