import { ArrowLeft, Sparkles, Save, Camera, CheckCircle2, Battery, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import nutritionLabel from '../../assets/nutrition_label.png';
import './ScanResultView.css';

const defaultScanData = {
  isValid: false
};

const ScanResultView = ({ onBack, onSaveComplete, scanData, scannedImage }) => {
  const { setHistory, updateNutrition } = useAppContext();
  const baseData = scanData || defaultScanData;

  const handleSave = () => {
    const timeString = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    const newItem = {
      id: Date.now(),
      name: baseData.productName || 'Produk Tanpa Nama',
      date: `Hari ini, ${timeString}`,
      cal: `${baseData.saveValues?.calorie || 0} kcal`,
      status: baseData.resultStatus,
      color: baseData.statusColor
    };

    setHistory(prev => [newItem, ...prev]);

    updateNutrition({
      sodium: baseData.saveValues?.sodium || 0,
      sugar: baseData.saveValues?.sugar || 0,
      calorie: baseData.saveValues?.calorie || 0
    });

    if (onSaveComplete) {
      onSaveComplete();
    }
  };

  if (baseData.isValid === false) {
    return (
      <div className="scan-result-view">
        <div className="scan-result-header">
          <button className="back-btn" onClick={onBack} aria-label="Kembali">
            <ArrowLeft size={24} />
          </button>
          <h2 className="scan-result-title">NutriGuard</h2>
          <div className="status-indicator-container">
            <div className="status-indicator" style={{ color: '#ef4444' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
        </div>

        <div className="scan-result-content">
          <div className="feedback-table-card" style={{ borderLeft: '4px solid #ef4444' }}>
            <div className="feedback-status-header status-danger-header" style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#991b1b' }}>
              <span className="feedback-status-icon">⚠️</span>
              <span className="feedback-status-text" style={{ color: '#991b1b', fontWeight: 'bold' }}>
                LABEL TIDAK VALID
              </span>
            </div>
            <div style={{ padding: '16px', fontSize: '0.9rem', color: '#475569', lineHeight: '1.6' }}>
              Kami tidak dapat mendeteksi informasi gizi yang valid dari gambar ini. Pastikan gambar label informasi nilai gizi terlihat jelas, tidak buram, dan sejajar di dalam bingkai.
            </div>
          </div>

          <div className="label-preview-card">
            <div className="label-image-wrapper">
              <img src={scannedImage || nutritionLabel} alt="Scanned Food Label" className="label-image" />
              <div className="label-overlay-badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.9)' }}>
                <AlertTriangle size={16} className="badge-icon" style={{ color: '#fff' }} />
                <span>Gagal Mendeteksi Label</span>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn btn-save" onClick={onBack} style={{ backgroundColor: '#64748b' }}>
              <Camera size={20} className="btn-icon" />
              <span>Pindai Ulang</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scan-result-view">
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
        <div className="feedback-table-card">
          <div className="feedback-product-info">
            <span className="product-info-label">Nama Produk:</span>
            <span className="product-info-value">{baseData.productName || 'Produk Tanpa Nama'}</span>
          </div>

          <div className={`feedback-status-header ${baseData.statusClass}`}>
            <span className="feedback-status-icon">{baseData.statusIcon}</span>
            <span className="feedback-status-text">
              HASIL: <span className="status-highlight">{baseData.resultStatus}</span> <span className="status-conf">(conf: {baseData.confidence})</span>
            </span>
          </div>

          <div className="feedback-section">
            <div className="feedback-section-title">Probabilitas :</div>
            <div className="probability-container">
              <div className="probability-row">
                <span className="prob-label">Aman</span>
                <span className="prob-colon">:</span>
                <span className="prob-val-text">{baseData.probabilities.aman}</span>
                <div className="prob-progress-bg">
                  <div className="prob-progress-bar bar-green" style={{ width: baseData.probabilities.amanVal + '%' }}></div>
                </div>
              </div>
              
              <div className="probability-row">
                <span className="prob-label">Waspada</span>
                <span className="prob-colon">:</span>
                <span className="prob-val-text">{baseData.probabilities.waspada}</span>
                <div className="prob-progress-bg">
                  <div className="prob-progress-bar bar-yellow" style={{ width: baseData.probabilities.waspadaVal + '%' }}></div>
                </div>
              </div>

              <div className="probability-row">
                <span className="prob-label">Batasi</span>
                <span className="prob-colon">:</span>
                <span className="prob-val-text">{baseData.probabilities.batasi}</span>
                <div className="prob-progress-bg">
                  <div className="prob-progress-bar bar-red" style={{ width: baseData.probabilities.batasiVal + '%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="feedback-section">
            <div className="feedback-section-title">Nutrisi terdeteksi:</div>
            <div className="nutrients-list">
              {baseData.nutrients.map((nutr, index) => (
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

        <div className="ai-suggestion-card">
          <div className="ai-icon-wrapper">
            <div className="ai-icon-bg">
              <Sparkles size={20} className="ai-spark-icon" />
            </div>
          </div>
          <div className="ai-suggestion-content">
            <h4 className="ai-title">Saran NutriGuard AI</h4>
            <p className="ai-desc">
              {baseData.aiSuggestion}
            </p>
          </div>
        </div>

        <div className="label-preview-card">
          <div className="label-image-wrapper">
            <img src={scannedImage || nutritionLabel} alt="Scanned Food Label" className="label-image" />
            <div className="label-overlay-badge">
              <CheckCircle2 size={16} className="badge-icon" />
              <span>Label Terdeteksi Otomatis</span>
            </div>
          </div>
        </div>

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
