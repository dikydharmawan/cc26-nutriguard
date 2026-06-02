
import './Button.css';

const Button = ({ children, variant = 'primary', icon: Icon, rightIcon: RightIcon, className = '', ...props }) => {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {Icon && <span className="btn-icon-left"><Icon size={20} /></span>}
      <span className="btn-text">{children}</span>
      {RightIcon && <span className="btn-icon-right"><RightIcon size={20} /></span>}
    </button>
  );
};

export default Button;
