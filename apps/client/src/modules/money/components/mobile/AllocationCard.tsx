import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { AllocationByClass } from '../../types/investments.types';
import { ASSET_CLASS_LABELS, ASSET_CLASS_COLORS } from '../../types/investments.types';

interface AllocationCardProps {
    allocation: AllocationByClass[];
    totalValue: number;
}

export function AllocationCard({ allocation, totalValue }: AllocationCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    // Sort by value descending
    const sortedAllocation = [...allocation].sort((a, b) => b.totalValue - a.totalValue);

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Alocação por Classe</h3>
            </div>

            {/* Allocation Bar */}
            <div className="h-4 rounded-full overflow-hidden flex mb-4">
                {sortedAllocation.map((alloc) => (
                    <div
                        key={alloc.assetClass}
                        className="h-full transition-all"
                        style={{
                            width: `${alloc.percentage}%`,
                            backgroundColor: ASSET_CLASS_COLORS[alloc.assetClass],
                        }}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="space-y-2">
                {sortedAllocation.map((alloc) => (
                    <div key={alloc.assetClass} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: ASSET_CLASS_COLORS[alloc.assetClass] }}
                            />
                            <span className="text-sm">{ASSET_CLASS_LABELS[alloc.assetClass]}</span>
                            <span className="text-xs text-muted-foreground">({alloc.count})</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">
                                {alloc.percentage.toFixed(0)}%
                            </span>
                            <span className="text-sm font-medium w-24 text-right">
                                {formatCurrency(alloc.totalValue)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
