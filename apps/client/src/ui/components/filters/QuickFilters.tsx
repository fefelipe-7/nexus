import { cn } from '@nexus/shared';

export interface QuickFilter {
  id: string;
  label: string;
  value: any;
}

interface QuickFiltersProps {
  filters: QuickFilter[];
  activeFilter: string;
  onChange: (filterId: string) => void;
  className?: string;
}

export function QuickFilters({
  filters,
  activeFilter,
  onChange,
  className,
}: QuickFiltersProps) {
  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeFilter === filter.id
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
