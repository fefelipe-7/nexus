import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Layers, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { BudgetCategory } from '../../types/budget.types';

interface BudgetCategoriesCardProps {
  categories: BudgetCategory[];
  onCategoryClick?: (categoryId: string) => void;
}

export function BudgetCategoriesCard({ categories, onCategoryClick }: BudgetCategoriesCardProps) {
  const getStatusIcon = (status: BudgetCategory['status']) => {
    switch (status) {
      case 'exceeded':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'near_limit':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  const activeCategories = categories.filter(c => c.isActive);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Categorias de Gasto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeCategories.map((category) => (
          <div
            key={category.id}
            className={cn(
              'space-y-2 p-3 rounded-lg border transition-colors',
              category.status === 'exceeded' && 'border-red-200 bg-red-50/50',
              category.status === 'near_limit' && 'border-amber-200 bg-amber-50/50',
              category.status === 'normal' && 'border-border bg-background',
              onCategoryClick && 'cursor-pointer hover:bg-accent'
            )}
            onClick={() => onCategoryClick?.(category.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(category.status)}
                <span className="font-medium text-sm">{category.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {category.percentage.toFixed(0)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    category.percentage >= 100 && 'bg-red-500',
                    category.percentage >= 90 && category.percentage < 100 && 'bg-amber-500',
                    category.percentage < 90 && 'bg-green-500'
                  )}
                  style={{
                    width: `${Math.min(category.percentage, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">
                  R$ {category.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-muted-foreground">de</span>
                <span className="font-medium">
                  R$ {category.budgeted.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <span className={cn(
                'font-semibold',
                category.remaining >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {category.remaining >= 0 ? '' : '-'}R$ {Math.abs(category.remaining).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
