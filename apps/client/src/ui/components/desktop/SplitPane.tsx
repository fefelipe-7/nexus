import { ReactNode, useState, useRef, MouseEvent } from 'react';
import { cn } from '@nexus/shared';

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

export function SplitPane({
  left,
  right,
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
  className,
}: SplitPaneProps) {
  const [leftWidth, setLeftWidth] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    const clampedWidth = Math.max(minSize, Math.min(maxSize, newLeftWidth));
    setLeftWidth(clampedWidth);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn('flex h-full relative', className)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="overflow-auto"
        style={{ width: `${leftWidth}%` }}
      >
        {left}
      </div>

      <div
        className={cn(
          'w-1 bg-border hover:bg-primary cursor-col-resize transition-colors relative',
          isDragging && 'bg-primary'
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1" />
      </div>

      <div
        className="flex-1 overflow-auto"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {right}
      </div>
    </div>
  );
}
