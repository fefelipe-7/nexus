import { PieChart } from './PieChart';
import type { ChartDataPoint } from './types';

interface DonutChartProps {
  data: ChartDataPoint[];
  size?: number;
  showLabels?: boolean;
  showValues?: boolean;
  showLegend?: boolean;
  animated?: boolean;
  onSliceClick?: (item: ChartDataPoint, index: number) => void;
  formatValue?: (value: number) => string;
  colors?: string[];
  className?: string;
  centerContent?: React.ReactNode;
}

export function DonutChart({
  centerContent,
  size = 200,
  ...props
}: DonutChartProps) {
  const innerRadius = size * 0.35;

  return (
    <div className="relative">
      <PieChart {...props} size={size} innerRadius={innerRadius} />
      {centerContent && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          style={{ width: innerRadius * 2, height: innerRadius * 2 }}
        >
          {centerContent}
        </div>
      )}
    </div>
  );
}
