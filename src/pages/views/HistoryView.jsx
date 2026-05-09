import { Clock, Search, ChevronRight } from 'lucide-react';
import './HistoryView.css';

const HistoryView = () => {
  const historyData = [
    { id: 1, name: 'Susu UHT Full Cream', date: 'Hari ini, 08:30', cal: '150 kcal', status: 'Aman', color: '#3b7454' },
    { id: 2, name: 'Roti Gandum Utuh', date: 'Hari ini, 07:15', cal: '120 kcal', status: 'Aman', color: '#3b7454' },
    { id: 3, name: 'Keripik Kentang Balado', date: 'Kemarin, 19:45', cal: '320 kcal', status: 'Tinggi Natrium', color: '#9b4b45' },
    { id: 4, name: 'Minuman Boba Brown Sugar', date: 'Kemarin, 14:20', cal: '450 kcal', status: 'Tinggi Gula', color: '#9b4b45' },
    { id: 5, name: 'Yogurt Plain', date: '2 Hari lalu, 09:00', cal: '80 kcal', status: 'Aman', color: '#3b7454' },
  ];

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
        {historyData.map((item) => (
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
      </div>
    </div>
  );
};

export default HistoryView;
