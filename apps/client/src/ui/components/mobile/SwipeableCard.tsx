import { ReactNode, useState, useRef, TouchEvent } from 'react';
import { cn } from '@nexus/shared';
import { Trash2, Archive, Check } from 'lucide-react';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: {
    icon?: React.ComponentType<{ className?: string }>;
    label?: string;
    color?: string;
  };
  rightAction?: {
    icon?: React.ComponentType<{ className?: string }>;
    label?: string;
    color?: string;
  };
  className?: string;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction = { icon: Trash2, label: 'Excluir', color: 'bg-red-500' },
  rightAction = { icon: Check, label: 'Concluir', color: 'bg-green-500' },
  className,
}: SwipeableCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const SWIPE_THRESHOLD = 100;
  const MAX_SWIPE = 150;

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping) return;
    
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    const clampedDiff = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, diff));
    setTranslateX(clampedDiff);
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);

    if (translateX < -SWIPE_THRESHOLD && onSwipeLeft) {
      onSwipeLeft();
    } else if (translateX > SWIPE_THRESHOLD && onSwipeRight) {
      onSwipeRight();
    }

    setTranslateX(0);
  };

  const LeftIcon = leftAction.icon || Trash2;
  const RightIcon = rightAction.icon || Check;

  return (
    <div className="relative overflow-hidden">
      {translateX < 0 && (
        <div className={cn(
          'absolute inset-y-0 right-0 flex items-center justify-center px-6',
          leftAction.color || 'bg-red-500',
          'text-white'
        )}>
          <div className="flex flex-col items-center gap-1">
            <LeftIcon className="h-5 w-5" />
            {leftAction.label && (
              <span className="text-xs font-medium">{leftAction.label}</span>
            )}
          </div>
        </div>
      )}

      {translateX > 0 && (
        <div className={cn(
          'absolute inset-y-0 left-0 flex items-center justify-center px-6',
          rightAction.color || 'bg-green-500',
          'text-white'
        )}>
          <div className="flex flex-col items-center gap-1">
            <RightIcon className="h-5 w-5" />
            {rightAction.label && (
              <span className="text-xs font-medium">{rightAction.label}</span>
            )}
          </div>
        </div>
      )}

      <div
        className={cn(
          'transition-transform duration-200 bg-card',
          isSwiping ? 'transition-none' : '',
          className
        )}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
