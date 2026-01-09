import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@nexus/shared';
import { formatDate } from '@/utils/data';

export interface DateRange {
  start: Date;
  end: Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  presets?: Array<{ label: string; range: DateRange }>;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  presets = [
    {
      label: 'Hoje',
      range: {
        start: new Date(),
        end: new Date(),
      },
    },
    {
      label: 'Esta Semana',
      range: {
        start: new Date(new Date().setDate(new Date().getDate() - 7)),
        end: new Date(),
      },
    },
    {
      label: 'Este Mês',
      range: {
        start: new Date(new Date().setDate(1)),
        end: new Date(),
      },
    },
    {
      label: 'Últimos 30 dias',
      range: {
        start: new Date(new Date().setDate(new Date().getDate() - 30)),
        end: new Date(),
      },
    },
  ],
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatRange = (range: DateRange): string => {
    return `${formatDate(range.start, 'short')} - ${formatDate(range.end, 'short')}`;
  };

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-accent transition-colors"
      >
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{formatRange(value)}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 z-50 w-64 p-3 bg-card border rounded-lg shadow-lg">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Períodos Rápidos
              </p>
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onChange(preset.range);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
