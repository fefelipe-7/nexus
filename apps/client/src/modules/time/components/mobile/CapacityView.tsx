import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { Clock, Unlock, BatteryMedium, AlertTriangle } from 'lucide-react';
import { CapacityMetrics } from '../../types/planning.types';

interface CapacityViewProps {
    metrics: CapacityMetrics;
}

export function CapacityView({ metrics }: CapacityViewProps) {
    const allocatedPercentage = (metrics.fixedCommitmentsHours / 168) * 100;
    const availablePercentage = (metrics.availableHours / 168) * 100;
    const focusSafeZone = (metrics.recommendedFocusHours / metrics.availableHours) * 100;

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center px-4">
                <h3 className="text-lg font-bold">Capacidade Semanal</h3>
                <p className="text-xs text-muted-foreground">
                    Entenda quanto tempo você realmente tem disponível para avançar em seus projetos.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border-none bg-blue-500/5">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-3.5 w-3.5 text-blue-500" />
                        <p className="text-[10px] font-bold uppercase tracking-tight text-blue-600">Fixos e Essenciais</p>
                    </div>
                    <p className="text-2xl font-bold">{metrics.fixedCommitmentsHours}h</p>
                    <p className="text-[10px] text-muted-foreground">Sono, trabalho, rotinas</p>
                </Card>

                <Card className="p-4 border-none bg-green-500/5">
                    <div className="flex items-center gap-2 mb-2">
                        <Unlock className="h-3.5 w-3.5 text-green-500" />
                        <p className="text-[10px] font-bold uppercase tracking-tight text-green-600">Tempo Livre Real</p>
                    </div>
                    <p className="text-2xl font-bold">{metrics.availableHours}h</p>
                    <p className="text-[10px] text-muted-foreground">Para alocação livre</p>
                </Card>
            </div>

            {/* Recommended Focus Bar */}
            <section className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <BatteryMedium className="h-4 w-4 text-purple-500" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Teto Especial de Foco</h4>
                    </div>
                    <span className="text-xs font-bold text-purple-600">{metrics.recommendedFocusHours}h / semana</span>
                </div>

                <Card className="p-4">
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-muted rounded-md overflow-hidden flex">
                            <div
                                className="h-full bg-blue-400 opacity-50"
                                style={{ width: `${allocatedPercentage}%` }}
                            />
                            <div
                                className="h-full bg-green-400 opacity-50"
                                style={{ width: `${availablePercentage}%` }}
                            />
                            <div
                                className="h-full bg-slate-200"
                                style={{ width: `${100 - allocatedPercentage - availablePercentage}%` }}
                            />
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-sm bg-blue-400 opacity-50" />
                                <span>Ocupado</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-green-600">
                                <div className="w-2 h-2 rounded-sm bg-green-400 opacity-50" />
                                <span>Livre</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <div className="w-2 h-2 rounded-sm bg-slate-200" />
                                <span>Indefinido</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="flex gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-700 font-medium leading-tight">
                        Cuidado: Planejar mais de 20h de foco profundo por semana costuma levar ao burnout. Mantenha-se na zona segura.
                    </p>
                </div>
            </section>
        </div>
    );
}
