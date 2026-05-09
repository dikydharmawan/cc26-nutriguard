import { Clock, Search, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import './HistoryView.css';

const HistoryView = () => {
  const { history } = useAppContext();

  return (
    <div className="history-view">
      <div className="history-header">
        <h2 className="history-title">Riwayat Pindaian</h2>
        <p className="text-muted">Pantau apa yang telah Anda konsumsi</p>
      </div>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Cari makanan atau minuman..." className="search-input" />
      </div>

      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-card dashboard-card">
            <div className="history-icon">
              <Clock size={20} color="#64746b" />
            </div>
            <div className="history-details">
              <h4 className="food-name">{item.name}</h4>
              <span className="scan-date">{item.date}</span>
              <div className="nutrition-badges">
                <span className="cal-badge">{item.cal}</span>
                <span className="status-badge" style={{ color: item.color, backgroundColor: `${item.color}15` }}>
                  {item.status}
                </span>
              </div>
            </div>
            <button className="view-detail-btn">
              <ChevronRight size={20} />
            </button>
          </div>
        ))}
        {history.length === 0 && (
          <div className="text-center text-muted mt-8">
            Belum ada riwayat pindaian.
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
