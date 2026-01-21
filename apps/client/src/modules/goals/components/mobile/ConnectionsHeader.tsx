import { Button } from '@/ui/components/components/ui';
import {
    Network,
    Filter,
    ChevronDown,
    Layout
} from 'lucide-react';

interface ConnectionsHeaderProps {
    onFilterClick: () => void;
}

export function ConnectionsHeader({ onFilterClick }: ConnectionsHeaderProps) {
    return (
        <div className="space-y-6">
            <div className="px-1 space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Conexão: Hábitos e Projetos
                </h1>
                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                    <Network className="h-3.5 w-3.5" />
                    Alinhamento Sistêmico de Execução
                </p>
            </div>

            <div className="flex flex-col gap-4 bg-muted/20 p-4 rounded-2xl border border-border/40">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Escopo de Visualização</p>
                    <Filter className="h-3 w-3 text-muted-foreground/50" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="justify-between bg-background border-border/60 text-[11px] h-9 rounded-xl font-bold uppercase tracking-tighter"
                    >
                        <span>Todos Objetivos</span>
                        <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="justify-between bg-background border-border/60 text-[11px] h-9 rounded-xl font-bold uppercase tracking-tighter"
                    >
                        <span>Todas Áreas</span>
                        <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
