import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllModules } from '@/config/modules.config';
import { Search, X } from 'lucide-react';
import { cn } from '@nexus/shared';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = useMemo(() => {
    const modules = getAllModules();
    const items: CommandItem[] = [];

    modules.forEach((module) => {
      items.push({
        id: module.id,
        label: module.name,
        path: module.path,
        icon: module.icon,
        category: 'Módulos',
      });

      module.submodules?.forEach((sub) => {
        items.push({
          id: `${module.id}-${sub.id}`,
          label: `${module.name} › ${sub.name}`,
          path: sub.path,
          icon: sub.icon || module.icon,
          category: 'Submódulos',
        });
      });
    });

    return items;
  }, []);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    
    const searchLower = search.toLowerCase();
    return commands.filter((cmd) =>
      cmd.label.toLowerCase().includes(searchLower)
    );
  }, [commands, search]);

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          onClose();
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            navigate(filteredCommands[selectedIndex].path);
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, navigate, filteredCommands, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card border rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar módulos, submódulos..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent outline-none text-sm"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Nenhum resultado encontrado
            </div>
          ) : (
            <div className="py-2">
              {filteredCommands.map((cmd, index) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      navigate(cmd.path);
                      onClose();
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                      index === selectedIndex
                        ? 'bg-accent'
                        : 'hover:bg-accent/50'
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="flex-1 text-left truncate">{cmd.label}</span>
                    <span className="text-xs text-muted-foreground">{cmd.category}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t bg-muted/30 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 border rounded bg-background">↑↓</kbd>
            <span>Navegar</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 border rounded bg-background">Enter</kbd>
            <span>Selecionar</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 border rounded bg-background">Esc</kbd>
            <span>Fechar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
