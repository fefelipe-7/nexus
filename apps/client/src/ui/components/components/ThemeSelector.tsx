import { useState } from 'react';
import { useThemeStore } from '@/state/stores/themeStore';
import { themes } from '@/ui/themes/themes';
import { Button } from '@/ui/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/components/ui/dialog';
import { Palette, Check } from 'lucide-react';

export function ThemeSelector() {
  const [open, setOpen] = useState(false);
  const { currentTheme, setTheme } = useThemeStore();

  const handleThemeChange = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setTheme(theme);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Palette className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Escolher Tema</DialogTitle>
          <DialogDescription>
            Selecione um tema para personalizar a aparência do aplicativo
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`flex items-center justify-between rounded-lg border-2 p-4 transition-all hover:border-primary ${
                currentTheme.id === theme.id ? 'border-primary bg-accent' : 'border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div
                    className="h-6 w-6 rounded-full border"
                    style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                  />
                  <div
                    className="h-6 w-6 rounded-full border"
                    style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
                  />
                  <div
                    className="h-6 w-6 rounded-full border"
                    style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                  />
                </div>
                <span className="font-medium">{theme.name}</span>
              </div>
              {currentTheme.id === theme.id && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
