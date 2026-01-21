import { ConnectionsData } from '../types/connections.types';

export const mockConnectionsData: ConnectionsData = {
    metrics: {
        goalsWithHabitsPct: 75,
        goalsWithProjectsPct: 80,
        strategicProjectPct: 65,
        systemCoherence: 82
    },
    connections: [
        {
            goalId: 'l1',
            goalTitle: 'Liberdade Financeira',
            level: 'life',
            areaId: 'finance',
            alignmentScore: 90,
            habits: [
                {
                    id: 'h1',
                    title: 'Registrar gastos diariamente',
                    impact: 'high',
                    type: 'direct',
                    consistency: 95,
                    isSustaining: true
                },
                {
                    id: 'h2',
                    title: 'Revisão orçamentária semanal',
                    impact: 'medium',
                    type: 'support',
                    consistency: 80,
                    isSustaining: true
                }
            ],
            projects: [
                {
                    id: 'p1',
                    title: 'Quitação Cartão de Crédito X',
                    impact: 'high',
                    priority: 'essential',
                    status: 'In Progress',
                    progress: 45
                }
            ]
        },
        {
            goalId: 'y2',
            goalTitle: 'Certificação Solutions Architect',
            level: 'yearly',
            areaId: 'career',
            alignmentScore: 65,
            habits: [
                {
                    id: 'h3',
                    title: 'Deep Work (Estudo AWS)',
                    impact: 'high',
                    type: 'direct',
                    consistency: 40,
                    isSustaining: false
                }
            ],
            projects: [
                {
                    id: 'p2',
                    title: 'Laboratório VPC Complexa',
                    impact: 'medium',
                    priority: 'important',
                    status: 'Paused',
                    progress: 15
                }
            ]
        }
    ],
    diagnostics: [
        {
            id: 'dg1',
            title: 'Hábito Órfão Detectado',
            type: 'orphan_habit',
            risk: 'medium',
            description: 'O hábito "Caminhada Noturna" não está vinculado a nenhum objetivo de saúde ativo.',
            suggestion: 'Vincule-o a um objetivo de Vitalidade ou considere-o apenas como manutenção.'
        },
        {
            id: 'dg2',
            title: 'Sobrecarga de Objetivos',
            type: 'overloaded_goal',
            risk: 'high',
            description: 'A meta "Certificação" possui 5 projetos associados, superando sua capacidade de energia.',
            suggestion: 'Pause 2 projetos acessórios para focar no fluxo de trabalho essencial.'
        }
    ]
};
