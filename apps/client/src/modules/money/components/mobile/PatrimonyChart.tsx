import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { PatrimonyDataPoint } from '../../types/reports.types';

interface PatrimonyChartProps {
    data: PatrimonyDataPoint[];
    showLayers?: boolean;
}

export function PatrimonyChart({ data, showLayers = false }: PatrimonyChartProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            notation: 'compact',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatMonth = (date: Date) => {
        return date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    };

    // Calculate min/max for scaling
    const netWorths = data.map(d => d.netWorth);
    const minValue = Math.min(...netWorths);
    const maxValue = Math.max(...netWorths);
    const range = maxValue - minValue || 1;

    // First and last values
    const firstValue = data[0]?.netWorth || 0;
    const lastValue = data[data.length - 1]?.netWorth || 0;
    const change = lastValue - firstValue;
    const changePercentage = (change / firstValue) * 100;

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Evolução Patrimonial</h3>
                <span className={cn(
                    "text-xs font-semibold px-2 py-1 rounded-full",
                    change >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}>
                    {change >= 0 ? '+' : ''}{changePercentage.toFixed(1)}%
                </span>
            </div>

            {/* Simple area chart */}
            <div className="relative h-32 mb-2">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className="border-b border-dashed border-muted" />
                    ))}
                </div>

                {/* Chart area */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    {/* Area fill */}
                    <path
                        d={`
              M 0 ${((maxValue - data[0].netWorth) / range) * 100}%
              ${data.map((d, i) => {
                            const x = (i / (data.length - 1)) * 100;
                            const y = ((maxValue - d.netWorth) / range) * 100;
                            return `L ${x}% ${y}%`;
                        }).join(' ')}
              L 100% 100%
              L 0 100%
              Z
            `}
                        fill="url(#gradient)"
                        opacity="0.3"
                    />

                    {/* Line */}
                    <path
                        d={`
              M 0 ${((maxValue - data[0].netWorth) / range) * 100}%
              ${data.map((d, i) => {
                            const x = (i / (data.length - 1)) * 100;
                            const y = ((maxValue - d.netWorth) / range) * 100;
                            return `L ${x}% ${y}%`;
                        }).join(' ')}
            `}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                    />

                    {/* Gradient definition */}
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Event markers */}
                    {data.map((d, i) => d.event && (
                        <g key={d.event.id}>
                            <circle
                                cx={`${(i / (data.length - 1)) * 100}%`}
                                cy={`${((maxValue - d.netWorth) / range) * 100}%`}
                                r="6"
                                fill="hsl(var(--primary))"
                                stroke="white"
                                strokeWidth="2"
                            />
                        </g>
                    ))}
                </svg>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-[10px] text-muted-foreground">
                {data.filter((_, i) => i % 3 === 0 || i === data.length - 1).map((d, i) => (
                    <span key={i}>{formatMonth(d.date)}</span>
                ))}
            </div>

            {/* Y-axis range */}
            <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                <span>{formatCurrency(minValue)}</span>
                <span>{formatCurrency(maxValue)}</span>
            </div>
        </Card>
    );
}
