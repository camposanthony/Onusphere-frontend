import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout.js';
import Dashboard from './pages/Dashboard.js';
import MyTools from './pages/MyTools.js';
import AllTools from './pages/AllTools.js';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="my-tools" element={<MyTools />} />
        <Route path="all-tools" element={<AllTools />} />
      </Route>
    </Routes>
  );
}

export default App;
