import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Event } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export function Events() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState<'scheduled' | 'unexpected'>('scheduled');

  const events = useLiveQuery(() =>
    db.events.orderBy('startTime').reverse().toArray()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: Event = {
      title,
      description: description.trim() || undefined,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : undefined,
      type,
    };

    await db.events.add(newEvent);
    
    setTitle('');
    setDescription('');
    setStartTime('');
    setEndTime('');
    setType('scheduled');
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-1">Track scheduled and unexpected events</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Record a scheduled or unexpected event
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Event details..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="unexpected">Unexpected</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Time</label>
                <Input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Time (optional)</label>
                <Input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">Create Event</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Events</CardTitle>
          <CardDescription>Timeline of your events</CardDescription>
        </CardHeader>
        <CardContent>
          {events && events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 rounded-lg border p-4"
                >
                  <CalendarIcon className="h-5 w-5 text-muted-foreground mt-1" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{event.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        event.type === 'scheduled' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    )}
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>Start: {formatDateTime(event.startTime)}</span>
                      {event.endTime && (
                        <span>End: {formatDateTime(event.endTime)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No events recorded yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
