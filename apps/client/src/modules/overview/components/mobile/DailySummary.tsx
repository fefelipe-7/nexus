import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { Accordion, AccordionItem } from '@/ui/components/mobile';
import { Clock, CheckCircle2, DollarSign, AlertCircle, Sparkles } from 'lucide-react';

interface DailySummaryProps {
  commitments: number;
  pendingTasks: number;
  plannedExpense: {
    amount: number;
    category: string;
  };
  highlights: string[];
  concerns: string[];
}

export function DailySummary({ commitments, pendingTasks, plannedExpense, highlights, concerns }: DailySummaryProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Hoje</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-3 rounded-lg bg-background/50 border">
              <Clock className="h-5 w-5 text-blue-500 mb-1" />
              <p className="text-xs text-muted-foreground">Compromissos</p>
              <p className="text-xl font-bold">{commitments}</p>
            </div>

            <div className="flex flex-col items-center p-3 rounded-lg bg-background/50 border">
              <CheckCircle2 className="h-5 w-5 text-green-500 mb-1" />
              <p className="text-xs text-muted-foreground">Tarefas</p>
              <p className="text-xl font-bold">{pendingTasks}</p>
            </div>

            <div className="flex flex-col items-center p-3 rounded-lg bg-background/50 border">
              <DollarSign className="h-5 w-5 text-amber-500 mb-1" />
              <p className="text-xs text-muted-foreground">Gasto</p>
              <p className="text-xl font-bold">R$ {plannedExpense.amount.toFixed(0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion>
        <AccordionItem title="Destaques do Dia" icon={Sparkles} defaultOpen>
          <ul className="space-y-2">
            {highlights.map((highlight, idx) => (
              <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </AccordionItem>

        <AccordionItem title="Pontos de Atenção" icon={AlertCircle}>
          <ul className="space-y-2">
            {concerns.map((concern, idx) => (
              <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">⚠</span>
                <span>{concern}</span>
              </li>
            ))}
          </ul>
        </AccordionItem>
      </Accordion>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/time/calendar')}
        >
          <Clock className="h-4 w-4 mr-2" />
          Agenda
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/overview/alerts')}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Alertas
        </Button>
      </div>
    </div>
  );
}
