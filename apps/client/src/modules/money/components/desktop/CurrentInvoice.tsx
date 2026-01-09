import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Receipt, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/data';
import type { InvoiceItem } from '../../types/cards.types';

interface CurrentInvoiceProps {
  items: InvoiceItem[];
}

export function CurrentInvoice({ items }: CurrentInvoiceProps) {
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const installmentsCount = items.filter(item => item.installment).length;

  const categoryTotals = items.reduce((acc, item) => {
    if (item.category) {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Fatura Atual
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total da Fatura</span>
            <span className="text-3xl font-bold">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{items.length} transações</span>
            <span>{installmentsCount} parceladas</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Principais Categorias</h4>
          <div className="space-y-2">
            {topCategories.map(([category, amount]) => {
              const percentage = (amount / totalAmount) * 100;
              return (
                <div key={category} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</span>
                    <span className="font-semibold">{formatCurrency(amount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t">
          <h4 className="text-sm font-semibold mb-3">Transações Recentes</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {items.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-start justify-between text-sm py-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(item.date, 'short')}</span>
                    {item.installment && (
                      <>
                        <span>•</span>
                        <span>{item.installment.current}/{item.installment.total}x</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="font-semibold ml-3">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
