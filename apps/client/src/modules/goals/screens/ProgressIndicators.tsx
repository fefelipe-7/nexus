import { useState } from 'react';
import { ProgressHeader } from '../components/mobile/ProgressHeader';
import { ProgressScore } from '../components/mobile/ProgressScore';
import { ProgressKPIs } from '../components/mobile/ProgressKPIs';
import { ProgressHierarchy } from '../components/mobile/ProgressHierarchy';
import { ProgressInsights } from '../components/mobile/ProgressInsights';
import { mockProgressData } from '../data/mockProgressData';
import { ProgressContext } from '../types/progress-indicators.types';

export function ProgressIndicators() {
    const [context, setContext] = useState<ProgressContext>('general');
    const [period, setPeriod] = useState('Últimos 30 dias');

    return (
        <div className="p-4 sm:p-6 space-y-10 pb-32 max-w-2xl mx-auto min-h-screen bg-background">
            <ProgressHeader
                context={context}
                period={period}
                onContextChange={setContext}
                onPeriodChange={setPeriod}
            />

            <section className="space-y-6">
                <ProgressScore score={mockProgressData.score} />
                <ProgressKPIs kpis={mockProgressData.kpis} />
            </section>

            <section className="pt-4 border-t border-border/40">
                <ProgressHierarchy hierarchy={mockProgressData.hierarchy} />
            </section>

            <section className="pt-4 border-t border-border/40">
                <ProgressInsights
                    bottlenecks={mockProgressData.bottlenecks}
                    recommendations={mockProgressData.recommendations}
                />
            </section>

            {/* Strategic Footer */}
            <footer className="pt-12 text-center space-y-6 border-t border-border/40">
                <div className="max-w-[280px] mx-auto space-y-3 px-4">
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                        "Métricas sem interpretação são apenas ruído. O progresso real nasce do ajuste consciente baseado em dados."
                    </p>
                </div>
            </footer>
        </div>
    );
}
