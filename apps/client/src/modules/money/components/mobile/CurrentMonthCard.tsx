import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';
import type { BudgetMonth } from '../../types/budget.types';

interface CurrentMonthCardProps {
  month: BudgetMonth;
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
}

export function CurrentMonthCard({ month, onPreviousMonth, onNextMonth }: CurrentMonthCardProps) {
  const variance = month.actual - month.planned;
  const variancePercentage = ((variance / month.planned) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Período Atual
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={onPreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={onNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{month.month} {month.year}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {month.startDate.toLocaleDateString('pt-BR')} - {month.endDate.toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Planejado</p>
            <p className="text-lg font-bold text-primary">
              R$ {month.planned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Realizado</p>
            <p className="text-lg font-bold text-foreground">
              R$ {month.actual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {variance !== 0 && (
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-1">Variação</p>
            <div className="flex items-center justify-between">
              <p className={`text-sm font-semibold ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {variance > 0 ? '+' : ''}R$ {variance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className={`text-sm font-medium ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {variance > 0 ? '+' : ''}{variancePercentage}%
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
