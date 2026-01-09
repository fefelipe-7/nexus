import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Clock, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';
import { cn } from '@nexus/shared';
import { formatCurrency, formatDate } from '@/utils/data';
import type { AccountTransaction } from '../../types/accounts.types';

interface RecentTransactionsTableProps {
  transactions: AccountTransaction[];
}

export function RecentTransactionsTable({ transactions }: RecentTransactionsTableProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'expense':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'transfer':
        return <ArrowRightLeft className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-green-500';
      case 'expense':
        return 'text-red-500';
      case 'transfer':
        return 'text-blue-500';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Transações Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg',
                'hover:bg-accent transition-colors cursor-pointer',
                transaction.pending && 'opacity-60'
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-accent">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {transaction.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(transaction.date, 'short')}</span>
                    {transaction.category && (
                      <>
                        <span>•</span>
                        <span>{transaction.category}</span>
                      </>
                    )}
                    {transaction.pending && (
                      <>
                        <span>•</span>
                        <span className="text-amber-500">Pendente</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <p className={cn('font-semibold text-sm ml-3', getAmountColor(transaction.type))}>
                {transaction.amount > 0 && '+'}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
