import { Card, CardContent } from '@/ui/components/components/ui';
import { Wallet, TrendingUp, CreditCard } from 'lucide-react';
import { TrendIndicator } from '@/ui/components/analytics';
import { formatCurrency } from '@/utils/data';
import type { AccountSummary } from '../../types/accounts.types';

interface AccountsSummaryCardProps {
  summary: AccountSummary;
}

export function AccountsSummaryCard({ summary }: AccountsSummaryCardProps) {
  return (
    <Card className="bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent border border-white/10">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Saldo Total</span>
          </div>
          <TrendIndicator
            direction={summary.trend.direction}
            value={summary.trend.percentage}
            size="sm"
          />
        </div>

        <p className="text-3xl font-bold mb-6">{formatCurrency(summary.totalBalance)}</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Entradas</span>
            </div>
            <p className="text-lg font-semibold text-green-500">
              {formatCurrency(summary.totalIncome)}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-4 w-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Saídas</span>
            </div>
            <p className="text-lg font-semibold text-red-500">
              {formatCurrency(summary.totalExpenses)}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{summary.activeAccounts} contas ativas</span>
          <span className="text-muted-foreground">{summary.accountsCount} total</span>
        </div>
      </CardContent>
    </Card>
  );
}
