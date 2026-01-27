import { Button } from '@/ui/components/components/ui';
import {
    Plus,
    History,
    Settings2,
    Moon
} from 'lucide-react';

interface SleepHeaderProps {
    onQuickEntry: () => void;
    onViewHistory: () => void;
}

export function SleepHeader({ onQuickEntry, onViewHistory }: SleepHeaderProps) {
    return (
        <div className="space-y-6">
            <div className="px-1 flex items-start justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Sono
                    </h1>
                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                        <Moon className="h-3.5 w-3.5" />
                        Inteligência de Recuperação
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Settings2 className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex gap-3">
                <Button
                    onClick={onQuickEntry}
                    className="flex-1 h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-bold text-xs uppercase tracking-tighter shadow-lg shadow-foreground/5"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar Sono
                </Button>
                <Button
                    variant="outline"
                    onClick={onViewHistory}
                    className="px-5 h-12 rounded-2xl border-border/60 font-bold text-xs uppercase tracking-tighter"
                >
                    <History className="h-4 w-4 mr-2" />
                    Histórico
                </Button>
            </div>
        </div>
    );
}
