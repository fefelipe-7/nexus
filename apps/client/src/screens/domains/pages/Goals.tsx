import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Goal } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Target } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function Goals() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState(5);

  const goals = useLiveQuery(() =>
    db.goals.orderBy('createdAt').reverse().toArray()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal: Goal = {
      title,
      description: description.trim() || undefined,
      status: 'active',
      priority,
      createdAt: new Date(),
      targetDate: targetDate ? new Date(targetDate) : undefined,
      progress: 0,
    };

    await db.goals.add(newGoal);
    
    setTitle('');
    setDescription('');
    setTargetDate('');
    setPriority(5);
    setOpen(false);
  };

  const updateProgress = async (goalId: number, progress: number) => {
    await db.goals.update(goalId, { progress });
    if (progress >= 100) {
      await db.goals.update(goalId, { 
        status: 'completed',
        completedAt: new Date()
      });
    }
  };

  const filterGoals = (status: string) => {
    if (!goals) return [];
    if (status === 'all') return goals;
    return goals.filter(g => g.status === status);
  };

  const GoalItem = ({ goal }: { goal: Goal }) => (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Target className="h-5 w-5 text-muted-foreground mt-1" />
          <div className="flex-1 space-y-1">
            <h4 className="font-medium">{goal.title}</h4>
            {goal.description && (
              <p className="text-sm text-muted-foreground">{goal.description}</p>
            )}
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>Criada: {formatDate(goal.createdAt)}</span>
              {goal.targetDate && (
                <span>Alvo: {formatDate(goal.targetDate)}</span>
              )}
              {goal.priority && (
                <span>Prioridade: {goal.priority}/10</span>
              )}
            </div>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
          goal.status === 'active' 
            ? 'bg-green-100 text-green-700' 
            : goal.status === 'completed'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {goal.status}
        </span>
      </div>
      {goal.status === 'active' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{goal.progress || 0}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${goal.progress || 0}%` }}
            />
          </div>
          <Input
            type="range"
            min="0"
            max="100"
            value={goal.progress || 0}
            onChange={(e) => goal.id && updateProgress(goal.id, Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas</h1>
          <p className="text-muted-foreground mt-1">Defina e acompanhe seus objetivos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Meta</DialogTitle>
              <DialogDescription>
                Defina um novo objetivo para trabalhar
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="O que você quer alcançar?"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Por que isso é importante?"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Prioridade: {priority}/10
                </label>
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Alvo (opcional)</label>
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">Criar Meta</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suas Metas</CardTitle>
          <CardDescription>Acompanhe o progresso dos seus objetivos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="active">Ativas</TabsTrigger>
              <TabsTrigger value="completed">Concluídas</TabsTrigger>
              <TabsTrigger value="paused">Pausadas</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-3 mt-4">
              {filterGoals('all').length > 0 ? (
                filterGoals('all').map((goal) => (
                  <GoalItem key={goal.id} goal={goal} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Nenhuma meta ainda</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="active" className="space-y-3 mt-4">
              {filterGoals('active').length > 0 ? (
                filterGoals('active').map((goal) => (
                  <GoalItem key={goal.id} goal={goal} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Nenhuma meta ativa</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed" className="space-y-3 mt-4">
              {filterGoals('completed').length > 0 ? (
                filterGoals('completed').map((goal) => (
                  <GoalItem key={goal.id} goal={goal} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Nenhuma meta concluída</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="paused" className="space-y-3 mt-4">
              {filterGoals('paused').length > 0 ? (
                filterGoals('paused').map((goal) => (
                  <GoalItem key={goal.id} goal={goal} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Nenhuma meta pausada</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
