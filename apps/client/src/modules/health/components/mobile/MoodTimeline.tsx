import { Card, CardContent } from '@/ui/components/components/ui';
import { Clock } from 'lucide-react';
import { cn } from '@nexus/shared';
import { MoodEntry } from '../../types/mood.types';

interface MoodTimelineProps {
    entries: MoodEntry[];
}

const MOOD_COLORS = {
    1: 'bg-rose-500',
    2: 'bg-orange-500',
    3: 'bg-blue-500',
    4: 'bg-emerald-500',
    5: 'bg-green-500'
};

const MOOD_EMOJIS = {
    1: '😞',
    2: '🙁',
    3: '😐',
    4: '🙂',
    5: '😄'
};

export function MoodTimeline({ entries }: MoodTimelineProps) {
    if (entries.length === 0) {
        return (
            <Card className="border-border/40 shadow-none bg-muted/10">
                <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">Nenhum registro hoje ainda</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="px-1 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    Linha do Tempo de Hoje
                </h3>
            </div>

            <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border/40" />

                <div className="space-y-4">
                    {entries.map((entry, index) => (
                        <div key={entry.id} className="relative flex items-start gap-4">
                            <div className="relative z-10">
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg",
                                    MOOD_COLORS[entry.moodLevel]
                                )}>
                                    {MOOD_EMOJIS[entry.moodLevel]}
                                </div>
                            </div>

                            <Card className="flex-1 border-border/40 shadow-none bg-background">
                                <CardContent className="p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-foreground">
                                            {entry.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {entry.context && (
                                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded">
                                                {entry.context}
                                            </span>
                                        )}
                                    </div>

                                    {entry.emotions.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {entry.emotions.map((emotion) => (
                                                <span
                                                    key={emotion}
                                                    className="text-[9px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded uppercase tracking-tighter"
                                                >
                                                    {emotion}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {entry.note && (
                                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                                            "{entry.note}"
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
