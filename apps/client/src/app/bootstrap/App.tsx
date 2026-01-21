import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ResponsiveLayout } from '@/ui/layouts/ResponsiveLayout';
import { MODULES } from '@/config/modules.config';
import { SubmodulePlaceholder } from '@/ui/components/SubmodulePlaceholder';

import { Overview, Home, Weekly, Alerts, Pending, Upcoming, Suggestions } from '@/modules/overview';
import { Money, CashFlow, Accounts, Cards, Budget, Purchases, Subscriptions, Debts, Investments, Patrimony, FinancialGoals, Reports } from '@/modules/money';
import { Time, Agenda, Commitments, Tasks, Habits, Routines, Priorities, History, WeeklyPlanning } from '@/modules/time';
import { Goals, LifeGoals, YearlyGoals, ShortTermGoals, ActionPlans, ProgressIndicators, PeriodicReviews, GoalConnections } from '@/modules/goals';
import { Health } from '@/modules/health';
import { People } from '@/modules/people';
import { WorkStudy } from '@/modules/work-study';
import { HomeThings } from '@/modules/home-things';
import { Projects } from '@/modules/projects';
import { DigitalLife } from '@/modules/digital-life';
import { Memories } from '@/modules/memories';
import { Insights } from '@/modules/insights';

const moduleComponents: Record<string, React.ComponentType> = {
  'overview': Overview,
  'money': Money,
  'time': Time,
  'goals': Goals,
  'health': Health,
  'people': People,
  'work-study': WorkStudy,
  'home-things': HomeThings,
  'projects': Projects,
  'digital-life': DigitalLife,
  'memories': Memories,
  'insights': Insights,
};

function App() {
  return (
    <Router>
      <ResponsiveLayout>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/overview">
            <Route index element={<Overview />} />
            <Route path="weekly" element={<Weekly />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="pending" element={<Pending />} />
            <Route path="upcoming" element={<Upcoming />} />
            <Route path="suggestions" element={<Suggestions />} />
          </Route>

          <Route path="/money">
            <Route index element={<Money />} />
            <Route path="cashflow" element={<CashFlow />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="cards" element={<Cards />} />
            <Route path="budget" element={<Budget />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="debts" element={<Debts />} />
            <Route path="investments" element={<Investments />} />
            <Route path="patrimony" element={<Patrimony />} />
            <Route path="goals" element={<FinancialGoals />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          <Route path="/time">
            <Route index element={<Time />} />
            <Route path="calendar" element={<Agenda />} />
            <Route path="appointments" element={<Commitments />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="habits" element={<Habits />} />
            <Route path="routines" element={<Routines />} />
            <Route path="priorities" element={<Priorities />} />
            <Route path="history" element={<History />} />
            <Route path="planning" element={<WeeklyPlanning />} />
          </Route>

          {Object.values(MODULES).filter(m => m.id !== 'overview' && m.id !== 'money' && m.id !== 'time').map((module) => {
            const ModuleComponent = moduleComponents[module.id];

            return (
              <Route key={module.id} path={module.path}>
                <Route index element={<ModuleComponent />} />

                {module.id === 'goals' && (
                  <>
                    <Route path="life" element={<LifeGoals />} />
                    <Route path="yearly" element={<YearlyGoals />} />
                    <Route path="short-term" element={<ShortTermGoals />} />
                    <Route path="action-plans" element={<ActionPlans />} />
                    <Route path="progress" element={<ProgressIndicators />} />
                    <Route path="reviews" element={<PeriodicReviews />} />
                    <Route path="connections" element={<GoalConnections />} />
                  </>
                )}

                {module.submodules.map((submodule) => (
                  <Route
                    key={submodule.id}
                    path={submodule.path.replace(module.path + '/', '')}
                    element={
                      (module.id === 'goals' && submodule.id === 'life') ? (
                        <LifeGoals />
                      ) : (module.id === 'goals' && submodule.id === 'yearly') ? (
                        <YearlyGoals />
                      ) : (module.id === 'goals' && submodule.id === 'short-term') ? (
                        <ShortTermGoals />
                      ) : (module.id === 'goals' && submodule.id === 'action-plans') ? (
                        <ActionPlans />
                      ) : (module.id === 'goals' && submodule.id === 'progress') ? (
                        <ProgressIndicators />
                      ) : (module.id === 'goals' && submodule.id === 'reviews') ? (
                        <PeriodicReviews />
                      ) : (module.id === 'goals' && submodule.id === 'connections') ? (
                        <GoalConnections />
                      ) : (
                        <SubmodulePlaceholder
                          title={submodule.name}
                          description={submodule.description}
                          moduleName={module.name}
                        />
                      )
                    }
                  />
                ))}
              </Route>
            );
          })}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ResponsiveLayout>
    </Router>
  );
}

export default App;
