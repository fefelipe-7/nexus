import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockInvestmentsData } from '../data/mockInvestmentsData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Search, LayoutGrid, List, TrendingUp, PieChart, Target } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { Asset, AssetClass } from '../types/investments.types';
import { ASSET_CLASS_LABELS, ASSET_CLASS_COLORS, RISK_COLORS, RISK_LABELS } from '../types/investments.types';

import {
    InvestmentsSummaryCard,
    AllocationCard,
    AssetListItem,
    GoalProgressCard,
    AssetDetailSheet,
} from '../components/mobile';

export function Investments() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'portfolio' | 'allocation' | 'goals'>('portfolio');
    const [filterClass, setFilterClass] = useState<AssetClass | 'all'>('all');

    const data = mockInvestmentsData;

    const handleAssetClick = (asset: Asset) => {
        setSelectedAsset(asset);
        setIsDetailOpen(true);
    };

    // Filter assets
    const filteredAssets = data.assets.filter(a => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!a.name.toLowerCase().includes(query) &&
                !a.ticker?.toLowerCase().includes(query) &&
                !a.institution.toLowerCase().includes(query)) {
                return false;
            }
        }
        if (filterClass !== 'all' && a.assetClass !== filterClass) {
            return false;
        }
        return true;
    });

    // Group by class
    const assetsByClass = filteredAssets.reduce((acc, asset) => {
        if (!acc[asset.assetClass]) {
            acc[asset.assetClass] = [];
        }
        acc[asset.assetClass].push(asset);
        return acc;
    }, {} as Record<AssetClass, Asset[]>);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const linkedGoal = selectedAsset?.linkedGoalId
        ? data.goals.find(g => g.id === selectedAsset.linkedGoalId)
        : null;

    if (isMobileView) {
        return (
            <div className="space-y-4 pb-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Investimentos</h1>
                    <p className="text-sm text-muted-foreground">
                        Seu patrimônio em um único lugar
                    </p>
                </div>

                {/* Summary Card */}
                <InvestmentsSummaryCard summary={data.summary} />

                {/* Tabs */}
                <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
                    {(['portfolio', 'allocation', 'goals'] as const).map(tab => (
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
                            {tab === 'portfolio' && (
                                <>
                                    <List className="h-3.5 w-3.5" />
                                    Carteira
                                </>
                            )}
                            {tab === 'allocation' && (
                                <>
                                    <PieChart className="h-3.5 w-3.5" />
                                    Alocação
                                </>
                            )}
                            {tab === 'goals' && (
                                <>
                                    <Target className="h-3.5 w-3.5" />
                                    Metas
                                </>
                            )}
                        </button>
                    ))}
                </div>

                {/* Portfolio Tab */}
                {activeTab === 'portfolio' && (
                    <>
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar ativos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-11 bg-muted/50 border-0"
                            />
                        </div>

                        {/* Class Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            <button
                                onClick={() => setFilterClass('all')}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                                    filterClass === 'all'
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted hover:bg-accent"
                                )}
                            >
                                Todos
                            </button>
                            {data.summary.allocationByClass.map(alloc => (
                                <button
                                    key={alloc.assetClass}
                                    onClick={() => setFilterClass(alloc.assetClass)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5",
                                        filterClass === alloc.assetClass
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted hover:bg-accent"
                                    )}
                                >
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: filterClass === alloc.assetClass ? 'currentColor' : ASSET_CLASS_COLORS[alloc.assetClass] }}
                                    />
                                    {ASSET_CLASS_LABELS[alloc.assetClass]}
                                </button>
                            ))}
                        </div>

                        {/* Assets List by Class */}
                        <div className="space-y-4">
                            {Object.entries(assetsByClass).map(([assetClass, assets]) => (
                                <div key={assetClass}>
                                    <div className="flex items-center justify-between px-1 mb-2">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: ASSET_CLASS_COLORS[assetClass as AssetClass] }}
                                            />
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                {ASSET_CLASS_LABELS[assetClass as AssetClass]}
                                            </p>
                                        </div>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {formatCurrency(assets.reduce((s, a) => s + a.currentValue, 0))}
                                        </p>
                                    </div>
                                    <Card className="overflow-hidden divide-y divide-border/50">
                                        {assets.map((asset) => (
                                            <AssetListItem
                                                key={asset.id}
                                                asset={asset}
                                                onClick={() => handleAssetClick(asset)}
                                            />
                                        ))}
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Allocation Tab */}
                {activeTab === 'allocation' && (
                    <AllocationCard
                        allocation={data.summary.allocationByClass}
                        totalValue={data.summary.currentValue}
                    />
                )}

                {/* Goals Tab */}
                {activeTab === 'goals' && (
                    <GoalProgressCard goals={data.goals} />
                )}

                {/* Detail Sheet */}
                <AssetDetailSheet
                    asset={selectedAsset}
                    linkedGoal={linkedGoal}
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    onToggleStrategic={(a) => console.log('Toggle strategic', a)}
                    onLinkToGoal={(a) => console.log('Link to goal', a)}
                    onSimulateWithdraw={(a) => console.log('Simulate withdraw', a)}
                    onEdit={(a) => console.log('Edit', a)}
                />

                {/* FAB */}
                <FAB
                    onClick={() => console.log('Add asset')}
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
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Investimentos</h1>
                    <p className="text-muted-foreground">
                        Seu patrimônio consolidado em um único lugar
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
                        Novo Ativo
                    </Button>
                </div>
            </div>

            {/* Desktop Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Patrimônio Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.summary.currentValue)}</div>
                        <p className="text-xs text-muted-foreground">investido: {formatCurrency(data.summary.totalInvested)}</p>
                    </CardContent>
                </Card>
                <Card className={data.summary.totalProfitability >= 0 ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rentabilidade</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", data.summary.totalProfitability >= 0 ? "text-green-500" : "text-red-500")}>
                            +{data.summary.totalProfitabilityPercentage.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {data.summary.totalProfitability >= 0 ? '+' : ''}{formatCurrency(data.summary.totalProfitability)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.assetsCount}</div>
                        <p className="text-xs text-muted-foreground">na carteira</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Risco Global</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" style={{ color: RISK_COLORS[data.summary.globalRiskLevel] }}>
                            {RISK_LABELS[data.summary.globalRiskLevel]}
                        </div>
                        <p className="text-xs text-muted-foreground">perfil da carteira</p>
                    </CardContent>
                </Card>
            </div>

            {/* Desktop Content */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Assets List */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Carteira de Ativos</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/50">
                            {filteredAssets.map((asset) => (
                                <AssetListItem
                                    key={asset.id}
                                    asset={asset}
                                    onClick={() => handleAssetClick(asset)}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Side Panel */}
                <div className="space-y-6">
                    <AllocationCard
                        allocation={data.summary.allocationByClass}
                        totalValue={data.summary.currentValue}
                    />
                    <GoalProgressCard goals={data.goals} />
                </div>
            </div>

            {/* Detail Sheet */}
            <AssetDetailSheet
                asset={selectedAsset}
                linkedGoal={linkedGoal}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onToggleStrategic={(a) => console.log('Toggle strategic', a)}
                onLinkToGoal={(a) => console.log('Link to goal', a)}
                onSimulateWithdraw={(a) => console.log('Simulate withdraw', a)}
                onEdit={(a) => console.log('Edit', a)}
            />
        </div>
    );
}
