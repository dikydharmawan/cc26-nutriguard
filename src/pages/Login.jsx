
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';

// A simple filled circle icon to match the design
const CircleIcon = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="var(--primary-color)">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const Login = ({ onSwitchToRegister }) => {
  return (
    <AuthCard
      title="NutriGuard"
      subtitle="Masuk untuk melanjutkan perjalanan sehatmu"
      icon={CircleIcon}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Email"
          type="email"
          placeholder="nama@email.com"
          icon={Mail}
        />
        
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', right: 0, top: 0, zIndex: 1 }}>
            <a href="#" className="text-xs uppercase" style={{ letterSpacing: '0.05em' }}>Lupa?</a>
          </div>
          <Input
            label="Kata Sandi"
            type="password"
            placeholder="••••••••"
            icon={Lock}
          />
        </div>

        <Button variant="primary" className="mt-2 mb-6">
          Masuk
        </Button>

        <div className="divider">
          <span>Atau lanjutkan dengan</span>
        </div>

        <div className="social-buttons-container mb-8">
          <Button variant="social">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" style={{ width: '20px', marginRight: '8px' }} />
            Google
          </Button>
          <Button variant="social">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" style={{ width: '20px', marginRight: '8px' }} />
            Facebook
          </Button>
        </div>

        <div className="text-center text-sm text-muted mb-4">
          Belum punya akun?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>
            Daftar Sekarang
          </a>
        </div>
        
        <div className="text-center text-xs text-muted" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.5 }}>
          <ShieldCheck size={14} />
          <span>ENKRIPSI 256-BIT TERJAMIN</span>
        </div>
      </form>
    </AuthCard>
  );
};

export default Login;
