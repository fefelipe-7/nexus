import { Card, CardContent } from '@/ui/components/components/ui';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@nexus/shared';
import { formatCurrency } from '@/utils/data';
import type { Account } from '../../types/accounts.types';

interface AccountCardProps {
  account: Account;
  onClick?: () => void;
}

export function AccountCard({ account, onClick }: AccountCardProps) {
  const isNegative = account.balance < 0;

  return (
    <Card
      className={cn(
        'cursor-pointer active:scale-98 transition-all',
        'bg-gradient-to-br border border-white/10',
      )}
      style={{
        background: `linear-gradient(135deg, ${account.color}15 0%, ${account.color}05 100%)`,
      }}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${account.color}20` }}
            >
              {account.icon}
            </div>
            <div>
              <p className="font-semibold text-foreground">{account.name}</p>
              {account.institution && (
                <p className="text-xs text-muted-foreground">{account.institution}</p>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Saldo</p>
            <p className={cn(
              'text-2xl font-bold',
              isNegative ? 'text-red-500' : 'text-foreground'
            )}>
              {formatCurrency(Math.abs(account.balance))}
            </p>
          </div>
          
          {account.type === 'credit' && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Fatura</p>
              <p className="text-sm font-semibold text-red-500">
                {formatCurrency(Math.abs(account.balance))}
              </p>
            </div>
          )}
        </div>

        {account.lastSync && (
          <p className="text-xs text-muted-foreground mt-3">
            Atualizado há {Math.floor((Date.now() - account.lastSync.getTime()) / 60000)} min
          </p>
        )}
      </CardContent>
    </Card>
  );
}
