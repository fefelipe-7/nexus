import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { ChartSize } from '../types';

interface ChartContainerProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  size?: ChartSize;
  className?: string;
  actions?: ReactNode;
}

const sizeClasses: Record<ChartSize, string> = {
  sm: 'h-32',
  md: 'h-48',
  lg: 'h-64',
  xl: 'h-96',
};

export function ChartContainer({
  title,
  description,
  icon,
  children,
  size = 'md',
  className,
  actions,
}: ChartContainerProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      {(title || actions) && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            {title && (
              <div className="flex items-center gap-2">
                {icon}
                <div>
                  <CardTitle className="text-base">{title}</CardTitle>
                  {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                  )}
                </div>
              </div>
            )}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn('p-4', !title && 'pt-6')}>
        <div className={cn(sizeClasses[size], 'w-full')}>{children}</div>
      </CardContent>
    </Card>
  );
}
