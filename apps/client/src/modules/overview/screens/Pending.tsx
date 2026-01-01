import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { AlertTriangle, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

export function Pending() {
  const navigate = useNavigate();

  const pendingItems = [
    {
      id: 1,
      title: 'Fatura do cartão vence amanhã',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      whyCritical: 'Impacto financeiro alto - juros se não pagar',
      linkedEntity: { type: 'record', id: '1', label: 'Cartão Principal' },
      domain: 'money'
    },
    {
      id: 2,
      title: 'Consulta médica não confirmada',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      whyCritical: 'Saúde preventiva importante',
      linkedEntity: { type: 'record', id: '2', label: 'Consulta com Dr. Silva' },
      domain: 'health'
    },
    {
      id: 3,
      title: 'Relatório do projeto atrasado',
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      whyCritical: 'Prazo crítico - impacta equipe',
      linkedEntity: { type: 'project', id: '3', label: 'Projeto X' },
      domain: 'work'
    },
    {
      id: 4,
      title: 'Renovar seguro do carro',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      whyCritical: 'Documentação legal obrigatória',
      linkedEntity: { type: 'record', id: '4', label: 'Seguro Veículo' },
      domain: 'home'
    }
  ];

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

  const getUrgencyColor = (daysUntil: number) => {
    if (daysUntil <= 1) return 'border-red-500/30 bg-red-500/5';
    if (daysUntil <= 3) return 'border-amber-500/30 bg-amber-500/5';
    return 'border-blue-500/30 bg-blue-500/5';
  };

  const getUrgencyBadge = (daysUntil: number) => {
    if (daysUntil <= 1) return 'bg-red-500/20 text-red-700';
    if (daysUntil <= 3) return 'bg-amber-500/20 text-amber-700';
    return 'bg-blue-500/20 text-blue-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pendências Críticas</h1>
        <p className="text-muted-foreground mt-2">Itens que não podem esperar</p>
      </div>

      {pendingItems.length === 0 ? (
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
          {pendingItems
            .sort((a, b) => getDaysUntil(a.deadline) - getDaysUntil(b.deadline))
            .map((item) => {
              const daysUntil = getDaysUntil(item.deadline);
              return (
                <Card key={item.id} className={`cursor-pointer hover:shadow-md transition-all ${getUrgencyColor(daysUntil)}`}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className={`p-3 rounded-lg h-fit ${getUrgencyBadge(daysUntil)}`}>
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {formatDeadline(item.deadline)}
                                {daysUntil > 0 && ` (em ${daysUntil} dia${daysUntil > 1 ? 's' : ''})`}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Por quê:</span> {item.whyCritical}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                        </div>
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/${item.domain}`)}
                            className="text-xs"
                          >
                            Resolver Agora
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
          <CardTitle className="text-lg">Priorização Automática</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Os itens são ordenados por urgência (prazo mais próximo primeiro). Resolva-os nesta ordem para evitar problemas maiores.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
