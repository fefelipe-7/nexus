import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockPhysicalHealthData } from '../data/mockPhysicalHealthData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus } from 'lucide-react';

import {
  PhysicalStatusCard,
  AlertsCard,
  MovementCard,
  RecentActivitiesCard,
  RecoveryCard,
} from '../components/mobile';

import {
  PhysicalHealthOverview,
} from '../components/desktop';

export function PhysicalHealth() {
  const { isMobile, isTablet } = useDeviceDetection();
  const isMobileView = isMobile || isTablet;

  const data = mockPhysicalHealthData;

  const handleQuickCheckIn = () => {
    console.log('Quick check-in');
  };

  if (isMobileView) {
    return (
      <div className="space-y-4 pb-20">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Saúde Física</h1>
          <p className="text-sm text-muted-foreground">
            Como está seu corpo hoje?
          </p>
        </div>

        <PhysicalStatusCard summary={data.summary} />

        <AlertsCard alerts={data.summary.alerts} />

        <MovementCard movement={data.movement} />

        <RecoveryCard recovery={data.recovery} />

        <RecentActivitiesCard activities={data.movement.activities} />

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
          <h1 className="text-3xl font-bold tracking-tight mb-1">Saúde Física</h1>
          <p className="text-muted-foreground">
            Mantenha seu corpo funcional e alinhado com seus objetivos
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <PhysicalHealthOverview summary={data.summary} />

      {/* Dashboard Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column - Movement & Activities */}
        <div className="lg:col-span-5 space-y-6">
          <MovementCard movement={data.movement} />
          <RecentActivitiesCard activities={data.movement.activities} />
        </div>

        {/* Middle Column - Recovery & Alerts */}
        <div className="lg:col-span-4 space-y-6">
          <RecoveryCard recovery={data.recovery} />
        </div>

        {/* Right Column - Alerts & Insights */}
        <div className="lg:col-span-3 space-y-6">
          <AlertsCard alerts={data.summary.alerts} />
        </div>
      </div>
    </div>
  );
}
