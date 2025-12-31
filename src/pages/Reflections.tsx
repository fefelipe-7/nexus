import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Reflection } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MessageSquare, BookMarked, BarChart3 } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export function Reflections() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'journal' | 'review' | 'retrospective'>('journal');
  const [period, setPeriod] = useState('');

  const reflections = useLiveQuery(() =>
    db.reflections.orderBy('timestamp').reverse().toArray()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReflection: Reflection = {
      title: title.trim() || undefined,
      content,
      type,
      timestamp: new Date(),
      period: period.trim() || undefined,
    };

    await db.reflections.add(newReflection);
    
    setTitle('');
    setContent('');
    setType('journal');
    setPeriod('');
    setOpen(false);
  };

  const filterReflections = (filterType: string) => {
    if (!reflections) return [];
    if (filterType === 'all') return reflections;
    return reflections.filter(r => r.type === filterType);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'journal': return <MessageSquare className="h-5 w-5" />;
      case 'review': return <BookMarked className="h-5 w-5" />;
      case 'retrospective': return <BarChart3 className="h-5 w-5" />;
      default: return <MessageSquare className="h-5 w-5" />;
    }
  };

  const ReflectionItem = ({ reflection }: { reflection: Reflection }) => (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-muted-foreground mt-1">
            {getTypeIcon(reflection.type)}
          </div>
          <div className="flex-1 space-y-1">
            {reflection.title && (
              <h4 className="font-medium">{reflection.title}</h4>
            )}
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {reflection.content.length > 300 
                ? `${reflection.content.substring(0, 300)}...` 
                : reflection.content}
            </p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{formatDateTime(reflection.timestamp)}</span>
              {reflection.period && (
                <span>Period: {reflection.period}</span>
              )}
            </div>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
          reflection.type === 'journal' 
            ? 'bg-blue-100 text-blue-700' 
            : reflection.type === 'review'
            ? 'bg-green-100 text-green-700'
            : 'bg-purple-100 text-purple-700'
        }`}>
          {reflection.type}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reflections</h1>
          <p className="text-muted-foreground mt-1">Journal, review, and retrospect on your journey</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Reflection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Reflection</DialogTitle>
              <DialogDescription>
                Write a journal entry, review, or retrospective
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="journal">Journal</option>
                  <option value="review">Review</option>
                  <option value="retrospective">Retrospective</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (optional)</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give it a title"
                />
              </div>
              {type !== 'journal' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Period (optional)</label>
                  <Input
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="e.g., Week 1, December 2024, Q4 2024"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your reflection..."
                  rows={10}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Save Reflection</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Reflections</CardTitle>
          <CardDescription>A record of your thoughts and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="journal">Journal</TabsTrigger>
              <TabsTrigger value="review">Reviews</TabsTrigger>
              <TabsTrigger value="retrospective">Retrospectives</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-3 mt-4">
              {filterReflections('all').length > 0 ? (
                filterReflections('all').map((reflection) => (
                  <ReflectionItem key={reflection.id} reflection={reflection} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No reflections yet</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="journal" className="space-y-3 mt-4">
              {filterReflections('journal').length > 0 ? (
                filterReflections('journal').map((reflection) => (
                  <ReflectionItem key={reflection.id} reflection={reflection} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No journal entries yet</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="review" className="space-y-3 mt-4">
              {filterReflections('review').length > 0 ? (
                filterReflections('review').map((reflection) => (
                  <ReflectionItem key={reflection.id} reflection={reflection} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No reviews yet</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="retrospective" className="space-y-3 mt-4">
              {filterReflections('retrospective').length > 0 ? (
                filterReflections('retrospective').map((reflection) => (
                  <ReflectionItem key={reflection.id} reflection={reflection} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No retrospectives yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
