import Header from '../components/dashboard/Header';
import Greeting from '../components/dashboard/Greeting';
import NutritionQuota from '../components/dashboard/NutritionQuota';
import DailyAccumulation from '../components/dashboard/DailyAccumulation';
import ScannerBanner from '../components/dashboard/ScannerBanner';
import BottomNav from '../components/dashboard/BottomNav';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Header />
      
      <main className="dashboard-main">
        <Greeting />
        <NutritionQuota />
        <DailyAccumulation />
        <ScannerBanner />
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
