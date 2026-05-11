import { ModuleData } from '@/types';

export const mockModules: Record<string, ModuleData> = {
  vida: {
    title: 'Vida',
    description: 'Organização pessoal, hábitos e rotina diária.',
    cards: [
      {
        id: 'habit',
        title: 'Hábitos',
        value: '8/10',
        subtitle: 'Consistência',
        color: '#F59E0B',
      } as any,
    ],
    quickActions: [],
  },
  mente: {
    title: 'Mente',
    description: 'Foco, clareza mental e bem‑estar emocional.',
    cards: [],
    quickActions: [],
  },
  saude: {
    title: 'Saúde',
    description: 'Sono, atividade física e indicadores corporais.',
    cards: [],
    quickActions: [],
  },
  acao: {
    title: 'Ação',
    description: 'Tarefas, projetos e produtividade.',
    cards: [],
    quickActions: [],
  },
  financa: {
    title: 'Finança',
    description: 'Gastos, receitas e metas financeiras.',
    cards: [],
    quickActions: [],
  },
};