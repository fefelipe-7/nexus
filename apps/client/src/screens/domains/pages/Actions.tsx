import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Action } from '@/data/local/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Textarea } from '@/ui/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/components/ui/tabs';
import { Plus, CheckCircle2, Circle, Clock } from 'lucide-react';
import { formatDate } from '@nexus/shared';

export function Actions() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'task' | 'habit' | 'activity'>('task');
  const [dueDate, setDueDate] = useState('');

  const actions = useLiveQuery(() =>
    db.actions.orderBy('createdAt').reverse().toArray()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAction: Action = {
      title,
      description: description.trim() || undefined,
      type,
      status: 'planned',
      createdAt: new Date(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };

    await db.actions.add(newAction);
    
    setTitle('');
    setDescription('');
    setType('task');
    setDueDate('');
    setOpen(false);
  };

  const toggleStatus = async (action: Action) => {
    if (!action.id) return;
    
    const newStatus = action.status === 'completed' ? 'planned' : 'completed';
    await db.actions.update(action.id, {
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date() : undefined,
    });
  };

  const filterActions = (status: string) => {
    if (!actions) return [];
    if (status === 'all') return actions;
    return actions.filter(a => a.status === status);
  };

  const ActionItem = ({ action }: { action: Action }) => (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      <button
        onClick={() => toggleStatus(action)}
        className="mt-1 flex-shrink-0"
      >
        {action.status === 'completed' ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : action.status === 'in-progress' ? (
          <Clock className="h-5 w-5 text-blue-500" />
        ) : (
          <Circle className="h-5 w-5 text-gray-300" />
        )}
      </button>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className={`font-medium ${action.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
            {action.title}
          </h4>
          <span className="text-xs text-muted-foreground capitalize">
            {action.type}
          </span>
        </div>
        {action.description && (
          <p className="text-sm text-muted-foreground">{action.description}</p>
        )}
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span>Criada: {formatDate(action.createdAt)}</span>
          {action.dueDate && (
            <span>Vencimento: {formatDate(action.dueDate)}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ações</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas tarefas, hábitos e atividades</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Ação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Ação</DialogTitle>
              <DialogDescription>
                Adicione uma tarefa, hábito ou atividade para rastrear
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="O que você quer fazer?"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhes adicionais..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="task">Tarefa</option>
                  <option value="habit">Hábito</option>
                  <option value="activity">Atividade</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Vencimento (opcional)</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">Criar Ação</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suas Ações</CardTitle>
          <CardDescription>Acompanhe e gerencie todas as suas ações</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="planned">Planejadas</TabsTrigger>
              <TabsTrigger value="in-progress">Em Progresso</TabsTrigger>
              <TabsTrigger value="completed">Concluídas</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-3 mt-4">
              {filterActions('all').length > 0 ? (
                filterActions('all').map((action) => (
                  <ActionItem key={action.id} action={action} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Nenhuma ação ainda</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="planned" className="space-y-3 mt-4">
              {filterActions('planned').length > 0 ? (
                filterActions('planned').map((action) => (
                  <ActionItem key={action.id} action={action} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Nenhuma ação planejada</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="in-progress" className="space-y-3 mt-4">
              {filterActions('in-progress').length > 0 ? (
                filterActions('in-progress').map((action) => (
                  <ActionItem key={action.id} action={action} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Nenhuma ação em progresso</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed" className="space-y-3 mt-4">
              {filterActions('completed').length > 0 ? (
                filterActions('completed').map((action) => (
                  <ActionItem key={action.id} action={action} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Nenhuma ação concluída</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
