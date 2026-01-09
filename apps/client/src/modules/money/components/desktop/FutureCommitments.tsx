import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/data';
import type { FutureCommitment } from '../../types/cards.types';

interface FutureCommitmentsProps {
  commitments: FutureCommitment[];
}

export function FutureCommitments({ commitments }: FutureCommitmentsProps) {
  const totalCommitted = commitments.reduce((sum, c) => sum + c.totalAmount, 0);
  const averageMonthly = totalCommitted / commitments.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Compromissos Futuros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Comprometido</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCommitted)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Média Mensal</p>
              <p className="text-2xl font-bold">{formatCurrency(averageMonthly)}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <p className="text-sm text-muted-foreground">
              Parcelas já comprometidas nos próximos {commitments.length} meses
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {commitments.map((commitment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">{commitment.month}</span>
                  <span className="text-xs text-muted-foreground">
                    {commitment.installmentsCount} parcelas
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {commitment.details.map((detail, i) => (
                    <span key={i}>
                      {detail.cardName}: {formatCurrency(detail.amount)}
                      {i < commitment.details.length - 1 && ' •'}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-lg font-bold ml-4">
                {formatCurrency(commitment.totalAmount)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground text-center">
            💡 Considere esses valores ao planejar novas compras parceladas
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
