import { ProgressIndicatorsData } from '../types/progress-indicators.types';

const now = new Date();
const days = (n: number) => new Date(now.getTime() - (n * 24 * 60 * 60 * 1000));

export const mockProgressData: ProgressIndicatorsData = {
    score: {
        value: 78,
        trend: 'improving',
        interpretation: 'Progresso Consistente',
        narrative: 'Seu ritmo de execução está 12% acima da média do último trimestre. Você está conseguindo converter planejamento em ação com alta fidelidade nas áreas de Finanças e Carreira.'
    },
    kpis: [
        {
            id: 'kpi1',
            title: 'Ritmo de Execução',
            value: 85,
            unit: '%',
            variation: '+5%',
            trend: 'improving',
            interpretation: 'Planos ativos com avanço nos últimos 7 dias.',
            category: 'rhythm'
        },
        {
            id: 'kpi2',
            title: 'Taxa de Conclusão',
            value: 92,
            unit: '%',
            variation: 'Estável',
            trend: 'stable',
            interpretation: 'Etapas concluídas dentro do prazo original.',
            category: 'completion'
        },
        {
            id: 'kpi3',
            title: 'Consistência',
            value: 6.2,
            unit: 'dias/sem',
            variation: '-0.3',
            trend: 'declining',
            interpretation: 'Frequência de ações realizadas por semana.',
            category: 'consistency'
        },
        {
            id: 'kpi4',
            title: 'Foco (Capacidade)',
            value: 4,
            unit: 'objs',
            variation: 'Ideal',
            trend: 'stable',
            interpretation: 'Número de objetivos ativos simultaneamente.',
            category: 'focus'
        }
    ],
    hierarchy: [
        {
            id: 'l1',
            title: 'Liberdade Financeira',
            level: 'life',
            progress: 42,
            status: 'on_track',
            children: [
                {
                    id: 'y1',
                    title: 'Reserva de Emergência de R$ 30k',
                    level: 'yearly',
                    progress: 65,
                    status: 'on_track',
                    children: [
                        {
                            id: 'st1',
                            title: 'Aportar R$ 3.000 mensais',
                            level: 'short_term',
                            progress: 80,
                            status: 'on_track',
                            bottleneck: 'Nenhum'
                        }
                    ]
                }
            ]
        },
        {
            id: 'l2',
            title: 'Carreira e Impacto',
            level: 'life',
            progress: 25,
            status: 'needs_attention',
            children: [
                {
                    id: 'y2',
                    title: 'Certificação Solutions Architect',
                    level: 'yearly',
                    progress: 30,
                    status: 'needs_attention',
                    bottleneck: 'Sobrecarga de estudos',
                    children: [
                        {
                            id: 'st2',
                            title: 'Módulo de Segurança AWS',
                            level: 'short_term',
                            progress: 15,
                            status: 'at_risk',
                            bottleneck: 'Baixa energia'
                        }
                    ]
                }
            ]
        }
    ],
    bottlenecks: [
        {
            id: 'b1',
            title: 'Fadiga de Decisão',
            impact: 'high',
            origin: 'energy',
            description: 'O plano de "Migração de Carreira" está parado há 8 dias devido ao alto esforço cognitivo exigido no fim do dia.',
            suggestion: 'Mova as atividades de estudo para o primeiro bloco da manhã (Deep Work).'
        },
        {
            id: 'b2',
            title: 'Dependência de Terceiros',
            impact: 'medium',
            origin: 'structure',
            description: 'A etapa de "Negociação com o Banco" aguarda retorno de e-mail.',
            suggestion: 'Utilize o canal telefônico para acelerar a resposta e desbloquear o plano financeiro.'
        }
    ],
    temporalTrends: [
        { date: days(30), planned: 10, real: 8 },
        { date: days(21), planned: 25, real: 22 },
        { date: days(14), planned: 40, real: 45 },
        { date: days(7), planned: 60, real: 68 },
        { date: now, planned: 75, real: 78 }
    ],
    recommendations: [
        {
            title: 'Pausar Meta de Lazer Temporariamente',
            description: 'Você está com 5 metas ativas e a área de saúde está sofrendo queda de consistência.',
            action: 'Arquivar "Roteiro de Viagem" por 2 semanas'
        },
        {
            title: 'Revisar Plano de Estudos',
            description: 'A complexidade da etapa atual está gerando procrastinação.',
            action: 'Quebrar etapa 2 em 4 ações menores'
        }
    ]
};
