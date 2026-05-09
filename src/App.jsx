import { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [currentView, setCurrentView] = useState('login');

  return (
    <>
      {currentView === 'register' && <Register onSwitchToLogin={() => setCurrentView('login')} />}
      {currentView === 'login' && <Login onSwitchToRegister={() => setCurrentView('register')} onLoginSuccess={() => setCurrentView('dashboard')} />}
      {currentView === 'dashboard' && <Dashboard />}
    </>
  );
}

export default App;
