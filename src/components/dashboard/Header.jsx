import { useAppContext } from '../../../context/AppContext';
import './Header.css';

const Header = () => {
  const { userProfile } = useAppContext();

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1 className="header-title">NutriGuard</h1>
      </div>
      <div className="header-right">
        <div className="profile-avatar">
          <img src={userProfile.avatar} alt="Profile" />
        </div>
      </div>
    </header>
  );
};

export default Header;
