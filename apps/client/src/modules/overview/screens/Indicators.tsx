import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { DollarSign, Heart, Clock, Smile, Target, FolderKanban, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';

export function Indicators() {
  const navigate = useNavigate();

  const indicators = [
    {
      domain: 'money',
      label: 'Dentro do orçamento',
      status: 'positive',
      trend: 'stable',
      icon: DollarSign,
      description: 'Seus gastos estão alinhados com o planejado'
    },
    {
      domain: 'health',
      label: 'Abaixo do ideal',
      status: 'attention',
      trend: 'down',
      icon: Heart,
      description: 'Padrão de sono precisa melhorar'
    },
    {
      domain: 'time',
      label: 'Agenda cheia hoje',
      status: 'neutral',
      trend: 'up',
      icon: Clock,
      description: 'Você tem 5 compromissos agendados'
    },
    {
      domain: 'mood',
      label: 'Estável',
      status: 'positive',
      trend: 'stable',
      icon: Smile,
      description: 'Seu humor está consistente'
    },
    {
      domain: 'goals',
      label: '1 em risco',
      status: 'attention',
      trend: 'down',
      icon: Target,
      description: 'Um objetivo está atrasado'
    },
    {
      domain: 'projects',
      label: '3 em progresso',
      status: 'positive',
      trend: 'up',
      icon: FolderKanban,
      description: 'Seus projetos estão avançando bem'
    }
  ];

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Indicadores Rápidos</h1>
        <p className="text-muted-foreground mt-2">Estado da sua vida em 10 segundos</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {indicators.map((indicator) => {
          const IconComponent = indicator.icon;
          return (
            <Card 
              key={indicator.domain} 
              className={`cursor-pointer hover:shadow-md transition-all ${getStatusColor(indicator.status)}`}
              onClick={() => navigate(`/${indicator.domain}`)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${getStatusBadgeColor(indicator.status)}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(indicator.trend)}
                    <span className="text-xs text-muted-foreground">{getTrendLabel(indicator.trend)}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{indicator.label}</h3>
                <p className="text-xs text-muted-foreground mb-3">{indicator.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeColor(indicator.status)}`}>
                    {getStatusLabel(indicator.status)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-500/5 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-lg">Interpretação vs Dados Brutos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Cada indicador mostra uma interpretação do seu estado, não apenas números. Por exemplo:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <span className="font-medium">Dinheiro:</span> "Dentro do orçamento" (não apenas "R$ 1.234,56")</li>
            <li>• <span className="font-medium">Saúde:</span> "Abaixo do ideal" (não apenas "6 horas de sono")</li>
            <li>• <span className="font-medium">Tempo:</span> "Agenda cheia" (não apenas "5 eventos")</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-green-500/5 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-lg">Próximas Ações Recomendadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Clique em qualquer indicador para explorar detalhes e tomar ações específicas.</p>
            <Button variant="outline" className="w-full mt-3" onClick={() => navigate('/health/sleep')}>
              Melhorar Padrão de Sono
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
