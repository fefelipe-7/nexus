import { Card, CardContent } from '@/ui/components/components/ui';
import { ChevronLeft, ChevronRight, Calendar, AlertCircle, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { cn } from '@nexus/shared';
import { YearlyGoalsSummary } from '../../types/yearly-goals.types';

interface YearlyGoalsHeaderProps {
    summary: YearlyGoalsSummary;
    onYearChange?: (year: number) => void;
}

export function YearlyGoalsHeader({ summary, onYearChange }: YearlyGoalsHeaderProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'balanced': return 'text-emerald-500 bg-emerald-500/10';
            case 'overloaded': return 'text-amber-500 bg-amber-500/10';
            case 'fragmented': return 'text-purple-500 bg-purple-500/10';
            default: return 'text-muted-foreground bg-muted';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'balanced': return 'Equilibrado';
            case 'overloaded': return 'Sobrecarregado';
            case 'fragmented': return 'Disperso';
            default: return 'Indefinido';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Objetivos Anuais
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-widest">
                        <Calendar className="h-3 w-3" />
                        <span>Foco Estratégico {summary.year}</span>
                    </div>
                </div>

                <div className="flex items-center bg-muted/30 rounded-xl p-1 border border-border/40">
                    <button className="p-1.5 hover:bg-background rounded-lg transition-colors">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="px-3 text-sm font-bold">{summary.year}</span>
                    <button className="p-1.5 hover:bg-background rounded-lg transition-colors">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                <Card className="border-none bg-muted/30 shadow-none overflow-hidden">
                    <CardContent className="p-5 space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-lg", getStatusColor(summary.status))}>
                                    <LayoutDashboard className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        Configuração do Ano
                                    </p>
                                    <p className="text-sm font-bold text-foreground">
                                        {getStatusLabel(summary.status)}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    Tempo Decorrido
                                </p>
                                <p className="text-sm font-bold text-foreground">
                                    {summary.yearProgress}%
                                </p>
                            </div>
                        </div>

                        {/* Year Progress Bar */}
                        <div className="h-1.5 w-full bg-background/50 rounded-full overflow-hidden border border-border/20">
                            <div
                                className="h-full bg-foreground/10 transition-all duration-1000"
                                style={{ width: `${summary.yearProgress}%` }}
                            />
                        </div>

                        <div className="space-y-2">
                            {summary.messages.map((msg, i) => (
                                <div key={i} className="flex gap-2 text-xs text-foreground/70 leading-relaxed italic">
                                    <span className="text-muted-foreground mt-0.5">•</span>
                                    <p>{msg}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="bg-background/40 p-3 rounded-xl border border-border/40 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Ativos</p>
                                    <p className="text-lg font-bold">{summary.activeCount}</p>
                                </div>
                                <AlertCircle className="h-4 w-4 text-emerald-500 opacity-40" />
                            </div>
                            <div className="bg-background/40 p-3 rounded-xl border border-border/40 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Concluídos</p>
                                    <p className="text-lg font-bold">{summary.completedCount}</p>
                                </div>
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 opacity-40" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
