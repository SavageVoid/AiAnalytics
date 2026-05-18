// client/src/App.jsx — Root app with routing and auth protection

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth }  from './context/AuthContext';
import Navbar          from './components/Navbar';
import LoginPage       from './pages/LoginPage';
import DashboardPage   from './pages/DashboardPage';
import EmployeesPage   from './pages/EmployeesPage';
import AddEmployeePage from './pages/AddEmployeePage';
import AIPage          from './pages/AIPage';
import './App.css';

// ─── Protected Route wrapper ───────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

// ─── App Layout ────────────────────────────────────────────────────────────────
const AppLayout = () => {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
          <Route path="/employees/add" element={<ProtectedRoute><AddEmployeePage /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><AIPage /></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </>
  );
};

// ─── Root Export ───────────────────────────────────────────────────────────────
const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
