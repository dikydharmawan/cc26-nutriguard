import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
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
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // App.jsx will automatically route to dashboard because isAuthenticated becomes true
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="NutriGuard"
      subtitle="Masuk untuk melanjutkan perjalanan sehatmu"
      icon={CircleIcon}
    >
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}
        <Input
          label="Email"
          type="email"
          placeholder="nama@email.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button variant="primary" className="mt-2 mb-6" type="submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
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
