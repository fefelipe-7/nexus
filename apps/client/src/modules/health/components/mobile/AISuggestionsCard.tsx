import { Card, CardContent } from '@/ui/components/components/ui';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { AISuggestion } from '../../types/mental-health.types';

interface AISuggestionsCardProps {
  suggestions: AISuggestion[];
}

export function AISuggestionsCard({ suggestions }: AISuggestionsCardProps) {
  if (suggestions.length === 0) {
    return null;
  }

  const getPriorityColor = (priority: AISuggestion['priority']) => {
    switch (priority) {
      case 'high':
        return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-600' };
      case 'medium':
        return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-600' };
      default:
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-600' };
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="h-4 w-4 text-purple-600" />
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Sugestões da IA ({suggestions.length})
        </h3>
      </div>
      
      {suggestions.map((suggestion) => {
        const colors = getPriorityColor(suggestion.priority);

        return (
          <Card
            key={suggestion.id}
            className={cn('border-l-4', colors.border)}
          >
            <CardContent className="pt-4 space-y-3">
              <div>
                <p className="text-sm font-medium">{suggestion.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{suggestion.reasoning}</p>
              </div>

              {suggestion.actionable && suggestion.actionText && (
                <button
                  className={cn(
                    'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all active:scale-[0.98]',
                    colors.bg,
                    'border',
                    colors.border
                  )}
                  onClick={() => console.log('Action:', suggestion.actionText)}
                >
                  <span className={cn('text-sm font-medium', colors.text)}>
                    {suggestion.actionText}
                  </span>
                  <ArrowRight className={cn('h-4 w-4', colors.text)} />
                </button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
