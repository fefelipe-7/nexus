import { ThemeSelector } from '@/ui/components/components/ThemeSelector';
import { Search, Bell, Settings } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';

interface TopBarProps {
  onOpenCommandPalette?: () => void;
}

export function TopBar({ onOpenCommandPalette }: TopBarProps) {
  return (
    <div className="h-14 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <button
        onClick={onOpenCommandPalette}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-background/50 hover:bg-accent transition-colors text-sm text-muted-foreground"
      >
        <Search className="h-4 w-4" />
        <span>Buscar ou navegar...</span>
        <kbd className="ml-2 px-1.5 py-0.5 text-xs border rounded bg-muted">
          Ctrl+K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        <ThemeSelector />
      </div>
    </div>
  );
}
