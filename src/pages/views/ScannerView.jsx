import { useState } from 'react';
import { Camera, Image as ImageIcon, Zap } from 'lucide-react';
import ScanResultView from './ScanResultView';
import './ScannerView.css';

const ScannerView = ({ onNavigate }) => {
  const [scanState, setScanState] = useState('idle'); // 'idle', 'scanning', 'result'

  const handleStartScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('result');
    }, 1500);
  };

  if (scanState === 'scanning') {
    return (
      <div className="scanning-container">
        <div className="spinner"></div>
        <p className="scanning-text">Mendeteksi Informasi Nilai Gizi...</p>
      </div>
    );
  }

  if (scanState === 'result') {
    return (
      <ScanResultView
        onBack={() => setScanState('idle')}
        onSaveComplete={() => onNavigate && onNavigate('history')}
      />
    );
  }

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
        <button className="control-btn secondary-btn" onClick={handleStartScan}>
          <ImageIcon size={24} />
          <span>Galeri</span>
        </button>
        <button className="control-btn primary-btn shutter-btn" onClick={handleStartScan} aria-label="Ambil Foto">
          <div className="shutter-inner"></div>
        </button>
        <button className="control-btn secondary-btn" onClick={handleStartScan}>
          <Zap size={24} />
          <span>Flash</span>
        </button>
      </div>
    </div>
  );
};

export default ScannerView;

