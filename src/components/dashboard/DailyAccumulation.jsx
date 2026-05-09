import { Utensils, Droplets } from 'lucide-react';
import './DailyAccumulation.css';

const DailyAccumulation = () => {
  return (
    <div className="daily-accumulation-container">
      <h3 className="accumulation-title">Akumulasi Hari Ini</h3>
      
      <div className="accumulation-cards">
        <div className="dashboard-card stat-card">
          <div className="stat-icon-wrapper calorie-icon">
            <Utensils size={18} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Kalori</span>
            <span className="stat-value">1.420 kcal</span>
          </div>
        </div>

        <div className="dashboard-card stat-card">
          <div className="stat-icon-wrapper hydration-icon">
            <Droplets size={18} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Hidrasi</span>
            <span className="stat-value">1.8 L</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyAccumulation;
