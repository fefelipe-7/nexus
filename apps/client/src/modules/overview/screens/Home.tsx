import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/ui/components/components/ui';
import { DollarSign, Heart, Clock, Smile, Target, FolderKanban, AlertCircle, Zap } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { IndicatorCard, DailySummary } from '../components/mobile';
import { IndicatorGrid, DailyOverview } from '../components/desktop';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';

export function Home() {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useDeviceDetection();

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

  const isMobileView = isMobile || isTablet;

  return (
    <div className="space-y-6">
      <div>
        <h1 className={isMobileView ? "text-2xl font-bold tracking-tight mb-1" : "text-3xl font-bold tracking-tight mb-1"}>
          Bem-vindo ao Nexus
        </h1>
        <p className="text-muted-foreground">Sua visão consolidada de vida em um só lugar</p>
      </div>

      {isMobileView ? (
        <>
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Estado Geral</h2>
            {indicators.map((indicator) => (
              <IndicatorCard
                key={indicator.domain}
                domain={indicator.domain}
                label={indicator.label}
                status={indicator.status}
                trend={indicator.trend}
                icon={indicator.icon}
                value={indicator.value}
              />
            ))}
          </div>

          <DailySummary
            commitments={dailyData.commitments}
            pendingTasks={dailyData.pendingTasks}
            plannedExpense={dailyData.plannedExpense}
            highlights={dailyData.highlights}
            concerns={dailyData.concerns}
          />

          <FAB
            onClick={() => navigate('/overview/suggestions')}
            label="Adicionar"
          />
        </>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Estado Geral</h2>
            <IndicatorGrid indicators={indicators} />
          </div>

          <div className="lg:col-span-2">
            <DailyOverview
              commitments={dailyData.commitments}
              pendingTasks={dailyData.pendingTasks}
              plannedExpense={dailyData.plannedExpense}
              highlights={dailyData.highlights}
              concerns={dailyData.concerns}
            />
          </div>
        </div>
      )}


      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Explore Mais</h2>
        <div className={isMobileView ? "grid gap-3 grid-cols-2" : "grid gap-4 md:grid-cols-2 lg:grid-cols-4"}>
          <Card
            className="cursor-pointer hover:bg-accent/50 active:scale-[0.98] transition-all group"
            onClick={() => navigate('/overview/weekly')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium">Semana</p>
                  <p className="text-xs text-muted-foreground">Análise estratégica</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:bg-accent/50 active:scale-[0.98] transition-all group"
            onClick={() => navigate('/overview/alerts')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <AlertCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium">Alertas</p>
                  <p className="text-xs text-muted-foreground">Sistema de atenção</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:bg-accent/50 active:scale-[0.98] transition-all group"
            onClick={() => navigate('/overview/pending')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <Zap className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium">Pendências</p>
                  <p className="text-xs text-muted-foreground">Tarefas pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:bg-accent/50 active:scale-[0.98] transition-all group"
            onClick={() => navigate('/overview/upcoming')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium">Próximos</p>
                  <p className="text-xs text-muted-foreground">Eventos futuros</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {!isMobileView && (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="py-4 px-5">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">💡 Dica:</span> Clique em qualquer indicador para explorar detalhes. Use os submódulos para análises mais profundas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
