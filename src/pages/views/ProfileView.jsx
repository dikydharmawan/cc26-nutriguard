import { useState } from 'react';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import EditProfile from './settings/EditProfile';
import PersonalData from './settings/PersonalData';
import Notifications from './settings/Notifications';
import PrivacySecurity from './settings/PrivacySecurity';
import AppPreferences from './settings/AppPreferences';
import HelpCenter from './settings/HelpCenter';
import './ProfileView.css';

const ProfileView = ({ onLogout }) => {
  const { userProfile } = useAppContext();
  const [currentView, setCurrentView] = useState('main');

  const renderSubView = () => {
    switch (currentView) {
      case 'edit-profile': return <EditProfile onBack={() => setCurrentView('main')} />;
      case 'personal-data': return <PersonalData onBack={() => setCurrentView('main')} />;
      case 'notifications': return <Notifications onBack={() => setCurrentView('main')} />;
      case 'privacy': return <PrivacySecurity onBack={() => setCurrentView('main')} />;
      case 'preferences': return <AppPreferences onBack={() => setCurrentView('main')} />;
      case 'help': return <HelpCenter onBack={() => setCurrentView('main')} />;
      default: return null;
    }
  };

  if (currentView !== 'main') {
    return renderSubView();
  }

  return (
    <div className="profile-view">
      <div className="profile-header-card dashboard-card">
        <div className="profile-avatar-large">
          <img src={userProfile.avatar} alt="Profile" />
        </div>
        <h2 className="profile-name">{userProfile.name}</h2>
        <p className="profile-email">{userProfile.email}</p>
        <button className="edit-profile-btn" onClick={() => setCurrentView('edit-profile')}>
          Edit Profil
        </button>
      </div>

      <div className="profile-section">
        <h3 className="section-title">Pengaturan Akun</h3>
        <div className="settings-group dashboard-card">
          <div className="setting-item" onClick={() => setCurrentView('personal-data')}>
            <div className="setting-icon"><User size={20} /></div>
            <span className="setting-label">Data Personal</span>
            <ChevronRight size={20} className="setting-arrow" />
          </div>
          <div className="setting-item" onClick={() => setCurrentView('notifications')}>
            <div className="setting-icon"><Bell size={20} /></div>
            <span className="setting-label">Notifikasi</span>
            <ChevronRight size={20} className="setting-arrow" />
          </div>
          <div className="setting-item" onClick={() => setCurrentView('privacy')}>
            <div className="setting-icon"><Shield size={20} /></div>
            <span className="setting-label">Privasi & Keamanan</span>
            <ChevronRight size={20} className="setting-arrow" />
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h3 className="section-title">Lainnya</h3>
        <div className="settings-group dashboard-card">
          <div className="setting-item" onClick={() => setCurrentView('preferences')}>
            <div className="setting-icon"><Settings size={20} /></div>
            <span className="setting-label">Preferensi Aplikasi</span>
            <ChevronRight size={20} className="setting-arrow" />
          </div>
          <div className="setting-item" onClick={() => setCurrentView('help')}>
            <div className="setting-icon"><HelpCircle size={20} /></div>
            <span className="setting-label">Pusat Bantuan</span>
            <ChevronRight size={20} className="setting-arrow" />
          </div>
        </div>
      </div>

      <button className="logout-btn" onClick={onLogout}>
        <LogOut size={20} />
        <span>Keluar</span>
      </button>
    </div>
  );
};

export default ProfileView;
