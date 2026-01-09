import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { Clock, CheckCircle2, DollarSign, AlertCircle, Sparkles } from 'lucide-react';

interface DailyOverviewProps {
  commitments: number;
  pendingTasks: number;
  plannedExpense: {
    amount: number;
    category: string;
  };
  highlights: string[];
  concerns: string[];
}

export function DailyOverview({ commitments, pendingTasks, plannedExpense, highlights, concerns }: DailyOverviewProps) {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/20 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Hoje</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 grid-cols-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border hover:bg-background/80 transition-colors">
            <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Compromissos</p>
              <p className="text-lg font-bold">{commitments}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border hover:bg-background/80 transition-colors">
            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Tarefas</p>
              <p className="text-lg font-bold">{pendingTasks}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border hover:bg-background/80 transition-colors">
            <DollarSign className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Gasto</p>
              <p className="text-lg font-bold">R$ {plannedExpense.amount.toFixed(0)}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 grid-cols-2">
          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 hover:bg-green-500/10 transition-colors">
            <h3 className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Destaques
            </h3>
            <ul className="space-y-1">
              {highlights.map((highlight, idx) => (
                <li key={idx} className="text-xs text-foreground leading-snug">
                  • {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 hover:bg-amber-500/10 transition-colors">
            <h3 className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Atenção
            </h3>
            <ul className="space-y-1">
              {concerns.map((concern, idx) => (
                <li key={idx} className="text-xs text-foreground leading-snug">
                  • {concern}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => navigate('/time/calendar')}
          >
            <Clock className="h-3 w-3 mr-1" />
            Agenda
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => navigate('/time/tasks')}
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Tarefas
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => navigate('/overview/alerts')}
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Alertas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
