import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockPurchasesData } from '../data/mockPurchasesData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Download, Filter } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';
import type { Purchase, PurchasesFilters } from '../types/purchases.types';

import {
    PurchasesSummaryCard,
    PurchasesFilterChips,
    PurchasesList,
    PurchaseDetailSheet,
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

    const handleAddPurchase = () => {
        console.log('Adicionar compra');
    };

    if (isMobileView) {
        return (
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Compras e Gastos</h1>
                    <p className="text-sm text-muted-foreground">
                        Onde seu dinheiro está sendo gasto
                    </p>
                </div>

                <PurchasesSummaryCard summary={data.summary} />

                <PurchasesFilterChips
                    filters={filters}
                    onFiltersChange={setFilters}
                />

                <PurchasesList
                    dayGroups={data.dayGroups}
                    onPurchaseClick={handlePurchaseClick}
                />

                <PurchaseDetailSheet
                    purchase={selectedPurchase}
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    onEdit={(p) => console.log('Edit', p)}
                    onMarkRecurring={(p) => console.log('Recurring', p)}
                    onSplit={(p) => console.log('Split', p)}
                    onDelete={(p) => console.log('Delete', p)}
                />

                <FAB
                    onClick={handleAddPurchase}
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
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtros
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
                dayGroups={data.dayGroups}
                onPurchaseClick={handlePurchaseClick}
            />

            {/* Detail Sheet (desktop uses same as mobile for now) */}
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
