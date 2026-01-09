import { Wallet, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import { StatCard } from '@/ui/components/analytics';
import type { AccountSummary } from '../../types/accounts.types';

interface AccountsOverviewProps {
  summary: AccountSummary;
}

export function AccountsOverview({ summary }: AccountsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard
        label="Saldo Total"
        value={summary.totalBalance}
        format="currency"
        icon={Wallet}
        color="blue"
        variant="bordered"
        trend={{
          direction: summary.trend.direction,
          value: summary.trend.percentage,
          label: 'vs mês anterior',
        }}
      />

      <StatCard
        label="Total de Entradas"
        value={summary.totalIncome}
        format="currency"
        icon={TrendingUp}
        color="green"
        variant="bordered"
      />

      <StatCard
        label="Total de Saídas"
        value={summary.totalExpenses}
        format="currency"
        icon={TrendingDown}
        color="red"
        variant="bordered"
      />

      <StatCard
        label="Contas Ativas"
        value={`${summary.activeAccounts}/${summary.accountsCount}`}
        format="custom"
        icon={CreditCard}
        color="purple"
        variant="bordered"
      />
    </div>
  );
}
