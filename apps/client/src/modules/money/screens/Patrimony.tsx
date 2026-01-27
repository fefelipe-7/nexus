import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useAccounts } from '@/hooks/data/useAccounts';
import { useInvestments } from '@/hooks/data/useInvestments';
import { useDebts } from '@/hooks/data/useDebts';
import { Loader2, TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';

export function Patrimony() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const { accounts, isLoading: accountsLoading } = useAccounts();
    const { investments, isLoading: investmentsLoading } = useInvestments();
    const { debts, isLoading: debtsLoading } = useDebts();

    const isLoading = accountsLoading || investmentsLoading || debtsLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Calculate Aggregates
    const totalAccounts = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalInvestments = investments.reduce((sum, inv) => sum + (inv.current_value || inv.amount), 0);
    const totalDebts = debts.reduce((sum, debt) => sum + debt.remaining_amount, 0);

    const totalAssets = totalAccounts + totalInvestments;
    const netWorth = totalAssets - totalDebts;

    const MetricsGrid = () => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Patrimônio Líquido</CardTitle>
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">R$ {netWorth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground">Ativos - Passivos</p>
                </CardContent>
            </Card>

            <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Contas e Caixa</CardTitle>
                    <Wallet className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">R$ {totalAccounts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </CardContent>
            </Card>

            <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Investimentos</CardTitle>
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">R$ {totalInvestments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </CardContent>
            </Card>

            <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dívidas</CardTitle>
                    <TrendingDown className="h-4 w-4 text-rose-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-rose-600">R$ {totalDebts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </CardContent>
            </Card>
        </div>
    );

    if (isMobileView) {
        return (
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Patrimônio</h1>
                    <p className="text-sm text-muted-foreground">
                        Visão consolidada da sua riqueza
                    </p>
                </div>

                <div className="p-6 rounded-2xl bg-primary text-primary-foreground shadow-lg">
                    <p className="text-sm opacity-80 mb-1">Patrimônio Líquido</p>
                    <h2 className="text-4xl font-black tracking-tighter">
                        R$ {netWorth.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 rounded-xl border border-border bg-background flex justify-between items-center">
                        <span className="text-sm font-medium">Ativos Totais</span>
                        <span className="font-bold text-emerald-600">R$ {totalAssets.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-background flex justify-between items-center">
                        <span className="text-sm font-medium">Passivos (Dívidas)</span>
                        <span className="font-bold text-rose-600">R$ {totalDebts.toLocaleString('pt-BR')}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Patrimônio</h1>
                <p className="text-muted-foreground">
                    Acompanhe a evolução da sua riqueza líquida
                </p>
            </div>

            <MetricsGrid />
        </div>
    );
}
