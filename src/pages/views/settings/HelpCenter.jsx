import { ArrowLeft, MessageCircle, Mail, Globe } from 'lucide-react';
import './SettingsLayout.css';

const HelpCenter = ({ onBack }) => {
  return (
    <div className="settings-view-container">
      <div className="settings-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="settings-title">Pusat Bantuan</h2>
      </div>
      
      <div className="settings-content">
        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px 20px', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, backgroundColor: '#e8f0eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#264a2f' }}>
            <MessageCircle size={32} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: '#1a1c1a' }}>Butuh Bantuan?</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>Tim dukungan kami siap membantu Anda 24/7. Jangan ragu untuk menghubungi kami.</p>
          </div>
          <button className="settings-save-btn" style={{ width: '100%', marginTop: '8px' }}>Mulai Chat</button>
        </div>

        <h3 className="settings-label" style={{ marginTop: '12px', marginBottom: '4px' }}>FAQ Populer</h3>
        
        <div className="dashboard-card" style={{ padding: '0' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
            <h4 style={{ margin: '0 0 4px 0', color: '#1a1c1a', fontSize: '0.9375rem' }}>Bagaimana cara memindai label?</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.8125rem' }}>Buka tab Scanner, arahkan kamera ke bagian Informasi Nilai Gizi, lalu tekan tombol shutter.</p>
          </div>
          <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
            <h4 style={{ margin: '0 0 4px 0', color: '#1a1c1a', fontSize: '0.9375rem' }}>Bagaimana batas harian dihitung?</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.8125rem' }}>Batas harian dihitung berdasarkan umur, berat badan, tinggi badan, dan jenis kelamin Anda.</p>
          </div>
          <div style={{ padding: '16px' }}>
            <h4 style={{ margin: '0 0 4px 0', color: '#1a1c1a', fontSize: '0.9375rem' }}>Apakah data saya aman?</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.8125rem' }}>Ya, kami menggunakan enkripsi 256-bit standar industri untuk melindungi data personal Anda.</p>
          </div>
        </div>

        <h3 className="settings-label" style={{ marginTop: '12px', marginBottom: '4px' }}>Kontak Lainnya</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="dashboard-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px' }}>
            <Mail size={24} color="#264a2f" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Email</span>
          </div>
          <div className="dashboard-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px' }}>
            <Globe size={24} color="#264a2f" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Website</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
