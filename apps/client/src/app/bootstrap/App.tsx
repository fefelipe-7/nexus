import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/ui/components/Layout';
import { Dashboard } from '@/screens/domains/pages/Dashboard';
import { StateTracker } from '@/screens/domains/pages/StateTracker';
import { Actions } from '@/screens/domains/pages/Actions';
import { Events } from '@/screens/domains/pages/Events';
import { Goals } from '@/screens/domains/pages/Goals';
import { Routines } from '@/screens/domains/pages/Routines';
import { Knowledge } from '@/screens/domains/pages/Knowledge';
import { Reflections } from '@/screens/domains/pages/Reflections';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/state" element={<StateTracker />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/events" element={<Events />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/routines" element={<Routines />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/reflections" element={<Reflections />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
