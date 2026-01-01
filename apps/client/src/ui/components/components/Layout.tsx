import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@nexus/shared';
import { ThemeSelector } from './ThemeSelector';
import { useThemeStore } from '@/state/stores/themeStore';
import { MODULES, getAllModules } from '@/config/modules.config';
import { Breadcrumbs } from '../Breadcrumbs';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { initTheme } = useThemeStore();
  const modules = getAllModules();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isModuleActive = (modulePath: string) => {
    return location.pathname === modulePath || location.pathname.startsWith(modulePath + '/');
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 border-b bg-card/50 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <Link to="/overview" className="flex-1">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Nexus
              </h1>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeSelector />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <nav className="border-t bg-background px-2 py-3 space-y-1 max-h-[calc(100vh-64px)] overflow-y-auto">
              {modules.map((module) => {
                const isActive = isModuleActive(module.path);
                const Icon = module.icon;
                return (
                  <Link
                    key={module.id}
                    to={module.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 min-h-[44px]',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{module.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </header>

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="px-4 py-4 max-w-full">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <aside className="w-64 border-r bg-card/50 backdrop-blur-sm flex-shrink-0 hidden md:flex flex-col">
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
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 min-h-[44px]',
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
