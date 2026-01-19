import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockTasksData } from '../data/mockTasksData';
import { List, LayoutGrid, Target, FolderKanban, Focus, CheckCircle, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { Task, TaskViewMode, TaskGroup } from '../types/tasks.types';
import { STATUS_LABELS, STATUS_COLORS, LIFE_AREA_LABELS, LIFE_AREA_COLORS } from '../types/tasks.types';

import {
    TasksHeader,
    TaskItem,
    QuickTaskInput,
} from '../components/mobile';

type FilterType = 'all' | 'todo' | 'in_progress' | 'backlog' | 'completed';

export function Tasks() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [viewMode, setViewMode] = useState<TaskViewMode>('list');

    const data = mockTasksData;

    const handleAddTask = (title: string) => {
        console.log('Add task:', title);
    };

    // Filter logic
    const getFilteredTasks = () => {
        switch (activeFilter) {
            case 'todo':
                return data.tasks.filter(t => t.status === 'todo');
            case 'in_progress':
                return data.tasks.filter(t => t.status === 'in_progress');
            case 'backlog':
                return data.tasks.filter(t => t.status === 'backlog');
            case 'completed':
                return data.tasks.filter(t => t.status === 'completed');
            default:
                return data.tasks.filter(t => t.status !== 'completed' && t.status !== 'cancelled');
        }
    };

    const filteredTasks = getFilteredTasks();

    const filters: { key: FilterType; label: string; count?: number }[] = [
        { key: 'all', label: 'Ativas', count: data.summary.totalActive },
        { key: 'todo', label: 'A fazer', count: data.summary.todoCount },
        { key: 'in_progress', label: 'Em andamento', count: data.summary.inProgressCount },
        { key: 'backlog', label: 'Backlog' },
        { key: 'completed', label: 'Concluídas', count: data.summary.completedToday },
    ];

    if (isMobileView) {
        return (
            <div className="space-y-4 pb-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Tarefas</h1>
                    <p className="text-sm text-muted-foreground">
                        O que você pode fazer agora
                    </p>
                </div>

                {/* Quick Input */}
                <QuickTaskInput
                    onSubmit={handleAddTask}
                    placeholder="Adicionar tarefa... (#tag, !alta)"
                />

                {/* Summary Header */}
                <TasksHeader summary={data.summary} />

                {/* Filters */}
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                    {filters.map(filter => (
                        <button
                            key={filter.key}
                            onClick={() => setActiveFilter(filter.key)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                                activeFilter === filter.key
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {filter.label}
                            {filter.count !== undefined && filter.count > 0 && (
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-full text-[10px]",
                                    activeFilter === filter.key
                                        ? "bg-primary-foreground/20"
                                        : "bg-background"
                                )}>
                                    {filter.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Task Groups */}
                {viewMode === 'list' && data.byStatus.map(group => {
                    const groupTasks = activeFilter === 'all'
                        ? group.tasks
                        : group.tasks.filter(t => filteredTasks.includes(t));

                    if (groupTasks.length === 0) return null;

                    return (
                        <Card key={group.key} className="overflow-hidden">
                            <div className="px-4 py-2 border-b flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{group.icon}</span>
                                    <span className="text-sm font-semibold">{group.label}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{groupTasks.length}</span>
                            </div>
                            <div className="divide-y divide-border/30">
                                {groupTasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onClick={() => console.log('Task clicked', task.id)}
                                        onToggleComplete={() => console.log('Toggle complete', task.id)}
                                    />
                                ))}
                            </div>
                        </Card>
                    );
                })}

                {/* Empty state */}
                {filteredTasks.length === 0 && (
                    <Card className="p-8 text-center">
                        <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                        <p className="text-lg font-semibold">Tudo feito!</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Nenhuma tarefa pendente nesta visualização.
                        </p>
                    </Card>
                )}
            </div>
        );
    }

    // Desktop
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Tarefas</h1>
                    <p className="text-muted-foreground">
                        O que você pode fazer agora para avançar
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                        {(['list', 'kanban'] as const).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                    viewMode === mode ? "bg-background shadow-sm" : "text-muted-foreground"
                                )}
                            >
                                {mode === 'list' ? 'Lista' : 'Kanban'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Input */}
            <QuickTaskInput
                onSubmit={handleAddTask}
                placeholder="Adicionar tarefa rapidamente... (use #tag para categorizar, !alta para prioridade)"
            />

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">A Fazer</CardTitle>
                        <List className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.todoCount}</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
                        <Play className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">{data.summary.inProgressCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Concluídas Hoje</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{data.summary.completedToday}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.averageCompletionRate}%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {filters.map(filter => (
                    <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        className={cn(
                            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            activeFilter === filter.key
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        )}
                    >
                        {filter.label}
                        {filter.count !== undefined && filter.count > 0 && (
                            <span className={cn(
                                "px-1.5 py-0.5 rounded-full text-xs",
                                activeFilter === filter.key ? "bg-primary-foreground/20" : "bg-background"
                            )}>
                                {filter.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Main Content - Kanban or List */}
            {viewMode === 'kanban' ? (
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {data.byStatus.map(group => (
                        <Card key={group.key} className="overflow-hidden">
                            <CardHeader className="pb-3" style={{ backgroundColor: `${group.color}10` }}>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <span>{group.icon}</span>
                                        {group.label}
                                    </CardTitle>
                                    <span className="text-xs text-muted-foreground">{group.count}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-2 space-y-2 min-h-[200px]">
                                {group.tasks.map(task => (
                                    <div
                                        key={task.id}
                                        className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                    >
                                        <p className="text-sm font-medium">{task.title}</p>
                                        {task.subtasks.length > 0 && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtarefas
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {data.byStatus.map(group => {
                        const groupTasks = activeFilter === 'all'
                            ? group.tasks
                            : group.tasks.filter(t => filteredTasks.includes(t));

                        if (groupTasks.length === 0) return null;

                        return (
                            <Card key={group.key} className="overflow-hidden">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <span>{group.icon}</span>
                                            {group.label}
                                        </CardTitle>
                                        <span className="text-xs text-muted-foreground">{groupTasks.length}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-border/30">
                                        {groupTasks.map(task => (
                                            <TaskItem
                                                key={task.id}
                                                task={task}
                                                onClick={() => console.log('Task clicked', task.id)}
                                                onToggleComplete={() => console.log('Toggle complete', task.id)}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
