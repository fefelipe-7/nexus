import { Link, useLocation } from 'react-router-dom';
import { cn } from '@nexus/shared';
import { LayoutDashboard, Bell, Target, User } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Início',
    icon: LayoutDashboard,
    path: '/overview',
  },
  {
    id: 'alerts',
    label: 'Alertas',
    icon: Bell,
    path: '/overview/alerts',
  },
  {
    id: 'goals',
    label: 'Objetivos',
    icon: Target,
    path: '/goals',
  },
  {
    id: 'profile',
    label: 'Perfil',
    icon: User,
    path: '/profile',
  },
];

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/overview') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[64px]',
                active
                  ? 'text-primary'
                  : 'text-muted-foreground active:scale-95'
              )}
            >
              <Icon className={cn('h-5 w-5', active && 'scale-110')} />
              <span className={cn(
                'text-xs font-medium',
                active && 'font-semibold'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
