import {
    ShieldAlert,
    Lightbulb,
    ArrowRight,
    Brain,
    Zap,
    Layout,
    Activity,
    AlertTriangle
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { CoherenceIssue } from '../../types/connections.types';

interface CoherenceDiagnosticProps {
    issues: CoherenceIssue[];
}

export function CoherenceDiagnostic({ issues }: CoherenceDiagnosticProps) {
    return (
        <div className="space-y-6">
            <div className="px-1 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                    Diagnóstico de Coerência
                </h3>
            </div>

            <div className="grid gap-3">
                {issues.map((issue) => (
                    <div
                        key={issue.id}
                        className={cn(
                            "p-5 rounded-2xl border bg-background space-y-4",
                            issue.risk === 'high' ? "border-rose-500/20 shadow-sm shadow-rose-500/5" : "border-amber-500/20"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "p-1.5 rounded-lg bg-muted/50",
                                    issue.risk === 'high' ? "text-rose-500" : "text-amber-500"
                                )}>
                                    <AlertTriangle className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                                    {issue.type.replace('_', ' ')}
                                </span>
                            </div>
                            <span className={cn(
                                "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                                issue.risk === 'high' ? "bg-rose-500/10 text-rose-600" : "bg-amber-500/10 text-amber-600"
                            )}>
                                Risco {issue.risk}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-foreground">{issue.title}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">{issue.description}</p>
                        </div>

                        <div className="pt-3 border-t border-border/40 flex items-start gap-3">
                            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-foreground uppercase tracking-tighter">Sugestão de Ajuste</p>
                                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium leading-relaxed italic">
                                    "{issue.suggestion}"
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
