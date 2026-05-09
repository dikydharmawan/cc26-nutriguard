import Greeting from '../../components/dashboard/Greeting';
import NutritionQuota from '../../components/dashboard/NutritionQuota';
import DailyAccumulation from '../../components/dashboard/DailyAccumulation';
import ScannerBanner from '../../components/dashboard/ScannerBanner';

const HomeView = () => {
  return (
    <>
      <Greeting />
      <NutritionQuota />
      <DailyAccumulation />
      <ScannerBanner />
    </>
  );
};

export default HomeView;
