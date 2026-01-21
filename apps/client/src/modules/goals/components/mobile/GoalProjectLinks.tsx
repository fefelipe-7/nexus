import { Card, CardContent } from '@/ui/components/components/ui';
import {
    Puzzle,
    Zap,
    Layers,
    ArrowRight,
    TrendingUp,
    Target
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { GoalConnection } from '../../types/connections.types';

interface GoalProjectLinksProps {
    connections: GoalConnection[];
}

export function GoalProjectLinks({ connections }: GoalProjectLinksProps) {
    return (
        <div className="space-y-6">
            <div className="px-1 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5" />
                    Alavancagem por Projetos
                </h3>
            </div>

            <div className="space-y-6">
                {connections.map((conn) => (
                    <div key={conn.goalId} className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <Target className="h-3 w-3 text-muted-foreground/60" />
                                <h4 className="text-[11px] font-bold text-foreground/80 uppercase tracking-tighter">{conn.goalTitle}</h4>
                            </div>
                            <div className="flex items-center gap-1">
                                <Zap className="h-3.5 w-3.5 text-amber-500" />
                                <span className="text-[10px] font-bold text-muted-foreground">{conn.alignmentScore}% Alinhamento</span>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            {conn.projects.map((project) => (
                                <Card key={project.id} className="border-border/40 shadow-none bg-background">
                                    <CardContent className="p-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h5 className="text-sm font-bold text-foreground">{project.title}</h5>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                                                        project.priority === 'essential' ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"
                                                    )}>
                                                        {project.priority}
                                                    </span>
                                                    <span className="text-[10px] font-medium text-muted-foreground">{project.status}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black tracking-tighter tabular-nums">{project.progress}%</p>
                                            </div>
                                        </div>

                                        <div className="h-1 bg-muted/60 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-700",
                                                    project.priority === 'essential' ? "bg-amber-500" : "bg-muted-foreground/40"
                                                )}
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
