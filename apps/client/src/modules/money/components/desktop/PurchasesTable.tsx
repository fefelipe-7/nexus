import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { CreditCard, Smartphone, Banknote, AlertCircle, Repeat, TrendingUp, MoreHorizontal, Calendar, Tag } from 'lucide-react';
import type { DayGroup, Purchase, PaymentMethod } from '../../types/purchases.types';
import { PAYMENT_METHOD_LABELS, PURCHASE_TYPE_LABELS } from '../../types/purchases.types';

interface PurchasesTableProps {
    dayGroups: DayGroup[];
    onPurchaseClick?: (purchase: Purchase) => void;
}

const PAYMENT_ICONS: Record<PaymentMethod, React.ReactNode> = {
    credit_card: <CreditCard className="h-4 w-4" />,
    debit_card: <CreditCard className="h-4 w-4" />,
    pix: <Smartphone className="h-4 w-4" />,
    cash: <Banknote className="h-4 w-4" />,
    bank_transfer: <Smartphone className="h-4 w-4" />,
    other: <MoreHorizontal className="h-4 w-4" />,
};

export function PurchasesTable({ dayGroups, onPurchaseClick }: PurchasesTableProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (dayGroups.length === 0) {
        return (
            <Card className="p-12">
                <div className="text-center">
                    <p className="text-muted-foreground">Nenhuma compra encontrada</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Tente ajustar os filtros ou registre uma nova compra
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Lista de Gastos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Descrição</th>
                                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Categoria</th>
                                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Pagamento</th>
                                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Data</th>
                                <th className="text-right p-3 text-xs font-medium text-muted-foreground">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dayGroups.map((group) => (
                                <>
                                    <tr key={group.date.toISOString()} className="border-b bg-muted/30">
                                        <td colSpan={5} className="p-2 px-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                    {group.dateLabel}
                                                </span>
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {formatCurrency(group.totalSpent)}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    {group.purchases.map((purchase) => (
                                        <tr
                                            key={purchase.id}
                                            onClick={() => onPurchaseClick?.(purchase)}
                                            className="border-b hover:bg-accent/50 cursor-pointer transition-colors"
                                        >
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-1 h-8 rounded-full"
                                                        style={{ backgroundColor: purchase.category?.color || '#6b7280' }}
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {purchase.establishment || purchase.description}
                                                        </p>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            {purchase.status.includes('uncategorized') && (
                                                                <span className="text-amber-500" title="Não categorizado">
                                                                    <AlertCircle className="h-3 w-3" />
                                                                </span>
                                                            )}
                                                            {purchase.status.includes('recurring') && (
                                                                <span className="text-blue-500" title="Recorrente">
                                                                    <Repeat className="h-3 w-3" />
                                                                </span>
                                                            )}
                                                            {purchase.status.includes('above_pattern') && (
                                                                <span className="text-red-500" title="Acima do padrão">
                                                                    <TrendingUp className="h-3 w-3" />
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className="text-sm text-muted-foreground">
                                                    {purchase.category?.name || '-'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    {PAYMENT_ICONS[purchase.paymentMethod]}
                                                    <span className="hidden lg:inline">
                                                        {PAYMENT_METHOD_LABELS[purchase.paymentMethod]}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className="text-sm text-muted-foreground">
                                                    {formatTime(purchase.date)}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <span className="text-sm font-semibold">
                                                    {formatCurrency(purchase.amount)}
                                                </span>
                                                {purchase.installments && (
                                                    <span className="text-xs text-muted-foreground ml-1">
                                                        ({purchase.installments.current}/{purchase.installments.total}x)
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
