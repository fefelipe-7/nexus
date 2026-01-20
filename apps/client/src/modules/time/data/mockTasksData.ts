import type {
    TasksData,
    Task,
    TaskGroup,
    TasksSummary
} from '../types/tasks.types';

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const addDays = (days: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() + days);
    return date;
};

const tasks: Task[] = [
    // Critical / In progress
    {
        id: '1',
        title: 'Finalizar tela de Tarefas',
        description: 'Implementar componentes mobile e desktop',
        status: 'in_progress',
        priority: 'critical',
        effort: 'long',
        lifeArea: 'work',
        linkedProjectId: 'nexus',
        subtasks: [
            { id: '1-1', title: 'Criar tipos', completed: true, createdAt: addDays(-1) },
            { id: '1-2', title: 'Criar dados mock', completed: true, createdAt: addDays(-1) },
            { id: '1-3', title: 'Criar componentes', completed: false, createdAt: addDays(-1) },
            { id: '1-4', title: 'Criar tela principal', completed: false, createdAt: addDays(-1) },
        ],
        tags: ['dev', 'nexus'],
        createdAt: addDays(-3),
        startedAt: addDays(-1),
        postponedCount: 0,
        estimatedMinutes: 180,
    },
    // High priority / Todo
    {
        id: '2',
        title: 'Revisar orçamento do mês',
        status: 'todo',
        priority: 'high',
        effort: 'medium',
        dueDate: today,
        lifeArea: 'finance',
        linkedGoalId: 'budget-control',
        subtasks: [],
        createdAt: addDays(-5),
        postponedCount: 1,
        estimatedMinutes: 45,
    },
    {
        id: '3',
        title: 'Agendar consulta dentista',
        status: 'todo',
        priority: 'high',
        effort: 'short',
        lifeArea: 'health',
        subtasks: [],
        createdAt: addDays(-7),
        postponedCount: 2,
    },
    // Medium priority
    {
        id: '4',
        title: 'Estudar React Server Components',
        description: '1h de estudo focado',
        status: 'todo',
        priority: 'medium',
        effort: 'medium',
        lifeArea: 'learning',
        linkedGoalId: 'tech-skills',
        subtasks: [],
        tags: ['estudo', 'tech'],
        createdAt: addDays(-2),
        postponedCount: 0,
        estimatedMinutes: 60,
    },
    {
        id: '5',
        title: 'Limpar e organizar escritório',
        status: 'todo',
        priority: 'medium',
        effort: 'medium',
        lifeArea: 'personal',
        subtasks: [
            { id: '5-1', title: 'Jogar papéis', completed: false, createdAt: addDays(-1) },
            { id: '5-2', title: 'Organizar cabos', completed: false, createdAt: addDays(-1) },
            { id: '5-3', title: 'Limpar monitor', completed: false, createdAt: addDays(-1) },
        ],
        createdAt: addDays(-10),
        postponedCount: 3,
    },
    // Low priority
    {
        id: '6',
        title: 'Pesquisar novo teclado mecânico',
        status: 'backlog',
        priority: 'low',
        effort: 'short',
        lifeArea: 'leisure',
        subtasks: [],
        createdAt: addDays(-15),
        postponedCount: 0,
    },
    {
        id: '7',
        title: 'Assistir documentário recomendado',
        status: 'backlog',
        priority: 'low',
        effort: 'medium',
        lifeArea: 'leisure',
        subtasks: [],
        createdAt: addDays(-8),
        postponedCount: 0,
    },
    // No priority
    {
        id: '8',
        title: 'Instalar extensão do banco',
        status: 'backlog',
        priority: 'none',
        lifeArea: 'finance',
        subtasks: [],
        createdAt: addDays(-4),
        postponedCount: 0,
    },
    {
        id: '9',
        title: 'Configurar backup automático',
        status: 'todo',
        priority: 'none',
        lifeArea: 'personal',
        subtasks: [],
        createdAt: addDays(-6),
        postponedCount: 0,
    },
    // Paused
    {
        id: '10',
        title: 'Curso de Python avançado',
        description: 'Pausado até terminar projeto atual',
        status: 'paused',
        priority: 'medium',
        effort: 'long',
        lifeArea: 'learning',
        linkedGoalId: 'python-course',
        subtasks: [
            { id: '10-1', title: 'Módulo 1', completed: true, createdAt: addDays(-30), completedAt: addDays(-25) },
            { id: '10-2', title: 'Módulo 2', completed: true, createdAt: addDays(-25), completedAt: addDays(-20) },
            { id: '10-3', title: 'Módulo 3', completed: false, createdAt: addDays(-20) },
        ],
        createdAt: addDays(-30),
        startedAt: addDays(-30),
        postponedCount: 0,
        estimatedMinutes: 600,
        actualMinutes: 180,
    },
    // Completed today
    {
        id: '11',
        title: 'Responder emails pendentes',
        status: 'completed',
        priority: 'high',
        effort: 'short',
        lifeArea: 'work',
        subtasks: [],
        createdAt: addDays(-1),
        completedAt: new Date(),
        postponedCount: 0,
        estimatedMinutes: 30,
        actualMinutes: 25,
    },
    {
        id: '12',
        title: 'Daily standup',
        status: 'completed',
        priority: 'medium',
        effort: 'short',
        lifeArea: 'work',
        subtasks: [],
        createdAt: today,
        completedAt: new Date(),
        postponedCount: 0,
    },
];

