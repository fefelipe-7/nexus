import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useBudget } from '@/hooks/data/useBudget';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';

import { BudgetWizard } from '../components/wizards/BudgetWizard';
import { EmptyBudget } from '../components/empty-states/EmptyBudget';

export function Budget() {
  const { isMobile, isTablet } = useDeviceDetection();
  const isMobileView = isMobile || isTablet;

  const { budgets, isLoading, error, addBudget, refresh } = useBudget();
  const [showWizard, setShowWizard] = useState(false);

  const handleAddBudget = () => {
    setShowWizard(true);
  };

  const handleWizardComplete = async (budgetData: any) => {
    await addBudget(budgetData);
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
        <p className="text-rose-600 mb-4">Erro ao carregar orçamentos: {error.message}</p>
        <Button onClick={refresh}>Tentar Novamente</Button>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <>
        <EmptyBudget onAddBudget={handleAddBudget} />
        {showWizard && (
          <BudgetWizard
            onComplete={handleWizardComplete}
            onCancel={() => setShowWizard(false)}
          />
        )}
      </>
    );
  }

  const BudgetList = () => (
    <div className="space-y-4">
      {budgets.map((budget) => (
        <div key={budget.id} className="p-4 rounded-xl border border-border bg-background">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">{budget.category}</h3>
            <span className="text-sm font-medium">R$ {budget.limit_amount}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-0" /> {/* Placeholder progress */}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-right">0% utilizado</p>
        </div>
      ))}
    </div>
  );

  if (isMobileView) {
    return (
      <>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Orçamento</h1>
            <p className="text-sm text-muted-foreground">
              Planeje seus limites de gastos
            </p>
          </div>

          <BudgetList />

          <FAB
            onClick={handleAddBudget}
            icon={Plus}
            label="Novo Orçamento"
          />
        </div>

        {showWizard && (
          <BudgetWizard
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
            <h1 className="text-3xl font-bold tracking-tight mb-1">Orçamento</h1>
            <p className="text-muted-foreground">
              Defina limites e acompanhe seus gastos
            </p>
          </div>
          <Button size="sm" onClick={handleAddBudget}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Button>
        </div>

        <BudgetList />
      </div>

      {showWizard && (
        <BudgetWizard
          onComplete={handleWizardComplete}
          onCancel={() => setShowWizard(false)}
        />
      )}
    </>
  );
}
