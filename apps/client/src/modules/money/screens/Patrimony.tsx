import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockPatrimonyData } from '../data/mockPatrimonyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Wallet, CreditCard, TrendingUp, TrendingDown, Scale, Target, ArrowRight } from 'lucide-react';
import { cn } from '@nexus/shared';
import { ASSET_TYPE_LABELS, ASSET_TYPE_COLORS, LIABILITY_TYPE_LABELS, LIABILITY_TYPE_COLORS } from '../types/patrimony.types';

import {
    NetWorthCard,
    CompositionCard,
    EvolutionCard,
} from '../components/mobile';

export function Patrimony() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const data = mockPatrimonyData;

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
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Patrimônio Financeiro</h1>
                    <p className="text-sm text-muted-foreground">
                        Sua posição financeira real, hoje
                    </p>
                </div>

                {/* Net Worth Card */}
                <NetWorthCard summary={data.summary} />

                {/* Composition Cards */}
                <CompositionCard
                    composition={data.summary.composition}
                    totalAssets={data.summary.totalAssets}
                    totalLiabilities={data.summary.totalLiabilities}
                />

                {/* Evolution Card */}
                <EvolutionCard history={data.history} />

                {/* Strategic Actions */}
                <Card className="p-4">
                    <h3 className="text-sm font-semibold mb-3">Ações Estratégicas</h3>
                    <div className="space-y-2">
                        <button className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-accent transition-colors">
                            <div className="flex items-center gap-3">
                                <Target className="h-4 w-4 text-primary" />
                                <span className="text-sm">Definir meta de patrimônio</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-accent transition-colors">
                            <div className="flex items-center gap-3">
                                <TrendingDown className="h-4 w-4 text-red-500" />
                                <span className="text-sm">Reduzir passivos críticos</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-accent transition-colors">
                            <div className="flex items-center gap-3">
                                <Scale className="h-4 w-4 text-amber-500" />
                                <span className="text-sm">Simular cenários</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    // Desktop
    const isPositiveVariation = data.summary.variation.amount >= 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Patrimônio Financeiro</h1>
                <p className="text-muted-foreground">
                    Sua posição financeira real, hoje
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="md:col-span-2 border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Patrimônio Líquido</CardTitle>
                        <Scale className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(data.summary.netWorth)}</div>
                        <p className={cn(
                            "text-sm flex items-center gap-1 mt-1",
                            isPositiveVariation ? "text-green-500" : "text-red-500"
                        )}>
                            {isPositiveVariation ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            {isPositiveVariation ? '+' : ''}{formatCurrency(data.summary.variation.amount)} este mês
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ativos</CardTitle>
                        <Wallet className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(data.summary.totalAssets)}</div>
                        <p className="text-xs text-muted-foreground">{data.assets.length} itens</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Passivos</CardTitle>
                        <CreditCard className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(data.summary.totalLiabilities)}</div>
                        <p className="text-xs text-muted-foreground">{data.liabilities.length} itens</p>
                    </CardContent>
                </Card>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Composition */}
                <div className="md:col-span-2">
                    <CompositionCard
                        composition={data.summary.composition}
                        totalAssets={data.summary.totalAssets}
                        totalLiabilities={data.summary.totalLiabilities}
                    />
                </div>

                {/* Evolution */}
                <EvolutionCard history={data.history} />
            </div>

            {/* Assets & Liabilities Detail */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Assets */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-green-500" />
                            Detalhamento de Ativos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.assets.map((asset) => (
                            <div
                                key={asset.id}
                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: ASSET_TYPE_COLORS[asset.type] }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium">{asset.name}</p>
                                        <p className="text-xs text-muted-foreground">{ASSET_TYPE_LABELS[asset.type]}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-green-600">
                                    {formatCurrency(asset.currentValue)}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Liabilities */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-red-500" />
                            Detalhamento de Passivos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.liabilities.map((liability) => (
                            <div
                                key={liability.id}
                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: LIABILITY_TYPE_COLORS[liability.type] }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium">{liability.name}</p>
                                        <p className="text-xs text-muted-foreground">{LIABILITY_TYPE_LABELS[liability.type]}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-red-600">
                                    {formatCurrency(liability.currentValue)}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
