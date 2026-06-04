import { useState, useEffect } from 'react';
import { useAppContext } from './context/AppContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const { isAuthenticated, isAuthLoading, logout } = useAppContext();
  const [currentView, setCurrentView] = useState('login');

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
    } else if (currentView === 'dashboard') {
      setCurrentView('login');
    }
  }, [isAuthenticated]);

  if (isAuthLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Memuat...</div>;
  }

  return (
    <>
      {currentView === 'register' && !isAuthenticated && <Register onSwitchToLogin={() => setCurrentView('login')} />}
      {currentView === 'login' && !isAuthenticated && <Login onSwitchToRegister={() => setCurrentView('register')} />}
      {currentView === 'dashboard' && isAuthenticated && <Dashboard onLogout={logout} />}
    </>
  );
}

export default App;
