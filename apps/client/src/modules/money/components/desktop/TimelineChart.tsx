import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { TimelineDay } from '../../types/cashflow.types';

interface TimelineChartProps {
  timeline: TimelineDay[];
}

export function TimelineChart({ timeline }: TimelineChartProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    }).format(date);
  };

  const maxValue = Math.max(...timeline.map(d => Math.max(d.income, d.expenses)));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Linha do Tempo Financeira
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-2 h-48 px-2">
            {timeline.map((day, index) => {
              const incomeHeight = (day.income / maxValue) * 100;
              const expenseHeight = (day.expenses / maxValue) * 100;
              
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-full flex flex-col items-center justify-end h-40 relative">
                    {day.income > 0 && (
                      <div
                        className="w-full bg-green-500/20 border-t-2 border-green-500 rounded-t hover:bg-green-500/30 transition-colors"
                        style={{ height: `${incomeHeight}%` }}
                      />
                    )}
                    {day.expenses > 0 && (
                      <div
                        className="w-full bg-red-500/20 border-t-2 border-red-500 rounded-t hover:bg-red-500/30 transition-colors"
                        style={{ height: `${expenseHeight}%` }}
                      />
                    )}
                    {day.isPeak && (
                      <div className="absolute -top-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground block">
                      {formatDate(day.date)}
                    </span>
                    {day.isPeak && (
                      <span className="text-[10px] text-primary font-medium">Pico</span>
                    )}
                  </div>

                  {day.events && day.events.length > 0 && (
                    <div className="hidden group-hover:block absolute z-10 bottom-full mb-2 p-3 bg-card border rounded-lg shadow-lg min-w-[200px]">
                      <p className="text-xs font-semibold mb-2">{formatDate(day.date)}</p>
                      <div className="space-y-1">
                        {day.events.map((event, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="truncate">{event.description}</span>
                            <span className={cn(
                              'font-medium ml-2',
                              event.type === 'income' ? 'text-green-600' : 'text-red-600'
                            )}>
                              R$ {event.amount.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 text-sm pt-4 border-t">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div className="w-8 h-3 bg-green-500/20 border-t-2 border-green-500 rounded" />
              <span className="text-muted-foreground">Entradas</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <div className="w-8 h-3 bg-red-500/20 border-t-2 border-red-500 rounded" />
              <span className="text-muted-foreground">Saídas</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
