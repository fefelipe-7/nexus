import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockBudgetData } from '../data/mockBudgetData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Settings } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';

import {
  BudgetOverviewCard,
  CurrentMonthCard,
  BudgetCategoriesCard,
  BudgetAlertsCard,
} from '../components/mobile';

import {
  BudgetOverview,
  CurrentMonthOverview,
  CategoriesBreakdownBudget,
  BudgetAlerts,
  BudgetConfig,
} from '../components/desktop';

export function Budget() {
  const { isMobile, isTablet } = useDeviceDetection();
  const isMobileView = isMobile || isTablet;

  const data = mockBudgetData;

  const handleCreateBudget = () => {
    console.log('Criar orçamento');
  };

  const handleEditBudget = () => {
    console.log('Editar orçamento');
  };

  const handleAddCategory = () => {
    console.log('Adicionar categoria');
  };

  const handleCategoryClick = (categoryId: string) => {
    console.log('Categoria clicada:', categoryId);
  };

  const handleEditCategory = (categoryId: string) => {
    console.log('Editar categoria:', categoryId);
  };

  const handleDismissAlert = (alertId: string) => {
    console.log('Dispensar alerta:', alertId);
  };

  const handlePreviousMonth = () => {
    console.log('Mês anterior');
  };

  const handleNextMonth = () => {
    console.log('Próximo mês');
  };

  if (isMobileView) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Orçamento</h1>
          <p className="text-sm text-muted-foreground">
            Controle seus gastos e mantenha suas finanças equilibradas
          </p>
        </div>

        <BudgetOverviewCard overview={data.overview} />

        <CurrentMonthCard
          month={data.currentMonth}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />

        <BudgetAlertsCard alerts={data.alerts} />

        <BudgetCategoriesCard
          categories={data.categories}
          onCategoryClick={handleCategoryClick}
        />

        <FAB
          onClick={handleEditBudget}
          icon={Settings}
          label="Configurar"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Orçamento</h1>
          <p className="text-muted-foreground">
            Controle financeiro inteligente e previsível
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleEditBudget}>
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
          <Button size="sm" onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </div>
      </div>

      <BudgetOverview overview={data.overview} />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <CurrentMonthOverview
            month={data.currentMonth}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
          />
          
          <BudgetConfig
            config={data.config}
            onCreateBudget={handleCreateBudget}
            onEditBudget={handleEditBudget}
            onAddCategory={handleAddCategory}
          />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <CategoriesBreakdownBudget
            categories={data.categories}
            onCategoryClick={handleCategoryClick}
            onEditCategory={handleEditCategory}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <BudgetAlerts
            alerts={data.alerts}
            onDismissAlert={handleDismissAlert}
          />
        </div>
      </div>
    </div>
  );
}
