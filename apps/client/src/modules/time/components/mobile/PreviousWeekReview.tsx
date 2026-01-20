import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { CheckCircle2, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';
import { PreviousWeekSummary } from '../../types/planning.types';

interface PreviousWeekReviewProps {
    summary: PreviousWeekSummary;
}

export function PreviousWeekReview({ summary }: PreviousWeekReviewProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground px-1 uppercase tracking-wider">
                    Semana Anterior ({summary.period})
                </h3>
                <Card className="p-4 bg-muted/30 border-none">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold tracking-tight">{summary.adherencePercentage}%</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">Aderência Real</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold">{summary.completedPriorities}/{summary.totalPriorities}</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">Focos Concluídos</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Principais Vitórias</h4>
                    </div>
                    <div className="space-y-2">
                        {summary.topAchievements.map((achievement, i) => (
                            <div key={i} className="flex gap-2 p-3 bg-muted/20 rounded-xl border border-muted">
                                <div className="w-1 h-full bg-green-500 rounded-full shrink-0" />
                                <p className="text-xs font-medium leading-relaxed">{achievement}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {summary.pendingHighPriorityItems.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 px-1">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pendências Críticas</h4>
                        </div>
                        <div className="space-y-2">
                            {summary.pendingHighPriorityItems.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                                    <p className="text-xs font-medium">{item}</p>
                                    <ArrowRight className="h-3 w-3 text-amber-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex gap-3">
                    <Lightbulb className="h-5 w-5 text-primary shrink-0" />
                    <p className="text-xs font-medium leading-relaxed italic text-primary/80">
                        "{summary.mainInsight}"
                    </p>
                </div>
            </Card>
        </div>
    );
}
