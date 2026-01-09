import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { BudgetMonth } from '../../types/budget.types';

interface CurrentMonthOverviewProps {
  month: BudgetMonth;
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
}

export function CurrentMonthOverview({ month, onPreviousMonth, onNextMonth }: CurrentMonthOverviewProps) {
  const variance = month.actual - month.planned;
  const variancePercentage = ((variance / month.planned) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Orçamento do Mês
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviousMonth}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNextMonth}
            >
              Próximo
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-4">
          <p className="text-3xl font-bold">{month.month} {month.year}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {month.startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - {month.endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Planejado</p>
            <p className="text-3xl font-bold text-primary">
              R$ {month.planned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Realizado</p>
            <p className="text-3xl font-bold text-foreground">
              R$ {month.actual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {variance !== 0 && (
          <div className={cn(
            'p-4 rounded-lg border',
            variance > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          )}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Variação</p>
                <p className={cn(
                  'text-xl font-bold',
                  variance > 0 ? 'text-red-600' : 'text-green-600'
                )}>
                  {variance > 0 ? '+' : ''}R$ {variance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-right">
                <p className={cn(
                  'text-2xl font-bold',
                  variance > 0 ? 'text-red-600' : 'text-green-600'
                )}>
                  {variance > 0 ? '+' : ''}{variancePercentage}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {variance > 0 ? 'acima' : 'abaixo'} do planejado
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
