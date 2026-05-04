import { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  const [currentView, setCurrentView] = useState('register');

  return (
    <>
      {currentView === 'register' ? (
        <Register onSwitchToLogin={() => setCurrentView('login')} />
      ) : (
        <Login onSwitchToRegister={() => setCurrentView('register')} />
      )}
    </>
  );
}

export default App;
