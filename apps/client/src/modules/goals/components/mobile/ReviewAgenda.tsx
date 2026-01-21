import { Card, CardContent } from '@/ui/components/components/ui';
import {
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    PlayCircle
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { ReviewAgendaItem } from '../../types/reviews.types';

interface ReviewAgendaProps {
    agenda: ReviewAgendaItem[];
}

export function ReviewAgenda({ agenda }: ReviewAgendaProps) {
    const getLabel = (type: string) => {
        switch (type) {
            case 'weekly': return 'Semanal';
            case 'monthly': return 'Mensal';
            case 'quarterly': return 'Trimestral';
            case 'annual': return 'Anual';
            default: return type;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'overdue': return <AlertCircle className="h-4 w-4 text-rose-500" />;
            case 'completed': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case 'in_progress': return <PlayCircle className="h-4 w-4 text-blue-500" />;
            default: return <Calendar className="h-4 w-4 text-muted-foreground/60" />;
        }
    };

    return (
        <div className="space-y-4">
            <div className="px-1 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Agenda de Rituais</h3>
                <span className="text-[10px] font-bold text-muted-foreground/40 uppercase">Cadência Ativa</span>
            </div>

            <div className="grid gap-3">
                {agenda.map((item) => (
                    <Card key={item.id} className={cn(
                        "border-border/40 shadow-none bg-background",
                        item.status === 'overdue' && "border-rose-500/20 bg-rose-500/[0.01]"
                    )}>
                        <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className={cn(
                                    "p-2.5 rounded-xl border",
                                    item.status === 'overdue' ? "bg-rose-500/10 border-rose-500/20" : "bg-muted/30 border-border/40"
                                )}>
                                    {getStatusIcon(item.status)}
                                </div>
                                <div className="grow min-w-0">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-0.5">
                                        Revisão {getLabel(item.type)}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "text-sm font-bold truncate",
                                            item.status === 'overdue' ? "text-rose-600" : "text-foreground"
                                        )}>
                                            {item.status === 'overdue' ? 'Atrasada' :
                                                item.scheduledDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                        </span>
                                        <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                        <span className="text-[10px] font-medium text-muted-foreground truncate">
                                            {item.lastReviewDate ? `Última: ${item.lastReviewDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}` : 'Primeira vez'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all",
                                    item.status === 'overdue'
                                        ? "bg-rose-500 text-white hover:bg-rose-600"
                                        : "bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-background"
                                )}
                            >
                                Ativar
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
