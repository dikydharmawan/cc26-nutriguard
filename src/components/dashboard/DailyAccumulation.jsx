import { Utensils, Droplets } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import './DailyAccumulation.css';

const DailyAccumulation = () => {
  const { nutritionData } = useAppContext();
  const { consumed } = nutritionData;

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
            <span className="stat-value">{consumed.calorie.toLocaleString('id-ID')} kcal</span>
          </div>
        </div>

        <div className="dashboard-card stat-card">
          <div className="stat-icon-wrapper hydration-icon">
            <Droplets size={18} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Hidrasi</span>
            <span className="stat-value">{consumed.hydration} L</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyAccumulation;
