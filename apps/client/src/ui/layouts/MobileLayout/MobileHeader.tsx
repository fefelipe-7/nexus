import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ThemeSelector } from '@/ui/components/components/ThemeSelector';

interface MobileHeaderProps {
  isMobileMenuOpen: boolean;
  onToggleMenu: () => void;
}

export function MobileHeader({ isMobileMenuOpen, onToggleMenu }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md shadow-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <Link to="/overview" className="flex-1">
          <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Nexus
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSelector />
          <button
            onClick={onToggleMenu}
            className="p-2 hover:bg-accent rounded-lg transition-colors active:scale-95"
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