// Calculate summary
const activeTasks = tasks.filter(t => !['completed', 'cancelled'].includes(t.status));
const todoCount = tasks.filter(t => t.status === 'todo').length;
const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
const overdueCount = activeTasks.filter(t => t.dueDate && t.dueDate < today).length;
const noPriorityCount = activeTasks.filter(t => t.priority === 'none').length;
const completedToday = tasks.filter(t => t.completedAt?.toDateString() === today.toDateString()).length;
const currentFocus = tasks.find(t => t.status === 'in_progress');

// Generate insight
let insight: TasksSummary['insight'] = {
    type: 'info',
    message: 'Sua lista está organizada.',
};
if (noPriorityCount >= 3) {
    insight = {
        type: 'suggestion',
        message: `${noPriorityCount} tarefas sem prioridade. Defina prioridades para melhor foco.`,
    };
} else if (overdueCount > 0) {
    insight = {
        type: 'warning',
        message: `${overdueCount} tarefa${overdueCount > 1 ? 's' : ''} com prazo vencido.`,
    };
} else if (completedToday >= 2) {
    insight = {
        type: 'success',
        message: `Ótimo! Você já concluiu ${completedToday} tarefas hoje.`,
    };
}

const summary: TasksSummary = {
    totalActive: activeTasks.length,
    todoCount,
    inProgressCount,
    overdueCount,
    noPriorityCount,
    completedToday,
    averageCompletionRate: 72,
    currentFocus,
    insight,
};

// Group by status
const byStatus: TaskGroup[] = [
    {
        key: 'in_progress',
        label: 'Em andamento',
        icon: '🔄',
        color: '#f59e0b',
        tasks: tasks.filter(t => t.status === 'in_progress'),
        count: 0,
    },
    {
        key: 'todo',
        label: 'A fazer',
        icon: '📋',
        color: '#3b82f6',
        tasks: tasks.filter(t => t.status === 'todo'),
        count: 0,
    },
    {
        key: 'backlog',
        label: 'Backlog',
        icon: '📦',
        color: '#6b7280',
        tasks: tasks.filter(t => t.status === 'backlog'),
        count: 0,
    },
    {
        key: 'paused',
        label: 'Pausadas',
        icon: '⏸️',
        color: '#8b5cf6',
        tasks: tasks.filter(t => t.status === 'paused'),
        count: 0,
    },
];
byStatus.forEach(g => g.count = g.tasks.length);

// Group by area
const areaMap: Record<string, Task[]> = {};
activeTasks.forEach(t => {
    const area = t.lifeArea || 'other';
    if (!areaMap[area]) areaMap[area] = [];
    areaMap[area].push(t);
});
const byArea: TaskGroup[] = Object.entries(areaMap).map(([key, list]) => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    tasks: list,
    count: list.length,
}));

// Group by project
const projectMap: Record<string, Task[]> = {};
activeTasks.forEach(t => {
    const project = t.linkedProjectId || 'no-project';
    if (!projectMap[project]) projectMap[project] = [];
    projectMap[project].push(t);
});
const byProject: TaskGroup[] = Object.entries(projectMap).map(([key, list]) => ({
    key,
    label: key === 'no-project' ? 'Sem projeto' : key,
    tasks: list,
    count: list.length,
}));

export const mockTasksData: TasksData = {
    summary,
    tasks,
    byStatus: byStatus.filter(g => g.count > 0),
    byProject,
    byArea,
};
