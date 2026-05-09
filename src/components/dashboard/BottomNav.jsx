import { LayoutGrid, Camera, History, User } from 'lucide-react';
import './BottomNav.css';

const BottomNav = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bottom-nav">
      <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => onTabChange('home')}>
        <LayoutGrid size={24} />
        <span>Dashboard</span>
      </div>
      <div className={`nav-item ${activeTab === 'scanner' ? 'active' : ''}`} onClick={() => onTabChange('scanner')}>
        <Camera size={24} />
        <span>Scanner</span>
      </div>
      <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => onTabChange('history')}>
        <History size={24} />
        <span>Riwayat</span>
      </div>
      <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => onTabChange('profile')}>
        <User size={24} />
        <span>Profil</span>
      </div>
    </nav>
  );
};

export default BottomNav;
