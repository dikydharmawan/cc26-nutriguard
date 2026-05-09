import { CheckCircle2, AlertTriangle } from 'lucide-react';
import './NutritionQuota.css';

const NutritionQuota = () => {
  return (
    <div className="dashboard-card nutrition-quota-card">
      <div className="quota-header">
        <div className="quota-title-group">
          <h3 className="quota-title">Sisa Kuota Nutrisi<br/>Harian</h3>
          <p className="quota-subtitle text-muted">Pantau asupan harian Anda</p>
        </div>
        <div className="quota-badge">Hari Ini</div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span className="nutrient-label">Gula</span>
          <span className="nutrient-value">
            <strong style={{color: '#264a2f'}}>12g</strong> / 50g
          </span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill safe-level" style={{ width: '24%' }}></div>
        </div>
        <div className="status-text safe-text">
          <CheckCircle2 size={14} />
          <span>Kadar aman terjaga</span>
        </div>
      </div>

      <div className="progress-section mt-4">
        <div className="progress-header">
          <span className="nutrient-label">Garam / Natrium</span>
          <span className="nutrient-value warning-value">
            <strong>1.850mg</strong> / 2.000mg
          </span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill warning-level" style={{ width: '92.5%' }}></div>
        </div>
        <div className="status-text warning-text">
          <AlertTriangle size={14} />
          <span>Mendekati batas harian</span>
        </div>
      </div>
    </div>
  );
};

export default NutritionQuota;
