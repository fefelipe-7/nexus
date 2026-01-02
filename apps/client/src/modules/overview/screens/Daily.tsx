import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { Clock, CheckCircle2, DollarSign, ChevronRight } from 'lucide-react';

export function Daily() {
  const navigate = useNavigate();

  const dailyData = {
    commitments: 2,
    pendingTasks: 3,
    plannedExpense: {
      amount: 150.00,
      category: 'Alimentação'
    },
    narrative: 'Hoje você tem 2 compromissos, 3 tarefas pendentes e um gasto planejado de R$ 150,00 em alimentação.',
    highlights: [
      'Começou o dia com energia',
      'Completou 2 tarefas importantes',
      'Manteve o orçamento sob controle'
    ],
    concerns: [
      'Ainda há 3 tarefas pendentes',
      'Uma reunião foi adiada para amanhã'
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resumo do Dia</h1>
        <p className="text-muted-foreground mt-2">Visão consolidada de como está seu dia</p>
      </div>

      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/20">
        <CardHeader>
          <CardTitle className="text-2xl">Hoje</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-foreground leading-relaxed">
            {dailyData.narrative}
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border">
              <Clock className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Compromissos</p>
                <p className="text-2xl font-bold">{dailyData.commitments}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Tarefas Pendentes</p>
                <p className="text-2xl font-bold">{dailyData.pendingTasks}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border">
              <DollarSign className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Gasto Planejado</p>
                <p className="text-2xl font-bold">R$ {dailyData.plannedExpense.amount.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">{dailyData.plannedExpense.category}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-green-600 mb-3">✨ Destaques</h3>
              <ul className="space-y-2">
                {dailyData.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-amber-600 mb-3">⚠️ Pontos de Atenção</h3>
              <ul className="space-y-2">
                {dailyData.concerns.map((concern, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Próximas ações recomendadas:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                Confirmar compromissos do dia
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Priorizar as 3 tarefas pendentes
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                Acompanhar gastos planejados
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate('/time/calendar')}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Ver Agenda Completa
            </CardTitle>
            <CardDescription>Visualize todos os seus compromissos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-between">
              Abrir <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate('/time/tasks')}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Gerenciar Tarefas
            </CardTitle>
            <CardDescription>Organize suas tarefas do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-between">
              Abrir <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
