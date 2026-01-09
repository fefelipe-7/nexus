import { Card, CardContent } from '@/ui/components/components/ui';
import { ChevronRight, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@nexus/shared';
import { formatCurrency, formatDate } from '@/utils/data';
import { ProgressBar } from '@/ui/components/charts';
import type { Card as CardType } from '../../types/cards.types';

interface CardListItemProps {
  card: CardType;
  onClick?: () => void;
}

export function CardListItem({ card, onClick }: CardListItemProps) {
  const usagePercentage = (card.usedLimit / card.limit) * 100;

  const getStatusColor = () => {
    switch (card.status) {
      case 'normal': return 'border-green-500';
      case 'attention': return 'border-amber-500';
      case 'critical': return 'border-red-500';
    }
  };

  return (
    <Card
      className={cn(
        'cursor-pointer active:scale-98 transition-all border-l-4',
        getStatusColor()
      )}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-foreground">{card.name}</p>
              {card.status === 'critical' && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {card.institution} •••• {card.lastDigits}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs text-muted-foreground">Fatura Atual</span>
              <span className="text-xl font-bold">{formatCurrency(card.currentInvoice)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Vencimento</span>
              <span className="font-medium">{formatDate(card.dueDate, 'short')}</span>
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
              <span>{formatCurrency(card.usedLimit)} usado</span>
              <span>{usagePercentage.toFixed(0)}% do limite</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
