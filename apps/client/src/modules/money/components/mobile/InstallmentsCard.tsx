import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/data';
import { ProgressBar } from '@/ui/components/charts';
import type { Installment } from '../../types/cards.types';

interface InstallmentsCardProps {
  installments: Installment[];
}

export function InstallmentsCard({ installments }: InstallmentsCardProps) {
  const totalMonthly = installments.reduce((sum, inst) => sum + inst.installmentAmount, 0);
  const totalRemaining = installments.reduce(
    (sum, inst) => sum + (inst.installmentAmount * inst.remainingInstallments),
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Compromissos Futuros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Impacto Mensal</span>
            <span className="text-2xl font-bold">{formatCurrency(totalMonthly)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Restante</span>
            <span className="font-medium">{formatCurrency(totalRemaining)}</span>
          </div>
        </div>

        <div className="space-y-3">
          {installments.map((installment) => {
            const progress = ((installment.currentInstallment - 1) / installment.totalInstallments) * 100;

            return (
              <div key={installment.id} className="pb-3 border-b last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{installment.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {installment.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(installment.installmentAmount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {installment.currentInstallment}/{installment.totalInstallments}
                    </p>
                  </div>
                </div>
                <ProgressBar
                  value={progress}
                  max={100}
                  size="sm"
                  color="blue"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Faltam {installment.remainingInstallments} parcelas • {formatCurrency(installment.installmentAmount * installment.remainingInstallments)} restantes
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
