import { Plus } from 'lucide-react';
import { cn } from '@nexus/shared';

interface FABProps {
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  className?: string;
}

export function FAB({ onClick, icon: Icon = Plus, label, className }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-20 right-4 z-40',
        'flex items-center gap-2 px-4 h-14 rounded-full',
        'bg-primary text-primary-foreground shadow-lg',
        'hover:shadow-xl active:scale-95 transition-all duration-200',
        'font-medium',
        className
      )}
      aria-label={label || 'Ação rápida'}
    >
      <Icon className="h-5 w-5" />
      {label && <span className="text-sm">{label}</span>}
    </button>
  );
}
