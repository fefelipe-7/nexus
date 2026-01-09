import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { PieChart, TrendingDown } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { Category } from '../../types/cashflow.types';

interface CategoriesBreakdownProps {
  categories: Category[];
}

export function CategoriesBreakdown({ categories }: CategoriesBreakdownProps) {
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const totalExpenses = expenseCategories.reduce((sum, c) => sum + c.total, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Distribuição de Gastos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 h-8">
          {expenseCategories.map((category) => (
            <div
              key={category.id}
              className="h-full rounded hover:opacity-80 transition-opacity cursor-pointer relative group"
              style={{
                width: `${category.percentage}%`,
                backgroundColor: category.color,
              }}
              title={category.name}
            >
              <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-2 bg-card border rounded shadow-lg whitespace-nowrap z-10">
                <p className="text-xs font-semibold">{category.name}</p>
                <p className="text-xs text-muted-foreground">
                  R$ {category.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {expenseCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-medium truncate">{category.name}</span>
              </div>
              <div className="text-right ml-2">
                <p className="text-sm font-semibold">
                  R$ {category.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {category.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total de Gastos</span>
            <span className="text-lg font-bold text-red-600">
              R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
