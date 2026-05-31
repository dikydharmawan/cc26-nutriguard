import { Camera } from 'lucide-react';
import './ScannerBanner.css';

const ScannerBanner = ({ onScannerClick }) => {
  return (
    <div className="scanner-banner-card">
      <div className="banner-content">
        <div className="banner-badge">Tips Nutri</div>
        <h3 className="banner-title">Pindai Label Makanan<br/>Anda</h3>
        <p className="banner-description">
          Dapatkan analisis instan dengan presisi tinggi untuk kandungan gula dan natrium hanya dengan memotret label informasi nilai gizi.
        </p>
        <button className="banner-btn" onClick={onScannerClick}>
          <Camera size={18} />
          <span>Buka Pemindai</span>
        </button>
      </div>
      <div className="banner-image-container">
        <img 
          src="https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600&auto=format&fit=crop" 
          alt="Nutrition Facts Label" 
          className="banner-image"
        />
        <div className="image-overlay"></div>
      </div>
    </div>
  );
};

export default ScannerBanner;
