import { useState } from 'react';
import { MoodHeader } from '../components/mobile/MoodHeader';
import { QuickMoodEntry } from '../components/mobile/QuickMoodEntry';
import { MoodTimeline } from '../components/mobile/MoodTimeline';
import { MoodIndicators } from '../components/mobile/MoodIndicators';
import { MoodInsights } from '../components/mobile/MoodInsights';
import { mockMoodData } from '../data/mockMoodData';
import { MoodLevel, EmotionType } from '../types/mood.types';
import { Heart } from 'lucide-react';

export function Mood() {
    const [showEntry, setShowEntry] = useState(false);

    const handleSaveMood = (mood: MoodLevel, emotions: EmotionType[]) => {
        console.log('Mood saved:', { mood, emotions });
        setShowEntry(false);
    };

    return (
        <div className="p-4 sm:p-6 space-y-12 pb-32 max-w-2xl mx-auto min-h-screen bg-background">
            <MoodHeader
                onQuickEntry={() => setShowEntry(true)}
                onViewHistory={() => { }}
            />

            {showEntry && (
                <section className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <QuickMoodEntry onSave={handleSaveMood} />
                </section>
            )}

            <section>
                <MoodTimeline entries={mockMoodData.recentEntries} />
            </section>

            <section className="pt-4 border-t border-border/40">
                <MoodIndicators metrics={mockMoodData.metrics} />
            </section>

            <section className="pt-4 border-t border-border/40">
                <MoodInsights
                    insights={mockMoodData.insights}
                    correlations={mockMoodData.correlations}
                />
            </section>

            {/* Disclaimer Footer */}
            <footer className="pt-12 text-center space-y-6 border-t border-border/40">
                <div className="inline-flex p-3 rounded-2xl bg-muted/30 border border-border/40">
                    <Heart className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <div className="max-w-[320px] mx-auto space-y-3">
                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed italic px-4">
                        ⚠️ Este app não substitui acompanhamento profissional. Se você está enfrentando dificuldades emocionais persistentes, considere buscar apoio especializado.
                    </p>
                </div>
            </footer>
        </div>
    );
}
