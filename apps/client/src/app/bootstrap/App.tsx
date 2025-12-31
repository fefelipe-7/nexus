import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { StateTracker } from './pages/StateTracker';
import { Actions } from './pages/Actions';
import { Events } from './pages/Events';
import { Goals } from './pages/Goals';
import { Routines } from './pages/Routines';
import { Knowledge } from './pages/Knowledge';
import { Reflections } from './pages/Reflections';

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

export { App };
export default App;
