import { Link, useLocation } from 'react-router-dom';
import { cn } from '@nexus/shared';
import { getAllModules } from '@/config/modules.config';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const location = useLocation();
  const modules = getAllModules();

  const isModuleActive = (modulePath: string) => {
    return location.pathname === modulePath || location.pathname.startsWith(modulePath + '/');
  };

  if (!isOpen) return null;

  return (
    <div className="border-t bg-background">
      <nav className="px-2 py-3 space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto">
        {modules.map((module) => {
          const isActive = isModuleActive(module.path);
          const Icon = module.icon;
          
          return (
            <Link
              key={module.id}
              to={module.path}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 min-h-[48px]',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-98'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{module.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
