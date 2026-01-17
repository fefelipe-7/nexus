import { X, Calendar, CreditCard, Percent, Star, AlertTriangle, TrendingDown, Clock, Wallet, Edit2, CheckCircle, Target, FileText } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { Debt, Installment } from '../../types/debts.types';
import { DEBT_TYPE_LABELS, DEBT_TYPE_ICONS } from '../../types/debts.types';

interface DebtDetailSheetProps {
    item: (Debt & { itemType: 'debt' }) | (Installment & { itemType: 'installment' }) | null;
    isOpen: boolean;
    onClose: () => void;
    onTogglePriority?: (item: Debt) => void;
    onSimulatePayoff?: (item: Debt | Installment) => void;
    onEdit?: (item: Debt | Installment) => void;
}

export function DebtDetailSheet({
    item,
    isOpen,
    onClose,
    onTogglePriority,
    onSimulatePayoff,
    onEdit,
}: DebtDetailSheetProps) {
    if (!isOpen || !item) return null;

    const isDebt = item.itemType === 'debt';
    const debt = isDebt ? item as Debt : null;
    const installment = !isDebt ? item as Installment : null;

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

    // Calculate progress
    const originalAmount = isDebt ? debt!.originalAmount : installment!.originalAmount;
    const currentBalance = isDebt ? debt!.currentBalance : installment!.remainingAmount;
    const totalPaid = originalAmount - currentBalance;
    const progressPercentage = (totalPaid / originalAmount) * 100;

    // Monthly and annual impact
    const monthlyPayment = isDebt ? debt!.monthlyPayment : installment!.installmentAmount;
    const remainingPayments = isDebt ? debt!.remainingPayments : (installment!.totalInstallments - installment!.paidInstallments);

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
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl",
                                isDebt ? "bg-muted" : "bg-muted"
                            )} style={installment?.category ? { backgroundColor: `${installment.category.color}15` } : undefined}>
                                {isDebt ? DEBT_TYPE_ICONS[debt!.type] : (
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: installment?.category?.color || '#6b7280' }}
                                    />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-semibold">
                                        {isDebt ? debt!.name : installment!.description}
                                    </h2>
                                    {isDebt && debt!.isPriority && (
                                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {isDebt ? DEBT_TYPE_LABELS[debt!.type] : installment!.establishment}
                                </p>
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
                        {/* Progress */}
                        <div className="p-4 bg-muted/30 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Progresso</span>
                                <span className="text-sm font-semibold">{progressPercentage.toFixed(0)}%</span>
                            </div>
                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                <span>Pago: {formatCurrency(totalPaid)}</span>
                                <span>Restante: {formatCurrency(currentBalance)}</span>
                            </div>
                        </div>

                        {/* Interest Alert (for debts) */}
                        {isDebt && debt!.interestRate && debt!.interestRate > 3 && (
                            <div className={cn(
                                "p-3 rounded-xl border",
                                debt!.interestRate > 5 ? "bg-red-500/10 border-red-500/30" : "bg-amber-500/10 border-amber-500/30"
                            )}>
                                <div className="flex items-center gap-2">
                                    <Percent className={cn("h-4 w-4", debt!.interestRate > 5 ? "text-red-500" : "text-amber-500")} />
                                    <span className={cn("text-sm font-medium", debt!.interestRate > 5 ? "text-red-600" : "text-amber-600")}>
                                        Taxa de {debt!.interestRate}% ao mês
                                    </span>
                                </div>
                                {debt!.interestRate > 5 && (
                                    <p className="text-xs text-red-600 mt-1">
                                        Considere priorizar a quitação desta dívida
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Details */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Wallet className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Valor Original:</span>{' '}
                                    <span className="font-medium">{formatCurrency(originalAmount)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <TrendingDown className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Parcela:</span>{' '}
                                    <span className="font-medium">{formatCurrency(monthlyPayment)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Parcelas Restantes:</span>{' '}
                                    <span className="font-medium">{remainingPayments}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Próximo Vencimento:</span>{' '}
                                    <span className="font-medium">
                                        {formatDate(isDebt ? debt!.nextDueDate : installment!.nextDueDate)}
                                    </span>
                                </div>
                            </div>

                            {isDebt && debt!.creditor && (
                                <div className="flex items-center gap-3 text-sm">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1">
                                        <span className="text-muted-foreground">Credor:</span>{' '}
                                        <span className="font-medium">{debt!.creditor}</span>
                                    </div>
                                </div>
                            )}

                            {!isDebt && installment!.cardLabel && (
                                <div className="flex items-center gap-3 text-sm">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1">
                                        <span className="text-muted-foreground">Cartão:</span>{' '}
                                        <span className="font-medium">{installment!.cardLabel}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Impact */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-muted/50 rounded-xl text-center">
                                <p className="text-xs text-muted-foreground mb-1">Impacto Total Restante</p>
                                <p className="text-lg font-bold">{formatCurrency(currentBalance)}</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-xl text-center">
                                <p className="text-xs text-muted-foreground mb-1">Término Previsto</p>
                                <p className="text-sm font-bold">
                                    {remainingPayments} meses
                                </p>
                            </div>
                        </div>

                        {/* Notes */}
                        {isDebt && debt!.notes && (
                            <div className="p-3 bg-muted/30 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">Observações</p>
                                <p className="text-sm">{debt!.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="border-t p-4 bg-muted/30 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            {isDebt && (
                                <Button
                                    variant={debt!.isPriority ? "default" : "outline"}
                                    onClick={() => onTogglePriority?.(debt!)}
                                    className="flex items-center gap-2"
                                >
                                    <Star className={cn("h-4 w-4", debt!.isPriority && "fill-current")} />
                                    {debt!.isPriority ? 'Prioritária' : 'Priorizar'}
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                onClick={() => onSimulatePayoff?.(item)}
                                className={isDebt ? "" : "col-span-2"}
                            >
                                <Target className="h-4 w-4 mr-2" />
                                Simular Quitação
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => onEdit?.(item)}
                        >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Editar
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
