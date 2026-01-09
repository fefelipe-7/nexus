import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { PieChart } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { Category } from '../../types/cashflow.types';

interface CategoriesCardProps {
  categories: Category[];
}

export function CategoriesCard({ categories }: CategoriesCardProps) {
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const topCategories = expenseCategories.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          Para Onde Vai o Dinheiro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topCategories.map((category) => (
          <div key={category.id} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{category.name}</span>
              <span className="text-muted-foreground">
                R$ {category.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${category.percentage}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-12 text-right">
                {category.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
