import { X, Calendar, Building, TrendingUp, TrendingDown, Star, Shield, Wallet, Clock, Target, Edit2, Link, Trash2 } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { Asset, InvestmentGoal } from '../../types/investments.types';
import { ASSET_CLASS_LABELS, ASSET_CLASS_COLORS, RISK_LABELS, RISK_COLORS, LIQUIDITY_LABELS } from '../../types/investments.types';

interface AssetDetailSheetProps {
    asset: Asset | null;
    linkedGoal?: InvestmentGoal | null;
    isOpen: boolean;
    onClose: () => void;
    onToggleStrategic?: (asset: Asset) => void;
    onLinkToGoal?: (asset: Asset) => void;
    onSimulateWithdraw?: (asset: Asset) => void;
    onEdit?: (asset: Asset) => void;
}

export function AssetDetailSheet({
    asset,
    linkedGoal,
    isOpen,
    onClose,
    onToggleStrategic,
    onLinkToGoal,
    onSimulateWithdraw,
    onEdit,
}: AssetDetailSheetProps) {
    if (!isOpen || !asset) return null;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const isPositive = asset.profitability >= 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
                <div className="bg-background rounded-t-2xl border-t shadow-xl max-h-[90vh] flex flex-col">
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="flex items-start justify-between px-4 pb-4 border-b">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                style={{ backgroundColor: `${ASSET_CLASS_COLORS[asset.assetClass]}15` }}
                            >
                                <span
                                    className="text-lg font-bold"
                                    style={{ color: ASSET_CLASS_COLORS[asset.assetClass] }}
                                >
                                    {asset.ticker || asset.name.substring(0, 3).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-semibold">{asset.name}</h2>
                                    {asset.isStrategic && (
                                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">{asset.institution}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Value & Performance */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-muted/30 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">Valor Atual</p>
                                <p className="text-xl font-bold">{formatCurrency(asset.currentValue)}</p>
                            </div>
                            <div className={cn(
                                "p-4 rounded-xl",
                                isPositive ? "bg-green-500/10" : "bg-red-500/10"
                            )}>
                                <p className="text-xs text-muted-foreground mb-1">Rentabilidade</p>
                                <p className={cn("text-xl font-bold flex items-center gap-1", isPositive ? "text-green-500" : "text-red-500")}>
                                    <TrendIcon className="h-5 w-5" />
                                    {isPositive ? '+' : ''}{asset.profitabilityPercentage.toFixed(1)}%
                                </p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Wallet className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Valor Investido:</span>{' '}
                                    <span className="font-medium">{formatCurrency(asset.investedAmount)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Lucro/Prejuízo:</span>{' '}
                                    <span className={cn("font-medium", isPositive ? "text-green-500" : "text-red-500")}>
                                        {isPositive ? '+' : ''}{formatCurrency(asset.profitability)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <div
                                    className="w-4 h-4 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: ASSET_CLASS_COLORS[asset.assetClass] }}
                                />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Classe:</span>{' '}
                                    <span className="font-medium">{ASSET_CLASS_LABELS[asset.assetClass]}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <Shield
                                    className="h-4 w-4"
                                    style={{ color: RISK_COLORS[asset.riskLevel] }}
                                />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Risco:</span>{' '}
                                    <span className="font-medium" style={{ color: RISK_COLORS[asset.riskLevel] }}>
                                        {RISK_LABELS[asset.riskLevel]}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Liquidez:</span>{' '}
                                    <span className="font-medium">{LIQUIDITY_LABELS[asset.liquidity]}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Aplicação:</span>{' '}
                                    <span className="font-medium">{formatDate(asset.applicationDate)}</span>
                                </div>
                            </div>

                            {asset.maturityDate && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1">
                                        <span className="text-muted-foreground">Vencimento:</span>{' '}
                                        <span className="font-medium">{formatDate(asset.maturityDate)}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Linked Goal */}
                        {linkedGoal && (
                            <div className="p-3 bg-muted/30 rounded-xl">
                                <div className="flex items-center gap-2 mb-1">
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-xs font-medium text-muted-foreground">Vinculado à meta</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{linkedGoal.icon}</span>
                                    <span className="font-medium">{linkedGoal.name}</span>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {asset.notes && (
                            <div className="p-3 bg-muted/30 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">Observações</p>
                                <p className="text-sm">{asset.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="border-t p-4 bg-muted/30 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant={asset.isStrategic ? "default" : "outline"}
                                onClick={() => onToggleStrategic?.(asset)}
                                className="flex items-center gap-2"
                            >
                                <Star className={cn("h-4 w-4", asset.isStrategic && "fill-current")} />
                                {asset.isStrategic ? 'Estratégico' : 'Marcar'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onLinkToGoal?.(asset)}
                            >
                                <Link className="h-4 w-4 mr-2" />
                                Vincular Meta
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                onClick={() => onSimulateWithdraw?.(asset)}
                            >
                                <Target className="h-4 w-4 mr-2" />
                                Simular Resgate
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onEdit?.(asset)}
                            >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
