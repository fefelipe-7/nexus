import { cn } from '@nexus/shared';
import { ChevronRight, AlertTriangle, Star, Percent, Calendar } from 'lucide-react';
import type { Debt } from '../../types/debts.types';
import { DEBT_TYPE_LABELS, DEBT_TYPE_ICONS } from '../../types/debts.types';

interface DebtListItemProps {
    debt: Debt;
    onClick?: () => void;
}

export function DebtListItem({ debt, onClick }: DebtListItemProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const daysUntilDue = Math.ceil(
        (debt.nextDueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    const isHighInterest = debt.interestRate && debt.interestRate > 5;
    const isOverdue = debt.status === 'overdue' || daysUntilDue < 0;
    const isDueSoon = daysUntilDue <= 5 && daysUntilDue >= 0;

    // Progress percentage
    const progressPercentage = ((debt.originalAmount - debt.currentBalance) / debt.originalAmount) * 100;

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 p-4 transition-all",
                "active:bg-accent/50 hover:bg-accent/30",
                isOverdue && "bg-red-500/5"
            )}
        >
            {/* Icon */}
            <div className={cn(
                "relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl",
                isOverdue ? "bg-red-500/10" : isHighInterest ? "bg-amber-500/10" : "bg-muted"
            )}>
                {DEBT_TYPE_ICONS[debt.type]}
                {debt.isPriority && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center">
                        <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">{debt.name}</p>
                    {isOverdue && <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
                    {isHighInterest && !isOverdue && <Percent className="h-3 w-3 text-amber-500" />}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <span>{DEBT_TYPE_LABELS[debt.type]}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                    <span>{debt.remainingPayments} parcelas restantes</span>
                </div>
                {/* Progress Bar */}
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all",
                            isOverdue ? "bg-red-500" : "bg-primary"
                        )}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Amount & Date */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <p className="text-sm font-bold">
                    {formatCurrency(debt.monthlyPayment)}
                    <span className="text-xs text-muted-foreground font-normal">/mês</span>
                </p>
                <p className={cn(
                    "text-xs flex items-center gap-1",
                    isOverdue ? "text-red-500" : isDueSoon ? "text-amber-500" : "text-muted-foreground"
                )}>
                    <Calendar className="h-3 w-3" />
                    {isOverdue ? 'Atrasado' : daysUntilDue === 0 ? 'Hoje' : daysUntilDue === 1 ? 'Amanhã' : `${daysUntilDue}d`}
                </p>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </button>
    );
}
