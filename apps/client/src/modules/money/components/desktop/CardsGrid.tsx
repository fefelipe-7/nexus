import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { CreditCard, AlertCircle, Calendar } from 'lucide-react';
import { cn } from '@nexus/shared';
import { formatCurrency, formatDate } from '@/utils/data';
import { ProgressBar } from '@/ui/components/charts';
import type { Card as CardType } from '../../types/cards.types';

interface CardsGridProps {
  cards: CardType[];
}

export function CardsGrid({ cards }: CardsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const usagePercentage = (card.usedLimit / card.limit) * 100;

        const getStatusBorder = () => {
          switch (card.status) {
            case 'normal': return 'border-green-500';
            case 'attention': return 'border-amber-500';
            case 'critical': return 'border-red-500';
          }
        };

        return (
          <Card
            key={card.id}
            className={cn(
              'cursor-pointer transition-all duration-300',
              'hover:-translate-y-1 hover:shadow-lg',
              'border-l-4',
              getStatusBorder()
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {card.name}
                    {card.status === 'critical' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.institution} •••• {card.lastDigits}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Fatura Atual</span>
                  <span className="text-2xl font-bold">{formatCurrency(card.currentInvoice)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Vence em {formatDate(card.dueDate, 'short')}</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Limite Disponível</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(card.availableLimit)}
                  </span>
                </div>
                <ProgressBar
                  value={usagePercentage}
                  max={100}
                  size="sm"
                  color={card.status === 'critical' ? 'red' : card.status === 'attention' ? 'amber' : 'blue'}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatCurrency(card.usedLimit)} em uso</span>
                  <span>{usagePercentage.toFixed(0)}%</span>
                </div>
              </div>

              {card.minimumPayment && (
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Pagamento Mínimo</span>
                    <span className="font-medium">{formatCurrency(card.minimumPayment)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
