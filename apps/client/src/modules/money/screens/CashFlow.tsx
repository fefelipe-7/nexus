import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useTransactions } from '@/hooks/data/useTransactions';
import { useAccounts } from '@/hooks/data/useAccounts';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';

import { TransactionWizard } from '../components/wizards/TransactionWizard';
import { EmptyTransactions } from '../components/empty-states/EmptyTransactions';

export function CashFlow() {
  const { isMobile, isTablet } = useDeviceDetection();
  const isMobileView = isMobile || isTablet;

  const { transactions, isLoading, error, addTransaction, refresh } = useTransactions();
  const { accounts } = useAccounts();

  const [showWizard, setShowWizard] = useState(false);

  const handleAddTransaction = () => {
    setShowWizard(true);
  };

  const handleWizardComplete = async (transactionData: any) => {
    await addTransaction(transactionData);
    setShowWizard(false);
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
        <p className="text-rose-600 mb-4">Erro ao carregar transações: {error.message}</p>
        <Button onClick={refresh}>Tentar Novamente</Button>
      </div>
    );
  }

  // Empty state
  if (transactions.length === 0) {
    return (
      <>
        <EmptyTransactions onAddTransaction={handleAddTransaction} />
        {showWizard && (
          <TransactionWizard
            accounts={accounts.map(a => ({ id: a.id, name: a.name }))}
            onComplete={handleWizardComplete}
            onCancel={() => setShowWizard(false)}
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
            <h1 className="text-2xl font-bold tracking-tight mb-1">Fluxo de Dinheiro</h1>
            <p className="text-sm text-muted-foreground">
              Entenda para onde seu dinheiro está indo
            </p>
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 rounded-xl border border-border bg-background"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      {transaction.category && ` • ${transaction.category}`}
                    </p>
                  </div>
                  <p className={`font-bold ${transaction.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(Math.abs(transaction.amount))}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <FAB
            onClick={handleAddTransaction}
            icon={Plus}
            label="Registrar"
          />
        </div>

        {showWizard && (
          <TransactionWizard
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
        {/* Header com Ações */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Fluxo de Dinheiro</h1>
            <p className="text-muted-foreground">
              Visão completa do seu fluxo financeiro
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={handleAddTransaction}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-5 rounded-xl border border-border bg-background hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-lg">{transaction.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    {transaction.category && (
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">
                        {transaction.category}
                      </span>
                    )}
                  </div>
                </div>
                <p className={`font-bold text-2xl ${transaction.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {transaction.amount > 0 ? '+' : ''}
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(Math.abs(transaction.amount))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showWizard && (
        <TransactionWizard
          accounts={accounts.map(a => ({ id: a.id, name: a.name }))}
          onComplete={handleWizardComplete}
          onCancel={() => setShowWizard(false)}
        />
      )}
    </>
  );
}
