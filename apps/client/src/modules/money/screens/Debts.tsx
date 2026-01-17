import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockDebtsData } from '../data/mockDebtsData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Search, Wallet, CreditCard } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { Debt, Installment } from '../types/debts.types';

import {
    DebtsSummaryCard,
    DebtListItem,
    InstallmentListItem,
    DebtDetailSheet,
} from '../components/mobile';

type DetailItem = (Debt & { itemType: 'debt' }) | (Installment & { itemType: 'installment' }) | null;

export function Debts() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const [selectedItem, setSelectedItem] = useState<DetailItem>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'debts' | 'installments'>('all');

    const data = mockDebtsData;

    const handleDebtClick = (debt: Debt) => {
        setSelectedItem({ ...debt, itemType: 'debt' });
        setIsDetailOpen(true);
    };

    const handleInstallmentClick = (installment: Installment) => {
        setSelectedItem({ ...installment, itemType: 'installment' });
        setIsDetailOpen(true);
    };

    // Filter
    const filteredDebts = data.debts.filter(d => {
        if (searchQuery) {
            return d.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    const filteredInstallments = data.installments.filter(i => {
        if (searchQuery) {
            return i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                i.establishment?.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    const showDebts = activeTab === 'all' || activeTab === 'debts';
    const showInstallments = activeTab === 'all' || activeTab === 'installments';

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    if (isMobileView) {
        return (
            <div className="space-y-4 pb-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Dívidas e Parcelamentos</h1>
                    <p className="text-sm text-muted-foreground">
                        Seus compromissos financeiros futuros
                    </p>
                </div>

                {/* Summary Card */}
                <DebtsSummaryCard summary={data.summary} />

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 bg-muted/50 border-0"
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
                    {(['all', 'debts', 'installments'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "flex-1 py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5",
                                activeTab === tab
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {tab === 'all' && 'Todos'}
                            {tab === 'debts' && (
                                <>
                                    <Wallet className="h-3.5 w-3.5" />
                                    Dívidas ({data.debts.length})
                                </>
                            )}
                            {tab === 'installments' && (
                                <>
                                    <CreditCard className="h-3.5 w-3.5" />
                                    Parcelas ({data.installments.length})
                                </>
                            )}
                        </button>
                    ))}
                </div>

                {/* Debts Section */}
                {showDebts && filteredDebts.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between px-1 mb-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                                <Wallet className="h-3.5 w-3.5" />
                                Dívidas Ativas
                            </p>
                            <p className="text-xs font-medium text-muted-foreground">
                                {formatCurrency(filteredDebts.reduce((s, d) => s + d.monthlyPayment, 0))}/mês
                            </p>
                        </div>
                        <Card className="overflow-hidden divide-y divide-border/50">
                            {filteredDebts.map((debt) => (
                                <DebtListItem
                                    key={debt.id}
                                    debt={debt}
                                    onClick={() => handleDebtClick(debt)}
                                />
                            ))}
                        </Card>
                    </div>
                )}

                {/* Installments Section */}
                {showInstallments && filteredInstallments.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between px-1 mb-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                                <CreditCard className="h-3.5 w-3.5" />
                                Parcelamentos
                            </p>
                            <p className="text-xs font-medium text-muted-foreground">
                                {formatCurrency(filteredInstallments.reduce((s, i) => s + i.installmentAmount, 0))}/mês
                            </p>
                        </div>
                        <Card className="overflow-hidden divide-y divide-border/50">
                            {filteredInstallments.map((installment) => (
                                <InstallmentListItem
                                    key={installment.id}
                                    installment={installment}
                                    onClick={() => handleInstallmentClick(installment)}
                                />
                            ))}
                        </Card>
                    </div>
                )}

                {/* Empty State */}
                {filteredDebts.length === 0 && filteredInstallments.length === 0 && (
                    <Card className="p-8">
                        <div className="text-center">
                            <p className="text-sm font-medium">Nenhum compromisso encontrado</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Parabéns! Você não tem dívidas ou parcelamentos ativos.
                            </p>
                        </div>
                    </Card>
                )}

                {/* Detail Sheet */}
                <DebtDetailSheet
                    item={selectedItem}
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    onTogglePriority={(d) => console.log('Toggle priority', d)}
                    onSimulatePayoff={(d) => console.log('Simulate payoff', d)}
                    onEdit={(d) => console.log('Edit', d)}
                />

                {/* FAB */}
                <FAB
                    onClick={() => console.log('Add debt')}
                    icon={Plus}
                    label="Novo"
                />
            </div>
        );
    }

    // Desktop
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Dívidas e Parcelamentos</h1>
                    <p className="text-muted-foreground">
                        Controle seus compromissos financeiros futuros
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 w-64"
                        />
                    </div>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                    </Button>
                </div>
            </div>

            {/* Desktop Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Comprometido</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.summary.totalCommitted)}</div>
                        <p className="text-xs text-muted-foreground">valor restante</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Compromisso Mensal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.summary.monthlyCommitment)}</div>
                        <p className="text-xs text-muted-foreground">por mês</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dívidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.activeDebtsCount}</div>
                        <p className="text-xs text-muted-foreground">ativas</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Parcelamentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.activeInstallmentsCount}</div>
                        <p className="text-xs text-muted-foreground">em andamento</p>
                    </CardContent>
                </Card>
            </div>

            {/* Desktop Lists */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Debts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="h-5 w-5" />
                            Dívidas Ativas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/50">
                            {filteredDebts.map((debt) => (
                                <DebtListItem
                                    key={debt.id}
                                    debt={debt}
                                    onClick={() => handleDebtClick(debt)}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Installments */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Parcelamentos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/50">
                            {filteredInstallments.map((installment) => (
                                <InstallmentListItem
                                    key={installment.id}
                                    installment={installment}
                                    onClick={() => handleInstallmentClick(installment)}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detail Sheet */}
            <DebtDetailSheet
                item={selectedItem}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onTogglePriority={(d) => console.log('Toggle priority', d)}
                onSimulatePayoff={(d) => console.log('Simulate payoff', d)}
                onEdit={(d) => console.log('Edit', d)}
            />
        </div>
    );
}
