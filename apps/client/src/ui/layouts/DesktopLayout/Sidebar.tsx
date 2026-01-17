import { Link, useLocation } from 'react-router-dom';
import { cn } from '@nexus/shared';
import { getAllModules } from '@/config/modules.config';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import logoNexus from '@/assets/logo-nexus.png';

export function Sidebar() {
  const location = useLocation();
  const modules = getAllModules();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isModuleActive = (modulePath: string) => {
    return location.pathname === modulePath || location.pathname.startsWith(modulePath + '/');
  };

  return (
    <aside
      className={cn(
        'border-r bg-card/50 backdrop-blur-sm flex-shrink-0 flex flex-col transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        <div className={cn(
          'flex h-16 items-center border-b px-4 justify-between',
          isCollapsed && 'px-2 justify-center'
        )}>
          {!isCollapsed ? (
            <Link to="/" className="flex items-center gap-2">
              <img src={logoNexus} alt="Nexus" className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Nexus
              </span>
            </Link>
          ) : (
            <Link to="/">
              <img src={logoNexus} alt="Nexus" className="h-6 w-6" />
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
          {modules.map((module) => {
            const isActive = isModuleActive(module.path);
            const Icon = module.icon;

            return (
              <Link
                key={module.id}
                to={module.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 min-h-[44px] group',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1',
                  isCollapsed && 'justify-center px-2'
                )}
                title={isCollapsed ? module.name : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{module.name}</span>}
              </Link>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="border-t p-4 bg-muted/30">
            <p className="text-xs text-muted-foreground text-center">
              Seu sistema operacional da vida
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
