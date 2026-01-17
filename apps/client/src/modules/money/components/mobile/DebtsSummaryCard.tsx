import { useState } from 'react';
import { Card } from '@/ui/components/components/ui';
import { ChevronDown, Wallet, Calendar, AlertTriangle, CreditCard, TrendingDown } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { DebtsSummary } from '../../types/debts.types';

interface DebtsSummaryCardProps {
    summary: DebtsSummary;
}

export function DebtsSummaryCard({ summary }: DebtsSummaryCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatDate = (date: Date | null) => {
        if (!date) return 'Indefinido';
        return date.toLocaleDateString('pt-BR', {
            month: 'short',
            year: 'numeric',
        });
    };

    const hasCritical = summary.criticalDebtsCount > 0 || summary.overdueAmount > 0;

    return (
        <Card className="overflow-hidden">
            {/* Main Summary */}
            <div className="p-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                {/* Total Comprometido */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Total Comprometido
                        </p>
                        <p className="text-3xl font-bold tracking-tight mt-1">
                            {formatCurrency(summary.totalCommitted)}
                        </p>
                    </div>
                    {hasCritical && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-red-500/10 text-red-500">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span className="text-xs font-semibold">
                                {summary.criticalDebtsCount} crítico{summary.criticalDebtsCount !== 1 ? 's' : ''}
                            </span>
                        </div>
                    )}
                </div>

                {/* Monthly Commitment */}
                <div className="p-3 bg-muted/50 rounded-xl mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Compromisso Mensal</span>
                        </div>
                        <span className="text-lg font-bold">{formatCurrency(summary.monthlyCommitment)}</span>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
                        <Wallet className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-bold">{summary.activeDebtsCount}</p>
                        <p className="text-[10px] text-muted-foreground">Dívidas</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
                        <CreditCard className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-bold">{summary.activeInstallmentsCount}</p>
                        <p className="text-[10px] text-muted-foreground">Parcelamentos</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 text-center">
                        <Calendar className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <p className="text-sm font-bold">{formatDate(summary.liberationDate)}</p>
                        <p className="text-[10px] text-muted-foreground">Liberação</p>
                    </div>
                </div>
            </div>

            {/* Overdue Alert */}
            {summary.overdueAmount > 0 && (
                <div className="px-4 py-3 bg-red-500/10 border-t border-red-500/20">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600 font-medium">
                            {formatCurrency(summary.overdueAmount)} em atraso
                        </span>
                    </div>
                </div>
            )}
        </Card>
    );
}
