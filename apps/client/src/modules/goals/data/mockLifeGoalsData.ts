import { LifeGoalsData, LifeArea } from '../types/life-goals.types';

export const LIFE_AREAS: LifeArea[] = [
    { id: 'health', name: 'Saúde', icon: 'heart', color: '#ef4444' },
    { id: 'finance', name: 'Financeiro', icon: 'wallet', color: '#10b981' },
    { id: 'career', name: 'Carreira', icon: 'briefcase', color: '#3b82f6' },
    { id: 'relationships', name: 'Relacionamentos', icon: 'users', color: '#ec4899' },
    { id: 'personal_development', name: 'Desenvolvimento Pessoal', icon: 'brain', color: '#8b5cf6' },
    { id: 'leisure', name: 'Lazer & Qualidade de Vida', icon: 'palmtree', color: '#f59e0b' },
    { id: 'purpose', name: 'Contribuição & Propósito', icon: 'sparkles', color: '#06b6d4' },
];

const now = new Date();

export const mockLifeGoalsData: LifeGoalsData = {
    summary: {
        activeCount: 5,
        lastReviewDate: new Date(now.getFullYear(), now.getMonth() - 1, 15),
        alignmentLevel: 'medium',
        alignmentMessage: 'Seus objetivos estão bem distribuídos, mas o foco financeiro domina o horizonte atual.',
        distribution: {
            health: 1,
            finance: 2,
            career: 1,
            relationships: 1,
            personal_development: 0,
            leisure: 0,
            purpose: 0,
        }
    },
    areas: LIFE_AREAS,
    goals: [
        {
            id: '1',
            title: 'Ter estabilidade para viver sem ansiedade',
            description: 'Eu quero ter uma reserva financeira que me permita tomar decisões baseadas em valores, não em necessidade imediata.',
            fullDescription: 'Construir um patrimônio que gere renda passiva suficiente para cobrir custos básicos de vida, permitindo-me focar em projetos criativos sem pressão financeira.',
            areaId: 'finance',
            horizon: '5-10 anos',
            status: 'active',
            clarityDegree: 85,
            whyItMatters: 'A segurança financeira é a fundação para minha liberdade criativa e paz mental.',
            successIndicators: [
                'Reserva de emergência completa (12 meses)',
                'Renda passiva cobrindo 50% dos custos fixos',
                'Capacidade de dizer "não" a projetos desalinhados sem medo'
            ],
            whatIsNotIncluded: [
                'Acumular luxos desnecessários',
                'Focar apenas em números sem aproveitar o presente'
            ],
            relatedMetaIds: ['meta-financial-1', 'meta-financial-2'],
            clarity: 90,
            progessPerception: 40,
            consistency: 75,
            createdAt: new Date(now.getFullYear() - 1, 0, 1),
            updatedAt: new Date(now.getFullYear(), now.getMonth(), 5),
            lastReviewedAt: new Date(now.getFullYear(), now.getMonth() - 1, 15),
            revisions: [
                { id: 'r1', date: new Date(now.getFullYear() - 1, 6, 1), note: 'Refinamento do valor da reserva de emergência.', changesMade: true }
            ]
        },
        {
            id: '2',
            title: 'Ser uma referência de liderança empática',
            description: 'Eu busco desenvolver habilidades que inspirem pessoas ao meu redor a crescerem com propósito.',
            areaId: 'career',
            horizon: 'Contínuo',
            status: 'active',
            clarityDegree: 70,
            whyItMatters: 'Acredito que o trabalho é uma plataforma de desenvolvimento humano, e quero potenciar isso.',
            successIndicators: [
                'Feedback positivo de mentorados',
                'Ambiente de trabalho com alta confiança',
                'Resultados alcançados coletivamente com saúde mental'
            ],
            whatIsNotIncluded: [
                'Escalar posições a qualquer custo',
                'Liderança baseada em comando e controle'
            ],
            relatedMetaIds: ['meta-career-1'],
            clarity: 70,
            progessPerception: 60,
            consistency: 80,
            createdAt: new Date(now.getFullYear() - 2, 3, 10),
            updatedAt: new Date(now.getFullYear(), now.getMonth(), 1),
            revisions: []
        },
        {
            id: '3',
            title: 'Manter meu corpo como meu templo de energia',
            description: 'Quero ter vitalidade suficiente para viver aventuras e envelhecer com autonomia total.',
            areaId: 'health',
            horizon: 'Contínuo',
            status: 'active',
            clarityDegree: 95,
            whyItMatters: 'Sem saúde física, todos os outros objetivos perdem o suporte.',
            successIndicators: [
                'Exames de sangue em níveis ótimos',
                'Capacidade de correr 5km sem dificuldade extrema',
                'Sono de qualidade na maior parte das noites'
            ],
            whatIsNotIncluded: [
                'Fisiculturismo ou estética extrema',
                'Dietas restritivas que retirem o prazer de comer'
            ],
            relatedMetaIds: ['meta-health-1', 'meta-health-2'],
            clarity: 95,
            progessPerception: 50,
            consistency: 90,
            createdAt: new Date(now.getFullYear() - 1, 11, 20),
            updatedAt: now,
            revisions: []
        },
        {
            id: '4',
            title: 'Cultivar conexões profundas e autênticas',
            description: 'Desejo estar presente para as pessoas que amo, construindo memórias que durarão a vida toda.',
            areaId: 'relationships',
            horizon: 'Contínuo',
            status: 'active',
            clarityDegree: 60,
            whyItMatters: 'A felicidade humana está intrinsecamente ligada à qualidade dos nossos relacionamentos.',
            successIndicators: [
                'Encontros significativos semanais com família/amigos',
                'Capacidade de ouvir ativamente sem julgamento',
                'Relações baseadas em vulnerabilidade e apoio mútuo'
            ],
            whatIsNotIncluded: [
                'Networking estratégico frio',
                'Agradar a todos em detrimento de mim mesmo'
            ],
            relatedMetaIds: [],
            clarity: 50,
            progessPerception: 30,
            consistency: 40,
            createdAt: new Date(now.getFullYear(), 0, 1),
            updatedAt: now,
            revisions: []
        }
    ]
};
