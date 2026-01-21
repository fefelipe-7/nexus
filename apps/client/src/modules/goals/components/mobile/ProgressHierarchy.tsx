import {
    Target,
    ChevronRight,
    ChevronDown,
    Layout,
    Zap,
    Lock,
    Minus,
    ArrowRight
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { GoalLayerProgress } from '../../types/progress-indicators.types';
import { useState } from 'react';

interface ProgressHierarchyProps {
    hierarchy: GoalLayerProgress[];
}

export function ProgressHierarchy({ hierarchy }: ProgressHierarchyProps) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggle = (id: string) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderLayer = (item: GoalLayerProgress, depth: number = 0) => {
        const isExpanded = expanded[item.id];
        const hasChildren = item.children && item.children.length > 0;

        return (
            <div key={item.id} className="space-y-2">
                <div
                    className={cn(
                        "p-4 rounded-2xl border bg-background transition-all",
                        item.status === 'on_track' ? "border-border/40" :
                            item.status === 'at_risk' ? "border-rose-500/30 bg-rose-500/[0.01]" : "border-amber-500/20 bg-amber-500/[0.01]",
                        depth > 0 && "ml-4 sm:ml-6"
                    )}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={cn(
                                "p-1.5 rounded-lg",
                                item.level === 'life' ? "bg-purple-500/10 text-purple-600" :
                                    item.level === 'yearly' ? "bg-blue-500/10 text-blue-600" :
                                        "bg-emerald-500/10 text-emerald-600"
                            )}>
                                {item.level === 'life' ? <Target className="h-4 w-4" /> :
                                    item.level === 'yearly' ? <Layout className="h-4 w-4" /> :
                                        <Zap className="h-4 w-4" />}
                            </div>
                            <div className="grow min-w-0">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">
                                    {item.level === 'life' ? 'Visão de Vida' : item.level === 'yearly' ? 'Estratégia Anual' : 'Meta Tática'}
                                </p>
                                <h4 className="text-sm font-bold text-foreground truncate">{item.title}</h4>
                            </div>
                        </div>

                        {hasChildren && (
                            <button onClick={() => toggle(item.id)} className="p-1 hover:bg-muted rounded-md transition-colors">
                                {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-muted/60 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-700",
                                    item.status === 'at_risk' ? "bg-rose-500" :
                                        item.status === 'on_track' ? "bg-emerald-500" : "bg-amber-500"
                                )}
                                style={{ width: `${item.progress}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-bold text-foreground/70 min-w-[24px]">
                            {item.progress}%
                        </span>
                    </div>

                    {item.bottleneck && item.bottleneck !== 'Nenhum' && (
                        <div className="mt-4 p-2.5 rounded-xl bg-orange-500/[0.03] border border-orange-500/10 flex items-center gap-2">
                            <Lock className="h-3 w-3 text-orange-500 shrink-0" />
                            <p className="text-[10px] font-medium text-orange-600/80 italic leading-tight">
                                Gargalo: {item.bottleneck}
                            </p>
                        </div>
                    )}
                </div>

                {isExpanded && hasChildren && (
                    <div className="space-y-2 border-l-2 border-muted/30 ml-4 pl-2 animate-in slide-in-from-top-2 duration-300">
                        {item.children?.map(child => renderLayer(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Fluxo de Progresso por Camada</h3>
            </div>
            <div className="space-y-4">
                {hierarchy.map(layer => renderLayer(layer))}
            </div>
        </div>
    );
}
