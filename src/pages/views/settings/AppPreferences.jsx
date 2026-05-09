import { ArrowLeft } from 'lucide-react';
import './SettingsLayout.css';

const AppPreferences = ({ onBack }) => {
  return (
    <div className="settings-view-container">
      <div className="settings-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="settings-title">Preferensi Aplikasi</h2>
      </div>
      
      <div className="settings-content">
        <div className="settings-form-group">
          <label className="settings-label">Bahasa</label>
          <select className="settings-input">
            <option value="id">Bahasa Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="settings-form-group">
          <label className="settings-label">Tema Tampilan</label>
          <select className="settings-input" defaultValue="light">
            <option value="light">Terang (Light Mode)</option>
            <option value="dark">Gelap (Dark Mode)</option>
            <option value="system">Mengikuti Sistem</option>
          </select>
        </div>

        <div className="settings-form-group" style={{ marginTop: '16px' }}>
          <label className="settings-label">Satuan Berat</label>
          <select className="settings-input">
            <option value="metric">Kilogram / Gram (Metric)</option>
            <option value="imperial">Pounds / Ounces (Imperial)</option>
          </select>
        </div>
        
        <div className="settings-form-group">
          <label className="settings-label">Satuan Volume</label>
          <select className="settings-input">
            <option value="metric">Liter / Mililiter</option>
            <option value="imperial">Fluid Ounces / Gallons</option>
          </select>
        </div>

        <button className="settings-save-btn" onClick={onBack}>Simpan Pengaturan</button>
      </div>
    </div>
  );
};

export default AppPreferences;
