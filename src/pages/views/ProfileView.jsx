import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import './ProfileView.css';

const ProfileView = ({ onLogout }) => {
  return (
    <div className="profile-view">
      <div className="profile-header-card dashboard-card">
        <div className="profile-avatar-large">
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
        </div>
        <h2 className="profile-name">Diky Dharmawan</h2>
        <p className="profile-email">diky@example.com</p>
        <button className="edit-profile-btn">Edit Profil</button>
      </div>

      <div className="profile-section">
        <h3 className="section-title">Pengaturan Akun</h3>
        <div className="settings-group dashboard-card">
          <div className="setting-item">
            <div className="setting-icon"><User size={20} /></div>
            <span className="setting-label">Data Personal</span>
            <ChevronRight size={20} className="setting-arrow" />
          </div>
          <div className="setting-item">
            <div className="setting-icon"><Bell size={20} /></div>
            <span className="setting-label">Notifikasi</span>
            <ChevronRight size={20} className="setting-arrow" />
          </div>
          <div className="setting-item">
            <div className="setting-icon"><Shield size={20} /></div>
            <span className="setting-label">Privasi & Keamanan</span>
            <ChevronRight size={20} className="setting-arrow" />
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h3 className="section-title">Lainnya</h3>
        <div className="settings-group dashboard-card">
          <div className="setting-item">
            <div className="setting-icon"><Settings size={20} /></div>
            <span className="setting-label">Preferensi Aplikasi</span>
            <ChevronRight size={20} className="setting-arrow" />
          </div>
          <div className="setting-item">
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
