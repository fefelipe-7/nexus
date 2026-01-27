import { useState } from 'react';
import { Button, Card, CardContent } from '@/ui/components/components/ui';
import { Droplet, Plus } from 'lucide-react';
import { cn } from '@nexus/shared';
import { WaterIntake } from '../../types/nutrition.types';

interface WaterTrackerProps {
    water: WaterIntake;
    onAddWater: (amount: number) => void;
}

export function WaterTracker({ water, onAddWater }: WaterTrackerProps) {
    const progress = (water.consumed / water.goal) * 100;
    const remaining = water.goal - water.consumed;

    return (
        <Card className="border-border/40 shadow-none bg-background">
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Droplet className="h-3.5 w-3.5 text-blue-500" />
                        Hidratação
                    </h3>
                    <span className="text-[9px] font-bold text-muted-foreground">{progress.toFixed(0)}%</span>
                </div>

                <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-black tracking-tighter tabular-nums">{water.consumed}</p>
                        <span className="text-sm font-bold text-muted-foreground">/ {water.goal} ml</span>
                    </div>

                    <div className="h-2 bg-muted/60 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>

                    {remaining > 0 && (
                        <p className="text-xs text-muted-foreground">
                            Faltam <span className="font-bold text-foreground">{remaining}ml</span> para atingir a meta
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddWater(100)}
                        className="h-10 rounded-xl border-border/60 font-bold text-xs"
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        100ml
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddWater(250)}
                        className="h-10 rounded-xl border-border/60 font-bold text-xs"
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        250ml
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddWater(500)}
                        className="h-10 rounded-xl border-border/60 font-bold text-xs"
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        500ml
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
