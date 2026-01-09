import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Calendar, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { FutureFlow } from '../../types/cashflow.types';

interface FutureProjectionProps {
  futureFlow: FutureFlow[];
}

export function FutureProjection({ futureFlow }: FutureProjectionProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const hasRisks = futureFlow.some(f => f.hasRisk);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Projeção Futura
          </CardTitle>
          {hasRisks && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Períodos de atenção identificados</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {futureFlow.map((flow, index) => {
            const netFlow = flow.expectedIncome - flow.expectedExpenses;
            
            return (
              <div
                key={index}
                className={cn(
                  'p-4 rounded-lg border transition-all hover:shadow-md',
                  flow.hasRisk 
                    ? 'bg-amber-500/5 border-amber-500/30' 
                    : 'bg-card border-border hover:bg-accent/50'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatDate(flow.date)}</span>
                  </div>
                  {flow.hasRisk && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                      <AlertTriangle className="h-3 w-3" />
                      Período de aperto
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <p className="text-xs text-muted-foreground mb-1">Entradas Esperadas</p>
                    <p className="text-lg font-semibold text-green-600">
                      R$ {flow.expectedIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-red-500/10">
                    <p className="text-xs text-muted-foreground mb-1">Saídas Programadas</p>
                    <p className="text-lg font-semibold text-red-600">
                      R$ {flow.expectedExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className={cn(
                    'p-3 rounded-lg',
                    netFlow >= 0 ? 'bg-blue-500/10' : 'bg-amber-500/10'
                  )}>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-muted-foreground">Resultado</p>
                      {netFlow >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                    <p className={cn(
                      'text-lg font-semibold',
                      netFlow >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {netFlow >= 0 ? '+' : ''}R$ {netFlow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className={cn(
                    'p-3 rounded-lg',
                    flow.projectedBalance >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                  )}>
                    <p className="text-xs text-muted-foreground mb-1">Saldo Projetado</p>
                    <p className={cn(
                      'text-lg font-semibold',
                      flow.projectedBalance >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      R$ {flow.projectedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
