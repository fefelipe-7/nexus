import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { MoreVertical, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { cn } from '@nexus/shared';
import { formatCurrency } from '@/utils/data';
import { ProgressBar } from '@/ui/components/charts';
import type { Account } from '../../types/accounts.types';

interface AccountsGridProps {
  accounts: Account[];
}

export function AccountsGrid({ accounts }: AccountsGridProps) {
  const getAccountTypeLabel = (type: string) => {
    const labels = {
      checking: 'Conta Corrente',
      savings: 'Poupança',
      investment: 'Investimento',
      credit: 'Cartão de Crédito',
      cash: 'Dinheiro',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => {
        const isNegative = account.balance < 0;
        const isCredit = account.type === 'credit';

        return (
          <Card
            key={account.id}
            className={cn(
              'cursor-pointer transition-all duration-300',
              'hover:-translate-y-1 hover:shadow-xl',
              'bg-gradient-to-br border border-white/10'
            )}
            style={{
              background: `linear-gradient(135deg, ${account.color}20 0%, ${account.color}05 100%)`,
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${account.color}30` }}
                  >
                    {account.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base">{account.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getAccountTypeLabel(account.type)}
                    </p>
                  </div>
                </div>
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {isCredit ? 'Fatura Atual' : 'Saldo Disponível'}
                </p>
                <p className={cn(
                  'text-3xl font-bold',
                  isNegative ? 'text-red-500' : 'text-foreground'
                )}>
                  {formatCurrency(Math.abs(account.balance))}
                </p>
              </div>

              {account.institution && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{account.institution}</span>
                  {account.lastSync && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <RefreshCw className="h-3 w-3" />
                      <span>Sincronizado</span>
                    </div>
                  )}
                </div>
              )}

              {isCredit && (
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-muted-foreground">Limite utilizado</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <ProgressBar
                    value={45}
                    max={100}
                    size="sm"
                    color="red"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
