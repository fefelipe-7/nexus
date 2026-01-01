import { ReactNode } from 'react';
import { useResponsive } from '@/hooks/useResponsive';

interface MobileOptimizedProps {
  children: ReactNode;
  mobileLayout?: boolean;
  className?: string;
}

export function MobileOptimized({ children, mobileLayout = true, className = '' }: MobileOptimizedProps) {
  const { isMobile } = useResponsive();

  if (!mobileLayout) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`${isMobile ? 'mobile-optimized' : ''} ${className}`}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
  className?: string;
}

export function ResponsiveGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  className = '',
}: ResponsiveGridProps) {
  const { isMobile, isTablet } = useResponsive();

  const colCount = isMobile ? columns.mobile : isTablet ? columns.tablet : columns.desktop;
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[colCount || 1];

  const gapClass = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  }[gap] || 'gap-4';

  return (
    <div className={`grid ${gridColsClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
}

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveContainer({ children, className = '' }: ResponsiveContainerProps) {
  const { isMobile } = useResponsive();

  return (
    <div
      className={`
        ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface TouchButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

export function TouchButton({ onClick, children, variant = 'primary', className = '' }: TouchButtonProps) {
  const variantClass = {
    primary: 'bg-blue-500 text-white active:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-900 active:bg-gray-300',
    ghost: 'bg-transparent text-blue-500 active:bg-blue-50',
  }[variant];

  return (
    <button
      onClick={onClick}
      className={`
        min-h-[44px] min-w-[44px]
        px-4 py-2
        rounded-lg
        font-medium
        transition-colors
        active:scale-95
        ${variantClass}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
