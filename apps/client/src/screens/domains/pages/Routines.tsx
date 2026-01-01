import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Routine } from '@/data/local/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Textarea } from '@/ui/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/components/ui/dialog';
import { Plus, Repeat, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function Routines() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const routines = useLiveQuery(() =>
    db.routines.where('active').equals(1).toArray()
  );

  const todayLogs = useLiveQuery(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return db.routineLogs
      .where('timestamp')
      .between(today, tomorrow)
      .toArray();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRoutine: Routine = {
      title,
      description: description.trim() || undefined,
      frequency,
      active: true,
      createdAt: new Date(),
    };

    await db.routines.add(newRoutine);
    
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setOpen(false);
  };

  const toggleRoutineLog = async (routineId: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingLog = await db.routineLogs
      .where('routineId')
      .equals(routineId)
      .and(log => log.timestamp >= today && log.timestamp < tomorrow)
      .first();

    if (existingLog) {
      if (existingLog.id) {
        await db.routineLogs.update(existingLog.id, {
          completed: !existingLog.completed
        });
      }
    } else {
      const newLog: RoutineLog = {
        routineId,
        timestamp: new Date(),
        completed: true,
      };
      await db.routineLogs.add(newLog);
    }
  };

  const isRoutineCompletedToday = (routineId: number) => {
    return todayLogs?.some(log => log.routineId === routineId && log.completed) || false;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rotinas</h1>
          <p className="text-muted-foreground mt-1">Construa e acompanhe seus hábitos diários</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Rotina
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Rotina</DialogTitle>
              <DialogDescription>
                Defina uma nova rotina para acompanhar regularmente
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nome da rotina"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="O que essa rotina envolve?"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Frequência</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="daily">Diária</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
              <Button type="submit" className="w-full">Criar Rotina</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rotinas de Hoje</CardTitle>
          <CardDescription>Marque suas rotinas conforme as completa</CardDescription>
        </CardHeader>
        <CardContent>
          {routines && routines.length > 0 ? (
            <div className="space-y-3">
              {routines.map((routine) => {
                const completed = isRoutineCompletedToday(routine.id!);
                return (
                  <div
                    key={routine.id}
                    className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => routine.id && toggleRoutineLog(routine.id)}
                  >
                    <button className="mt-1 flex-shrink-0">
                      {completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-300" />
                      )}
                    </button>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${completed ? 'line-through text-muted-foreground' : ''}`}>
                          {routine.title}
                        </h4>
                        <span className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                          <Repeat className="h-3 w-3" />
                          {routine.frequency}
                        </span>
                      </div>
                      {routine.description && (
                        <p className="text-sm text-muted-foreground">{routine.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                Nenhuma rotina ainda. Crie uma para começar a construir hábitos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
