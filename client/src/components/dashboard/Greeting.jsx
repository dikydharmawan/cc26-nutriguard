import { useAppContext } from '../../context/AppContext';
import './Greeting.css';

const Greeting = () => {
  const { userProfile } = useAppContext();
  const displayName = userProfile?.name || 'Pelopor Kesehatan';

  return (
    <div className="greeting-container">
      <h2 className="greeting-title">Halo, {displayName}</h2>
      <p className="greeting-subtitle text-muted">
        Berikut adalah ringkasan nutrisi Anda hari ini.
      </p>
    </div>
  );
};

export default Greeting;
