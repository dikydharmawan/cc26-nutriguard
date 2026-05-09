import { Camera, Image as ImageIcon, Zap } from 'lucide-react';
import './ScannerView.css';

const ScannerView = () => {
  return (
    <div className="scanner-view">
      <div className="scanner-header-text">
        <h2 className="scanner-title">Pindai Label Gizi</h2>
        <p className="text-muted">Arahkan kamera ke label informasi nilai gizi pada kemasan makanan.</p>
      </div>

      <div className="camera-placeholder">
        <div className="scan-frame">
          <div className="corner top-left"></div>
          <div className="corner top-right"></div>
          <div className="corner bottom-left"></div>
          <div className="corner bottom-right"></div>
          <div className="scan-line"></div>
        </div>
        <div className="camera-overlay-text">
          <Camera size={48} opacity={0.5} color="#fff" />
          <span>Kamera Aktif</span>
        </div>
      </div>

      <div className="scanner-controls">
        <button className="control-btn secondary-btn">
          <ImageIcon size={24} />
          <span>Galeri</span>
        </button>
        <button className="control-btn primary-btn shutter-btn">
          <div className="shutter-inner"></div>
        </button>
        <button className="control-btn secondary-btn">
          <Zap size={24} />
          <span>Flash</span>
        </button>
      </div>
    </div>
  );
};

export default ScannerView;
