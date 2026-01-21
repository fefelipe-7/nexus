import { Card, CardContent } from '@/ui/components/components/ui';
import {
    History,
    Calendar,
    ArrowRight,
    TrendingUp,
    MessageSquare,
    Zap
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { PeriodicReview } from '../../types/reviews.types';

interface ReviewHistoryProps {
    history: PeriodicReview[];
    onSelect: (review: PeriodicReview) => void;
}

export function ReviewHistory({ history, onSelect }: ReviewHistoryProps) {
    return (
        <div className="space-y-4">
            <div className="px-1 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Revisões Concluídas</h3>
                <span className="text-[10px] font-bold text-muted-foreground/40 uppercase">Acesso ao Aprendizado</span>
            </div>

            <div className="grid gap-3">
                {history.map((review) => (
                    <Card
                        key={review.id}
                        className="border-border/40 shadow-none bg-background hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => onSelect(review)}
                    >
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                                        review.type === 'weekly' ? "bg-blue-500/10 text-blue-600" :
                                            review.type === 'monthly' ? "bg-purple-500/10 text-purple-600" :
                                                "bg-amber-500/10 text-amber-600"
                                    )}>
                                        {review.type}
                                    </span>
                                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
                                        {review.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                                    <span className="text-[10px] font-bold text-foreground opacity-60">{review.scoreAtReview}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-foreground leading-tight">{review.title}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                    {review.summary}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="h-3 w-3 text-muted-foreground/40" />
                                        <span className="text-[9px] font-bold text-muted-foreground/60">{review.reflectionBlocks.length} Reflexões</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Zap className="h-3 w-3 text-muted-foreground/40" />
                                        <span className="text-[9px] font-bold text-muted-foreground/60">{review.decisions.length} Ajustes</span>
                                    </div>
                                </div>
                                <ArrowRight className="h-3 w-3 text-muted-foreground/30" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
