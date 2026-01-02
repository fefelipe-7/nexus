import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { Calendar, Clock, Users, ChevronRight, MapPin, AlertCircle, CheckCircle2, Star, ChevronDown } from 'lucide-react';

export function Upcoming() {
  const navigate = useNavigate();
  const [expandedDays, setExpandedDays] = useState<string[]>([]);

  const upcomingEvents = [
    {
      id: 1,
      title: 'Reunião com time de design',
      dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      location: 'Sala de Reuniões A',
      participants: [
        { name: 'Ana Silva', avatar: '👩‍💼' },
        { name: 'Carlos Santos', avatar: '👨‍💼' },
        { name: 'Maria Costa', avatar: '👩‍💼' }
      ],
      eventType: 'Trabalho',
      impact: 'high',
      isKeyEvent: false,
      preparationPending: 1,
      preparations: ['Preparar slides da apresentação']
    },
    {
      id: 2,
      title: 'Almoço com amigos',
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      location: 'Restaurante Centro',
      participants: [
        { name: 'João', avatar: '👨' },
        { name: 'Pedro', avatar: '👨' }
      ],
      eventType: 'Social',
      impact: 'low',
      isKeyEvent: false,
      preparationPending: 0,
      preparations: []
    },
    {
      id: 3,
      title: 'Apresentação do projeto',
      dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      location: 'Auditório Principal',
      participants: [
        { name: 'Diretor Geral', avatar: '👔' },
        { name: 'Gerente', avatar: '👔' }
      ],
      eventType: 'Trabalho',
      impact: 'high',
      isKeyEvent: true,
      preparationPending: 2,
      preparations: ['Finalizar apresentação', 'Revisar dados']
    },
    {
      id: 4,
      title: 'Consulta dentária',
      dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      location: 'Clínica Dental Silva',
      participants: [
        { name: 'Dr. Dentista', avatar: '👨‍⚕️' }
      ],
      eventType: 'Saúde',
      impact: 'medium',
      isKeyEvent: false,
      preparationPending: 0,
      preparations: []
    },
    {
      id: 5,
      title: 'Viagem para São Paulo',
      dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: 'São Paulo, SP',
      participants: [
        { name: 'Família', avatar: '👨‍👩‍👧‍👦' }
      ],
      eventType: 'Pessoal',
      impact: 'high',
      isKeyEvent: true,
      preparationPending: 3,
      preparations: ['Fazer malas', 'Confirmar hotel', 'Comprar passagens']
    }
  ];

  const formatEventTime = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) {
      return `Hoje às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isTomorrow) {
      return `Amanhã às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const formatDateLabel = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) {
      return 'Hoje';
    } else if (isTomorrow) {
      return 'Amanhã';
    } else {
      return date.toLocaleDateString('pt-BR', { weekday: 'long', month: 'long', day: 'numeric' });
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Trabalho':
        return 'bg-blue-500/20 text-blue-700';
      case 'Social':
        return 'bg-green-500/20 text-green-700';
      case 'Saúde':
        return 'bg-red-500/20 text-red-700';
      case 'Pessoal':
        return 'bg-amber-500/20 text-amber-700';
      default:
        return 'bg-gray-500/20 text-gray-700';
    }
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

  const getDensity = (events: typeof upcomingEvents) => {
    if (events.length <= 2) return 'Agenda leve';
    if (events.length <= 4) return 'Agenda moderada';
    return 'Agenda cheia';
  };

  const keyEvents = upcomingEvents.filter(e => e.isKeyEvent);
  const groupedByDay = upcomingEvents.reduce((acc, event) => {
    const dateKey = event.dateTime.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, typeof upcomingEvents>);

  const toggleDay = (dateKey: string) => {
    setExpandedDays(prev =>
      prev.includes(dateKey) ? prev.filter(d => d !== dateKey) : [...prev, dateKey]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Próximos Eventos</h1>
        <p className="text-muted-foreground mt-2">Janela de antecipação temporal - o que está vindo aí</p>
      </div>

      {/* 1. Cabeçalho de Horizonte Temporal */}
      <Card className="bg-blue-500/5 border-blue-500/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Horizonte Temporal</p>
              <p className="text-lg font-semibold text-foreground">Próximos 7 dias</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Densidade</p>
              <p className="text-lg font-semibold text-foreground">{getDensity(upcomingEvents)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {upcomingEvents.length === 0 ? (
        <Card className="bg-green-500/5 border-green-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-green-500 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium text-foreground">Nenhum evento próximo</p>
              <p className="text-sm text-muted-foreground mt-1">Sua agenda está livre!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Eventos-Chave (Destaque) */}
          {keyEvents.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                Eventos-Chave
              </h3>
              {keyEvents.map((event) => (
                <Card key={event.id} className="border-l-4 border-l-amber-500 bg-amber-500/5">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="p-3 rounded-lg bg-amber-500/20 h-fit">
                        <Star className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{event.title}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getEventTypeColor(event.eventType)}`}>
                                {event.eventType}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatEventTime(event.dateTime)}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                            {event.preparationPending > 0 && (
                              <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                                <AlertCircle className="h-3 w-3" />
                                {event.preparationPending} item{event.preparationPending > 1 ? 'ns' : ''} pendente{event.preparationPending > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                        {event.preparationPending > 0 && (
                          <div className="mt-2 pt-2 border-t border-border/50">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Preparações:</p>
                            <ul className="space-y-1">
                              {event.preparations.map((prep, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                  <span className="text-amber-500 mt-0.5">•</span>
                                  {prep}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 2. Linha do Tempo de Eventos */}
          <div className="space-y-4">
            {Object.entries(groupedByDay).map(([dateKey, dayEvents]) => (
              <div key={dateKey}>
                {/* Cabeçalho do Dia */}
                <button
                  onClick={() => toggleDay(dateKey)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:bg-background transition-colors mb-2"
                >
                  <span className="font-semibold text-sm capitalize">{formatDateLabel(dayEvents[0].dateTime)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                      {dayEvents.length} evento{dayEvents.length > 1 ? 's' : ''}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedDays.includes(dateKey) ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Eventos do Dia */}
                {expandedDays.includes(dateKey) && (
                  <div className="space-y-2 ml-2">
                    {dayEvents.map((event) => (
                      <Card key={event.id} className="cursor-pointer hover:shadow-md transition-all">
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            <div className={`p-3 rounded-lg h-fit ${getEventTypeColor(event.eventType).replace('text-', 'bg-').replace('20', '10')}`}>
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-foreground text-sm">{event.title}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getEventTypeColor(event.eventType)}`}>
                                      {event.eventType}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {event.dateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {event.location && (
                                      <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {event.location}
                                      </span>
                                    )}
                                    <span className={`font-medium ${getImpactColor(event.impact)}`}>
                                      Impacto {event.impact === 'high' ? 'Alto' : event.impact === 'medium' ? 'Médio' : 'Baixo'}
                                    </span>
                                  </div>
                                  {event.participants.length > 0 && (
                                    <div className="flex items-center gap-2">
                                      <Users className="h-3 w-3 text-muted-foreground" />
                                      <div className="flex items-center gap-1">
                                        {event.participants.slice(0, 3).map((participant, idx) => (
                                          <div
                                            key={idx}
                                            className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium"
                                            title={participant.name}
                                          >
                                            {participant.avatar}
                                          </div>
                                        ))}
                                        {event.participants.length > 3 && (
                                          <span className="text-xs text-muted-foreground ml-1">
                                            +{event.participants.length - 3}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {event.preparationPending > 0 && (
                                <div className="mt-2 pt-2 border-t border-border/50">
                                  <p className="text-xs font-medium text-amber-600 flex items-center gap-1 mb-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {event.preparationPending} preparação{event.preparationPending > 1 ? 's' : ''} pendente{event.preparationPending > 1 ? 's' : ''}
                                  </p>
                                </div>
                              )}
                              <div className="mt-2 pt-2 border-t border-border/50 flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => navigate('/time/calendar')}
                                >
                                  Ver Detalhes
                                </Button>
                                {event.preparationPending > 0 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs"
                                    onClick={() => navigate('/time/tasks')}
                                  >
                                    Preparar
                                  </Button>
                                )}
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
        </div>
      )}

      {/* Dica de Antecipação */}
      <Card className="bg-blue-500/5 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-lg">Radar de Curto Prazo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Curto horizonte:</span> Normalmente 7 a 14 dias, nunca um calendário completo.
          </p>
          <p>
            <span className="font-medium text-foreground">Relevância acima de volume:</span> Nem todo evento aparece aqui, apenas os que impactam sua vida.
          </p>
          <p>
            <span className="font-medium text-foreground">Preparação, não execução:</span> Use para se preparar mentalmente e logisticamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
