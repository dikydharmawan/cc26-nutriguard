import { ArrowLeft } from 'lucide-react';
import './SettingsLayout.css';

const Notifications = ({ onBack }) => {
  return (
    <div className="settings-view-container">
      <div className="settings-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="settings-title">Notifikasi</h2>
      </div>
      
      <div className="settings-content">
        <div className="settings-toggle-item">
          <div className="settings-form-group">
            <span className="settings-label" style={{ color: '#1a1c1a' }}>Push Notifikasi</span>
            <span style={{ fontSize: '0.75rem', color: '#64746b' }}>Terima pengingat harian di perangkat Anda</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>

        <div className="settings-toggle-item">
          <div className="settings-form-group">
            <span className="settings-label" style={{ color: '#1a1c1a' }}>Email Laporan</span>
            <span style={{ fontSize: '0.75rem', color: '#64746b' }}>Terima laporan nutrisi mingguan</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>

        <div className="settings-toggle-item">
          <div className="settings-form-group">
            <span className="settings-label" style={{ color: '#1a1c1a' }}>Promo & Penawaran</span>
            <span style={{ fontSize: '0.75rem', color: '#64746b' }}>Info terbaru dan promo menarik</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
