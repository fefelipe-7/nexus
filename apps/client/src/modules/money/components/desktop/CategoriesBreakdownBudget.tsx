import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Layers, AlertCircle, CheckCircle2, AlertTriangle, Edit } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { BudgetCategory } from '../../types/budget.types';

interface CategoriesBreakdownBudgetProps {
  categories: BudgetCategory[];
  onCategoryClick?: (categoryId: string) => void;
  onEditCategory?: (categoryId: string) => void;
}

export function CategoriesBreakdownBudget({ 
  categories, 
  onCategoryClick,
  onEditCategory 
}: CategoriesBreakdownBudgetProps) {
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

  const getStatusLabel = (status: BudgetCategory['status']) => {
    switch (status) {
      case 'exceeded':
        return 'Excedido';
      case 'near_limit':
        return 'Próximo do limite';
      default:
        return 'Normal';
    }
  };

  const activeCategories = categories.filter(c => c.isActive);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Categorias de Gasto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeCategories.map((category) => (
          <div
            key={category.id}
            className={cn(
              'group p-4 rounded-lg border transition-all',
              category.status === 'exceeded' && 'border-red-200 bg-red-50/50 hover:bg-red-50',
              category.status === 'near_limit' && 'border-amber-200 bg-amber-50/50 hover:bg-amber-50',
              category.status === 'normal' && 'border-border bg-background hover:bg-accent',
              onCategoryClick && 'cursor-pointer'
            )}
            onClick={() => onCategoryClick?.(category.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(category.status)}
                <div>
                  <p className="font-semibold text-sm">{category.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {getStatusLabel(category.status)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {category.percentage.toFixed(0)}% usado
                  </p>
                </div>
                {onEditCategory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCategory(category.id);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
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

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    R$ {category.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-muted-foreground">de</span>
                  <span className="font-semibold">
                    R$ {category.budgeted.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <span className={cn(
                  'font-bold',
                  category.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {category.remaining >= 0 ? 'Resta ' : 'Excesso '}
                  R$ {Math.abs(category.remaining).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
