import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockMentalHealthData } from '../data/mockMentalHealthData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus } from 'lucide-react';

import {
  MentalStatusCard,
  MentalIndicatorsCard,
  MentalAlertsCard,
  StressSourcesCard,
  AISuggestionsCard,
} from '../components/mobile';

import {
  MentalHealthOverview,
} from '../components/desktop';

export function MentalHealth() {
  const { isMobile, isTablet } = useDeviceDetection();
  const isMobileView = isMobile || isTablet;

  const data = mockMentalHealthData;

  const handleQuickCheckIn = () => {
    console.log('Quick mental check-in');
  };

  if (isMobileView) {
    return (
      <div className="space-y-4 pb-20">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Saúde Mental</h1>
          <p className="text-sm text-muted-foreground">
            Como você está emocional e cognitivamente?
          </p>
        </div>

        <MentalStatusCard summary={data.summary} />

        <MentalAlertsCard alerts={data.summary.alerts} />

        <MentalIndicatorsCard indicators={data.summary.indicators} />

        <StressSourcesCard stress={data.stress} />

        <AISuggestionsCard suggestions={data.aiSuggestions} />

        <FAB
          onClick={handleQuickCheckIn}
          icon={Plus}
          label="Check-in"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Saúde Mental</h1>
          <p className="text-muted-foreground">
            Autoconsciência emocional para decisões mais humanas e sustentáveis
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <MentalHealthOverview summary={data.summary} />

      {/* Dashboard Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column - Indicators & Stress */}
        <div className="lg:col-span-5 space-y-6">
          <MentalIndicatorsCard indicators={data.summary.indicators} />
          <StressSourcesCard stress={data.stress} />
        </div>

        {/* Middle Column - Alerts */}
        <div className="lg:col-span-4 space-y-6">
          <MentalAlertsCard alerts={data.summary.alerts} />
        </div>

        {/* Right Column - AI Suggestions */}
        <div className="lg:col-span-3 space-y-6">
          <AISuggestionsCard suggestions={data.aiSuggestions} />
        </div>
      </div>
    </div>
  );
}
