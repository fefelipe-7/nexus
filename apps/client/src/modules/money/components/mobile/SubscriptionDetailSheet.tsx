import { X, Calendar, CreditCard, Tag, Star, AlertTriangle, TrendingUp, Edit2, Trash2, Pause, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { Subscription } from '../../types/subscriptions.types';
import { FREQUENCY_LABELS, RISK_LABELS } from '../../types/subscriptions.types';

interface SubscriptionDetailSheetProps {
    subscription: Subscription | null;
    isOpen: boolean;
    onClose: () => void;
    onToggleEssential?: (subscription: Subscription) => void;
    onPause?: (subscription: Subscription) => void;
    onCancel?: (subscription: Subscription) => void;
    onEdit?: (subscription: Subscription) => void;
}

export function SubscriptionDetailSheet({
    subscription,
    isOpen,
    onClose,
    onToggleEssential,
    onPause,
    onCancel,
    onEdit,
}: SubscriptionDetailSheetProps) {
    if (!isOpen || !subscription) return null;

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

    // Monthly and annual impact
    const monthlyImpact = subscription.frequency === 'annual'
        ? subscription.amount / 12
        : subscription.amount;
    const annualImpact = subscription.frequency === 'annual'
        ? subscription.amount
        : subscription.amount * 12;

    const hasRisks = subscription.risks.length > 0;

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
                                style={{ backgroundColor: `${subscription.category.color}15` }}
                            >
                                <span
                                    className="text-2xl font-bold"
                                    style={{ color: subscription.category.color }}
                                >
                                    {subscription.name.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-semibold">{subscription.name}</h2>
                                    {subscription.isEssential && (
                                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                    )}
                                </div>
                                {subscription.description && (
                                    <p className="text-sm text-muted-foreground">{subscription.description}</p>
                                )}
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
                        {/* Valor */}
                        <div className="p-4 bg-muted/30 rounded-xl text-center">
                            <p className="text-3xl font-bold">{formatCurrency(subscription.amount)}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {FREQUENCY_LABELS[subscription.frequency]}
                            </p>
                        </div>

                        {/* Risks Alert */}
                        {hasRisks && (
                            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    <span className="text-sm font-medium text-amber-700">Atenção</span>
                                </div>
                                <ul className="space-y-1">
                                    {subscription.risks.map((risk) => (
                                        <li key={risk} className="text-xs text-amber-600 flex items-center gap-1">
                                            • {RISK_LABELS[risk]}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Details */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Próxima cobrança:</span>{' '}
                                    <span className="font-medium">{formatDate(subscription.nextBillingDate)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Pagamento:</span>{' '}
                                    <span className="font-medium">{subscription.paymentMethod.label}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Categoria:</span>{' '}
                                    <span
                                        className="font-medium px-2 py-0.5 rounded"
                                        style={{
                                            backgroundColor: `${subscription.category.color}15`,
                                            color: subscription.category.color
                                        }}
                                    >
                                        {subscription.category.name}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Assinante desde:</span>{' '}
                                    <span className="font-medium">{formatDate(subscription.startDate)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Impact */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-muted/50 rounded-xl text-center">
                                <p className="text-xs text-muted-foreground mb-1">Impacto Mensal</p>
                                <p className="text-lg font-bold">{formatCurrency(monthlyImpact)}</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-xl text-center">
                                <p className="text-xs text-muted-foreground mb-1">Impacto Anual</p>
                                <p className="text-lg font-bold">{formatCurrency(annualImpact)}</p>
                            </div>
                        </div>

                        {/* Notes */}
                        {subscription.notes && (
                            <div className="p-3 bg-muted/30 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">Observações</p>
                                <p className="text-sm">{subscription.notes}</p>
                            </div>
                        )}

                        {/* Price History */}
                        {subscription.priceHistory && subscription.priceHistory.length > 1 && (
                            <div className="p-3 bg-muted/30 rounded-xl">
                                <div className="flex items-center gap-1 mb-2">
                                    <TrendingUp className="h-4 w-4 text-orange-500" />
                                    <p className="text-xs font-medium text-orange-600">Histórico de Preços</p>
                                </div>
                                <div className="space-y-1">
                                    {subscription.priceHistory.map((entry, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">
                                                {formatDate(entry.date)}
                                            </span>
                                            <span className="font-medium">{formatCurrency(entry.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="border-t p-4 bg-muted/30 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant={subscription.isEssential ? "default" : "outline"}
                                onClick={() => onToggleEssential?.(subscription)}
                                className="flex items-center gap-2"
                            >
                                <Star className={cn("h-4 w-4", subscription.isEssential && "fill-current")} />
                                {subscription.isEssential ? 'Essencial' : 'Marcar Essencial'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onEdit?.(subscription)}
                            >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                onClick={() => onPause?.(subscription)}
                            >
                                <Pause className="h-4 w-4 mr-2" />
                                Pausar
                            </Button>
                            <Button
                                variant="outline"
                                className="text-destructive hover:text-destructive"
                                onClick={() => onCancel?.(subscription)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
