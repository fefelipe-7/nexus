import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import {
  Clock,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  Heart,
  Zap,
  AlertCircle,
  TrendingUp,
  Plus,
  Calendar,
  Wallet,
  Lightbulb,
} from 'lucide-react';

export function Daily() {
  const navigate = useNavigate();

  const today = new Date();
  const dateFormatted = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const dayScore = 72;
  const dayLabel = 'equilibrado';
  const dayLabelColor = {
    leve: 'text-green-500',
    equilibrado: 'text-blue-500',
    carregado: 'text-amber-500',
    crítico: 'text-red-500',
  }[dayLabel];

  const events = [
    { time: '09:00', title: 'Reunião com equipe', duration: '1h', priority: 'high' },
    { time: '14:00', title: 'Revisão de projeto', duration: '30m', priority: 'medium' },
    { time: '16:30', title: 'Feedback 1:1', duration: '45m', priority: 'medium' },
  ];

  const criticalTasks = [
    { title: 'Finalizar relatório Q1', priority: 'critical', time: '17:00' },
    { title: 'Revisar código do PR #234', priority: 'high', time: '18:00' },
    { title: 'Atualizar documentação', priority: 'high', time: '19:00' },
  ];

  const financialData = {
    balance: 2450.50,
    expenses: 125.30,
    income: 0,
    budgetAlert: false,
  };

  const healthData = {
    sleep: 7.5,
    steps: 4200,
    energy: 75,
    mood: 'positivo',
  };

  const suggestions = [
    {
      title: 'Pausar para hidratação',
      reason: 'Você tem 3 reuniões consecutivas',
      impact: 'Melhora foco e produtividade',
      type: 'wellness',
    },
    {
      title: 'Bloquear tempo para foco',
      reason: 'Tarefas críticas requerem concentração',
      impact: 'Aumenta chance de conclusão',
      type: 'productivity',
    },
    {
      title: 'Revisar orçamento',
      reason: 'Gastos estão dentro do esperado',
      impact: 'Mantém controle financeiro',
      type: 'finance',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Resumo do Dia</h1>
          <p className="text-slate-400 text-sm capitalize">{dateFormatted}</p>
        </div>

        {/* Day Status Overview */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl">Estado Geral do Dia</CardTitle>
            <CardDescription>Leitura instantânea baseada em múltiplos sinais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{dayScore}</span>
                  <span className="text-slate-400">/100</span>
                </div>
                <p className={`text-lg font-semibold capitalize ${dayLabelColor}`}>{dayLabel}</p>
              </div>
              <div className="text-right space-y-2">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="h-8 w-8 text-blue-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-400">Ativo</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                <p className="text-xs text-slate-400 mb-1">Compromissos</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                <p className="text-xs text-slate-400 mb-1">Tarefas</p>
                <p className="text-2xl font-bold">{criticalTasks.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                <p className="text-xs text-slate-400 mb-1">Alertas</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agenda de Hoje */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              Agenda de Hoje
            </CardTitle>
            <CardDescription>Eventos e compromissos planejados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-3 rounded-lg bg-slate-700/30 border border-slate-600 hover:border-blue-500/50 transition-colors"
                >
                  <div className="text-sm font-semibold text-blue-400 min-w-fit">{event.time}</div>
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-xs text-slate-400">{event.duration}</p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      event.priority === 'high'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {event.priority === 'high' ? 'Alta' : 'Média'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pendências Prioritárias */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              Pendências Prioritárias
            </CardTitle>
            <CardDescription>Tarefas críticas que impactam o andamento do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 border border-slate-600 hover:border-amber-500/50 transition-colors cursor-pointer"
                >
                  <div
                    className={`h-2 w-2 rounded-full flex-shrink-0 ${
                      task.priority === 'critical' ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.title}</p>
                  </div>
                  <span className="text-xs text-slate-400">{task.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Snapshot Financeiro */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              Snapshot Financeiro
            </CardTitle>
            <CardDescription>Situação financeira do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                <p className="text-xs text-slate-400 mb-2">Saldo</p>
                <p className="text-2xl font-bold text-green-400">R$ {financialData.balance.toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                <p className="text-xs text-slate-400 mb-2">Gastos Hoje</p>
                <p className="text-2xl font-bold text-red-400">R$ {financialData.expenses.toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                <p className="text-xs text-slate-400 mb-2">Renda Hoje</p>
                <p className="text-2xl font-bold text-blue-400">R$ {financialData.income.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Energia e Bem-estar */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-400" />
              Energia e Bem-estar
            </CardTitle>
            <CardDescription>Indicadores físicos e mentais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                <p className="text-xs text-slate-400 mb-2">Sono Noite Passada</p>
                <p className="text-2xl font-bold">{healthData.sleep}h</p>
                <p className="text-xs text-green-400 mt-1">✓ Adequado</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                <p className="text-xs text-slate-400 mb-2">Passos Hoje</p>
                <p className="text-2xl font-bold">{healthData.steps.toLocaleString()}</p>
                <p className="text-xs text-slate-400 mt-1">Meta: 10.000</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                <p className="text-xs text-slate-400 mb-2">Nível de Energia</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ width: `${healthData.energy}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{healthData.energy}%</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                <p className="text-xs text-slate-400 mb-2">Humor</p>
                <p className="text-lg font-semibold capitalize text-green-400">{healthData.mood}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sugestões Inteligentes */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              Sugestões Inteligentes
            </CardTitle>
            <CardDescription>Ações recomendadas com base no contexto atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-slate-700/30 border border-slate-600 hover:border-yellow-500/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{suggestion.title}</h4>
                    <TrendingUp className="h-4 w-4 text-green-400 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{suggestion.reason}</p>
                  <p className="text-xs text-green-400">💡 {suggestion.impact}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Footer */}
        <div className="grid grid-cols-3 gap-3 pb-8">
          <Button
            onClick={() => navigate('/time/tasks')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-lg flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Nova Tarefa</span>
          </Button>
          <Button
            onClick={() => navigate('/time/calendar')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 rounded-lg flex items-center justify-center gap-2"
          >
            <Calendar className="h-5 w-5" />
            <span className="hidden sm:inline">Novo Evento</span>
          </Button>
          <Button
            onClick={() => navigate('/money')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-6 rounded-lg flex items-center justify-center gap-2"
          >
            <Wallet className="h-5 w-5" />
            <span className="hidden sm:inline">Registrar Gasto</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
