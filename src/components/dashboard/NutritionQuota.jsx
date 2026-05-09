import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import './NutritionQuota.css';

const NutritionQuota = () => {
  const { nutritionData } = useAppContext();
  const { dailyGoal, consumed } = nutritionData;

  const sugarPercent = Math.min((consumed.sugar / dailyGoal.sugar) * 100, 100);
  const sodiumPercent = Math.min((consumed.sodium / dailyGoal.sodium) * 100, 100);

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
            <strong style={{color: sugarPercent > 90 ? '#9b4b45' : '#264a2f'}}>{consumed.sugar}g</strong> / {dailyGoal.sugar}g
          </span>
        </div>
        <div className="progress-bar-bg">
          <div className={`progress-bar-fill ${sugarPercent > 90 ? 'warning-level' : 'safe-level'}`} style={{ width: `${sugarPercent}%` }}></div>
        </div>
        <div className={`status-text ${sugarPercent > 90 ? 'warning-text' : 'safe-text'}`}>
          {sugarPercent > 90 ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
          <span>{sugarPercent > 90 ? 'Mendekati batas harian' : 'Kadar aman terjaga'}</span>
        </div>
      </div>

      <div className="progress-section mt-4">
        <div className="progress-header">
          <span className="nutrient-label">Garam / Natrium</span>
          <span className="nutrient-value warning-value">
            <strong style={{color: sodiumPercent > 90 ? '#9b4b45' : '#264a2f'}}>{consumed.sodium}mg</strong> / {dailyGoal.sodium}mg
          </span>
        </div>
        <div className="progress-bar-bg">
          <div className={`progress-bar-fill ${sodiumPercent > 90 ? 'warning-level' : 'safe-level'}`} style={{ width: `${sodiumPercent}%` }}></div>
        </div>
        <div className={`status-text ${sodiumPercent > 90 ? 'warning-text' : 'safe-text'}`}>
          {sodiumPercent > 90 ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
          <span>{sodiumPercent > 90 ? 'Mendekati batas harian' : 'Kadar aman terjaga'}</span>
        </div>
      </div>
    </div>
  );
};

export default NutritionQuota;
