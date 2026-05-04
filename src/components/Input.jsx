import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

const Input = ({ label, type = 'text', icon: Icon, rightIcon: RightIcon, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="input-group mb-6">
      {label && <label className="input-label mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">{label}</label>}
      <div className="input-wrapper">
        {Icon && (
          <div className="input-icon-left">
            <Icon size={20} />
          </div>
        )}
        <input
          type={inputType}
          className={`input-field ${Icon ? 'has-icon-left' : ''} ${isPassword || RightIcon ? 'has-icon-right' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="input-icon-right toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        {RightIcon && !isPassword && (
          <div className="input-icon-right">
            <RightIcon size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
