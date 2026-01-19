import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockHistoryData } from '../data/mockHistoryData';
import { Info, BarChart3, Clock, LayoutGrid, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { HistoryPeriod, TYPE_COLORS, TYPE_LABELS } from '../types/history.types';

import {
    HistoryHeader,
    TimeDistributionChart,
    RealTimeline,
    AdherenceStats,
    InsightCard,
} from '../components/mobile';

export function History() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const [period, setPeriod] = useState<HistoryPeriod>('today');
    const data = mockHistoryData;

    const handlePeriodChange = (p: HistoryPeriod) => {
        setPeriod(p);
        // In a real app, we would fetch data for the new period here
    };

    if (isMobileView) {
        return (
            <div className="space-y-6 pb-20">
                {/* Header & Retrospective */}
                <HistoryHeader
                    period={period}
                    totalTime={data.totalRecordedTime}
                    score={data.metrics.overallScore}
                    onPeriodChange={handlePeriodChange}
                    insight={data.insights[0].message}
                />

                {/* Global Distribution */}
                <TimeDistributionChart
                    summaryByArea={data.summaryByArea}
                    summaryByType={data.summaryByType}
                />

                {/* Real Timeline */}
                <RealTimeline records={data.records} />

                {/* Metrics */}
                <AdherenceStats metrics={data.metrics} />

                {/* Insights & Actions */}
                <section className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground px-1 uppercase tracking-wider">
                        Inteligência e Sugestões
                    </h3>
                    <div className="space-y-3">
                        {data.insights.map((insight) => (
                            <InsightCard key={insight.id} insight={insight} />
                        ))}
                    </div>
                </section>

                {/* Longitude Trend (Simplified for Mobile) */}
                <section className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground px-1 uppercase tracking-wider">
                        Evolução Semanal
                    </h3>
                    <Card className="p-4">
                        <div className="flex items-end justify-between h-32 gap-2">
                            {data.trend.map((t, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col-reverse h-full bg-muted rounded-t-md overflow-hidden">
                                        <div
                                            className="bg-primary/60 transition-all hover:bg-primary"
                                            style={{ height: `${(t.focusTime / 240) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{t.period}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <span>Tempo de Foco</span>
                            </div>
                        </div>
                    </Card>
                </section>
            </div>
        );
    }

    // Desktop View
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Histórico do Tempo</h1>
                    <p className="text-muted-foreground">Para onde meu tempo realmente foi?</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Exportar Dados</Button>
                    <Button size="sm">Novo Registro Manual</Button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Left Column - Metrics and Distribution */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <HistoryHeader
                        period={period}
                        totalTime={data.totalRecordedTime}
                        score={data.metrics.overallScore}
                        onPeriodChange={handlePeriodChange}
                        insight={data.insights[0].message}
                    />

                    <AdherenceStats metrics={data.metrics} />

                    <TimeDistributionChart
                        summaryByArea={data.summaryByArea}
                        summaryByType={data.summaryByType}
                    />
                </div>

                {/* Center Column - Timeline */}
                <div className="col-span-12 lg:col-span-5 space-y-6">
                    <RealTimeline records={data.records} />
                </div>

                {/* Right Column - Insights and Trends */}
                <div className="col-span-12 lg:col-span-3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Insights Estratégicos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.insights.map((insight) => (
                                <InsightCard key={insight.id} insight={insight} />
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Tendência de Foco
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between h-40 gap-1.5">
                                {data.trend.map((t, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full flex flex-col-reverse h-full bg-muted/30 rounded-t-sm overflow-hidden">
                                            <div
                                                className="bg-primary/80"
                                                style={{ height: `${(t.focusTime / 240) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{t.period}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
