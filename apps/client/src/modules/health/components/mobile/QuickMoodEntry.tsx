import { useState } from 'react';
import { Button, Card, CardContent } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { MoodLevel, EmotionType } from '../../types/mood.types';
import { Save, Plus } from 'lucide-react';

interface QuickMoodEntryProps {
    onSave: (mood: MoodLevel, emotions: EmotionType[]) => void;
}

const MOOD_OPTIONS = [
    { level: 1 as MoodLevel, emoji: '😞', label: 'Muito ruim' },
    { level: 2 as MoodLevel, emoji: '🙁', label: 'Ruim' },
    { level: 3 as MoodLevel, emoji: '😐', label: 'Neutro' },
    { level: 4 as MoodLevel, emoji: '🙂', label: 'Bom' },
    { level: 5 as MoodLevel, emoji: '😄', label: 'Muito bom' }
];

const EMOTIONS: { type: EmotionType; label: string }[] = [
    { type: 'anxious', label: 'Ansioso' },
    { type: 'calm', label: 'Calmo' },
    { type: 'happy', label: 'Feliz' },
    { type: 'sad', label: 'Triste' },
    { type: 'irritated', label: 'Irritado' },
    { type: 'motivated', label: 'Motivado' },
    { type: 'tired', label: 'Cansado' },
    { type: 'stressed', label: 'Estressado' },
    { type: 'confident', label: 'Confiante' },
    { type: 'lonely', label: 'Solitário' }
];

export function QuickMoodEntry({ onSave }: QuickMoodEntryProps) {
    const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
    const [selectedEmotions, setSelectedEmotions] = useState<EmotionType[]>([]);

    const toggleEmotion = (emotion: EmotionType) => {
        setSelectedEmotions(prev =>
            prev.includes(emotion)
                ? prev.filter(e => e !== emotion)
                : [...prev, emotion]
        );
    };

    const handleSave = () => {
        if (selectedMood) {
            onSave(selectedMood, selectedEmotions);
            setSelectedMood(null);
            setSelectedEmotions([]);
        }
    };

    return (
        <Card className="border-border/40 shadow-none bg-background">
            <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Como você está agora?</h3>
                    <div className="flex justify-between gap-2">
                        {MOOD_OPTIONS.map((option) => (
                            <button
                                key={option.level}
                                onClick={() => setSelectedMood(option.level)}
                                className={cn(
                                    "flex-1 aspect-square rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 hover:scale-105",
                                    selectedMood === option.level
                                        ? "border-foreground bg-foreground/5 shadow-lg"
                                        : "border-border/40 hover:border-foreground/30"
                                )}
                            >
                                <span className="text-3xl">{option.emoji}</span>
                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {selectedMood && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">O que você está sentindo?</h3>
                        <div className="flex flex-wrap gap-2">
                            {EMOTIONS.map((emotion) => (
                                <button
                                    key={emotion.type}
                                    onClick={() => toggleEmotion(emotion.type)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-tighter transition-all",
                                        selectedEmotions.includes(emotion.type)
                                            ? "bg-foreground text-background"
                                            : "bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-background"
                                    )}
                                >
                                    {emotion.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {selectedMood && (
                    <div className="flex gap-3 pt-4 border-t border-border/40 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Button
                            onClick={handleSave}
                            className="flex-1 h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold text-xs uppercase tracking-tighter"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Salvar
                        </Button>
                        <Button
                            variant="outline"
                            className="px-4 h-11 rounded-xl border-border/60 font-bold text-xs uppercase tracking-tighter"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Nota
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
