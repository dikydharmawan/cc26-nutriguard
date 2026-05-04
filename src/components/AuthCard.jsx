
import './AuthCard.css';

const AuthCard = ({ children, title, subtitle, icon: Icon }) => {
  return (
    <div className="auth-card-container">
      <div className="auth-card">
        <div className="auth-card-header text-center mb-8">
          {Icon && (
            <div className="auth-card-icon-wrapper mb-4">
              <Icon size={28} className="auth-card-icon" />
            </div>
          )}
          <h1 className="auth-card-title mb-2">{title}</h1>
          {subtitle && <p className="auth-card-subtitle text-muted">{subtitle}</p>}
        </div>
        <div className="auth-card-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
