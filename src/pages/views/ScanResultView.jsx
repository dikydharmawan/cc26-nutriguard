import { ArrowLeft, AlertTriangle, Sparkles, Save, Camera, CheckCircle2, Battery } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import nutritionLabel from '../../assets/nutrition_label.png';
import './ScanResultView.css';

const ScanResultView = ({ onBack, onSaveComplete }) => {
  const { setHistory, updateNutrition } = useAppContext();

  const handleSave = () => {
    const timeString = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    // Add to history list
    const newItem = {
      id: Date.now(),
      name: 'Mi Instan Goreng Premium',
      date: `Hari ini, ${timeString}`,
      cal: '380 kcal',
      status: 'Tinggi Natrium',
      color: '#9b4b45'
    };

    setHistory(prev => [newItem, ...prev]);

    // Update global consumed nutrients
    updateNutrition({
      sodium: 850,
      sugar: 4,
      calorie: 380
    });

    if (onSaveComplete) {
      onSaveComplete();
    }
  };

  return (
    <div className="scan-result-view">
      {/* Header */}
      <div className="scan-result-header">
        <button className="back-btn" onClick={onBack} aria-label="Kembali">
          <ArrowLeft size={24} />
        </button>
        <h2 className="scan-result-title">NutriGuard</h2>
        <div className="status-indicator-container">
          <div className="status-indicator">
            <Battery size={18} className="status-icon-fill" />
          </div>
        </div>
      </div>

      <div className="scan-result-content">
        {/* Waspada Warning Card */}
        <div className="warning-card">
          <div className="warning-icon-wrapper">
            <AlertTriangle className="warning-icon" size={32} />
          </div>
          <h3 className="warning-title">Waspada</h3>
          <p className="warning-desc">
            Produk ini memiliki kandungan yang berisiko bagi profil kesehatan <strong>Hipertensi</strong> Anda.
          </p>
        </div>

        {/* Nutrient Metric Card 1: Natrium */}
        <div className="nutrient-card natrium-card">
          <div className="nutrient-header">
            <span className="nutrient-label-title">NATRIUM</span>
            <div className="nutrient-icon-wrapper">
              {/* Custom Salt Shaker SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 20h12" />
                <path d="M8 20L9 8h6l1 12" />
                <path d="M10 8V5c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v3" />
                <path d="M11 2h2" />
                <circle cx="10" cy="13" r="0.5" fill="currentColor" />
                <circle cx="12" cy="13" r="0.5" fill="currentColor" />
                <circle cx="14" cy="13" r="0.5" fill="currentColor" />
              </svg>
            </div>
          </div>
          <div className="nutrient-value-container">
            <span className="nutrient-value text-danger">850</span>
            <span className="nutrient-unit text-danger">mg</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar progress-danger" style={{ width: '85%' }}></div>
          </div>
          <span className="progress-info text-danger">85% dari batas harian Anda</span>
        </div>

        {/* Nutrient Metric Card 2: Gula */}
        <div className="nutrient-card sugar-card">
          <div className="nutrient-header">
            <span className="nutrient-label-title">GULA</span>
            <div className="nutrient-icon-wrapper">
              {/* Custom Sugar Cube SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="8" height="8" rx="1" />
                <rect x="13" y="11" width="8" height="8" rx="1" />
                <rect x="8" y="3" width="8" height="8" rx="1" />
              </svg>
            </div>
          </div>
          <div className="nutrient-value-container">
            <span className="nutrient-value text-safe">4</span>
            <span className="nutrient-unit text-safe">g</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar progress-safe" style={{ width: '15%' }}></div>
          </div>
          <span className="progress-info text-safe">Aman: 15% dari batas harian</span>
        </div>

        {/* Saran NutriGuard AI Card */}
        <div className="ai-suggestion-card">
          <div className="ai-icon-wrapper">
            <div className="ai-icon-bg">
              <Sparkles size={20} className="ai-spark-icon" />
            </div>
          </div>
          <div className="ai-suggestion-content">
            <h4 className="ai-title">Saran NutriGuard AI</h4>
            <p className="ai-desc">
              Produk ini sangat tinggi Natrium. Disarankan untuk membatasi konsumsi garam pada makanan lain hari ini guna menjaga tekanan darah tetap stabil.
            </p>
          </div>
        </div>

        {/* Scanned Image Preview Card */}
        <div className="label-preview-card">
          <div className="label-image-wrapper">
            <img src={nutritionLabel} alt="Scanned Food Label" className="label-image" />
            <div className="label-overlay-badge">
              <CheckCircle2 size={16} className="badge-icon" />
              <span>Label Terdeteksi Otomatis</span>
            </div>
          </div>
        </div>

        {/* Actions Button Group */}
        <div className="action-buttons">
          <button className="btn btn-save" onClick={handleSave}>
            <Save size={20} className="btn-icon" />
            <span>Simpan ke Riwayat</span>
          </button>
          
          <button className="btn btn-rescan" onClick={onBack}>
            <Camera size={20} className="btn-icon" />
            <span>Pindai Lagi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanResultView;
