import { ActionPlansData } from '../types/action-plans.types';

const now = new Date();

export const mockActionPlansData: ActionPlansData = {
    summary: {
        activeCount: 3,
        completedCount: 1,
        blockedCount: 1,
        needsAttentionCount: 1,
        trends: {
            period: '14 dias',
            direction: 'improving'
        }
    },
    plans: [
        {
            id: 'ap1',
            title: 'Quitar Cartão de Crédito X',
            areaId: 'finance',
            shortTermGoalId: 'st1',
            yearlyGoalId: 'y1',
            description: 'Plano focado em eliminar a dívida do cartão de crédito principal para liberar fluxo de caixa para a reserva de emergência.',
            expectedResult: 'Fatura zerada e cancelamento de anuidade ou renegociação.',
            deadline: new Date(2026, 2, 15),
            status: 'on_track',
            progress: 45,
            complexity: 'medium',
            impact: 'high',
            steps: [
                {
                    id: 'step1',
                    order: 1,
                    title: 'Levantamento e Diagnóstico',
                    status: 'completed',
                    criteriaForCompletion: 'Planilha contendo valor total, juros e prazos.',
                    actions: [
                        { id: 'a1', title: 'Exportar extratos dos últimos 3 meses', effortEstimate: 'low', isRecurrent: false, isCompleted: true },
                        { id: 'a2', title: 'Categorizar gastos por essencialidade', effortEstimate: 'medium', isRecurrent: false, isCompleted: true }
                    ],
                    dependencies: []
                },
                {
                    id: 'step2',
                    order: 2,
                    title: 'Negociação com o Banco',
                    status: 'in_progress',
                    criteriaForCompletion: 'Acordo assinado ou condições de parcelamento aceitas.',
                    actions: [
                        { id: 'a3', title: 'Ligar para a central de atendimento', effortEstimate: 'medium', isRecurrent: false, isCompleted: false },
                        { id: 'a4', title: 'Comparar taxas com empréstimo pessoal', effortEstimate: 'low', isRecurrent: false, isCompleted: true }
                    ],
                    dependencies: [
                        { id: 'd1', type: 'information', description: 'Consultar score de crédito antes da ligação', isResolved: true }
                    ]
                },
                {
                    id: 'step3',
                    order: 3,
                    title: 'Ajuste Orçamentário e Pagamento',
                    status: 'pending',
                    criteriaForCompletion: 'Pagamento da primeira parcela ou quitação total efetuada.',
                    actions: [
                        { id: 'a5', title: 'Reduzir verba de lazer em 50%', effortEstimate: 'high', isRecurrent: true, isCompleted: false },
                        { id: 'a6', title: 'Automatizar o débito em conta', effortEstimate: 'low', isRecurrent: false, isCompleted: false }
                    ],
                    dependencies: [
                        { id: 'd2', type: 'money', description: 'Liberação do bônus de performance de Janeiro', isResolved: false }
                    ]
                }
            ],
            createdAt: new Date(2026, 0, 10),
            updatedAt: now,
            lastProgressAt: new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000))
        },
        {
            id: 'ap2',
            title: 'Migração de Carreira: Backend para Cloud',
            areaId: 'career',
            shortTermGoalId: 'st2',
            yearlyGoalId: 'y2',
            description: 'Plano de estudos intensivo e prática laboratorial para transição de stack técnica.',
            expectedResult: 'Capacidade técnica de liderança em projetos Cloud Native.',
            status: 'blocked',
            progress: 20,
            complexity: 'complex',
            impact: 'high',
            steps: [
                {
                    id: 'step-career-1',
                    order: 1,
                    title: 'Fundamentos de Infraestrutura como Código',
                    status: 'blocked',
                    criteriaForCompletion: 'Conclusão dos cursos de Terraform e CloudFormation.',
                    actions: [
                        { id: 'a7', title: 'Finalizar curso da Udemy', effortEstimate: 'high', isRecurrent: false, isCompleted: false },
                        { id: 'a8', title: 'Criar repositório com templates padrão', effortEstimate: 'medium', isRecurrent: false, isCompleted: false }
                    ],
                    dependencies: [
                        { id: 'd3', type: 'energy', description: 'Recuperação de burnout leve detectado pela Visão Geral', isResolved: false }
                    ]
                }
            ],
            createdAt: new Date(2026, 0, 5),
            updatedAt: now
        }
    ]
};
