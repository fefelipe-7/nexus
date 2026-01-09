import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { TimelineDay } from '../../types/cashflow.types';

interface TimelineCardProps {
  timeline: TimelineDay[];
}

export function TimelineCard({ timeline }: TimelineCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    }).format(date);
  };

  const getBarHeight = (day: TimelineDay) => {
    const maxValue = Math.max(...timeline.map(d => Math.max(d.income, d.expenses)));
    const value = Math.max(day.income, day.expenses);
    return (value / maxValue) * 100;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Linha do Tempo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between gap-1 h-32">
          {timeline.map((day, index) => {
            const height = getBarHeight(day);
            const isIncome = day.income > day.expenses;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center justify-end h-24">
                  {day.income > 0 && (
                    <div
                      className="w-full bg-green-500/30 border-t-2 border-green-500 rounded-t"
                      style={{ height: `${(day.income / Math.max(...timeline.map(d => Math.max(d.income, d.expenses)))) * 100}%` }}
                    />
                  )}
                  {day.expenses > 0 && (
                    <div
                      className="w-full bg-red-500/30 border-t-2 border-red-500 rounded-t"
                      style={{ height: `${(day.expenses / Math.max(...timeline.map(d => Math.max(d.income, d.expenses)))) * 100}%` }}
                    />
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {formatDate(day.date)}
                </span>
                {day.isPeak && (
                  <div className="w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500/30 border-t-2 border-green-500 rounded" />
            <span className="text-muted-foreground">Entradas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500/30 border-t-2 border-red-500 rounded" />
            <span className="text-muted-foreground">Saídas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
