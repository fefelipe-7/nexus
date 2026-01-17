import { useState } from 'react';
import { Card } from '@/ui/components/components/ui';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { PatrimonyComposition } from '../../types/patrimony.types';
import { ASSET_TYPE_LABELS, ASSET_TYPE_COLORS, LIABILITY_TYPE_LABELS, LIABILITY_TYPE_COLORS } from '../../types/patrimony.types';

interface CompositionCardProps {
    composition: PatrimonyComposition;
    totalAssets: number;
    totalLiabilities: number;
}

export function CompositionCard({ composition, totalAssets, totalLiabilities }: CompositionCardProps) {
    const [showAssets, setShowAssets] = useState(true);
    const [showLiabilities, setShowLiabilities] = useState(true);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const assetItems = [
        { key: 'cash', value: composition.assets.cash },
        { key: 'investments', value: composition.assets.investments },
        { key: 'property', value: composition.assets.property },
        { key: 'vehicle', value: composition.assets.vehicle },
        { key: 'other', value: composition.assets.other },
    ].filter(item => item.value > 0);

    const liabilityItems = [
        { key: 'debts', value: composition.liabilities.debts },
        { key: 'installments', value: composition.liabilities.installments },
        { key: 'obligations', value: composition.liabilities.obligations },
    ].filter(item => item.value > 0);

    return (
        <div className="space-y-3">
            {/* Assets Card */}
            <Card>
                <button
                    onClick={() => setShowAssets(!showAssets)}
                    className="w-full flex items-center justify-between p-4"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="font-semibold">Ativos</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-green-600">
                            {formatCurrency(totalAssets)}
                        </span>
                        {showAssets ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                </button>

                {showAssets && (
                    <div className="px-4 pb-4 space-y-3">
                        {/* Bar */}
                        <div className="h-3 rounded-full overflow-hidden flex">
                            {assetItems.map((item) => (
                                <div
                                    key={item.key}
                                    className="h-full"
                                    style={{
                                        width: `${(item.value / totalAssets) * 100}%`,
                                        backgroundColor: ASSET_TYPE_COLORS[item.key as keyof typeof ASSET_TYPE_COLORS] || '#6b7280',
                                    }}
                                />
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="space-y-2">
                            {assetItems.map((item) => {
                                const percentage = (item.value / totalAssets) * 100;
                                const label = ASSET_TYPE_LABELS[item.key as keyof typeof ASSET_TYPE_LABELS] || item.key;
                                const color = ASSET_TYPE_COLORS[item.key as keyof typeof ASSET_TYPE_COLORS] || '#6b7280';

                                return (
                                    <div key={item.key} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="text-sm">{label}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-muted-foreground">
                                                {percentage.toFixed(0)}%
                                            </span>
                                            <span className="text-sm font-medium w-24 text-right">
                                                {formatCurrency(item.value)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </Card>

            {/* Liabilities Card */}
            <Card>
                <button
                    onClick={() => setShowLiabilities(!showLiabilities)}
                    className="w-full flex items-center justify-between p-4"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="font-semibold">Passivos</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-red-600">
                            {formatCurrency(totalLiabilities)}
                        </span>
                        {showLiabilities ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                </button>

                {showLiabilities && liabilityItems.length > 0 && (
                    <div className="px-4 pb-4 space-y-3">
                        {/* Bar */}
                        <div className="h-3 rounded-full overflow-hidden flex">
                            {liabilityItems.map((item) => (
                                <div
                                    key={item.key}
                                    className="h-full"
                                    style={{
                                        width: `${(item.value / totalLiabilities) * 100}%`,
                                        backgroundColor: LIABILITY_TYPE_COLORS[item.key as keyof typeof LIABILITY_TYPE_COLORS] || '#6b7280',
                                    }}
                                />
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="space-y-2">
                            {liabilityItems.map((item) => {
                                const percentage = (item.value / totalLiabilities) * 100;
                                const label = LIABILITY_TYPE_LABELS[item.key as keyof typeof LIABILITY_TYPE_LABELS] || item.key;
                                const color = LIABILITY_TYPE_COLORS[item.key as keyof typeof LIABILITY_TYPE_COLORS] || '#6b7280';

                                return (
                                    <div key={item.key} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="text-sm">{label}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-muted-foreground">
                                                {percentage.toFixed(0)}%
                                            </span>
                                            <span className="text-sm font-medium w-24 text-right">
                                                {formatCurrency(item.value)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
