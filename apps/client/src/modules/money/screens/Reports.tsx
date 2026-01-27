import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useAccounts } from '@/hooks/data/useAccounts';
import { useTransactions } from '@/hooks/data/useTransactions';
import { Loader2, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';

export function Reports() {
    const { isMobile, isTablet } = useDeviceDetection();

    const { accounts, isLoading: accountsLoading } = useAccounts();
    const { transactions, isLoading: transactionsLoading } = useTransactions({ limit: 100 });

    const isLoading = accountsLoading || transactionsLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Basic Reporting Calculations
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Relatórios</h1>
                <p className="text-muted-foreground">
                    Análise detalhada das suas finanças
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Entradas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">
                            R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Saídas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-600">
                            R$ {expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Poupança</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${savingsRate >= 20 ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {savingsRate.toFixed(1)}%
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="p-8 text-center border border-dashed border-border rounded-xl">
                <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Mais relatórios em breve</h3>
                <p className="text-muted-foreground text-sm">
                    Estamos preparando gráficos detalhados de categorias e evolução mensal.
                </p>
            </div>
        </div>
    );
}
