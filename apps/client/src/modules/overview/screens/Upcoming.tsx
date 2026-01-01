import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { Calendar, Clock, Users, ChevronRight } from 'lucide-react';

export function Upcoming() {
  const navigate = useNavigate();

  const upcomingEvents = [
    {
      id: 1,
      title: 'Reunião com time de design',
      dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      participants: [
        { name: 'Ana Silva', avatar: '👩‍💼' },
        { name: 'Carlos Santos', avatar: '👨‍💼' },
        { name: 'Maria Costa', avatar: '👩‍💼' }
      ],
      eventType: 'Reunião'
    },
    {
      id: 2,
      title: 'Almoço com amigos',
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      participants: [
        { name: 'João', avatar: '👨' },
        { name: 'Pedro', avatar: '👨' }
      ],
      eventType: 'Social'
    },
    {
      id: 3,
      title: 'Apresentação do projeto',
      dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      participants: [
        { name: 'Diretor Geral', avatar: '👔' },
        { name: 'Gerente', avatar: '👔' }
      ],
      eventType: 'Trabalho'
    },
    {
      id: 4,
      title: 'Consulta dentária',
      dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      participants: [
        { name: 'Dr. Dentista', avatar: '👨‍⚕️' }
      ],
      eventType: 'Saúde'
    },
    {
      id: 5,
      title: 'Viagem para São Paulo',
      dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      participants: [
        { name: 'Família', avatar: '👨‍👩‍👧‍👦' }
      ],
      eventType: 'Pessoal'
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

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Reunião':
        return 'bg-blue-500/20 text-blue-700';
      case 'Social':
        return 'bg-green-500/20 text-green-700';
      case 'Trabalho':
        return 'bg-purple-500/20 text-purple-700';
      case 'Saúde':
        return 'bg-red-500/20 text-red-700';
      case 'Pessoal':
        return 'bg-amber-500/20 text-amber-700';
      default:
        return 'bg-gray-500/20 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Próximos Eventos</h1>
        <p className="text-muted-foreground mt-2">Antecipação mental dos seus compromissos</p>
      </div>

      {upcomingEvents.length === 0 ? (
        <Card className="bg-blue-500/5 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-blue-500 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium text-foreground">Nenhum evento próximo</p>
              <p className="text-sm text-muted-foreground mt-1">Sua agenda está livre!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10 h-fit">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{event.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getEventTypeColor(event.eventType)}`}>
                            {event.eventType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Clock className="h-4 w-4" />
                          {formatEventTime(event.dateTime)}
                        </div>
                        {event.participants.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div className="flex items-center gap-1">
                              {event.participants.slice(0, 3).map((participant, idx) => (
                                <div
                                  key={idx}
                                  className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium"
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
                      <ChevronRight className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-blue-500/5 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-lg">Dica de Planejamento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Revise seus próximos eventos regularmente para se preparar mentalmente e evitar surpresas desagradáveis.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
