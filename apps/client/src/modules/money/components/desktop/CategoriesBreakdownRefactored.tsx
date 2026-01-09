import { PieChart } from 'lucide-react';
import { ChartContainer, DonutChart } from '@/ui/components/charts';
import { formatCurrency } from '@/utils/data';
import type { Category } from '../../types/cashflow.types';

interface CategoriesBreakdownProps {
  categories: Category[];
}

export function CategoriesBreakdown({ categories }: CategoriesBreakdownProps) {
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const totalExpenses = expenseCategories.reduce((sum, c) => sum + c.total, 0);

  const chartData = expenseCategories.map(category => ({
    label: category.name,
    value: category.total,
    color: category.color,
  }));

  return (
    <ChartContainer
      title="Distribuição de Gastos"
      icon={<PieChart className="h-5 w-5" />}
      size="lg"
    >
      <DonutChart
        data={chartData}
        size={240}
        showLegend
        showValues
        formatValue={(v) => formatCurrency(v)}
        centerContent={
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold">{formatCurrency(totalExpenses)}</p>
          </div>
        }
      />
    </ChartContainer>
  );
}
