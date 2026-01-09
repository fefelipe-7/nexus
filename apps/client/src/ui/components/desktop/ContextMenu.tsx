import { ReactNode, useState, useRef, useEffect, MouseEvent } from 'react';
import { cn } from '@nexus/shared';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface ContextMenuProps {
  children: ReactNode;
  items: ContextMenuItem[];
}

export function ContextMenu({ children, items }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      
      let x = position.x;
      let y = position.y;

      if (x + rect.width > window.innerWidth) {
        x = window.innerWidth - rect.width - 10;
      }

      if (y + rect.height > window.innerHeight) {
        y = window.innerHeight - rect.height - 10;
      }

      setPosition({ x, y });
    }
  }, [isOpen]);

  return (
    <div onContextMenu={handleContextMenu}>
      {children}

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-50 min-w-[200px] bg-card border rounded-lg shadow-lg py-1 animate-in fade-in-0 zoom-in-95 duration-100"
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
          {items.map((item) => {
            if (item.divider) {
              return <div key={item.id} className="my-1 border-t" />;
            }

            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    setIsOpen(false);
                  }
                }}
                disabled={item.disabled}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors text-left',
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-accent cursor-pointer',
                  item.danger && !item.disabled && 'text-red-600 hover:bg-red-50'
                )}
              >
                {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
