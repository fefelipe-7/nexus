import type { HistoryData, TimeRecord, AreaTimeSummary, TypeTimeSummary, AdherenceMetrics, TimeInsight } from '../types/history.types';

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const addDays = (days: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() + days);
    return date;
};

const createTime = (dayOffset: number, hours: number, minutes: number) => {
    const date = addDays(dayOffset);
    date.setHours(hours, minutes, 0, 0);
    return date;
};

// Records for Today
const todayRecords: TimeRecord[] = [
    {
        id: 'r1',
        title: 'Sono e Descanso',
        area: 'health',
        type: 'rest',
        startTime: createTime(0, 0, 0),
        endTime: createTime(0, 7, 0),
        duration: 420,
        wasPlanned: true,
        status: 'concluded',
    },
    {
        id: 'r2',
        title: 'Rotina da Manhã',
        area: 'personal',
        type: 'maintenance',
        startTime: createTime(0, 7, 0),
        endTime: createTime(0, 8, 0),
        duration: 60,
        wasPlanned: true,
        status: 'concluded',
        plannedId: 'routine-morning',
    },
    {
        id: 'r3',
        title: 'Lacuna (Deslocamento)',
        area: 'untracked',
        type: 'gap',
        startTime: createTime(0, 8, 0),
        endTime: createTime(0, 8, 45),
        duration: 45,
        wasPlanned: false,
        status: 'concluded',
    },
    {
        id: 'r4',
        title: 'Trabalho Focado: Nexus MVP',
        area: 'work',
        type: 'focus',
        startTime: createTime(0, 9, 0),
        endTime: createTime(0, 11, 30),
        duration: 150,
        wasPlanned: true,
        status: 'extrapolated',
        actualDuration: 165,
        interruptions: 2,
        priorityId: 'priority-nexus',
    },
    {
        id: 'r5',
        title: 'Interrupção: Reunião não planejada',
        area: 'work',
        type: 'interruption',
        startTime: createTime(0, 10, 15),
        endTime: createTime(0, 10, 30),
        duration: 15,
        wasPlanned: false,
        status: 'concluded',
    },
    {
        id: 'r6',
        title: 'Almoço',
        area: 'health',
        type: 'maintenance',
        startTime: createTime(0, 12, 0),
        endTime: createTime(0, 13, 0),
        duration: 60,
        wasPlanned: true,
        status: 'concluded',
    },
    {
        id: 'r7',
        title: 'Trabalho: Emails e Pendências',
        area: 'work',
        type: 'obligation',
        startTime: createTime(0, 13, 30),
        endTime: createTime(0, 15, 0),
        duration: 90,
        wasPlanned: true,
        status: 'concluded',
    },
    {
        id: 'r8',
        title: 'Estudos: AWS',
        area: 'learning',
        type: 'focus',
        startTime: createTime(0, 16, 0),
        endTime: createTime(0, 17, 0),
        duration: 60,
        wasPlanned: true,
        status: 'skipped',
        notes: 'Me senti muito cansado e resolvi descansar',
    },
    {
        id: 'r9',
        title: 'Lazer e Descanso',
        area: 'personal',
        type: 'leisure',
        startTime: createTime(0, 17, 0),
        endTime: createTime(0, 19, 0),
        duration: 120,
        wasPlanned: false,
        status: 'concluded',
    },
];

// Summary by Area
const summaryByArea: AreaTimeSummary[] = [
    { area: 'health', totalTime: 480, percentage: 33, plannedTime: 480, realTime: 480 },
    { area: 'work', totalTime: 255, percentage: 18, plannedTime: 240, realTime: 255 },
    { area: 'personal', totalTime: 180, percentage: 12, plannedTime: 60, realTime: 180 },
    { area: 'learning', totalTime: 0, percentage: 0, plannedTime: 60, realTime: 0 },
    { area: 'untracked', totalTime: 525, percentage: 37, plannedTime: 0, realTime: 525 },
];

// Summary by Type
const summaryByType: TypeTimeSummary[] = [
    { type: 'rest', totalTime: 420, percentage: 29 },
    { type: 'focus', totalTime: 150, percentage: 10 },
    { type: 'maintenance', totalTime: 120, percentage: 8 },
    { type: 'obligation', totalTime: 90, percentage: 6 },
    { type: 'leisure', totalTime: 120, percentage: 8 },
    { type: 'gap', totalTime: 525, percentage: 37 },
    { type: 'interruption', totalTime: 15, percentage: 1 },
];

// Metrics
const metrics: AdherenceMetrics = {
    overallScore: 72,
    percentageConcluded: 85,
    percentageSkipped: 10,
    percentageExtrapolated: 5,
    averageFragmentSize: 42,
    totalDeepWorkTime: 150,
    contextSwitches: 8,
};

// Insights
const insights: TimeInsight[] = [
    {
        id: 'i1',
        type: 'success',
        title: 'Bom bloco de foco',
        message: 'Você manteve 150 minutos de foco profundo no projeto Nexus pela manhã.',
    },
    {
        id: 'i2',
        type: 'warning',
        title: 'Tempo fragmentado à tarde',
        message: 'Suas atividades da tarde tiveram uma duração média de apenas 25 minutos.',
        actionLabel: 'Agrupar tarefas',
    },
    {
        id: 'i3',
        type: 'suggestion',
        title: 'Subestimação de tarefas',
        message: 'Suas tarefas de trabalho tendem a levar 15% mais tempo do que o planejado.',
        actionLabel: 'Ajustar buffers',
    },
];

// Trends (Week)
const trend = [
    { period: 'Seg', focusTime: 120, fragmentation: 20 },
    { period: 'Ter', focusTime: 180, fragmentation: 15 },
    { period: 'Qua', focusTime: 90, fragmentation: 35 },
    { period: 'Qui', focusTime: 210, fragmentation: 10 },
    { period: 'Sex', focusTime: 150, fragmentation: 25 },
    { period: 'Sáb', focusTime: 30, fragmentation: 60 },
    { period: 'Dom', focusTime: 0, fragmentation: 80 },
];

export const mockHistoryData: HistoryData = {
    period: 'today',
    startDate: today,
    endDate: today,
    totalRecordedTime: 1440, // 24h
    summaryByArea,
    summaryByType,
    records: todayRecords,
    metrics,
    insights,
    trend,
};
