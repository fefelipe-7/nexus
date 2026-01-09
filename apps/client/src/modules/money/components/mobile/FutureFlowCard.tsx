import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Accordion, AccordionItem } from '@/ui/components/mobile';
import { Calendar, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { FutureFlow } from '../../types/cashflow.types';

interface FutureFlowCardProps {
  futureFlow: FutureFlow[];
}

export function FutureFlowCard({ futureFlow }: FutureFlowCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: 'long' 
    }).format(date);
  };

  const hasRisks = futureFlow.some(f => f.hasRisk);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Próximos Dias
          {hasRisks && (
            <span className="ml-auto flex items-center gap-1 text-xs text-amber-600">
              <AlertTriangle className="h-3 w-3" />
              Atenção
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion>
          {futureFlow.map((flow, index) => {
            const netFlow = flow.expectedIncome - flow.expectedExpenses;
            
            return (
              <AccordionItem
                key={index}
                title={formatDate(flow.date)}
                defaultOpen={index === 0}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <p className="text-xs text-muted-foreground mb-1">Entradas</p>
                      <p className="text-sm font-semibold text-green-600">
                        R$ {flow.expectedIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <p className="text-xs text-muted-foreground mb-1">Saídas</p>
                      <p className="text-sm font-semibold text-red-600">
                        R$ {flow.expectedExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className={cn(
                    'p-3 rounded-lg',
                    flow.hasRisk ? 'bg-amber-500/10' : 'bg-blue-500/10'
                  )}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Saldo Projetado</span>
                      {netFlow >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <p className={cn(
                      'text-lg font-bold mt-1',
                      flow.projectedBalance >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      R$ {flow.projectedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    {flow.hasRisk && (
                      <p className="text-xs text-amber-600 mt-2">
                        ⚠ Período de aperto previsto
                      </p>
                    )}
                  </div>
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
