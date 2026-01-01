import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { AlertCircle, TrendingDown, Heart, DollarSign, Clock, ChevronRight } from 'lucide-react';

export function Alerts() {
  const navigate = useNavigate();

  const alerts = [
    {
      id: 1,
      title: 'Conta vence hoje',
      description: 'Fatura do cartão de crédito vence em 2 horas',
      reason: 'Impacto financeiro alto',
      severity: 'critical',
      domain: 'money',
      icon: DollarSign,
      linkedEntity: { type: 'record', id: '1', label: 'Cartão Principal' }
    },
    {
      id: 2,
      title: 'Padrão de sono alterado',
      description: 'Você dormiu menos que o normal nos últimos 3 dias',
      reason: 'Pode afetar sua saúde e produtividade',
      severity: 'attention',
      domain: 'health',
      icon: Heart,
      linkedEntity: { type: 'record', id: '2', label: 'Histórico de Sono' }
    },
    {
      id: 3,
      title: 'Projeto atrasado',
      description: 'Projeto "Redesign do App" está 2 dias atrasado',
      reason: 'Prazo crítico próximo',
      severity: 'attention',
      domain: 'time',
      icon: Clock,
      linkedEntity: { type: 'project', id: '3', label: 'Redesign do App' }
    },
    {
      id: 4,
      title: 'Gasto acima do padrão',
      description: 'Seus gastos esta semana estão 25% acima do orçamento',
      reason: 'Impacto no planejamento financeiro',
      severity: 'attention',
      domain: 'money',
      icon: TrendingDown,
      linkedEntity: { type: 'record', id: '4', label: 'Orçamento Semanal' }
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500/30 bg-red-500/5';
      case 'attention':
        return 'border-amber-500/30 bg-amber-500/5';
      default:
        return 'border-blue-500/30 bg-blue-500/5';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-700';
      case 'attention':
        return 'bg-amber-500/20 text-amber-700';
      default:
        return 'bg-blue-500/20 text-blue-700';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'Crítico';
      case 'attention':
        return 'Atenção';
      default:
        return 'Informativo';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alertas Importantes</h1>
        <p className="text-muted-foreground mt-2">Situações que requerem sua atenção ou ação</p>
      </div>

      {alerts.length === 0 ? (
        <Card className="bg-green-500/5 border-green-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-green-500 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium text-foreground">Nenhum alerta no momento</p>
              <p className="text-sm text-muted-foreground mt-1">Tudo está sob controle!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const IconComponent = alert.icon;
            return (
              <Card key={alert.id} className={`cursor-pointer hover:shadow-md transition-all ${getSeverityColor(alert.severity)}`}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-lg h-fit ${getSeverityBadgeColor(alert.severity)}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{alert.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityBadgeColor(alert.severity)}`}>
                              {getSeverityLabel(alert.severity)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Por quê:</span> {alert.reason}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/${alert.domain}`)}
                          className="text-xs"
                        >
                          Ir para {alert.linkedEntity.label}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="bg-blue-500/5 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-lg">Dica de Gerenciamento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Os alertas mais críticos aparecem no topo. Resolva-os na ordem de prioridade para manter seu sistema de vida em equilíbrio.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
