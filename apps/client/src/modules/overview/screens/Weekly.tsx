import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';

export function Weekly() {
  const navigate = useNavigate();

  const weeklyData = {
    highlights: [
      'Completou 5 tarefas importantes',
      'Manteve consistência nos exercícios',
      'Economizou R$ 200 em relação ao orçamento'
    ],
    concerns: [
      'Dormir menos que o ideal em 2 noites',
      'Uma reunião foi adiada',
      'Gasto com alimentação acima do esperado'
    ],
    trends: {
      money: 'down',
      health: 'up',
      time: 'stable'
    },
    aiSummary: 'Esta semana você gastou mais que o normal, mas manteve bons hábitos de sono e foi produtivo em seus projetos.'
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'Melhorando';
      case 'down':
        return 'Piorando';
      default:
        return 'Estável';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resumo da Semana</h1>
        <p className="text-muted-foreground mt-2">Visão macro dos últimos 7 dias</p>
      </div>

      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/20">
        <CardHeader>
          <CardTitle className="text-2xl">Análise Semanal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-foreground leading-relaxed">
            {weeklyData.aiSummary}
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Dinheiro</p>
                {getTrendIcon(weeklyData.trends.money)}
              </div>
              <p className="text-sm font-medium">{getTrendLabel(weeklyData.trends.money)}</p>
            </div>

            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Saúde</p>
                {getTrendIcon(weeklyData.trends.health)}
              </div>
              <p className="text-sm font-medium">{getTrendLabel(weeklyData.trends.health)}</p>
            </div>

            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Tempo</p>
                {getTrendIcon(weeklyData.trends.time)}
              </div>
              <p className="text-sm font-medium">{getTrendLabel(weeklyData.trends.time)}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-green-600 mb-3">✨ Destaques</h3>
              <ul className="space-y-2">
                {weeklyData.highlights.map((highlight, idx) => (
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
                {weeklyData.concerns.map((concern, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Comparação com semana anterior:</p>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Você foi 15% mais produtivo esta semana</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate('/goals/reviews')}>
        <CardHeader>
          <CardTitle className="text-lg">Revisão Detalhada</CardTitle>
          <CardDescription>Análise completa da semana com métricas e insights</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="ghost" className="w-full justify-between">
            Abrir Revisão <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
