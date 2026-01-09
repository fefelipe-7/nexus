import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Repeat, ChevronRight } from 'lucide-react';
import type { RecurringCommitment } from '../../types/cashflow.types';

interface RecurringCardProps {
  commitments: RecurringCommitment[];
}

export function RecurringCard({ commitments }: RecurringCardProps) {
  const totalMonthly = commitments
    .filter(c => c.isActive)
    .reduce((sum, c) => sum + c.amount, 0);

  const formatNextDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    }).format(date);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Repeat className="h-4 w-4" />
            Compromissos Fixos
          </CardTitle>
          <span className="text-sm font-bold text-primary">
            R$ {totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {commitments.slice(0, 5).map((commitment) => (
          <div
            key={commitment.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 active:bg-muted transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{commitment.name}</p>
              <p className="text-xs text-muted-foreground">
                Próximo: {formatNextDate(commitment.nextDate)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                R$ {commitment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
