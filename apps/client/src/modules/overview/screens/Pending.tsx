import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { AlertTriangle, Calendar, CheckCircle2, ChevronRight, Filter, Clock, Zap, TrendingDown, Archive, Plus } from 'lucide-react';

export function Pending() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'oldest' | 'impact' | 'effort' | 'blocking'>('all');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [resolvedItems, setResolvedItems] = useState<number[]>([]);

  const pendingItems = [
    {
      id: 1,
      title: 'Fatura do cartão vence hoje',
      deadline: new Date(Date.now()),
      daysOverdue: 0,
      whyCritical: 'Impacto financeiro alto - juros se não pagar',
      linkedEntity: { type: 'record', id: '1', label: 'Cartão Principal' },
      domain: 'money',
      origin: 'Financeiro',
      impact: 'high',
      effort: 'low',
      blocking: true,
      group: 'financial'
    },
    {
      id: 2,
      title: 'Consulta médica não confirmada',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      daysOverdue: 0,
      whyCritical: 'Saúde preventiva importante',
      linkedEntity: { type: 'record', id: '2', label: 'Consulta com Dr. Silva' },
      domain: 'health',
      origin: 'Saúde',
      impact: 'medium',
      effort: 'low',
      blocking: false,
      group: 'health'
    },
    {
      id: 3,
      title: 'Relatório do projeto atrasado',
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      daysOverdue: 2,
      whyCritical: 'Prazo crítico - impacta equipe',
      linkedEntity: { type: 'project', id: '3', label: 'Projeto X' },
      domain: 'work',
      origin: 'Tarefas',
      impact: 'high',
      effort: 'high',
      blocking: true,
      group: 'tasks'
    },
    {
      id: 4,
      title: 'Renovar seguro do carro',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      daysOverdue: 0,
      whyCritical: 'Documentação legal obrigatória',
      linkedEntity: { type: 'record', id: '4', label: 'Seguro Veículo' },
      domain: 'home',
      origin: 'Pessoal',
      impact: 'medium',
      effort: 'medium',
      blocking: false,
      group: 'personal'
    },
    {
      id: 5,
      title: 'Responder email importante do cliente',
      deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      daysOverdue: 1,
      whyCritical: 'Adiado 3 vezes - impacta relacionamento',
      linkedEntity: { type: 'record', id: '5', label: 'Email Cliente ABC' },
      domain: 'work',
      origin: 'Tarefas',
      impact: 'high',
      effort: 'low',
      blocking: true,
      group: 'tasks'
    }
  ];

  const filteredItems = pendingItems.filter(item => !resolvedItems.includes(item.id));
  const criticalCount = filteredItems.filter(i => i.daysOverdue > 0 || i.blocking).length;
  const impactLevel = criticalCount > 3 ? 'high' : criticalCount > 1 ? 'medium' : 'low';

  const formatDeadline = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Amanhã';
    } else {
      return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
    }
  };

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (daysOverdue: number, blocking: boolean) => {
    if (daysOverdue > 0 || blocking) return 'border-red-500/30 bg-red-500/5';
    return 'border-amber-500/30 bg-amber-500/5';
  };

  const getUrgencyBadge = (daysOverdue: number, blocking: boolean) => {
    if (daysOverdue > 0 || blocking) return 'bg-red-500/20 text-red-700';
    return 'bg-amber-500/20 text-amber-700';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      default:
        return 'text-blue-600';
    }
  };

  const getEffortLabel = (effort: string) => {
    switch (effort) {
      case 'low':
        return 'Baixo esforço';
      case 'medium':
        return 'Esforço médio';
      default:
        return 'Alto esforço';
    }
  };

  const sortItems = (items: typeof pendingItems) => {
    const sorted = [...items];
    switch (filter) {
      case 'oldest':
        return sorted.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
      case 'impact':
        return sorted.sort((a, b) => {
          const impactOrder = { high: 0, medium: 1, low: 2 };
          return impactOrder[a.impact as keyof typeof impactOrder] - impactOrder[b.impact as keyof typeof impactOrder];
        });
      case 'effort':
        return sorted.sort((a, b) => {
          const effortOrder = { low: 0, medium: 1, high: 2 };
          return effortOrder[a.effort as keyof typeof effortOrder] - effortOrder[b.effort as keyof typeof effortOrder];
        });
      case 'blocking':
        return sorted.sort((a, b) => (b.blocking ? 1 : 0) - (a.blocking ? 1 : 0));
      default:
        return sorted.sort((a, b) => {
          if (a.daysOverdue !== b.daysOverdue) return b.daysOverdue - a.daysOverdue;
          return a.deadline.getTime() - b.deadline.getTime();
        });
    }
  };

  const groupedItems = sortItems(filteredItems).reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof filteredItems>);

  const groupLabels: Record<string, string> = {
    financial: 'Pendências Financeiras',
    health: 'Saúde e Bem-estar',
    tasks: 'Tarefas e Projetos',
    personal: 'Pendências Pessoais'
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const handleResolve = (id: number) => {
    setResolvedItems(prev => [...prev, id]);
  };

  const handleReplan = (id: number) => {
    console.log(`Pendência ${id} replanejada`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pendências Críticas</h1>
        <p className="text-muted-foreground mt-2">Painel de passivo ativo - o que já está pendente e precisa ser resolvido</p>
      </div>

      {/* 1. Cabeçalho de Estado Crítico */}
      <Card className={impactLevel === 'high' ? 'bg-red-500/5 border-red-500/30' : impactLevel === 'medium' ? 'bg-amber-500/5 border-amber-500/30' : 'bg-green-500/5 border-green-500/30'}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tamanho do Passivo</p>
              {filteredItems.length === 0 ? (
                <p className="text-lg font-semibold text-green-600">Nenhuma pendência crítica</p>
              ) : (
                <>
                  <p className="text-lg font-semibold text-foreground">{filteredItems.length} pendência{filteredItems.length > 1 ? 's' : ''} crítica{filteredItems.length > 1 ? 's' : ''}</p>
                  <p className={`text-sm mt-1 font-medium ${impactLevel === 'high' ? 'text-red-600' : impactLevel === 'medium' ? 'text-amber-600' : 'text-green-600'}`}>
                    {impactLevel === 'high' ? 'Acúmulo prolongado' : impactLevel === 'medium' ? 'Acúmulo moderado' : 'Poucas, recentes'}
                  </p>
                </>
              )}
            </div>
            <AlertTriangle className={`h-8 w-8 ${impactLevel === 'high' ? 'text-red-500' : impactLevel === 'medium' ? 'text-amber-500' : 'text-green-500'}`} />
          </div>
        </CardContent>
      </Card>

      {/* 2. Filtro Rápido de Resolução */}
      {filteredItems.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="text-xs"
          >
            <Clock className="h-3 w-3 mr-1" />
            Todas
          </Button>
          <Button
            variant={filter === 'oldest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('oldest')}
            className="text-xs"
          >
            <TrendingDown className="h-3 w-3 mr-1" />
            Mais Antigas
          </Button>
          <Button
            variant={filter === 'impact' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('impact')}
            className="text-xs"
          >
            <Zap className="h-3 w-3 mr-1" />
            Maior Impacto
          </Button>
          <Button
            variant={filter === 'effort' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('effort')}
            className="text-xs"
          >
            <Filter className="h-3 w-3 mr-1" />
            Menor Esforço
          </Button>
          <Button
            variant={filter === 'blocking' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('blocking')}
            className="text-xs"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            Bloqueantes
          </Button>
        </div>
      )}

      {/* 3. Lista Unificada de Pendências */}
      {filteredItems.length === 0 ? (
        <Card className="bg-green-500/5 border-green-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium text-foreground">Nenhuma pendência crítica</p>
              <p className="text-sm text-muted-foreground mt-1">Você está em dia com tudo!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([group, items]) => (
            <div key={group}>
              {/* Cabeçalho do Grupo */}
              <button
                onClick={() => toggleGroup(group)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:bg-background transition-colors mb-2"
              >
                <span className="font-semibold text-sm">{groupLabels[group]}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                    {items.length} {items.length === 1 ? 'item' : 'itens'}
                  </span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${expandedGroups.includes(group) ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {/* Itens do Grupo */}
              {expandedGroups.includes(group) && (
                <div className="space-y-3 ml-2">
                  {items.map((item) => (
                    <Card key={item.id} className={`${getUrgencyColor(item.daysOverdue, item.blocking)}`}>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <div className={`p-3 rounded-lg h-fit ${getUrgencyBadge(item.daysOverdue, item.blocking)}`}>
                            <AlertTriangle className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                                  {item.blocking && (
                                    <span className="text-xs bg-red-500/20 text-red-700 px-2 py-0.5 rounded font-medium">
                                      Bloqueante
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDeadline(item.deadline)}
                                    {item.daysOverdue > 0 && <span className="text-red-600 font-medium">({item.daysOverdue}d atrasado)</span>}
                                  </span>
                                  <span className={`font-medium ${getImpactColor(item.impact)}`}>
                                    Impacto {item.impact === 'high' ? 'Alto' : item.impact === 'medium' ? 'Médio' : 'Baixo'}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">
                                  <span className="font-medium">Por quê:</span> {item.whyCritical}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  <span className="font-medium">Esforço:</span> {getEffortLabel(item.effort)}
                                </p>
                              </div>
                            </div>

                            {/* Ações */}
                            <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  navigate(`/${item.domain}`);
                                }}
                                className="text-xs"
                              >
                                Resolver Agora
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReplan(item.id)}
                                className="text-xs"
                              >
                                Replanejar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleResolve(item.id)}
                                className="text-xs text-muted-foreground"
                              >
                                <Archive className="h-3 w-3 mr-1" />
                                Arquivar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dica de Gerenciamento */}
      <Card className="bg-blue-500/5 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-lg">Estratégia de Redução</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Zero ambiguidade:</span> Tudo aqui está atrasado, bloqueado ou em risco.
          </p>
          <p>
            <span className="font-medium text-foreground">Menos explicação, mais ação:</span> Contexto mínimo suficiente para decidir.
          </p>
          <p>
            <span className="font-medium text-foreground">Sem julgamento:</span> O sistema apresenta fatos, não culpas. Use os filtros para atacar o passivo estrategicamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
