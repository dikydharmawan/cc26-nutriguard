import { useState } from 'react';
import { Clock, Search, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import ScanResultView from './ScanResultView';
import './HistoryView.css';

const HistoryView = () => {
  const { history } = useAppContext();
  const [selectedItem, setSelectedItem] = useState(null);

  const handleViewDetail = (item) => {
    if (item.fullData) {
      setSelectedItem({
        scanData: item.fullData,
        image: item.image || item.imageUrl
      });
    } else {
      setSelectedItem({
        scanData: {
          isValid: true,
          productName: item.detected?.productName || item.name || 'Produk',
          resultStatus: item.detected?.resultStatus || item.status || 'OK',
          confidence: item.confidence ? `${(item.confidence * 100).toFixed(0)}%` : '99%',
          statusIcon: 'ℹ️',
          statusClass: 'status-safe-header',
          probabilities: item.detected?.probabilities || { aman: '0%', amanVal: 0, waspada: '0%', waspadaVal: 0, batasi: '0%', batasiVal: 0 },
          nutrients: item.detected?.nutrients || [],
          aiSuggestion: item.detected?.aiSuggestion || 'Informasi detail tidak tersedia.'
        },
        image: item.imageUrl || null
      });
    }
  };

  if (selectedItem) {
    return (
      <ScanResultView
        scanData={selectedItem.scanData}
        scannedImage={selectedItem.image}
        onBack={() => setSelectedItem(null)}
        isViewOnly={true}
      />
    );
  }

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
        {history.map((item) => {
          const name = item.detected?.productName || item.name || 'Produk';
          const date = new Date(item.createdAt || item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
          const cal = item.nutrition?.calorie || item.cal || '-';
          const status = item.detected?.resultStatus || item.status || 'OK';
          const color = item.detected?.statusColor || item.color || '#64746b';
          
          return (
            <div key={item.id} className="history-card dashboard-card" onClick={() => handleViewDetail(item)} style={{ cursor: 'pointer' }}>
              <div className="history-icon">
                <Clock size={20} color="#64746b" />
              </div>
              <div className="history-details">
                <h4 className="food-name">{name}</h4>
                <span className="scan-date">{date}</span>
                <div className="nutrition-badges">
                  <span className="cal-badge">{cal} kkal</span>
                  <span className="status-badge" style={{ color: color, backgroundColor: `${color}15` }}>
                    {status}
                  </span>
                </div>
              </div>
              <button className="view-detail-btn">
                <ChevronRight size={20} />
              </button>
            </div>
          );
        })}
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
