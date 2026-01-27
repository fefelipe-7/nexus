import { useState } from 'react';
import { SleepHeader } from '../components/mobile/SleepHeader';
import { SleepOverview } from '../components/mobile/SleepOverview';
import { QuickSleepEntry } from '../components/mobile/QuickSleepEntry';
import { SleepMetrics } from '../components/mobile/SleepMetrics';
import { SleepInfluences } from '../components/mobile/SleepInfluences';
import { SleepInsights } from '../components/mobile/SleepInsights';
import { mockSleepData } from '../data/mockSleepData';
import { SleepQuality } from '../types/sleep.types';
import { Moon } from 'lucide-react';

export function Sleep() {
    const [showEntry, setShowEntry] = useState(false);

    const handleSaveSleep = (bedtime: Date, wakeTime: Date, quality: SleepQuality) => {
        console.log('Sleep saved:', { bedtime, wakeTime, quality });
        setShowEntry(false);
    };

    return (
        <div className="p-4 sm:p-6 space-y-12 pb-32 max-w-2xl mx-auto min-h-screen bg-background">
            <SleepHeader
                onQuickEntry={() => setShowEntry(true)}
                onViewHistory={() => { }}
            />

            {showEntry && (
                <section className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <QuickSleepEntry onSave={handleSaveSleep} />
                </section>
            )}

            <section>
                <SleepOverview
                    lastNight={mockSleepData.lastNight}
                    score={mockSleepData.score}
                />
            </section>

            <section className="pt-4 border-t border-border/40">
                <SleepMetrics
                    metrics={mockSleepData.metrics}
                    debt={mockSleepData.debt}
                />
            </section>

            <section className="pt-4 border-t border-border/40">
                <SleepInfluences influences={mockSleepData.influences} />
            </section>

            <section className="pt-4 border-t border-border/40">
                <SleepInsights insights={mockSleepData.insights} />
            </section>

            {/* Philosophy Footer */}
            <footer className="pt-12 text-center space-y-6 border-t border-border/40">
                <div className="inline-flex p-3 rounded-2xl bg-muted/30 border border-border/40">
                    <Moon className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <div className="max-w-[320px] mx-auto space-y-3">
                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed italic px-4">
                        "Dormir bem não é só dormir mais, é dormir melhor, de forma consistente e alinhada com seu corpo."
                    </p>
                </div>
            </footer>
        </div>
    );
}
