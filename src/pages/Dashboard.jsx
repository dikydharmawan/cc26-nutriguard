import { useState } from 'react';
import Header from '../components/dashboard/Header';
import BottomNav from '../components/dashboard/BottomNav';
import HomeView from './views/HomeView';
import ScannerView from './views/ScannerView';
import HistoryView from './views/HistoryView';
import ProfileView from './views/ProfileView';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView onNavigate={setActiveTab} />;
      case 'scanner':
        return <ScannerView onNavigate={setActiveTab} />;
      case 'history':
        return <HistoryView />;
      case 'profile':
        return <ProfileView onLogout={onLogout} />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Hide Header on Profile view to look cleaner, or keep it. Let's keep it but maybe hide for scanner? Let's keep it for consistency for now. Actually, let's only show header on home and history maybe. For simplicity, let's keep header always visible except maybe on scanner/profile. 
      Wait, Profile usually doesn't have the main app header. I'll conditionally render it. */}
      {activeTab !== 'profile' && activeTab !== 'scanner' && <Header />}
      
      <main className="dashboard-main" style={{ paddingTop: (activeTab === 'profile' || activeTab === 'scanner') ? '24px' : '0' }}>
        {renderView()}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Dashboard;
