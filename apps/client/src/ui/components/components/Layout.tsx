import { ReactNode, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@nexus/shared';
import { ThemeSelector } from './ThemeSelector';
import { useThemeStore } from '@/state/stores/themeStore';
import { MODULES, getAllModules } from '@/config/modules.config';
import { Breadcrumbs } from '../Breadcrumbs';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { initTheme } = useThemeStore();
  const modules = getAllModules();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const isModuleActive = (modulePath: string) => {
    return location.pathname === modulePath || location.pathname.startsWith(modulePath + '/');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <aside className="w-64 border-r bg-card/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b px-6">
              <Link to="/overview">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Nexus
                </h1>
              </Link>
              <ThemeSelector />
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
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{module.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t p-4 bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                Seu sistema operacional da vida
              </p>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-8 max-w-7xl">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
