import Greeting from '../../components/dashboard/Greeting';
import DashboardSummary from '../../components/dashboard/DashboardSummary';
import ScannerBanner from '../../components/dashboard/ScannerBanner';

const HomeView = ({ onNavigate }) => {
  return (
    <>
      <Greeting />
      <DashboardSummary />
      <ScannerBanner onScannerClick={() => onNavigate('scanner')} />
    </>
  );
};

export default HomeView;
