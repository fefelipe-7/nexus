import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, PersonalState } from '@/data/local/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Textarea } from '@/ui/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/components/ui/dialog';
import { Plus, TrendingUp } from 'lucide-react';
import { formatDateTime, getMoodLabel, getEnergyLabel, getStressLabel } from '@nexus/shared';

export function StateTracker() {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const [notes, setNotes] = useState('');

  const states = useLiveQuery(() =>
    db.personalStates.orderBy('timestamp').reverse().limit(20).toArray()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newState: PersonalState = {
      timestamp: new Date(),
      mood,
      energy,
      stress,
      notes: notes.trim() || undefined,
    };

    await db.personalStates.add(newState);
    
    setMood(5);
    setEnergy(5);
    setStress(5);
    setNotes('');
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estado Pessoal</h1>
          <p className="text-muted-foreground mt-1">Acompanhe seu humor, energia e níveis de estresse</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Rastrear Estado
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rastreie Seu Estado Atual</DialogTitle>
              <DialogDescription>
                Registre como você está se sentindo agora
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Humor: {getMoodLabel(mood)} ({mood}/10)
                </label>
                <Input
                  type="range"
                  min="0"
                  max="10"
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Energia: {getEnergyLabel(energy)} ({energy}/10)
                </label>
                <Input
                  type="range"
                  min="0"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Estresse: {getStressLabel(stress)} ({stress}/10)
                </label>
                <Input
                  type="range"
                  min="0"
                  max="10"
                  value={stress}
                  onChange={(e) => setStress(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notas (opcional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contexto adicional..."
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">Salvar Estado</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Humor</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {states?.[0]?.mood ? getMoodLabel(states[0].mood) : 'Sem dados'}
            </div>
            <p className="text-xs text-muted-foreground">
              {states?.[0]?.mood ? `${states[0].mood}/10` : 'Rastreie seu estado'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Energia</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {states?.[0]?.energy ? getEnergyLabel(states[0].energy) : 'Sem dados'}
            </div>
            <p className="text-xs text-muted-foreground">
              {states?.[0]?.energy ? `${states[0].energy}/10` : 'Rastreie seu estado'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Estresse</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {states?.[0]?.stress ? getStressLabel(states[0].stress) : 'Sem dados'}
            </div>
            <p className="text-xs text-muted-foreground">
              {states?.[0]?.stress ? `${states[0].stress}/10` : 'Rastreie seu estado'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estados Recentes</CardTitle>
          <CardDescription>Seus estados rastreados ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          {states && states.length > 0 ? (
            <div className="space-y-3">
              {states.map((state) => (
                <div
                  key={state.id}
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex gap-4 text-sm">
                      <span>Humor: <strong>{getMoodLabel(state.mood || 0)}</strong></span>
                      <span>Energia: <strong>{getEnergyLabel(state.energy || 0)}</strong></span>
                      <span>Estresse: <strong>{getStressLabel(state.stress || 0)}</strong></span>
                    </div>
                    {state.notes && (
                      <p className="text-sm text-muted-foreground">{state.notes}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(state.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                Nenhum estado rastreado ainda. Comece a rastrear para ver padrões ao longo do tempo.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
