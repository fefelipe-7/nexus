import { cn } from '@nexus/shared';
import { ChevronRight, ChevronDown, Star, Pause, Check, Link, ListTodo, Calendar, RotateCcw, Clock } from 'lucide-react';
import { useState } from 'react';
import type { Priority, LinkedItem } from '../../types/priorities.types';
import { TYPE_LABELS, TYPE_ICONS, TYPE_COLORS, HORIZON_LABELS, LIFE_AREA_LABELS, LIFE_AREA_COLORS } from '../../types/priorities.types';

interface PriorityCardProps {
    priority: Priority;
    onClick?: () => void;
    onSetDominant?: () => void;
}

export function PriorityCard({ priority, onClick, onSetDominant }: PriorityCardProps) {
    const [expanded, setExpanded] = useState(false);

    const isPaused = priority.status === 'paused';
    const completedItems = priority.linkedItems.filter(i => i.status === 'completed').length;
    const totalItems = priority.linkedItems.length;

    const getItemIcon = (type: LinkedItem['type']) => {
        switch (type) {
            case 'task': return <ListTodo className="h-3 w-3" />;
            case 'commitment': return <Calendar className="h-3 w-3" />;
            case 'habit': return <RotateCcw className="h-3 w-3" />;
            case 'routine': return <Clock className="h-3 w-3" />;
        }
    };

    return (
        <div className={cn(
            "overflow-hidden transition-all rounded-xl border",
            isPaused && "opacity-50",
            priority.isDominant && "border-primary/50 ring-1 ring-primary/30"
        )}>
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-4 flex items-center gap-3"
            >
                {/* Icon */}
                <div
                    className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    )}
                    style={{ backgroundColor: `${priority.color}15` }}
                >
                    {priority.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                        <p className={cn(
                            "text-sm font-semibold truncate",
                            isPaused && "text-muted-foreground"
                        )}>
                            {priority.name}
                        </p>
                        {priority.isDominant && (
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                        )}
                        {isPaused && (
                            <Pause className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 flex-wrap">
                        <span>{TYPE_ICONS[priority.type]}</span>
                        <span>{TYPE_LABELS[priority.type]}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{HORIZON_LABELS[priority.horizon]}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span style={{ color: LIFE_AREA_COLORS[priority.lifeArea] }}>
                            {LIFE_AREA_LABELS[priority.lifeArea]}
                        </span>
                    </div>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {totalItems > 0 && (
                        <div className="text-right">
                            <p className="text-sm font-semibold">{completedItems}/{totalItems}</p>
                            <p className="text-[10px] text-muted-foreground">ações</p>
                        </div>
                    )}
                    {expanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>
            </button>

            {/* Expanded Content */}
            {expanded && (
                <div className="border-t px-4 py-3 space-y-3">
                    {/* Description */}
                    {priority.description && (
                        <p className="text-sm text-muted-foreground">{priority.description}</p>
                    )}

                    {/* Impact */}
                    <div className="p-2 bg-muted/30 rounded-lg">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Impacto</p>
                        <p className="text-xs">{priority.impact}</p>
                    </div>

                    {/* Linked Items */}
                    {priority.linkedItems.length > 0 && (
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Vinculados</p>
                            <div className="space-y-1.5">
                                {priority.linkedItems.map(item => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-2 py-1"
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded flex items-center justify-center",
                                            item.status === 'completed' && "bg-green-500/20 text-green-500",
                                            item.status === 'in_progress' && "bg-amber-500/20 text-amber-500",
                                            item.status === 'pending' && "bg-muted/50 text-muted-foreground"
                                        )}>
                                            {item.status === 'completed' ? (
                                                <Check className="h-3 w-3" />
                                            ) : (
                                                getItemIcon(item.type)
                                            )}
                                        </div>
                                        <span className={cn(
                                            "text-sm flex-1",
                                            item.status === 'completed' && "text-muted-foreground line-through"
                                        )}>
                                            {item.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {!priority.isDominant && !isPaused && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onSetDominant?.(); }}
                            className="w-full py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
                        >
                            <Star className="h-4 w-4" />
                            Definir como Foco Principal
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
