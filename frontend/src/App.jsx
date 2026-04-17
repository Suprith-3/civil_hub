/* src/App.jsx */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AnimatedLoginPage from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import EngineerDashboard from './pages/EngineerDashboard';
import ShopkeeperDashboard from './pages/ShopkeeperDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import Shop from './pages/Shop';
import Schemes from './pages/Schemes';
import AdminDashboard from './pages/AdminDashboard';
// Import other dashboards as we build them

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<AnimatedLoginPage />} />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/admin-dashboard" 
          element={
            localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === 'admin' 
              ? <AdminDashboard /> 
              : <Navigate to="/login" />
          } 
        />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/engineer-dashboard" element={<EngineerDashboard />} />
        <Route path="/shopkeeper-dashboard" element={<ShopkeeperDashboard />} />
        <Route path="/worker-dashboard" element={<WorkerDashboard />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/schemes" element={<Schemes />} />

        {/* Redirect empty path to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
