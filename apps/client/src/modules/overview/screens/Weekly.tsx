import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Minus, ChevronRight, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

export function Weekly() {
  const navigate = useNavigate();

  const weeklyData = {
    weekInterval: '08 - 14 de Janeiro',
    weekLabel: 'Semana equilibrada',
    score: 72,
    summary: 'Você manteve consistência, mas acumulou mais tarefas do que concluiu.',
    
    plannedVsRealized: {
      tasksPlanned: 12,
      tasksCompleted: 8,
      eventsPlanned: 5,
      eventsRealized: 4,
      habitsPlanned: 7,
      habitsMaintained: 5
    },

    timeDistribution: {
      work: 35,
      personal: 20,
      health: 15,
      social: 15,
      studies: 15,
      insight: 'Concentração de carga na quarta e quinta'
    },

    pendencies: [
      { title: 'Relatório de projeto', daysOverdue: 3, status: 'critical' },
      { title: 'Revisar documentação', daysOverdue: 1, status: 'high' },
      { title: 'Responder emails pendentes', daysOverdue: 2, status: 'high' }
    ],

    financial: {
      totalSpent: 1250.50,
      previousWeek: 1050.00,
      weeklyBudget: 1200.00,
      topCategories: [
        { name: 'Alimentação', amount: 450.00, percentage: 36 },
        { name: 'Transporte', amount: 280.00, percentage: 22 },
        { name: 'Lazer', amount: 200.00, percentage: 16 }
      ]
    },

    wellness: {
      avgSleep: 6.8,
      sleepTrend: 'down',
      energyLevel: 'moderada',
      emotionalState: 'positivo',
      recoverySignal: 'Sinais de desgaste no final da semana'
    },

    highlights: [
      'Completou 5 tarefas importantes',
      'Manteve consistência nos exercícios',
      'Economizou R$ 200 em relação ao orçamento'
    ],

    patterns: [
      'Você rende mais no início da semana',
      'Planeja mais do que consegue executar',
      'Gastos aumentam em semanas com mais compromissos'
    ],

    trends: {
      money: 'down',
      health: 'up',
      time: 'stable'
    }
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

  const getWeekLabelColor = (label: string) => {
    switch (label) {
      case 'Semana leve':
        return 'text-green-600 bg-green-50';
      case 'Semana equilibrada':
        return 'text-blue-600 bg-blue-50';
      case 'Semana intensa':
        return 'text-amber-600 bg-amber-50';
      case 'Semana sobrecarregada':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resumo da Semana</h1>
        <p className="text-muted-foreground mt-2">Análise estratégica e reflexiva dos últimos 7 dias</p>
      </div>

      {/* 1. Cabeçalho Semanal */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{weeklyData.weekInterval}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${getWeekLabelColor(weeklyData.weekLabel)}`}>
          {weeklyData.weekLabel}
        </div>
      </div>

      {/* 2. Visão Geral da Semana */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/20">
        <CardHeader>
          <CardTitle className="text-2xl">Visão Geral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold">{weeklyData.score}</span>
                <span className="text-muted-foreground">/100</span>
              </div>
              <p className="text-sm text-muted-foreground">Score da semana</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-foreground">{weeklyData.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Planejado vs Realizado */}
      <Card>
        <CardHeader>
          <CardTitle>Planejado vs Realizado</CardTitle>
          <CardDescription>Alinhamento entre intenção e execução</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <p className="text-sm text-muted-foreground mb-3">Tarefas</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Planejadas</span>
                  <span className="font-bold">{weeklyData.plannedVsRealized.tasksPlanned}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Concluídas</span>
                  <span className="font-bold text-green-600">{weeklyData.plannedVsRealized.tasksCompleted}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${(weeklyData.plannedVsRealized.tasksCompleted / weeklyData.plannedVsRealized.tasksPlanned) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <p className="text-sm text-muted-foreground mb-3">Eventos</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Planejados</span>
                  <span className="font-bold">{weeklyData.plannedVsRealized.eventsPlanned}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Realizados</span>
                  <span className="font-bold text-blue-600">{weeklyData.plannedVsRealized.eventsRealized}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(weeklyData.plannedVsRealized.eventsRealized / weeklyData.plannedVsRealized.eventsPlanned) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <p className="text-sm text-muted-foreground mb-3">Hábitos</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Previstos</span>
                  <span className="font-bold">{weeklyData.plannedVsRealized.habitsPlanned}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mantidos</span>
                  <span className="font-bold text-purple-600">{weeklyData.plannedVsRealized.habitsMaintained}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${(weeklyData.plannedVsRealized.habitsMaintained / weeklyData.plannedVsRealized.habitsPlanned) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Distribuição de Tempo e Energia */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Tempo</CardTitle>
          <CardDescription>{weeklyData.timeDistribution.insight}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Trabalho', value: weeklyData.timeDistribution.work, color: 'bg-blue-500' },
              { label: 'Pessoal', value: weeklyData.timeDistribution.personal, color: 'bg-purple-500' },
              { label: 'Saúde', value: weeklyData.timeDistribution.health, color: 'bg-green-500' },
              { label: 'Social', value: weeklyData.timeDistribution.social, color: 'bg-pink-500' },
              { label: 'Estudos', value: weeklyData.timeDistribution.studies, color: 'bg-amber-500' }
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm text-muted-foreground">{item.value}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 5. Pendências e Acúmulos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Pendências e Acúmulos
          </CardTitle>
          <CardDescription>Tarefas que atravessaram a semana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {weeklyData.pendencies.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${item.status === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.daysOverdue} dias atrasado</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Replanejar</Button>
                  <Button variant="outline" size="sm">Arquivar</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 6. Financeiro Semanal */}
      <Card>
        <CardHeader>
          <CardTitle>Financeiro da Semana</CardTitle>
          <CardDescription>Resumo estratégico sem detalhes excessivos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Total Gasto</p>
              <p className="text-2xl font-bold">R$ {weeklyData.financial.totalSpent.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Semana Anterior</p>
              <p className="text-2xl font-bold">R$ {weeklyData.financial.previousWeek.toFixed(2)}</p>
              <p className="text-xs text-red-600 mt-1">+R$ {(weeklyData.financial.totalSpent - weeklyData.financial.previousWeek).toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Orçamento Semanal</p>
              <p className="text-2xl font-bold">R$ {weeklyData.financial.weeklyBudget.toFixed(2)}</p>
              <p className={`text-xs mt-1 ${weeklyData.financial.totalSpent > weeklyData.financial.weeklyBudget ? 'text-red-600' : 'text-green-600'}`}>
                {weeklyData.financial.totalSpent > weeklyData.financial.weeklyBudget ? '⚠️ Acima do orçamento' : '✓ Dentro do orçamento'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-3">Categorias Principais</p>
            <div className="space-y-2">
              {weeklyData.financial.topCategories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{cat.name}</span>
                      <span className="text-sm font-medium">R$ {cat.amount.toFixed(2)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7. Bem-estar e Ritmo Pessoal */}
      <Card>
        <CardHeader>
          <CardTitle>Bem-estar e Ritmo Pessoal</CardTitle>
          <CardDescription>Correlação entre desempenho e estado pessoal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Média de Sono</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{weeklyData.wellness.avgSleep}</span>
                <span className="text-sm text-muted-foreground">horas/noite</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {getTrendIcon(weeklyData.wellness.sleepTrend)}
                <span className="text-xs text-muted-foreground">Tendência baixa</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Nível de Energia</p>
              <p className="text-lg font-semibold capitalize">{weeklyData.wellness.energyLevel}</p>
              <p className="text-xs text-muted-foreground mt-2">{weeklyData.wellness.recoverySignal}</p>
            </div>

            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Estado Emocional</p>
              <p className="text-lg font-semibold capitalize text-green-600">{weeklyData.wellness.emotionalState}</p>
            </div>

            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Relação Carga × Recuperação</p>
              <p className="text-sm">Semana produtiva, mas com sinais de desgaste</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 8. Destaques da Semana */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Destaques da Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {weeklyData.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 9. Aprendizados e Padrões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Aprendizados e Padrões Detectados
          </CardTitle>
          <CardDescription>Transformando dados em entendimento</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {weeklyData.patterns.map((pattern, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border">
                <span className="text-amber-500 font-bold mt-0.5">💡</span>
                <span className="text-sm">{pattern}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 10. Preparação para Próxima Semana */}
      <Card>
        <CardHeader>
          <CardTitle>Preparação para Próxima Semana</CardTitle>
          <CardDescription>Feche o ciclo semanal com ajustes conscientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button className="flex-1" onClick={() => navigate('/goals/planning')}>
              Ajustar Planejamento
            </Button>
            <Button variant="outline" className="flex-1">
              Manter Estratégia
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
