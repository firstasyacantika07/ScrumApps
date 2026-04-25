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

    // DEBUG: Cek input sebelum kirim
    console.log("Mencoba login dengan:", email);

    try {
      const response = await api.post('/users/login', { email, password });
      
      // DEBUG: Lihat isi response dari server di Console
      console.log("Response Full:", response);
      console.log("Data dari Server:", response.data);

      // Cek apakah user ada di dalam response.data
      if (response.data && response.data.user) {
        const userData = response.data.user;
        
        // Simpan ke localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // DEBUG: Cek apakah sudah tersimpan tepat setelah setItem
        console.log("Data tersimpan di Storage:", localStorage.getItem('user'));
        
        // Navigasi
        navigate('/dashboard');
      } else {
        // Jika login "berhasil" secara status tapi data user kosong
        console.warn("Login sukses tapi data user tidak ditemukan di response");
        setError("Format data dari server tidak sesuai.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      // Ambil pesan error dari backend
      const errMsg = err.response?.data?.message || "Login Gagal. Periksa koneksi Anda.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.loginSplitContainer}>
      {/* --- SISI KIRI: VISUAL --- */}
      <div style={styles.loginVisualSection}>
        <div style={styles.visualContent}>
          <div style={styles.visualLogoContainer}>
            <span style={styles.visualLogoText}>ScrumApps</span>
          </div>
          <img 
            src="https://cdni.iconscout.com/illustration/premium/thumb/team-management-5147517-4301385.png" 
            alt="Illustration" 
            style={styles.visualImage}
          />
          <h2 style={styles.visualTitle}>Kelola Proyek Lebih Mudah</h2>
          <p style={styles.visualSubtitle}>Pantau progres tim Anda dalam satu dasbor terpusat secara real-time.</p>
        </div>
        <div style={{ ...styles.blurCircle, ...styles.topCircle }}></div>
        <div style={{ ...styles.blurCircle, ...styles.bottomCircle }}></div>
      </div>

      {/* --- SISI KANAN: FORM --- */}
      <div style={styles.loginFormSection}>
        <div style={styles.formContainer}>
          <header style={styles.formHeader}>
            <h1 style={styles.formHeaderTitle}>Masuk</h1>
            <p style={styles.formHeaderSub}>Gunakan akun ScrumApps Anda.</p>
          </header>

          {/* Alert Error */}
          {error && (
            <div style={styles.errorAlert}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.loginForm}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Alamat Email</label>
              <input
                type="email"
                placeholder="nama@email.com"
                style={styles.customInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Kata Sandi</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  style={styles.customInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <div style={styles.optionsRow}>
              <label style={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Ingat saya</span>
              </label>
              <Link to="/forgot-password" style={styles.linkTextRed}>Lupa sandi?</Link>
            </div>

            <button 
              type="submit" 
              style={{...styles.btnLoginMain, opacity: isLoading ? 0.7 : 1}}
              disabled={isLoading}
            >
              {isLoading ? 'Mengecek Akun...' : 'Masuk Sekarang'}
            </button>
          </form>

          <footer style={styles.formFooter}>
            <p>© 2026 <strong>ScrumApps</strong>. Madiun, Indonesia.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  loginSplitContainer: { display: 'flex', minHeight: '100vh', width: '100%', fontFamily: "'Inter', sans-serif" },
  loginVisualSection: { flex: 1.2, backgroundColor: '#ee1e2d', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', color: 'white', padding: '60px' },
  visualContent: { position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  visualLogoContainer: { alignSelf: 'flex-start', marginBottom: '40px' },
  visualLogoText: { fontSize: '24px', fontWeight: 'bold' },
  visualImage: { width: '100%', maxWidth: '400px', marginBottom: '30px' },
  visualTitle: { fontSize: '32px', fontWeight: '800', marginBottom: '15px' },
  visualSubtitle: { fontSize: '16px', opacity: '0.85', maxWidth: '400px' },
  blurCircle: { position: 'absolute', borderRadius: '50%', filter: 'blur(100px)', zIndex: 1 },
  topCircle: { width: '400px', height: '400px', background: 'rgba(255, 255, 255, 0.15)', top: '-150px', left: '-100px' },
  bottomCircle: { width: '500px', height: '500px', background: 'rgba(0, 0, 0, 0.1)', bottom: '-200px', right: '-100px' },
  loginFormSection: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', backgroundColor: '#f8fafc' },
  formContainer: { width: '100%', maxWidth: '400px' },
  formHeader: { marginBottom: '30px' },
  formHeaderTitle: { fontSize: '32px', fontWeight: '800', color: '#1a202c', margin: '0' },
  formHeaderSub: { color: '#718096', fontSize: '15px' },
  errorAlert: { backgroundColor: '#fff5f5', color: '#e53e3e', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #feb2b2', fontSize: '14px', textAlign: 'center' },
  inputGroup: { marginBottom: '20px' },
  inputLabel: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' },
  passwordWrapper: { position: 'relative' },
  customInput: { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', boxSizing: 'border-box' },
  passwordToggle: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer' },
  optionsRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '25px', fontSize: '14px' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', color: '#4a5568' },
  linkTextRed: { color: '#ee1e2d', textDecoration: 'none', fontWeight: '600' },
  btnLoginMain: { width: '100%', backgroundColor: '#ee1e2d', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' },
  formFooter: { marginTop: '50px', color: '#a0aec0', fontSize: '13px', textAlign: 'center' }
};

export default Login;