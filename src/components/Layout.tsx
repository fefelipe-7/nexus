import { ReactNode, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Heart, 
  CheckSquare, 
  Calendar, 
  Target, 
  Repeat, 
  BookOpen, 
  MessageSquare 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeSelector } from './ThemeSelector';
import { useThemeStore } from '@/store/themeStore';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Painel', href: '/', icon: LayoutDashboard },
  { name: 'Estado', href: '/state', icon: Heart },
  { name: 'Ações', href: '/actions', icon: CheckSquare },
  { name: 'Eventos', href: '/events', icon: Calendar },
  { name: 'Metas', href: '/goals', icon: Target },
  { name: 'Rotinas', href: '/routines', icon: Repeat },
  { name: 'Conhecimento', href: '/knowledge', icon: BookOpen },
  { name: 'Reflexões', href: '/reflections', icon: MessageSquare },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <aside className="w-64 border-r bg-card/50 backdrop-blur-sm">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b px-6">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Nexus</h1>
              <ThemeSelector />
            </div>
            <nav className="flex-1 space-y-1 px-3 py-6">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t p-4 bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                Seu centro de comando pessoal
              </p>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
