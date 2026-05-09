import { ArrowLeft } from 'lucide-react';
import './SettingsLayout.css';

const PrivacySecurity = ({ onBack }) => {
  return (
    <div className="settings-view-container">
      <div className="settings-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="settings-title">Privasi & Keamanan</h2>
      </div>
      
      <div className="settings-content">
        <h3 className="settings-label" style={{ marginBottom: '-10px' }}>Ubah Kata Sandi</h3>
        
        <div className="settings-form-group">
          <input type="password" placeholder="Kata Sandi Saat Ini" className="settings-input" />
        </div>
        
        <div className="settings-form-group">
          <input type="password" placeholder="Kata Sandi Baru" className="settings-input" />
        </div>
        
        <div className="settings-form-group">
          <input type="password" placeholder="Konfirmasi Kata Sandi Baru" className="settings-input" />
        </div>

        <button className="settings-save-btn" onClick={() => alert('Kata sandi berhasil diubah!')}>Simpan Kata Sandi</button>

        <div style={{ margin: '20px 0' }}></div>

        <div className="settings-toggle-item">
          <div className="settings-form-group">
            <span className="settings-label" style={{ color: '#1a1c1a' }}>Login Biometrik</span>
            <span style={{ fontSize: '0.75rem', color: '#64746b' }}>Gunakan sidik jari atau Face ID</span>
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

export default PrivacySecurity;
