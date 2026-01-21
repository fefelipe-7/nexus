import { ReviewsData } from '../types/reviews.types';

const now = new Date();
const lastWeek = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
const nextWeek = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000));

export const mockReviewsData: ReviewsData = {
    agenda: [
        {
            id: 'ag1',
            type: 'weekly',
            scheduledDate: nextWeek,
            status: 'scheduled',
            lastReviewDate: lastWeek
        },
        {
            id: 'ag2',
            type: 'monthly',
            scheduledDate: new Date(2026, 1, 1),
            status: 'overdue',
            lastReviewDate: new Date(2026, 0, 1)
        },
        {
            id: 'ag3',
            type: 'quarterly',
            scheduledDate: new Date(2026, 3, 1),
            status: 'scheduled'
        }
    ],
    history: [
        {
            id: 'rev1',
            type: 'weekly',
            title: 'Revisão Semanal - Semana 2, Jan 2026',
            date: lastWeek,
            status: 'completed',
            summary: 'Uma semana de forte avanço financeiro, mas com gargalos claros na área de estudos AWS devido à fadiga noturna.',
            reflectionBlocks: [
                {
                    id: 'b1',
                    title: 'O que avançou de forma significativa?',
                    content: 'O aporte do cartão de crédito foi realizado antes do esperado. A negociação com o banco avançou para a fase de contrato.',
                    sentiment: 'positive',
                    tags: ['finanças', 'execução']
                },
                {
                    id: 'b2',
                    title: 'O que ficou parado?',
                    content: 'Os laboratórios de VPC não foram iniciados. Sinto que a energia após o trabalho não é suficiente para tarefas complexas.',
                    sentiment: 'negative',
                    tags: ['estudos', 'energia']
                }
            ],
            learnings: [
                'Decisões complexas devem ser tomadas no primeiro bloco do dia.',
                'O uso de e-mail para negociações bancárias é ineficiente em comparação ao chat/telefone.'
            ],
            decisions: [
                {
                    id: 'd1',
                    type: 'plan_revision',
                    title: 'Mover estudos para a manhã',
                    description: 'Acordar 45 min mais cedo para concluir labs antes do trabalho.',
                    targetId: 'ap2',
                    status: 'applied'
                },
                {
                    id: 'd2',
                    type: 'priority_shift',
                    title: 'Focar na quitação total do cartão',
                    description: 'Aumentar o esforço financeiro para fechar a fatura em Fevereiro em vez de Março.',
                    targetId: 'ap1',
                    status: 'applied'
                }
            ],
            scoreAtReview: 75,
            activeGoalsCount: 4,
            createdAt: lastWeek,
            updatedAt: lastWeek
        }
    ]
};
