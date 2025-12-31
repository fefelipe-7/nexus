import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Knowledge as KnowledgeType } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Lightbulb, GraduationCap, FileText } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export function Knowledge() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'note' | 'idea' | 'learning' | 'documentation'>('note');

  const knowledge = useLiveQuery(() =>
    db.knowledge.orderBy('updatedAt').reverse().toArray()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date();
    const newKnowledge: KnowledgeType = {
      title,
      content,
      type,
      createdAt: now,
      updatedAt: now,
    };

    await db.knowledge.add(newKnowledge);
    
    setTitle('');
    setContent('');
    setType('note');
    setOpen(false);
  };

  const filterKnowledge = (filterType: string) => {
    if (!knowledge) return [];
    if (filterType === 'all') return knowledge;
    return knowledge.filter(k => k.type === filterType);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note': return <FileText className="h-5 w-5" />;
      case 'idea': return <Lightbulb className="h-5 w-5" />;
      case 'learning': return <GraduationCap className="h-5 w-5" />;
      case 'documentation': return <BookOpen className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const KnowledgeItem = ({ item }: { item: KnowledgeType }) => (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-muted-foreground mt-1">
            {getTypeIcon(item.type)}
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-medium">{item.title}</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {item.content.length > 200 
                ? `${item.content.substring(0, 200)}...` 
                : item.content}
            </p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>Created: {formatDateTime(item.createdAt)}</span>
              {item.updatedAt.getTime() !== item.createdAt.getTime() && (
                <span>Updated: {formatDateTime(item.updatedAt)}</span>
              )}
            </div>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
          item.type === 'note' 
            ? 'bg-blue-100 text-blue-700' 
            : item.type === 'idea'
            ? 'bg-purple-100 text-purple-700'
            : item.type === 'learning'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {item.type}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge</h1>
          <p className="text-muted-foreground mt-1">Capture notes, ideas, and learnings</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Knowledge Entry</DialogTitle>
              <DialogDescription>
                Capture a note, idea, learning, or documentation
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give it a title"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="note">Note</option>
                  <option value="idea">Idea</option>
                  <option value="learning">Learning</option>
                  <option value="documentation">Documentation</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your content here..."
                  rows={8}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Save Entry</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Knowledge Base</CardTitle>
          <CardDescription>All your captured information</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="note">Notes</TabsTrigger>
              <TabsTrigger value="idea">Ideas</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
              <TabsTrigger value="documentation">Docs</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-3 mt-4">
              {filterKnowledge('all').length > 0 ? (
                filterKnowledge('all').map((item) => (
                  <KnowledgeItem key={item.id} item={item} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No knowledge entries yet</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="note" className="space-y-3 mt-4">
              {filterKnowledge('note').length > 0 ? (
                filterKnowledge('note').map((item) => (
                  <KnowledgeItem key={item.id} item={item} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No notes yet</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="idea" className="space-y-3 mt-4">
              {filterKnowledge('idea').length > 0 ? (
                filterKnowledge('idea').map((item) => (
                  <KnowledgeItem key={item.id} item={item} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No ideas yet</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="learning" className="space-y-3 mt-4">
              {filterKnowledge('learning').length > 0 ? (
                filterKnowledge('learning').map((item) => (
                  <KnowledgeItem key={item.id} item={item} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No learning entries yet</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="documentation" className="space-y-3 mt-4">
              {filterKnowledge('documentation').length > 0 ? (
                filterKnowledge('documentation').map((item) => (
                  <KnowledgeItem key={item.id} item={item} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No documentation yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
