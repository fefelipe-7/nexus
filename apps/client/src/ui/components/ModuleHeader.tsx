import { LucideIcon } from 'lucide-react';

interface ModuleHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  color?: string;
}

export function ModuleHeader({ title, description, icon: Icon, color = 'blue' }: ModuleHeaderProps) {
  return (
    <div className="flex items-start gap-4 mb-6">
      {Icon && (
        <div className={`p-3 rounded-xl bg-${color}-500/10 mt-1`}>
          <Icon className={`h-8 w-8 text-${color}-500`} />
        </div>
      )}
      <div className="flex-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2 text-lg">{description}</p>
        )}
      </div>
    </div>
  );
}
