import { X, Clock, Calendar, Target, Link, Repeat, Edit2, Trash2, CheckCircle, XCircle, RotateCw, CalendarPlus, MessageSquare } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { Commitment } from '../../types/commitments.types';
import { ORIGIN_LABELS, ORIGIN_COLORS, TYPE_LABELS, TYPE_ICONS, STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS, LIFE_AREA_LABELS } from '../../types/commitments.types';

interface CommitmentDetailSheetProps {
    commitment: Commitment | null;
    isOpen: boolean;
    onClose: () => void;
    onComplete?: (commitment: Commitment) => void;
    onReschedule?: (commitment: Commitment) => void;
    onConvertToBlock?: (commitment: Commitment) => void;
    onEdit?: (commitment: Commitment) => void;
    onDelete?: (commitment: Commitment) => void;
}

export function CommitmentDetailSheet({
    commitment,
    isOpen,
    onClose,
    onComplete,
    onReschedule,
    onConvertToBlock,
    onEdit,
    onDelete,
}: CommitmentDetailSheetProps) {
    if (!isOpen || !commitment) return null;

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    };

    const formatDateTime = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isOverdue = commitment.status === 'overdue';
    const isCompleted = commitment.status === 'completed';
    const originColor = ORIGIN_COLORS[commitment.origin];

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
                                className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                                    isOverdue ? "bg-red-500/10" : "bg-muted/50"
                                )}
                            >
                                {TYPE_ICONS[commitment.type]}
                            </div>
                            <div>
                                <h2 className={cn(
                                    "text-lg font-semibold",
                                    isCompleted && "line-through text-muted-foreground"
                                )}>
                                    {commitment.title}
                                </h2>
                                <p className="text-sm text-muted-foreground">{TYPE_LABELS[commitment.type]}</p>
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
                        {/* Status & Priority */}
                        <div className="flex flex-wrap gap-2">
                            <span
                                className="px-3 py-1.5 rounded-full text-xs font-medium"
                                style={{
                                    backgroundColor: `${STATUS_COLORS[commitment.status]}15`,
                                    color: STATUS_COLORS[commitment.status]
                                }}
                            >
                                {STATUS_LABELS[commitment.status]}
                            </span>
                            <span
                                className="px-3 py-1.5 rounded-full text-xs font-medium"
                                style={{
                                    backgroundColor: `${PRIORITY_COLORS[commitment.priority]}15`,
                                    color: PRIORITY_COLORS[commitment.priority]
                                }}
                            >
                                {PRIORITY_LABELS[commitment.priority]}
                            </span>
                            <span
                                className="px-3 py-1.5 rounded-full text-xs font-medium"
                                style={{
                                    backgroundColor: `${originColor}15`,
                                    color: originColor
                                }}
                            >
                                {ORIGIN_LABELS[commitment.origin]}
                            </span>
                        </div>

                        {/* Date */}
                        {commitment.dueDate && (
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className={cn("capitalize", isOverdue && "text-red-500 font-medium")}>
                                        {formatDate(commitment.dueDate)}
                                    </p>
                                    {commitment.dueTime && (
                                        <p className="text-xs text-muted-foreground">às {commitment.dueTime}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Life Area */}
                        <div className="flex items-center gap-3 text-sm">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <p>{LIFE_AREA_LABELS[commitment.lifeArea]}</p>
                        </div>

                        {/* Recurring */}
                        {commitment.isRecurring && (
                            <div className="flex items-center gap-3 text-sm">
                                <Repeat className="h-4 w-4 text-muted-foreground" />
                                <p>{commitment.recurringPattern}</p>
                            </div>
                        )}

                        {/* Linked */}
                        {(commitment.linkedGoalId || commitment.linkedProjectId) && (
                            <div className="flex items-center gap-3 text-sm">
                                <Link className="h-4 w-4 text-primary" />
                                <p className="text-primary">
                                    Vinculado a {commitment.linkedGoalId ? 'meta' : 'projeto'}
                                </p>
                            </div>
                        )}

                        {/* Description */}
                        {commitment.description && (
                            <div className="p-3 bg-muted/30 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">Descrição</p>
                                <p className="text-sm">{commitment.description}</p>
                            </div>
                        )}

                        {/* Rescheduled count */}
                        {commitment.rescheduledCount > 0 && (
                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                <p className="text-xs text-amber-600">
                                    Reagendado {commitment.rescheduledCount}x
                                </p>
                            </div>
                        )}

                        {/* Meta info */}
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p>Criado em: {formatDateTime(commitment.createdAt)}</p>
                            {commitment.completedAt && (
                                <p>Concluído em: {formatDateTime(commitment.completedAt)}</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t p-4 bg-muted/30 space-y-3">
                        {!isCompleted && (
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    className="w-full"
                                    onClick={() => onComplete?.(commitment)}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Concluir
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => onReschedule?.(commitment)}
                                >
                                    <RotateCw className="h-4 w-4 mr-2" />
                                    Reagendar
                                </Button>
                            </div>
                        )}
                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onConvertToBlock?.(commitment)}
                            >
                                <CalendarPlus className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit?.(commitment)}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => onDelete?.(commitment)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
