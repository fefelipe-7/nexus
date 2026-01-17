import { cn } from '@nexus/shared';
import { ChevronRight, TrendingUp, TrendingDown, Star, Shield } from 'lucide-react';
import type { Asset } from '../../types/investments.types';
import { ASSET_CLASS_LABELS, ASSET_CLASS_COLORS, RISK_COLORS } from '../../types/investments.types';

interface AssetListItemProps {
    asset: Asset;
    onClick?: () => void;
}

export function AssetListItem({ asset, onClick }: AssetListItemProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const isPositive = asset.profitability >= 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 p-4 transition-all",
                "active:bg-accent/50 hover:bg-accent/30"
            )}
        >
            {/* Asset Symbol */}
            <div
                className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${ASSET_CLASS_COLORS[asset.assetClass]}15` }}
            >
                <span
                    className="text-sm font-bold"
                    style={{ color: ASSET_CLASS_COLORS[asset.assetClass] }}
                >
                    {asset.ticker || asset.name.substring(0, 2).toUpperCase()}
                </span>
                {asset.isStrategic && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center">
                        <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">{asset.name}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{
                            backgroundColor: `${ASSET_CLASS_COLORS[asset.assetClass]}15`,
                            color: ASSET_CLASS_COLORS[asset.assetClass]
                        }}
                    >
                        {ASSET_CLASS_LABELS[asset.assetClass]}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                    <span>{asset.institution}</span>
                </div>
            </div>

            {/* Value & Performance */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <p className="text-sm font-bold">{formatCurrency(asset.currentValue)}</p>
                <p className={cn(
                    "text-xs flex items-center gap-0.5",
                    isPositive ? "text-green-500" : "text-red-500"
                )}>
                    <TrendIcon className="h-3 w-3" />
                    {isPositive ? '+' : ''}{asset.profitabilityPercentage.toFixed(1)}%
                </p>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </button>
    );
}
