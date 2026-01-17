import { ReactNode, useEffect, useState } from 'react';
import { ContextualHeader } from './ContextualHeader';
import { ContextualBottomNav } from './ContextualBottomNav';
import { ModuleSheet } from './ModuleSheet';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  useEffect(() => {
    if (isNavigationOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isNavigationOpen]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ContextualHeader
        onOpenNavigation={() => setIsNavigationOpen(true)}
      />

      <ModuleSheet
        isOpen={isNavigationOpen}
        onClose={() => setIsNavigationOpen(false)}
      />

      <main className="flex-1 overflow-y-auto bg-background pb-20">
        <div className="px-4 py-4 max-w-full">
          {children}
        </div>
      </main>

      <ContextualBottomNav />
    </div>
  );
}
