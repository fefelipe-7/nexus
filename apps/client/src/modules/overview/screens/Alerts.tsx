import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { AlertCircle, TrendingDown, Heart, DollarSign, Clock, ChevronRight, ChevronDown, CheckCircle2, X } from 'lucide-react';

export function Alerts() {
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [resolvedAlerts, setResolvedAlerts] = useState<number[]>([]);

  const activeAlerts = [
    {
      id: 1,
      title: 'Conta vence hoje',
      description: 'Fatura do cartão de crédito vence em 2 horas',
      reason: 'Impacto financeiro alto',
      consequence: 'Juros e multa por atraso',
      severity: 'critical',
      domain: 'money',
      icon: DollarSign,
      linkedEntity: { type: 'record', id: '1', label: 'Cartão Principal' },
      group: 'financial'
    },
    {
      id: 2,
      title: 'Padrão de sono alterado',
      description: 'Você dormiu menos que o normal nos últimos 3 dias',
      reason: 'Pode afetar sua saúde e produtividade',
      consequence: 'Redução de energia e foco',
      severity: 'attention',
      domain: 'health',
      icon: Heart,
      linkedEntity: { type: 'record', id: '2', label: 'Histórico de Sono' },
      group: 'health'
    },
    {
      id: 3,
      title: 'Projeto atrasado',
      description: 'Projeto "Redesign do App" está 2 dias atrasado',
      reason: 'Prazo crítico próximo',
      consequence: 'Risco de impacto em outras tarefas',
      severity: 'attention',
      domain: 'time',
      icon: Clock,
      linkedEntity: { type: 'project', id: '3', label: 'Redesign do App' },
      group: 'tasks'
    },
    {
      id: 4,
      title: 'Gasto acima do padrão',
      description: 'Seus gastos esta semana estão 25% acima do orçamento',
      reason: 'Impacto no planejamento financeiro',
      consequence: 'Possível falta de recursos para próximas semanas',
      severity: 'attention',
      domain: 'money',
      icon: TrendingDown,
      linkedEntity: { type: 'record', id: '4', label: 'Orçamento Semanal' },
      group: 'financial'
    },
    {
      id: 5,
      title: 'Sobrecarga prevista',
      description: 'Próxima semana tem 8 compromissos agendados',
      reason: 'Antecipa possível desgaste',
      consequence: 'Redução de tempo para tarefas pessoais',
      severity: 'preventive',
      domain: 'time',
      icon: Clock,
      linkedEntity: { type: 'record', id: '5', label: 'Agenda da Próxima Semana' },
      group: 'agenda'
    }
  ];

  const recentlyResolved = [
    {
      id: 101,
      title: 'Email importante respondido',
      action: 'Resolvido',
      timestamp: 'há 2 horas'
    },
    {
      id: 102,
      title: 'Tarefa crítica concluída',
      action: 'Concluído',
      timestamp: 'há 4 horas'
    }
  ];

  const filteredAlerts = activeAlerts.filter(alert => !resolvedAlerts.includes(alert.id));
  const criticalCount = filteredAlerts.filter(a => a.severity === 'critical').length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500/30 bg-red-500/5';
      case 'attention':
        return 'border-amber-500/30 bg-amber-500/5';
      case 'preventive':
        return 'border-blue-500/30 bg-blue-500/5';
      default:
        return 'border-gray-500/30 bg-gray-500/5';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-700';
      case 'attention':
        return 'bg-amber-500/20 text-amber-700';
      case 'preventive':
        return 'bg-blue-500/20 text-blue-700';
      default:
        return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'Crítico';
      case 'attention':
        return 'Atenção';
      case 'preventive':
        return 'Preventivo';
      default:
        return 'Informativo';
    }
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const handleResolve = (id: number) => {
    setResolvedAlerts(prev => [...prev, id]);
  };

  const handleDefer = (id: number) => {
    console.log(`Alerta ${id} adiado`);
  };

  const handleDismiss = (id: number) => {
    setResolvedAlerts(prev => [...prev, id]);
  };

  // Agrupar alertas
  const groupedAlerts = filteredAlerts.reduce((acc, alert) => {
    if (!acc[alert.group]) {
      acc[alert.group] = [];
    }
    acc[alert.group].push(alert);
    return acc;
  }, {} as Record<string, typeof filteredAlerts>);

  const groupLabels: Record<string, string> = {
    financial: 'Alertas Financeiros',
    health: 'Saúde e Bem-estar',
    tasks: 'Tarefas e Projetos',
    agenda: 'Agenda e Planejamento'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alertas Importantes</h1>
        <p className="text-muted-foreground mt-2">Sistema nervoso de risco e atenção do Nexus</p>
      </div>

      {/* 1. Cabeçalho de Estado */}
      <Card className={filteredAlerts.length === 0 ? 'bg-green-500/5 border-green-500/30' : criticalCount > 0 ? 'bg-red-500/5 border-red-500/30' : 'bg-amber-500/5 border-amber-500/30'}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estado Atual</p>
              {filteredAlerts.length === 0 ? (
                <p className="text-lg font-semibold text-green-600">Nenhum alerta crítico</p>
              ) : criticalCount > 0 ? (
                <p className="text-lg font-semibold text-red-600">{criticalCount} alerta{criticalCount > 1 ? 's' : ''} crítico{criticalCount > 1 ? 's' : ''} ativo{criticalCount > 1 ? 's' : ''}</p>
              ) : (
                <p className="text-lg font-semibold text-amber-600">{filteredAlerts.length} alerta{filteredAlerts.length > 1 ? 's' : ''} ativo{filteredAlerts.length > 1 ? 's' : ''}</p>
              )}
            </div>
            <AlertCircle className={`h-8 w-8 ${filteredAlerts.length === 0 ? 'text-green-500' : criticalCount > 0 ? 'text-red-500' : 'text-amber-500'}`} />
          </div>
        </CardContent>
      </Card>

      {/* 2. Lista Prioritária de Alertas */}
      {filteredAlerts.length === 0 ? (
        <Card className="bg-green-500/5 border-green-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium text-foreground">Tudo sob controle!</p>
              <p className="text-sm text-muted-foreground mt-1">Nenhum alerta exigindo atenção no momento</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedAlerts).map(([group, alerts]) => (
            <div key={group}>
              {/* Cabeçalho do Grupo */}
              <button
                onClick={() => toggleGroup(group)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:bg-background transition-colors mb-2"
              >
                <span className="font-semibold text-sm">{groupLabels[group]}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                    {alerts.length} {alerts.length === 1 ? 'alerta' : 'alertas'}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedGroups.includes(group) ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Alertas do Grupo */}
              {expandedGroups.includes(group) && (
                <div className="space-y-3 ml-2">
                  {alerts.map((alert) => {
                    const IconComponent = alert.icon;
                    return (
                      <Card key={alert.id} className={`${getSeverityColor(alert.severity)}`}>
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            <div className={`p-3 rounded-lg h-fit ${getSeverityBadgeColor(alert.severity)}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-foreground">{alert.title}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityBadgeColor(alert.severity)}`}>
                                      {getSeverityLabel(alert.severity)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                                  <div className="space-y-1 text-xs text-muted-foreground">
                                    <p><span className="font-medium">Por quê:</span> {alert.reason}</p>
                                    {alert.consequence && (
                                      <p><span className="font-medium">Consequência:</span> {alert.consequence}</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Ações */}
                              <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    navigate(`/${alert.domain}`);
                                  }}
                                  className="text-xs"
                                >
                                  Resolver Agora
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDefer(alert.id)}
                                  className="text-xs"
                                >
                                  Adiar
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDismiss(alert.id)}
                                  className="text-xs text-muted-foreground"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Ignorar
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
            </div>
          ))}
        </div>
      )}

      {/* 5. Alertas Resolvidos Recentemente */}
      {recentlyResolved.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Resolvidos Recentemente
            </CardTitle>
            <CardDescription>Progresso das últimas 24-48 horas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentlyResolved.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-700 px-2 py-1 rounded-full font-medium">
                    {item.action}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dica de Gerenciamento */}
      <Card className="bg-blue-500/5 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-lg">Como Usar Alertas Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Baixo volume, alta relevância:</span> Apenas eventos que realmente importam aparecem aqui.
          </p>
          <p>
            <span className="font-medium text-foreground">Contexto antes de ação:</span> Cada alerta explica por que está aparecendo e qual é a consequência.
          </p>
          <p>
            <span className="font-medium text-foreground">Aprendizado contínuo:</span> O sistema aprende quais alertas você resolve, adia ou ignora para melhorar no futuro.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
