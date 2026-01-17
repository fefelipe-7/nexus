import { X, Clock, MapPin, Calendar, Target, Link, Repeat, Zap, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { TimeBlock } from '../../types/agenda.types';
import { INTENTION_LABELS, INTENTION_COLORS, LIFE_AREA_LABELS, EVENT_TYPE_LABELS, ENERGY_LABELS, STATUS_LABELS } from '../../types/agenda.types';

interface EventDetailSheetProps {
    block: TimeBlock | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (block: TimeBlock) => void;
    onComplete?: (block: TimeBlock) => void;
    onCancel?: (block: TimeBlock) => void;
    onDelete?: (block: TimeBlock) => void;
}

export function EventDetailSheet({
    block,
    isOpen,
    onClose,
    onEdit,
    onComplete,
    onCancel,
    onDelete,
}: EventDetailSheetProps) {
    if (!isOpen || !block) return null;

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    };

    const getDuration = () => {
        const mins = (block.endTime.getTime() - block.startTime.getTime()) / 60000;
        if (mins < 60) return `${mins} minutos`;
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return remainingMins > 0 ? `${hours}h ${remainingMins}min` : `${hours} hora${hours > 1 ? 's' : ''}`;
    };

    const color = block.color || INTENTION_COLORS[block.intention];
    const isCompleted = block.status === 'completed';

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
                <div className="bg-background rounded-t-2xl border-t shadow-xl max-h-[85vh] flex flex-col">
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="flex items-start justify-between px-4 pb-4 border-b">
                        <div className="flex items-start gap-3">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                                style={{ backgroundColor: `${color}15` }}
                            >
                                <Zap style={{ color }} className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">{block.title}</h2>
                                <p className="text-sm text-muted-foreground">{INTENTION_LABELS[block.intention]}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Time */}
                        <div className="flex items-center gap-3 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="font-medium">{formatTime(block.startTime)} - {formatTime(block.endTime)}</p>
                                <p className="text-xs text-muted-foreground">{getDuration()}</p>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p className="capitalize">{formatDate(block.startTime)}</p>
                        </div>

                        {/* Location */}
                        {block.location && (
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <p>{block.location}</p>
                            </div>
                        )}

                        {/* Recurring */}
                        {block.isRecurring && (
                            <div className="flex items-center gap-3 text-sm">
                                <Repeat className="h-4 w-4 text-muted-foreground" />
                                <p>{block.recurringPattern}</p>
                            </div>
                        )}

                        {/* Meta links */}
                        {(block.linkedGoalId || block.linkedProjectId) && (
                            <div className="flex items-center gap-3 text-sm">
                                <Link className="h-4 w-4 text-primary" />
                                <p className="text-primary">
                                    {block.linkedGoalId && 'Vinculada a meta'}
                                    {block.linkedProjectId && 'Vinculada a projeto'}
                                </p>
                            </div>
                        )}

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                            <span
                                className="px-3 py-1.5 rounded-full text-xs font-medium"
                                style={{
                                    backgroundColor: `${color}15`,
                                    color
                                }}
                            >
                                {EVENT_TYPE_LABELS[block.eventType]}
                            </span>
                            <span className="px-3 py-1.5 bg-muted rounded-full text-xs font-medium">
                                {LIFE_AREA_LABELS[block.lifeArea]}
                            </span>
                            <span className="px-3 py-1.5 bg-muted rounded-full text-xs font-medium">
                                Energia: {ENERGY_LABELS[block.energyLevel]}
                            </span>
                            {block.isFlexible && (
                                <span className="px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-full text-xs font-medium">
                                    Flexível
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {block.description && (
                            <div className="p-3 bg-muted/30 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">Descrição</p>
                                <p className="text-sm">{block.description}</p>
                            </div>
                        )}

                        {/* Notes */}
                        {block.notes && (
                            <div className="p-3 bg-muted/30 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">Notas</p>
                                <p className="text-sm">{block.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="border-t p-4 bg-muted/30 space-y-3">
                        {!isCompleted && (
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    className="w-full"
                                    onClick={() => onComplete?.(block)}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Concluir
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => onCancel?.(block)}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancelar
                                </Button>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                onClick={() => onEdit?.(block)}
                            >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                            <Button
                                variant="outline"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => onDelete?.(block)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
