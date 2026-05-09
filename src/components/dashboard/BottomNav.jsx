import { LayoutGrid, Camera, History, User } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <div className="nav-item active">
        <LayoutGrid size={24} />
        <span>Dashboard</span>
      </div>
      <div className="nav-item">
        <Camera size={24} />
        <span>Scanner</span>
      </div>
      <div className="nav-item">
        <History size={24} />
        <span>Riwayat</span>
      </div>
      <div className="nav-item">
        <User size={24} />
        <span>Profil</span>
      </div>
    </nav>
  );
};

export default BottomNav;
