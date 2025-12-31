import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Routine, RoutineLog } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Repeat, CheckCircle2, Circle } from 'lucide-react';
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
          <h1 className="text-3xl font-bold tracking-tight">Routines</h1>
          <p className="text-muted-foreground mt-1">Build and track your daily habits</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Routine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Routine</DialogTitle>
              <DialogDescription>
                Define a new routine to track regularly
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Routine name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this routine involve?"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <Button type="submit" className="w-full">Create Routine</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Routines</CardTitle>
          <CardDescription>Check off your routines as you complete them</CardDescription>
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
                No routines yet. Create one to start building habits.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
