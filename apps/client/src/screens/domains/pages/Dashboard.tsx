import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/data/local/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Button } from '@/ui/components/ui/button';
import { Plus, TrendingUp, CheckCircle2, Calendar, Target } from 'lucide-react';
import { formatDate, getMoodLabel, getEnergyLabel } from '@nexus/shared';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [currentDate] = useState(new Date());

  const recentState = useLiveQuery(
    () => db.personalStates.orderBy('timestamp').reverse().first()
  );

  const todayActions = useLiveQuery(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return db.actions
      .where('createdAt')
      .above(today)
      .or('dueDate')
      .above(today)
      .toArray();
  });

  const activeGoals = useLiveQuery(() =>
    db.goals.where('status').equals('active').toArray()
  );

  const todayEvents = useLiveQuery(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return db.events
      .where('startTime')
      .between(today, tomorrow)
      .toArray();
  });

  const completedToday = todayActions?.filter(a => a.status === 'completed').length || 0;
  const totalToday = todayActions?.length || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Painel</h1>
          <p className="text-muted-foreground mt-2 text-lg">{formatDate(currentDate)}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado Atual</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {recentState ? (
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  {recentState.mood ? getMoodLabel(recentState.mood) : 'Não rastreado'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {recentState.energy && `Energia: ${getEnergyLabel(recentState.energy)}`}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold">Sem dados</div>
                <p className="text-xs text-muted-foreground">Rastreie seu estado</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso de Hoje</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedToday}/{totalToday}
            </div>
            <p className="text-xs text-muted-foreground">
              Ações concluídas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Hoje</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayEvents?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Eventos agendados
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Ativas</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Target className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Em progresso
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ações de Hoje</CardTitle>
            <CardDescription>Tarefas e atividades para hoje</CardDescription>
          </CardHeader>
          <CardContent>
            {todayActions && todayActions.length > 0 ? (
              <div className="space-y-2">
                {todayActions.slice(0, 5).map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          action.status === 'completed'
                            ? 'bg-green-500'
                            : action.status === 'in-progress'
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      <span className="text-sm">{action.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {action.type}
                    </span>
                  </div>
                ))}
                <Link to="/actions">
                  <Button variant="outline" className="w-full mt-2">
                    Ver Todas as Ações
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">
                  Nenhuma ação para hoje
                </p>
                <Link to="/actions">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Ação
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metas Ativas</CardTitle>
            <CardDescription>Seus objetivos atuais</CardDescription>
          </CardHeader>
          <CardContent>
            {activeGoals && activeGoals.length > 0 ? (
              <div className="space-y-2">
                {activeGoals.slice(0, 5).map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <span className="text-sm font-medium">{goal.title}</span>
                      {goal.progress !== undefined && (
                        <div className="mt-2">
                          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <Link to="/goals">
                  <Button variant="outline" className="w-full mt-2">
                    Ver Todas as Metas
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">
                  Nenhuma meta ativa
                </p>
                <Link to="/goals">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Meta
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Tarefas comuns para começar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-4">
            <Link to="/state">
              <Button variant="outline" className="w-full">
                Rastrear Estado
              </Button>
            </Link>
            <Link to="/actions">
              <Button variant="outline" className="w-full">
                Adicionar Ação
              </Button>
            </Link>
            <Link to="/reflections">
              <Button variant="outline" className="w-full">
                Escrever Reflexão
              </Button>
            </Link>
            <Link to="/knowledge">
              <Button variant="outline" className="w-full">
                Capturar Nota
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
