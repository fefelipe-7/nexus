import {
  LayoutDashboard, Wallet, Clock, Target, Heart, Users,
  Briefcase, Home, FolderKanban, Globe, Camera, TrendingUp,
  DollarSign, Calendar, Activity, GraduationCap, Package,
  Shield, BookOpen, Award, CreditCard, PiggyBank, TrendingDown,
  Receipt, Repeat, BarChart3, Building2, Wrench, FileText,
  Car, Smartphone, Lock, Cloud, Sparkles, Brain, Bell
} from 'lucide-react';
import { ModuleConfig } from '@/types/modules.types';

export const MODULES: ModuleConfig = {
  OVERVIEW: {
    id: 'overview',
    name: 'Visão Geral',
    icon: LayoutDashboard,
    path: '/overview',
    color: 'blue',
    description: 'Ponto de entrada do Nexus. Visão consolidada de tudo.',
    submodules: [
      { id: 'weekly', name: 'Resumo da Semana', path: '/overview/weekly' },
      { id: 'alerts', name: 'Alertas Importantes', path: '/overview/alerts', icon: Bell },
      { id: 'pending', name: 'Pendências Críticas', path: '/overview/pending' },
      { id: 'upcoming', name: 'Próximos Eventos', path: '/overview/upcoming', icon: Calendar },
      { id: 'suggestions', name: 'Sugestões Inteligentes', path: '/overview/suggestions', icon: Sparkles },
    ]
  },
  
  MONEY: {
    id: 'money',
    name: 'Dinheiro',
    icon: Wallet,
    path: '/money',
    color: 'green',
    description: 'Tudo que envolve valor financeiro, sem divisão artificial.',
    submodules: [
      { id: 'cashflow', name: 'Fluxo de Dinheiro', path: '/money/cashflow', icon: DollarSign },
      { id: 'accounts', name: 'Contas e Carteiras', path: '/money/accounts', icon: Building2 },
      { id: 'cards', name: 'Cartões', path: '/money/cards', icon: CreditCard },
      { id: 'budget', name: 'Orçamento', path: '/money/budget', icon: PiggyBank },
      { id: 'purchases', name: 'Compras e Gastos', path: '/money/purchases', icon: Receipt },
      { id: 'subscriptions', name: 'Assinaturas', path: '/money/subscriptions', icon: Repeat },
      { id: 'debts', name: 'Dívidas e Parcelamentos', path: '/money/debts', icon: TrendingDown },
      { id: 'investments', name: 'Investimentos', path: '/money/investments', icon: TrendingUp },
      { id: 'patrimony', name: 'Patrimônio Financeiro', path: '/money/patrimony', icon: Award },
      { id: 'goals', name: 'Metas Financeiras', path: '/money/goals', icon: Target },
      { id: 'reports', name: 'Relatórios e Histórico', path: '/money/reports', icon: BarChart3 },
    ]
  },

  TIME: {
    id: 'time',
    name: 'Tempo',
    icon: Clock,
    path: '/time',
    color: 'purple',
    description: 'Onde a vida acontece.',
    submodules: [
      { id: 'calendar', name: 'Agenda', path: '/time/calendar', icon: Calendar },
      { id: 'appointments', name: 'Compromissos', path: '/time/appointments' },
      { id: 'tasks', name: 'Tarefas', path: '/time/tasks' },
      { id: 'habits', name: 'Hábitos', path: '/time/habits', icon: Repeat },
      { id: 'routines', name: 'Rotinas', path: '/time/routines' },
      { id: 'priorities', name: 'Prioridades', path: '/time/priorities', icon: Target },
      { id: 'history', name: 'Histórico do Tempo', path: '/time/history' },
      { id: 'planning', name: 'Planejamento Semanal', path: '/time/planning' },
    ]
  },

  GOALS: {
    id: 'goals',
    name: 'Objetivos',
    icon: Target,
    path: '/goals',
    color: 'orange',
    description: 'Direção da vida, não apenas tarefas.',
    submodules: [
      { id: 'life', name: 'Objetivos de Vida', path: '/goals/life' },
      { id: 'yearly', name: 'Objetivos Anuais', path: '/goals/yearly' },
      { id: 'short-term', name: 'Metas de Curto Prazo', path: '/goals/short-term' },
      { id: 'action-plans', name: 'Planos de Ação', path: '/goals/action-plans' },
      { id: 'progress', name: 'Indicadores de Progresso', path: '/goals/progress', icon: BarChart3 },
      { id: 'reviews', name: 'Revisões Periódicas', path: '/goals/reviews' },
      { id: 'connections', name: 'Conexão com Hábitos e Projetos', path: '/goals/connections' },
    ]
  },

  HEALTH: {
    id: 'health',
    name: 'Saúde',
    icon: Heart,
    path: '/health',
    color: 'red',
    description: 'Corpo e mente no mesmo lugar.',
    submodules: [
      { id: 'physical', name: 'Saúde Física', path: '/health/physical', icon: Activity },
      { id: 'mental', name: 'Saúde Mental', path: '/health/mental', icon: Brain },
      { id: 'mood', name: 'Humor e Emoções', path: '/health/mood' },
      { id: 'sleep', name: 'Sono', path: '/health/sleep' },
      { id: 'nutrition', name: 'Alimentação', path: '/health/nutrition' },
      { id: 'exercise', name: 'Exercícios', path: '/health/exercise', icon: Activity },
      { id: 'medications', name: 'Medicamentos', path: '/health/medications' },
      { id: 'appointments', name: 'Consultas e Exames', path: '/health/appointments', icon: Calendar },
      { id: 'history', name: 'Histórico de Saúde', path: '/health/history' },
      { id: 'alerts', name: 'Alertas', path: '/health/alerts', icon: Bell },
    ]
  },

  PEOPLE: {
    id: 'people',
    name: 'Pessoas',
    icon: Users,
    path: '/people',
    color: 'pink',
    description: 'Relacionamentos organizados de forma natural.',
    submodules: [
      { id: 'contacts', name: 'Contatos Importantes', path: '/people/contacts' },
      { id: 'family', name: 'Família', path: '/people/family' },
      { id: 'relationships', name: 'Relacionamentos', path: '/people/relationships', icon: Heart },
      { id: 'interactions', name: 'Histórico de Interações', path: '/people/interactions' },
      { id: 'dates', name: 'Datas Importantes', path: '/people/dates', icon: Calendar },
      { id: 'notes', name: 'Anotações por Pessoa', path: '/people/notes', icon: FileText },
      { id: 'network', name: 'Redes de Apoio', path: '/people/network' },
    ]
  },

  WORK_STUDY: {
    id: 'work-study',
    name: 'Trabalho & Estudos',
    icon: Briefcase,
    path: '/work-study',
    color: 'indigo',
    description: 'Produção intelectual e profissional juntas.',
    submodules: [
      { id: 'jobs', name: 'Empregos/Atividades Atuais', path: '/work-study/jobs' },
      { id: 'projects', name: 'Projetos Profissionais', path: '/work-study/projects', icon: FolderKanban },
      { id: 'income', name: 'Renda Associada', path: '/work-study/income', icon: DollarSign },
      { id: 'studies', name: 'Estudos e Cursos', path: '/work-study/studies', icon: GraduationCap },
      { id: 'skills', name: 'Habilidades', path: '/work-study/skills' },
      { id: 'certifications', name: 'Certificações', path: '/work-study/certifications', icon: Award },
      { id: 'goals', name: 'Metas Profissionais', path: '/work-study/goals', icon: Target },
      { id: 'portfolio', name: 'Portfólio/Histórico', path: '/work-study/portfolio' },
      { id: 'processes', name: 'Processos Seletivos', path: '/work-study/processes' },
    ]
  },

  HOME_THINGS: {
    id: 'home-things',
    name: 'Casa & Coisas',
    icon: Home,
    path: '/home-things',
    color: 'yellow',
    description: 'Onde patrimônio e logística se encontram.',
    submodules: [
      { id: 'properties', name: 'Imóveis', path: '/home-things/properties', icon: Building2 },
      { id: 'housing', name: 'Moradia (Aluguel, Condomínio)', path: '/home-things/housing' },
      { id: 'bills', name: 'Contas da Casa', path: '/home-things/bills', icon: Receipt },
      { id: 'maintenance', name: 'Manutenções', path: '/home-things/maintenance', icon: Wrench },
      { id: 'inventory', name: 'Inventário Pessoal', path: '/home-things/inventory', icon: Package },
      { id: 'warranties', name: 'Garantias', path: '/home-things/warranties', icon: FileText },
      { id: 'insurance', name: 'Seguros', path: '/home-things/insurance', icon: Shield },
      { id: 'vehicles', name: 'Veículos', path: '/home-things/vehicles', icon: Car },
      { id: 'transport', name: 'Transporte e Deslocamentos', path: '/home-things/transport' },
    ]
  },

  PROJECTS: {
    id: 'projects',
    name: 'Projetos',
    icon: FolderKanban,
    path: '/projects',
    color: 'cyan',
    description: 'Qualquer coisa que tenha começo, meio e fim.',
    submodules: [
      { id: 'personal', name: 'Projetos Pessoais', path: '/projects/personal' },
      { id: 'professional', name: 'Projetos Profissionais', path: '/projects/professional', icon: Briefcase },
      { id: 'creative', name: 'Projetos Criativos', path: '/projects/creative' },
      { id: 'tasks', name: 'Tarefas por Projeto', path: '/projects/tasks' },
      { id: 'resources', name: 'Recursos', path: '/projects/resources' },
      { id: 'deadlines', name: 'Prazos', path: '/projects/deadlines', icon: Calendar },
      { id: 'status', name: 'Status', path: '/projects/status' },
      { id: 'results', name: 'Resultados', path: '/projects/results', icon: Award },
      { id: 'learnings', name: 'Aprendizados', path: '/projects/learnings', icon: BookOpen },
    ]
  },

  DIGITAL_LIFE: {
    id: 'digital-life',
    name: 'Vida Digital',
    icon: Globe,
    path: '/digital-life',
    color: 'teal',
    description: 'Sua presença online organizada.',
    submodules: [
      { id: 'accounts', name: 'Contas Online', path: '/digital-life/accounts', icon: Smartphone },
      { id: 'subscriptions', name: 'Assinaturas Digitais', path: '/digital-life/subscriptions', icon: Repeat },
      { id: 'services', name: 'Serviços Conectados', path: '/digital-life/services' },
      { id: 'security', name: 'Segurança Digital', path: '/digital-life/security', icon: Shield },
      { id: 'identity', name: 'Identidade Digital', path: '/digital-life/identity', icon: Lock },
      { id: 'backups', name: 'Backups', path: '/digital-life/backups', icon: Cloud },
      { id: 'history', name: 'Histórico de Acessos', path: '/digital-life/history' },
    ]
  },

  MEMORIES: {
    id: 'memories',
    name: 'Memórias',
    icon: Camera,
    path: '/memories',
    color: 'rose',
    description: 'Registro da vida ao longo do tempo.',
    submodules: [
      { id: 'journal', name: 'Diário', path: '/memories/journal', icon: BookOpen },
      { id: 'events', name: 'Eventos Marcantes', path: '/memories/events', icon: Calendar },
      { id: 'achievements', name: 'Conquistas', path: '/memories/achievements', icon: Award },
      { id: 'reflections', name: 'Reflexões', path: '/memories/reflections' },
      { id: 'timeline', name: 'Linha do Tempo', path: '/memories/timeline' },
      { id: 'files', name: 'Arquivos Pessoais', path: '/memories/files', icon: FileText },
      { id: 'photos', name: 'Fotos (Metadados)', path: '/memories/photos', icon: Camera },
    ]
  },

  INSIGHTS: {
    id: 'insights',
    name: 'Insights',
    icon: TrendingUp,
    path: '/insights',
    color: 'violet',
    description: 'Onde tudo se conecta.',
    submodules: [
      { id: 'dashboards', name: 'Dashboards', path: '/insights/dashboards', icon: LayoutDashboard },
      { id: 'correlations', name: 'Correlações entre Áreas', path: '/insights/correlations' },
      { id: 'patterns', name: 'Padrões de Comportamento', path: '/insights/patterns', icon: Brain },
      { id: 'alerts', name: 'Alertas Inteligentes', path: '/insights/alerts', icon: Bell },
      { id: 'recommendations', name: 'Recomendações', path: '/insights/recommendations', icon: Sparkles },
      { id: 'reviews', name: 'Revisões Automáticas', path: '/insights/reviews' },
      { id: 'reports', name: 'Relatórios Periódicos', path: '/insights/reports', icon: BarChart3 },
    ]
  },
};

export const getModuleById = (id: string) => {
  return Object.values(MODULES).find(module => module.id === id);
};

export const getSubmoduleByPath = (modulePath: string, submodulePath: string) => {
  const module = Object.values(MODULES).find(m => m.path === modulePath);
  return module?.submodules.find(s => s.path === submodulePath);
};

export const getAllModules = () => Object.values(MODULES);
