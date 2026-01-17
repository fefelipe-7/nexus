import { cn } from '@nexus/shared';
import { ChevronRight, CreditCard, Calendar } from 'lucide-react';
import type { Installment } from '../../types/debts.types';

interface InstallmentListItemProps {
    installment: Installment;
    onClick?: () => void;
}

export function InstallmentListItem({ installment, onClick }: InstallmentListItemProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const daysUntilDue = Math.ceil(
        (installment.nextDueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    const isDueSoon = daysUntilDue <= 5 && daysUntilDue >= 0;
    const progressPercentage = (installment.paidInstallments / installment.totalInstallments) * 100;
    const remainingInstallments = installment.totalInstallments - installment.paidInstallments;

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 p-4 transition-all",
                "active:bg-accent/50 hover:bg-accent/30"
            )}
        >
            {/* Category Color */}
            <div
                className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${installment.category?.color || '#6b7280'}15` }}
            >
                <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: installment.category?.color || '#6b7280' }}
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold truncate">{installment.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    {installment.establishment && (
                        <>
                            <span>{installment.establishment}</span>
                            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                        </>
                    )}
                    <span className="flex items-center gap-0.5">
                        <CreditCard className="h-3 w-3" />
                        {installment.cardLabel?.split(' ')[0]}
                    </span>
                </div>
                {/* Progress Bar */}
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <span className="text-xs font-semibold text-primary">
                        {installment.paidInstallments}/{installment.totalInstallments}
                    </span>
                </div>
            </div>

            {/* Amount & Date */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <p className="text-sm font-bold">
                    {formatCurrency(installment.installmentAmount)}
                </p>
                <p className={cn(
                    "text-xs flex items-center gap-1",
                    isDueSoon ? "text-amber-500" : "text-muted-foreground"
                )}>
                    <Calendar className="h-3 w-3" />
                    +{remainingInstallments}x
                </p>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </button>
    );
}
