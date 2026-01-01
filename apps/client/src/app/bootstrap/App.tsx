import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/ui/components/components/Layout';
import { MODULES } from '@/config/modules.config';
import { SubmodulePlaceholder } from '@/ui/components/SubmodulePlaceholder';

import { Overview, Daily, Weekly, Alerts, Pending, Upcoming, Indicators, Suggestions } from '@/modules/overview';
import { Money } from '@/modules/money';
import { Time } from '@/modules/time';
import { Goals } from '@/modules/goals';
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
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          
          <Route path="/overview">
            <Route index element={<Overview />} />
            <Route path="daily" element={<Daily />} />
            <Route path="weekly" element={<Weekly />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="pending" element={<Pending />} />
            <Route path="upcoming" element={<Upcoming />} />
            <Route path="indicators" element={<Indicators />} />
            <Route path="suggestions" element={<Suggestions />} />
          </Route>

          {Object.values(MODULES).filter(m => m.id !== 'overview').map((module) => {
            const ModuleComponent = moduleComponents[module.id];
            
            return (
              <Route key={module.id} path={module.path}>
                <Route index element={<ModuleComponent />} />
                
                {module.submodules.map((submodule) => (
                  <Route
                    key={submodule.id}
                    path={submodule.path.replace(module.path + '/', '')}
                    element={
                      <SubmodulePlaceholder
                        title={submodule.name}
                        description={submodule.description}
                        moduleName={module.name}
                      />
                    }
                  />
                ))}
              </Route>
            );
          })}
          
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
