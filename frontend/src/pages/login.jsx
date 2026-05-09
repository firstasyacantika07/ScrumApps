import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeOff, Eye } from 'lucide-react';
import api from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log("Mencoba login dengan:", email);

    try {
      const response = await api.post('/users/login', { email, password });
      
      if (response.data && response.data.user) {
        const userData = response.data.user;
        
        // Simpan data user ke localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // --- LOGIKA PENGALIHAN DASHBOARD BERDASARKAN ROLE ---
        const role = userData.role; 

        if (role === 'Super Admin') {
          navigate('/dashboard/admin');
        } else if (role === 'Business Analyst') {
          navigate('/dashboard/analyst');
        } else if (role === 'Team Developer') {
          navigate('/dashboard/developer');
        } else if (role === 'Project Owner') {
          navigate('/dashboard/owner');
        } else {
          // Jika role tidak dikenali, kirim ke dashboard umum
          navigate('/dashboard');
        }

      } else {
        setError("Format data dari server tidak sesuai.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      const errMsg = err.response?.data?.message || "Login Gagal. Periksa koneksi Anda.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans antialiased">
      {/* --- SISI KIRI: VISUAL (TAILWIND VERSION) --- */}
      <div className="hidden lg:flex flex-[1.2] bg-[#ee1e2d] items-center justify-center relative overflow-hidden text-white p-16">
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="self-start mb-10">
            <span className="text-2xl font-bold">ScrumApps</span>
          </div>
          <img 
            src="https://cdni.iconscout.com/illustration/premium/thumb/team-management-5147517-4301385.png" 
            alt="Illustration" 
            className="w-full max-w-[400px] mb-8"
          />
          <h2 className="text-3xl font-extrabold mb-4">Kelola Proyek Lebih Mudah</h2>
          <p className="text-base opacity-90 max-w-[400px]">
            Pantau progres tim Anda dalam satu dasbor terpusat secara real-time.
          </p>
        </div>
        
        {/* Blur Circles using Tailwind */}
        <div className="absolute rounded-full blur-[100px] z-0 w-[400px] h-[400px] bg-white/15 -top-[150px] -left-[100px]"></div>
        <div className="absolute rounded-full blur-[100px] z-0 w-[500px] h-[500px] bg-black/10 -bottom-[200px] -right-[100px]"></div>
      </div>

      {/* --- SISI KANAN: FORM (TAILWIND VERSION) --- */}
      <div className="flex-1 flex items-center justify-center p-10 bg-slate-50">
        <div className="w-full max-w-[400px]">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">Masuk</h1>
            <p className="text-slate-500 text-[15px]">Gunakan akun ScrumApps Anda.</p>
          </header>

          {/* Alert Error */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-5 border border-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Email</label>
              <input
                type="email"
                placeholder="nama@email.com"
                className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ee1e2d] focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ee1e2d] focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-[#ee1e2d] focus:ring-[#ee1e2d]"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Ingat saya</span>
              </label>
              <Link to="/forgot-password" size="sm" className="text-[#ee1e2d] font-semibold hover:underline">Lupa sandi?</Link>
            </div>

            <button 
              type="submit" 
              className={`w-full bg-[#ee1e2d] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#d61a28] active:scale-[0.98] transition-all shadow-lg shadow-red-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengecek Akun...
                </span>
              ) : 'Masuk Sekarang'}
            </button>
          </form>

          <footer className="mt-12 text-slate-400 text-[13px] text-center">
            <p>© 2026 <span className="font-bold">ScrumApps</span>. Madiun, Indonesia.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;