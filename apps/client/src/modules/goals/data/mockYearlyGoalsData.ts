import { YearlyGoalsData } from '../types/yearly-goals.types';

const now = new Date();
const currentYear = now.getFullYear();

export const mockYearlyGoalsData: YearlyGoalsData = {
    summary: {
        year: 2026,
        activeCount: 6,
        completedCount: 1,
        yearProgress: 15, // Aproximadamente meados de Fevereiro
        status: 'balanced',
        messages: [
            'Este ano tem um foco equilibrado, com ênfase em Saúde e Carreira.',
            'Você ainda possui espaço para 2 objetivos estratégicos se necessário.'
        ],
        distribution: {
            health: 2,
            finance: 1,
            career: 2,
            relationships: 1,
            personal_development: 0,
            leisure: 0,
            purpose: 0,
        }
    },
    goals: [
        {
            id: 'y1',
            title: 'Consolidar reserva de emergência de 6 meses',
            description: 'Atingir o valor de R$ 30.000,00 em aplicações de liquidez imediata.',
            whyThisYear: 'Para garantir tranquilidade durante a transição de carreira planejada para o ano que vem.',
            impactIfAchieved: 'Redução drástica do estresse financeiro e maior poder de negociação profissional.',
            riskIfIgnored: 'Vulnerabilidade a imprevistos que podem forçar o adiamento de planos maiores.',
            areaId: 'finance',
            relatedLifeGoalId: '1', // Conectado ao objetivo de vida "Estabilidade financeira"
            importance: 'high',
            status: 'active',
            period: 'Year',
            successCriteria: [
                'Saldo em conta de investimento atingir R$ 30k',
                'Aportes mentais consistentes de R$ 2k',
                'Nenhum resgate realizado para gastos não emergenciais'
            ],
            activeMetaIds: ['meta-fin-1'],
            perceivedConsistency: 80,
            financialImpact: 24000,
            createdAt: new Date(2026, 0, 1),
            updatedAt: now,
            lastReviewedAt: new Date(2026, 0, 15),
            revisions: []
        },
        {
            id: 'y2',
            title: 'Dominar arquitetura de software Cloud Native',
            description: 'Obter certificação AWS Solutions Architect e liderar um projeto de refatoração.',
            whyThisYear: 'É o requisito técnico principal para a promoção desejada no segundo semestre.',
            impactIfAchieved: 'Reconhecimento técnico e aumento salarial de 20%.',
            riskIfIgnored: 'Estagnação nas responsabilidades atuais e perda de relevância no time.',
            areaId: 'career',
            relatedLifeGoalId: '2', // Conectado ao objetivo de vida "Liderança"
            importance: 'high',
            status: 'active',
            period: 'H1',
            successCriteria: [
                'Certificação AWS aprovada',
                'Documentação da nova arquitetura concluída',
                'Redução de 15% nos custos de infraestrutura no projeto Alpha'
            ],
            activeMetaIds: ['meta-career-1'],
            perceivedConsistency: 65,
            timeInvestedHours: 42,
            createdAt: new Date(2026, 0, 5),
            updatedAt: now,
            revisions: []
        },
        {
            id: 'y3',
            title: 'Reduzir percentual de gordura para 15%',
            description: 'Implementar rotina de treino de força 4x por semana e dieta equilibrada.',
            whyThisYear: 'Recuperar a disposição física que sinto ter perdido nos últimos 2 anos de sedentarismo.',
            impactIfAchieved: 'Melhor disposição diária, sono mais profundo e maior autoestima.',
            riskIfIgnored: 'Risco aumentado de problemas metabólicos e fadiga crônica.',
            areaId: 'health',
            relatedLifeGoalId: '3', // Conectado ao objetivo de vida "Corpo como Templo"
            importance: 'medium',
            status: 'active',
            period: 'Year',
            successCriteria: [
                'Adesão de 90% aos treinos planejados',
                'Avaliação física trimestral mostrando evolução',
                'Peso estabilizado com maior massa magra'
            ],
            activeMetaIds: ['meta-health-1'],
            perceivedConsistency: 90,
            createdAt: new Date(2026, 0, 2),
            updatedAt: now,
            revisions: []
        },
        {
            id: 'y4',
            title: 'Viagem de 10 dias com a família',
            description: 'Planejar e executar viagem sem distrações de trabalho para fortalecer vínculos.',
            whyThisYear: 'Compensar o excesso de ausência no ano passado devido ao lançamento do Nexus.',
            impactIfAchieved: 'Memórias duradouras e reconexão emocional profunda.',
            riskIfIgnored: 'Afastamento progressivo e perda de momentos irrepetíveis com os filhos.',
            areaId: 'relationships',
            relatedLifeGoalId: '4', // Conectado ao objetivo de vida "Conexões Autênticas"
            importance: 'high',
            status: 'planned',
            period: 'Q3',
            successCriteria: [
                'Roteiro definido e voos comprados até Abril',
                'Budget da viagem totalmente poupado antecipadamente',
                '10 dias de "Digital Detox" absoluto'
            ],
            activeMetaIds: [],
            perceivedConsistency: 0,
            createdAt: new Date(2026, 0, 10),
            updatedAt: now,
            revisions: []
        },
        {
            id: 'y5',
            title: 'Concluir curso de Liderança Facilitadora',
            description: 'Terminar os 12 módulos e aplicar as técnicas nas reuniões de 1:1.',
            whyThisYear: 'Fortalecer a base humana para a meta de dominar arquitetura.',
            impactIfAchieved: 'Time mais engajado e turn-over reduzido.',
            riskIfIgnored: 'Dificuldade em gerenciar conflitos no novo nível de senioridade.',
            areaId: 'career',
            relatedLifeGoalId: '2',
            importance: 'medium',
            status: 'completed',
            period: 'Q1',
            successCriteria: [
                'Certificado de conclusão emitido',
                'Novo formato de 1:1 implementado com sucesso'
            ],
            activeMetaIds: [],
            perceivedConsistency: 100,
            createdAt: new Date(2025, 11, 20),
            updatedAt: new Date(2026, 0, 30),
            revisions: []
        }
    ]
};
