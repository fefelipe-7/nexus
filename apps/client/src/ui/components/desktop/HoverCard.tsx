import { ReactNode, useState } from 'react';
import { cn } from '@nexus/shared';

interface HoverCardProps {
  trigger: ReactNode;
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function HoverCard({ 
  trigger, 
  content, 
  side = 'top',
  align = 'center',
  className 
}: HoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getPositionClasses = () => {
    const positions = {
      top: 'bottom-full mb-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2',
      right: 'left-full ml-2',
    };

    const alignments = {
      start: side === 'top' || side === 'bottom' ? 'left-0' : 'top-0',
      center: side === 'top' || side === 'bottom' ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2',
      end: side === 'top' || side === 'bottom' ? 'right-0' : 'bottom-0',
    };

    return `${positions[side]} ${alignments[align]}`;
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {trigger}
      
      {isOpen && (
        <div 
          className={cn(
            'absolute z-50 w-64 p-4 bg-card border rounded-lg shadow-lg',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            getPositionClasses(),
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
