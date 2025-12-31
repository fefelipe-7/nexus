import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, PersonalState } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, TrendingUp } from 'lucide-react';
import { formatDateTime, getMoodLabel, getEnergyLabel, getStressLabel } from '@/lib/utils';

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
          <h1 className="text-3xl font-bold tracking-tight">Personal State</h1>
          <p className="text-muted-foreground mt-1">Track your mood, energy, and stress levels</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Track State
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Track Your Current State</DialogTitle>
              <DialogDescription>
                Record how you're feeling right now
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Mood: {getMoodLabel(mood)} ({mood}/10)
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
                  Energy: {getEnergyLabel(energy)} ({energy}/10)
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
                  Stress: {getStressLabel(stress)} ({stress}/10)
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
                <label className="text-sm font-medium">Notes (optional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional context..."
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">Save State</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Mood</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {states?.[0]?.mood ? getMoodLabel(states[0].mood) : 'No data'}
            </div>
            <p className="text-xs text-muted-foreground">
              {states?.[0]?.mood ? `${states[0].mood}/10` : 'Track your state'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Energy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {states?.[0]?.energy ? getEnergyLabel(states[0].energy) : 'No data'}
            </div>
            <p className="text-xs text-muted-foreground">
              {states?.[0]?.energy ? `${states[0].energy}/10` : 'Track your state'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Stress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {states?.[0]?.stress ? getStressLabel(states[0].stress) : 'No data'}
            </div>
            <p className="text-xs text-muted-foreground">
              {states?.[0]?.stress ? `${states[0].stress}/10` : 'Track your state'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent States</CardTitle>
          <CardDescription>Your tracked states over time</CardDescription>
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
                      <span>Mood: <strong>{getMoodLabel(state.mood || 0)}</strong></span>
                      <span>Energy: <strong>{getEnergyLabel(state.energy || 0)}</strong></span>
                      <span>Stress: <strong>{getStressLabel(state.stress || 0)}</strong></span>
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
                No states tracked yet. Start tracking to see patterns over time.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
