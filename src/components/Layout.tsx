import { ReactNode } from 'react';
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

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'State', href: '/state', icon: Heart },
  { name: 'Actions', href: '/actions', icon: CheckSquare },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Routines', href: '/routines', icon: Repeat },
  { name: 'Knowledge', href: '/knowledge', icon: BookOpen },
  { name: 'Reflections', href: '/reflections', icon: MessageSquare },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <aside className="w-64 border-r bg-card">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b px-6">
              <h1 className="text-2xl font-bold tracking-tight">Nexus</h1>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t p-4">
              <p className="text-xs text-muted-foreground">
                Your personal command center
              </p>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
