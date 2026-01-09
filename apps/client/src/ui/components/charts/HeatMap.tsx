import { useMemo } from 'react';
import { cn } from '@nexus/shared';
import { max, min, normalize } from '@/utils/data';

export interface HeatMapCell {
  x: number;
  y: number;
  value: number;
  label?: string;
}

interface HeatMapProps {
  data: HeatMapCell[];
  width?: number;
  height?: number;
  cellSize?: number;
  gap?: number;
  colorScale?: [string, string]; // [minColor, maxColor]
  showValues?: boolean;
  onCellClick?: (cell: HeatMapCell) => void;
  formatValue?: (value: number) => string;
  className?: string;
}

export function HeatMap({
  data,
  width = 400,
  height = 200,
  cellSize = 20,
  gap = 2,
  colorScale = ['#dbeafe', '#1e40af'],
  showValues = false,
  onCellClick,
  formatValue = (v) => v.toString(),
  className,
}: HeatMapProps) {
  const { minValue, maxValue } = useMemo(() => ({
    minValue: min(data.map(d => d.value)),
    maxValue: max(data.map(d => d.value)),
  }), [data]);

  const interpolateColor = (value: number): string => {
    const normalized = normalize(value, minValue, maxValue);
    
    // Simple RGB interpolation
    const parseColor = (color: string) => {
      const hex = color.replace('#', '');
      return {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16),
      };
    };

    const min = parseColor(colorScale[0]);
    const max = parseColor(colorScale[1]);

    const r = Math.round(min.r + (max.r - min.r) * normalized);
    const g = Math.round(min.g + (max.g - min.g) * normalized);
    const b = Math.round(min.b + (max.b - min.b) * normalized);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const maxX = useMemo(() => max(data.map(d => d.x)), [data]);
  const maxY = useMemo(() => max(data.map(d => d.y)), [data]);

  return (
    <div className={cn('relative', className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${(maxX + 1) * (cellSize + gap)} ${(maxY + 1) * (cellSize + gap)}`}
      >
        {data.map((cell, index) => {
          const x = cell.x * (cellSize + gap);
          const y = cell.y * (cellSize + gap);
          const color = interpolateColor(cell.value);

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill={color}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onCellClick?.(cell)}
                rx="2"
              />
              {showValues && (
                <text
                  x={x + cellSize / 2}
                  y={y + cellSize / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium fill-foreground pointer-events-none"
                >
                  {formatValue(cell.value)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
