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
        variant="gradient"
        gradient="from-blue-500/20 via-indigo-500/10 to-transparent"
        glassEffect
        glowEffect
        iconGradient
        hoverEffect="lift"
        trend={{
          direction: summary.trend.direction,
          value: summary.trend.percentage,
          label: 'vs mês anterior',
          animated: true,
        }}
      />

      <StatCard
        label="Total de Entradas"
        value={summary.totalIncome}
        format="currency"
        icon={TrendingUp}
        color="green"
        variant="gradient"
        glassEffect
        hoverEffect="lift"
        animateValue
      />

      <StatCard
        label="Total de Saídas"
        value={summary.totalExpenses}
        format="currency"
        icon={TrendingDown}
        color="red"
        variant="gradient"
        glassEffect
        hoverEffect="lift"
        animateValue
      />

      <StatCard
        label="Contas Ativas"
        value={`${summary.activeAccounts}/${summary.accountsCount}`}
        format="custom"
        icon={CreditCard}
        color="purple"
        variant="gradient"
        glassEffect
        iconGradient
        hoverEffect="scale"
      />
    </div>
  );
}
