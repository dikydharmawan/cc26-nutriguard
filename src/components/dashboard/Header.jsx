import './Header.css';

const Header = () => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1 className="header-title">NutriGuard</h1>
      </div>
      <div className="header-right">
        <div className="profile-avatar">
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
        </div>
      </div>
    </header>
  );
};

export default Header;
