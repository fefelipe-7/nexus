import { Calendar } from 'lucide-react';
import { ChartContainer, BarChart } from '@/ui/components/charts';
import { formatDate, formatCurrency } from '@/utils/data';
import type { TimelineDay } from '../../types/cashflow.types';

interface TimelineChartProps {
  timeline: TimelineDay[];
}

export function TimelineChart({ timeline }: TimelineChartProps) {
  const chartData = timeline.flatMap((day) => [
    {
      label: formatDate(day.date, 'short'),
      value: day.income,
      color: '#10b981',
      metadata: { type: 'income', date: day.date, isPeak: day.isPeak },
    },
    {
      label: formatDate(day.date, 'short'),
      value: day.expenses,
      color: '#ef4444',
      metadata: { type: 'expense', date: day.date, isPeak: day.isPeak },
    },
  ]);

  return (
    <ChartContainer
      title="Linha do Tempo Financeira"
      icon={<Calendar className="h-5 w-5" />}
      size="lg"
      className="col-span-2"
    >
      <BarChart
        data={chartData}
        orientation="vertical"
        showGrid
        animated
        formatValue={(v) => formatCurrency(v)}
      />
    </ChartContainer>
  );
}
