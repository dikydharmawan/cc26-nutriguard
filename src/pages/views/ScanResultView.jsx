import { ArrowLeft, AlertTriangle, Sparkles, Save, Camera, CheckCircle2, Battery } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import nutritionLabel from '../../assets/nutrition_label.png';
import './ScanResultView.css';

const defaultScanData = {
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
};

const ScanResultView = ({ onBack, onSaveComplete, scanData, scannedImage }) => {
  const { setHistory, updateNutrition } = useAppContext();
  const currentData = scanData || defaultScanData;

  const handleSave = () => {
    const timeString = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    // Add to history list
    const newItem = {
      id: Date.now(),
      name: currentData.productName,
      date: `Hari ini, ${timeString}`,
      cal: currentData.saveValues.calorie + ' kcal',
      status: currentData.resultStatus,
      color: currentData.statusColor
    };

    setHistory(prev => [newItem, ...prev]);

    // Update global consumed nutrients
    updateNutrition({
      sodium: currentData.saveValues.sodium,
      sugar: currentData.saveValues.sugar,
      calorie: currentData.saveValues.calorie
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
        {/* Unified Feedback Table Card */}
        <div className="feedback-table-card">
          <div className="feedback-product-info">
            <span className="product-info-label">Nama Produk:</span>
            <span className="product-info-value">{currentData.productName}</span>
          </div>

          <div className={`feedback-status-header ${currentData.statusClass || 'status-danger-header'}`}>
            <span className="feedback-status-icon">{currentData.statusIcon}</span>
            <span className="feedback-status-text">
              HASIL: <span className="status-highlight">{currentData.resultStatus}</span> <span className="status-conf">(conf: {currentData.confidence})</span>
            </span>
          </div>

          <div className="feedback-section">
            <div className="feedback-section-title">Probabilitas :</div>
            <div className="probability-container">
              <div className="probability-row">
                <span className="prob-label">Aman</span>
                <span className="prob-colon">:</span>
                <span className="prob-val-text">{currentData.probabilities.aman}</span>
                <div className="prob-progress-bg">
                  <div className="prob-progress-bar bar-green" style={{ width: currentData.probabilities.amanVal + '%' }}></div>
                </div>
              </div>
              
              <div className="probability-row">
                <span className="prob-label">Waspada</span>
                <span className="prob-colon">:</span>
                <span className="prob-val-text">{currentData.probabilities.waspada}</span>
                <div className="prob-progress-bg">
                  <div className="prob-progress-bar bar-yellow" style={{ width: currentData.probabilities.waspadaVal + '%' }}></div>
                </div>
              </div>

              <div className="probability-row">
                <span className="prob-label">Batasi</span>
                <span className="prob-colon">:</span>
                <span className="prob-val-text">{currentData.probabilities.batasi}</span>
                <div className="prob-progress-bg">
                  <div className="prob-progress-bar bar-red" style={{ width: currentData.probabilities.batasiVal + '%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="feedback-section">
            <div className="feedback-section-title">Nutrisi terdeteksi:</div>
            <div className="nutrients-list">
              {currentData.nutrients.map((nutr, index) => (
                <div className="nutrient-row-item" key={index}>
                  <span className="nutr-key">{nutr.key}</span>
                  <span className="nutr-colon">:</span>
                  <span className={`nutr-val ${nutr.isMuted ? 'text-muted' : ''} ${nutr.isItalic ? 'italic' : ''}`}>
                    {nutr.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
              {currentData.aiSuggestion}
            </p>
          </div>
        </div>

        {/* Scanned Image Preview Card */}
        <div className="label-preview-card">
          <div className="label-image-wrapper">
            <img src={scannedImage || nutritionLabel} alt="Scanned Food Label" className="label-image" />
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
