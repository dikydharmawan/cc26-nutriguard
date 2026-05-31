import { Utensils, Droplets, Cookie, FlaskConical } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import './DashboardSummary.css';

const DashboardSummary = () => {
  const { nutritionData } = useAppContext();
  const { consumed, dailyGoal } = nutritionData;

  const sugarPercent = Math.min((consumed.sugar / dailyGoal.sugar) * 100, 100);
  const sodiumPercent = Math.min((consumed.sodium / dailyGoal.sodium) * 100, 100);

  return (
    <div className="dashboard-summary-container">
      <h3 className="summary-title">Ringkasan Hari Ini</h3>
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon calorie-icon">
            <Utensils size={20} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Kalori</span>
            <span className="summary-value">{consumed.calorie.toLocaleString('id-ID')} <small>kcal</small></span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon hydration-icon">
            <Droplets size={20} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Hidrasi</span>
            <span className="summary-value">{consumed.hydration} <small>L</small></span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon sugar-icon">
            <Cookie size={20} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Gula</span>
            <span className="summary-value" style={{color: sugarPercent > 90 ? '#9b4b45' : 'inherit'}}>
              {consumed.sugar} <small>g</small>
            </span>
          </div>
          <div className="mini-progress-bg">
            <div className="mini-progress-fill" style={{width: `${sugarPercent}%`, backgroundColor: sugarPercent > 90 ? '#9b4b45' : '#3b7454'}}></div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon sodium-icon">
            <FlaskConical size={20} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Natrium</span>
            <span className="summary-value" style={{color: sodiumPercent > 90 ? '#9b4b45' : 'inherit'}}>
              {consumed.sodium.toLocaleString('id-ID')} <small>mg</small>
            </span>
          </div>
          <div className="mini-progress-bg">
            <div className="mini-progress-fill" style={{width: `${sodiumPercent}%`, backgroundColor: sodiumPercent > 90 ? '#9b4b45' : '#3b7454'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
