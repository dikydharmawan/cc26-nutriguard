
import { ShieldPlus, User, Mail, Lock, ArrowRight } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';

const Register = ({ onSwitchToLogin }) => {
  return (
    <AuthCard
      title="Daftar"
      subtitle="Bergabunglah dengan NutriGuard untuk hidup lebih sehat."
      icon={ShieldPlus}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Nama Lengkap"
          placeholder="Masukkan nama Anda"
          icon={User}
        />
        
        <Input
          label="Email"
          type="email"
          placeholder="contoh@email.com"
          icon={Mail}
        />
        
        <Input
          label="Kata Sandi"
          type="password"
          placeholder="Minimal 8 karakter"
          icon={Lock}
        />

        <div className="mb-6 text-sm text-muted">
          <p>
            Saya setuju dengan <a href="#">Syarat & Ketentuan</a> serta <a href="#">Kebijakan Privasi</a> HealthLens.
          </p>
        </div>

        <Button variant="primary" rightIcon={ArrowRight} className="mb-6">
          Daftar
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
