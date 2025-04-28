import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Promotions from './pages/Promotions';
import Bookings from './pages/Bookings';
import Analytics from './pages/Analytics';
import Forecasting from './pages/Forecasting';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="forecasting" element={<Forecasting />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;