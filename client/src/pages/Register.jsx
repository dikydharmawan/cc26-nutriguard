import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ShieldPlus, User, Mail, Lock, ArrowRight } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';

const Register = ({ onSwitchToLogin }) => {
  const { register } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(email, password); // Note: Backend currently only requires email & password
      setSuccess('Pendaftaran berhasil! Silakan masuk.');
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Pendaftaran gagal. Pastikan email belum terdaftar dan kata sandi minimal 8 karakter.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Daftar"
      subtitle="Bergabunglah dengan NutriGuard untuk hidup lebih sehat."
      icon={ShieldPlus}
    >
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: '#10b981', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>{success}</div>}
        
        <Input
          label="Nama Lengkap"
          placeholder="Masukkan nama Anda"
          icon={User}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <Input
          label="Email"
          type="email"
          placeholder="contoh@email.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          label="Kata Sandi"
          type="password"
          placeholder="Minimal 8 karakter"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="mb-6 text-sm text-muted">
          <p>
            Saya setuju dengan <a href="#">Syarat & Ketentuan</a> serta <a href="#">Kebijakan Privasi</a> NutriGuard.
          </p>
        </div>

        <Button variant="primary" rightIcon={ArrowRight} className="mb-6" type="submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Daftar'}
        </Button>

        <div className="divider">
          <span>Atau daftar dengan</span>
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

        <div className="text-center text-sm text-muted">
          Sudah punya akun?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
            Masuk Sekarang
          </a>
        </div>
      </form>
    </AuthCard>
  );
};

export default Register;
