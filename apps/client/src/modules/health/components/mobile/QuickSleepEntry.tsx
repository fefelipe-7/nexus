import { useState } from 'react';
import { Button, Card, CardContent } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { SleepQuality } from '../../types/sleep.types';
import { Save, Star, Moon, Sun } from 'lucide-react';

interface QuickSleepEntryProps {
    onSave: (bedtime: Date, wakeTime: Date, quality: SleepQuality) => void;
}

export function QuickSleepEntry({ onSave }: QuickSleepEntryProps) {
    const [bedtime, setBedtime] = useState('23:00');
    const [wakeTime, setWakeTime] = useState('07:00');
    const [quality, setQuality] = useState<SleepQuality | null>(null);

    const handleSave = () => {
        if (quality) {
            const now = new Date();
            const bedDate = new Date(now);
            const [bedHour, bedMin] = bedtime.split(':').map(Number);
            bedDate.setHours(bedHour, bedMin, 0, 0);

            const wakeDate = new Date(now);
            const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
            wakeDate.setHours(wakeHour, wakeMin, 0, 0);

            onSave(bedDate, wakeDate, quality);
            setQuality(null);
        }
    };

    return (
        <Card className="border-border/40 shadow-none bg-background">
            <CardContent className="p-6 space-y-6">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Registrar Sono</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter flex items-center gap-1.5">
                            <Moon className="h-3 w-3" />
                            Hora de Dormir
                        </label>
                        <input
                            type="time"
                            value={bedtime}
                            onChange={(e) => setBedtime(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-border/60 bg-background text-foreground font-bold text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter flex items-center gap-1.5">
                            <Sun className="h-3 w-3" />
                            Hora de Acordar
                        </label>
                        <input
                            type="time"
                            value={wakeTime}
                            onChange={(e) => setWakeTime(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-border/60 bg-background text-foreground font-bold text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                        Como foi a qualidade?
                    </label>
                    <div className="flex justify-between gap-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                            <button
                                key={level}
                                onClick={() => setQuality(level as SleepQuality)}
                                className={cn(
                                    "flex-1 aspect-square rounded-2xl border-2 transition-all flex items-center justify-center hover:scale-105",
                                    quality === level
                                        ? "border-amber-500 bg-amber-500/10 shadow-lg"
                                        : "border-border/40 hover:border-amber-500/30"
                                )}
                            >
                                <Star
                                    className={cn(
                                        "h-8 w-8",
                                        quality === level ? "fill-amber-500 text-amber-500" : "text-muted-foreground/40"
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-between px-1">
                        <span className="text-[8px] font-bold text-muted-foreground uppercase">Muito ruim</span>
                        <span className="text-[8px] font-bold text-muted-foreground uppercase">Excelente</span>
                    </div>
                </div>

                {quality && (
                    <Button
                        onClick={handleSave}
                        className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold text-xs uppercase tracking-tighter animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Registro
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
