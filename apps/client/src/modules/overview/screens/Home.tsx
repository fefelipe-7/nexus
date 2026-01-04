import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { DollarSign, Heart, Clock, Smile, Target, FolderKanban, TrendingUp, TrendingDown, Minus, ChevronRight, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  const indicators = [
    {
      domain: 'money',
      label: 'Dentro do orçamento',
      status: 'positive',
      trend: 'stable',
      icon: DollarSign,
      value: 'R$ 1.234,56'
    },
    {
      domain: 'health',
      label: 'Abaixo do ideal',
      status: 'attention',
      trend: 'down',
      icon: Heart,
      value: '6h sono'
    },
    {
      domain: 'time',
      label: 'Agenda cheia',
      status: 'neutral',
      trend: 'up',
      icon: Clock,
      value: '5 eventos'
    },
    {
      domain: 'mood',
      label: 'Estável',
      status: 'positive',
      trend: 'stable',
      icon: Smile,
      value: 'Positivo'
    },
    {
      domain: 'goals',
      label: '1 em risco',
      status: 'attention',
      trend: 'down',
      icon: Target,
      value: '1 atrasado'
    },
    {
      domain: 'projects',
      label: '3 em progresso',
      status: 'positive',
      trend: 'up',
      icon: FolderKanban,
      value: '3 ativo'
    }
  ];

  const dailyData = {
    commitments: 2,
    pendingTasks: 3,
    plannedExpense: {
      amount: 150.00,
      category: 'Alimentação'
    },
    highlights: [
      'Começou o dia com energia',
      'Completou 2 tarefas importantes'
    ],
    concerns: [
      'Ainda há 3 tarefas pendentes',
      'Uma reunião foi adiada para amanhã'
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive':
        return 'border-green-500/30 bg-green-500/5';
      case 'attention':
        return 'border-amber-500/30 bg-amber-500/5';
      case 'critical':
        return 'border-red-500/30 bg-red-500/5';
      default:
        return 'border-blue-500/30 bg-blue-500/5';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'positive':
        return 'bg-green-500/20 text-green-700';
      case 'attention':
        return 'bg-amber-500/20 text-amber-700';
      case 'critical':
        return 'bg-red-500/20 text-red-700';
      default:
        return 'bg-blue-500/20 text-blue-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'positive':
        return '✓ Bem';
      case 'attention':
        return '⚠ Atenção';
      case 'critical':
        return '✕ Crítico';
      default:
        return '→ Neutro';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
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
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Bem-vindo ao Nexus</h1>
        <p className="text-muted-foreground">Sua visão consolidada de vida em um só lugar</p>
      </div>

      {/* Grid Principal: Indicadores Compactos + Resumo do Dia */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna Esquerda: Indicadores em Grid Compacto */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Estado Geral</h2>
          <div className="grid gap-3 grid-cols-2">
            {indicators.map((indicator) => {
              const IconComponent = indicator.icon;
              return (
                <Card 
                  key={indicator.domain} 
                  className={`cursor-pointer hover:shadow-sm transition-all p-3 ${getStatusColor(indicator.status)}`}
                  onClick={() => navigate(`/${indicator.domain}`)}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div className={`p-1.5 rounded-lg ${getStatusBadgeColor(indicator.status)}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      {getTrendIcon(indicator.trend)}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground line-clamp-2">{indicator.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{indicator.value}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Coluna Direita: Resumo do Dia */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/20 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Hoje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Métricas do Dia em Grid Horizontal */}
              <div className="grid gap-3 grid-cols-3">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border">
                  <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Compromissos</p>
                    <p className="text-lg font-bold">{dailyData.commitments}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Tarefas</p>
                    <p className="text-lg font-bold">{dailyData.pendingTasks}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border">
                  <DollarSign className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Gasto</p>
                    <p className="text-lg font-bold">R$ {dailyData.plannedExpense.amount.toFixed(0)}</p>
                  </div>
                </div>
              </div>

              {/* Destaques e Atenção em Grid Horizontal */}
              <div className="grid gap-3 grid-cols-2">
                <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <h3 className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                    <span>✨</span> Destaques
                  </h3>
                  <ul className="space-y-1">
                    {dailyData.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-xs text-foreground leading-snug">
                        • {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <h3 className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Atenção
                  </h3>
                  <ul className="space-y-1">
                    {dailyData.concerns.map((concern, idx) => (
                      <li key={idx} className="text-xs text-foreground leading-snug">
                        • {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 text-xs"
                  onClick={() => navigate('/overview/weekly')}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Agenda
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 text-xs"
                  onClick={() => navigate('/overview/weekly')}
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
        </div>
      </div>

      {/* Seção: Submódulos Principais */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Explore Mais</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Card 
            className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-blue-500"
            onClick={() => navigate('/overview/weekly')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Semana
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Análise estratégica da semana
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-red-500"
            onClick={() => navigate('/overview/alerts')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Sistema de risco e atenção
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-amber-500"
            onClick={() => navigate('/overview/pending')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Pendências
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Passivo ativo que precisa resolver
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-purple-500"
            onClick={() => navigate('/overview/upcoming')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Próximos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Eventos que estão vindo
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dica Contextual */}
      <Card className="bg-blue-500/5 border-blue-500/30">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">💡 Dica:</span> Clique em qualquer indicador para explorar detalhes. Use os submódulos para análises mais profundas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
