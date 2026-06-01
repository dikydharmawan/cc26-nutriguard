import { useState } from 'react';
import { Camera, Image as ImageIcon, Zap } from 'lucide-react';
import ScanResultView from './ScanResultView';
import './ScannerView.css';

const PRESETS = {
  batasi: {
    productName: 'Mi Instan Goreng Premium',
    resultStatus: 'BATASI',
    confidence: '87.1%',
    statusIcon: '🚫',
    statusClass: 'status-danger-header',
    probabilities: {
      aman: '8.51%',
      waspada: '4.43%',
      batasi: '87.06%',
      amanVal: 8.51,
      waspadaVal: 4.43,
      batasiVal: 87.06
    },
    nutrients: [
      { key: 'energi_total_kkal', val: '380.0 kkal' },
      { key: 'lemak_total_g', val: '15.0 g' },
      { key: 'lemak_jenuh_g', val: '8.0 g' },
      { key: 'lemak_trans_g', val: '0.0 g' },
      { key: 'kolesterol_mg', val: '0.0 mg' },
      { key: 'karbohidrat_g', val: '52.0 g' },
      { key: 'serat_g', val: '2.0 g' },
      { key: 'gula_g', val: '8.0 g' },
      { key: 'protein_g', val: '8.0 g' },
      { key: 'natrium_mg', val: '850.0 mg' }
    ],
    saveValues: {
      sodium: 850,
      sugar: 8,
      calorie: 380
    },
    statusText: 'Tinggi Natrium',
    statusColor: '#b91c1c',
    aiSuggestion: 'Produk ini sangat tinggi Natrium. Disarankan untuk membatasi konsumsi garam pada makanan lain hari ini guna menjaga tekanan darah tetap stabil.'
  },
  waspada: {
    productName: 'Teh Tarik Manis',
    resultStatus: 'WASPADA',
    confidence: '78.5%',
    statusIcon: '⚠️',
    statusClass: 'status-warning-header',
    probabilities: {
      aman: '12.30%',
      waspada: '78.50%',
      batasi: '9.20%',
      amanVal: 12.3,
      waspadaVal: 78.5,
      batasiVal: 9.2
    },
    nutrients: [
      { key: 'energi_total_kkal', val: '140.0 kkal' },
      { key: 'lemak_total_g', val: '3.0 g' },
      { key: 'lemak_jenuh_g', val: '2.0 g' },
      { key: 'lemak_trans_g', val: '0.0 g' },
      { key: 'kolesterol_mg', val: '0.0 mg' },
      { key: 'karbohidrat_g', val: '26.0 g' },
      { key: 'serat_g', val: 'tidak terdeteksi', isMuted: true, isItalic: true },
      { key: 'gula_g', val: '22.0 g' },
      { key: 'protein_g', val: '2.0 g' },
      { key: 'natrium_mg', val: '65.0 mg' }
    ],
    saveValues: {
      sodium: 65,
      sugar: 22,
      calorie: 140
    },
    statusText: 'Cukup Tinggi Gula',
    statusColor: '#fbbf24',
    aiSuggestion: 'Produk ini mengandung gula yang cukup tinggi (22g). Batasi konsumsi camilan manis lainnya hari ini untuk menjaga stabilitas gula darah Anda.'
  },
  aman: {
    productName: 'Yogurt Plain Organik',
    resultStatus: 'AMAN',
    confidence: '94.2%',
    statusIcon: '✅',
    statusClass: 'status-safe-header',
    probabilities: {
      aman: '94.20%',
      waspada: '4.10%',
      batasi: '1.70%',
      amanVal: 94.2,
      waspadaVal: 4.1,
      batasiVal: 1.7
    },
    nutrients: [
      { key: 'energi_total_kkal', val: '80.0 kkal' },
      { key: 'lemak_total_g', val: '1.5 g' },
      { key: 'lemak_jenuh_g', val: '1.0 g' },
      { key: 'lemak_trans_g', val: '0.0 g' },
      { key: 'kolesterol_mg', val: '5.0 mg' },
      { key: 'karbohidrat_g', val: '6.0 g' },
      { key: 'serat_g', val: 'tidak terdeteksi', isMuted: true, isItalic: true },
      { key: 'gula_g', val: '4.0 g' },
      { key: 'protein_g', val: '9.0 g' },
      { key: 'natrium_mg', val: '50.0 mg' }
    ],
    saveValues: {
      sodium: 50,
      sugar: 4,
      calorie: 80
    },
    statusText: 'Sangat Sehat',
    statusColor: '#10b981',
    aiSuggestion: 'Pilihan yang sangat baik! Produk ini rendah gula dan natrium serta kaya protein. Sangat aman dikonsumsi untuk profil kesehatan Anda.'
  }
};

const ScannerView = ({ onNavigate }) => {
  const [scanState, setScanState] = useState('idle'); // 'idle', 'scanning', 'result'
  const [scannedImage, setScannedImage] = useState(null);
  const [scanData, setScanData] = useState(PRESETS.batasi);

  const triggerFileSelect = () => {
    document.getElementById('file-scanner-input').click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setScannedImage(imageUrl);

    // Determine profile by filename keywords
    const filename = file.name.toLowerCase();
    let profile = PRESETS.batasi;
    
    if (filename.includes('yogurt') || filename.includes('susu') || filename.includes('milk') || filename.includes('sehat') || filename.includes('healthy') || filename.includes('aman') || filename.includes('green')) {
      profile = PRESETS.aman;
    } else if (filename.includes('teh') || filename.includes('tarik') || filename.includes('manis') || filename.includes('soda') || filename.includes('cola') || filename.includes('jus') || filename.includes('juice') || filename.includes('waspada') || filename.includes('yellow') || filename.includes('gula')) {
      profile = PRESETS.waspada;
    }

    setScanData(profile);
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
        onBack={() => {
          setScanState('idle');
          setScannedImage(null);
        }}
        onSaveComplete={() => onNavigate && onNavigate('history')}
        scanData={scanData}
        scannedImage={scannedImage}
      />
    );
  }

  return (
    <div className="scanner-view">
      <input
        type="file"
        id="file-scanner-input"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div className="scanner-header-text">
        <h2 className="scanner-title">Pindai Label Gizi</h2>
        <p className="text-muted">Arahkan kamera ke label informasi nilai gizi pada kemasan makanan.</p>
      </div>

      <div className="camera-placeholder" onClick={triggerFileSelect} style={{ cursor: 'pointer' }}>
        <div className="scan-frame">
          <div className="corner top-left"></div>
          <div className="corner top-right"></div>
          <div className="corner bottom-left"></div>
          <div className="corner bottom-right"></div>
          <div className="scan-line"></div>
        </div>
        <div className="camera-overlay-text">
          <Camera size={48} opacity={0.5} color="#fff" />
          <span>Ketuk untuk Unggah / Ambil Foto</span>
        </div>
      </div>

      <div className="scanner-controls">
        <button className="control-btn secondary-btn" onClick={triggerFileSelect}>
          <ImageIcon size={24} />
          <span>Galeri</span>
        </button>
        <button className="control-btn primary-btn shutter-btn" onClick={triggerFileSelect} aria-label="Ambil Foto">
          <div className="shutter-inner"></div>
        </button>
        <button className="control-btn secondary-btn" onClick={triggerFileSelect}>
          <Zap size={24} />
          <span>Flash</span>
        </button>
      </div>
    </div>
  );
};

export default ScannerView;

