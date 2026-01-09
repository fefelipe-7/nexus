import { ReactNode, useEffect, useState } from 'react';
import { MobileHeader } from './MobileHeader';
import { BottomNav } from './BottomNav';
import { MobileDrawer } from './MobileDrawer';
import { Breadcrumbs } from '@/ui/components/Breadcrumbs';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MobileHeader 
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {isMobileMenuOpen && (
        <MobileDrawer 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 overflow-y-auto bg-background pb-20">
        <div className="px-4 py-4 max-w-full">
          <Breadcrumbs />
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
