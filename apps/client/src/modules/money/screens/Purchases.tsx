import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockPurchasesData } from '../data/mockPurchasesData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Download, Filter, Search } from 'lucide-react';
import { Button, Input } from '@/ui/components/components/ui';
import type { Purchase, PurchasesFilters } from '../types/purchases.types';

import {
    PurchaseDetailSheet,
    EnhancedSummaryCard,
    FilterSheet,
    QuickFilterBar,
    EnhancedPurchasesList,
    AddPurchaseSheet,
} from '../components/mobile';

import {
    PurchasesSummary,
    PurchasesTable,
} from '../components/desktop';

export function Purchases() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<PurchasesFilters>({
        period: 'week',
        types: [],
        paymentMethods: [],
        categories: [],
        statuses: [],
    });

    const data = mockPurchasesData;

    const handlePurchaseClick = (purchase: Purchase) => {
        setSelectedPurchase(purchase);
        setIsDetailOpen(true);
    };

    const handleAddPurchase = (purchaseData: {
        description: string;
        amount: number;
        category?: string;
        paymentMethod: string;
        type: string;
    }) => {
        console.log('Nova compra:', purchaseData);
        // TODO: Add to data
    };

    // Calculate active filters count
    const activeFiltersCount =
        filters.types.length +
        filters.paymentMethods.length +
        filters.categories.length;

    // Filter purchases based on search query
    const filteredDayGroups = searchQuery
        ? data.dayGroups.map(group => ({
            ...group,
            purchases: group.purchases.filter(p =>
                p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.establishment?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(group => group.purchases.length > 0)
        : data.dayGroups;

    if (isMobileView) {
        return (
            <div className="space-y-4 pb-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Compras e Gastos</h1>
                    <p className="text-sm text-muted-foreground">
                        Onde seu dinheiro está sendo gasto
                    </p>
                </div>

                {/* Enhanced Summary */}
                <EnhancedSummaryCard
                    summary={data.summary}
                    categories={data.categories}
                />

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar compras..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 bg-muted/50 border-0"
                    />
                </div>

                {/* Quick Filter Bar */}
                <QuickFilterBar
                    filters={filters}
                    onFiltersChange={setFilters}
                    onOpenFilters={() => setIsFilterOpen(true)}
                    activeCount={activeFiltersCount}
                />

                {/* Purchases List */}
                <EnhancedPurchasesList
                    dayGroups={filteredDayGroups}
                    onPurchaseClick={handlePurchaseClick}
                />

                {/* Filter Sheet */}
                <FilterSheet
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    filters={filters}
                    onApply={setFilters}
                    categories={data.categories}
                />

                {/* Purchase Detail Sheet */}
                <PurchaseDetailSheet
                    purchase={selectedPurchase}
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    onEdit={(p) => console.log('Edit', p)}
                    onMarkRecurring={(p) => console.log('Recurring', p)}
                    onSplit={(p) => console.log('Split', p)}
                    onDelete={(p) => console.log('Delete', p)}
                />

                {/* Add Purchase Sheet */}
                <AddPurchaseSheet
                    isOpen={isAddOpen}
                    onClose={() => setIsAddOpen(false)}
                    onAdd={handleAddPurchase}
                    categories={data.categories}
                />

                {/* FAB */}
                <FAB
                    onClick={() => setIsAddOpen(true)}
                    icon={Plus}
                    label="Registrar"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Compras e Gastos</h1>
                    <p className="text-muted-foreground">
                        Registro completo de onde seu dinheiro está sendo gasto
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
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtros
                        {activeFiltersCount > 0 && (
                            <span className="ml-1 bg-primary text-primary-foreground text-xs px-1.5 rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Compra
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <PurchasesSummary summary={data.summary} />

            {/* Purchases Table */}
            <PurchasesTable
                dayGroups={filteredDayGroups}
                onPurchaseClick={handlePurchaseClick}
            />

            {/* Detail Sheet */}
            <PurchaseDetailSheet
                purchase={selectedPurchase}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onEdit={(p) => console.log('Edit', p)}
                onMarkRecurring={(p) => console.log('Recurring', p)}
                onSplit={(p) => console.log('Split', p)}
                onDelete={(p) => console.log('Delete', p)}
            />
        </div>
    );
}
