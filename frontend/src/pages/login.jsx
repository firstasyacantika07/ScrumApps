import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeOff, Eye } from 'lucide-react';
import api from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan password wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data?.token) {
        // 🔐 simpan token baru
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // redirect
        navigate('/dashboard');
      } else {
        alert("Login gagal, token tidak ditemukan");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data);

      alert(
        err.response?.data?.message ||
        "Login gagal, cek email/password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">

      {/* LEFT */}
      <div className="hidden lg:flex w-1/2 p-4">
        <div className="w-full bg-[#D31217] rounded-[40px] flex flex-col items-center justify-center p-12">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">ScrumApps</h1>
            <p className="text-sm opacity-90">
              © 2024 ScrumApps
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Masuk</h2>
            <p className="text-gray-500 text-sm mt-1">
              Masukkan email dan password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}
            <input
              type="email"
              required
              placeholder="Alamat Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-[#F3F6F9] rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-[#F3F6F9] rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* OPTIONS */}
            <div className="flex justify-between items-center text-xs px-1">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" />
                Ingat saya
              </label>

              <Link
                to="/forgot-password"
                className="text-[#D31217] font-medium hover:underline"
              >
                Lupa kata sandi?
              </Link>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#D31217] text-white rounded-xl font-semibold hover:bg-red-700"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;