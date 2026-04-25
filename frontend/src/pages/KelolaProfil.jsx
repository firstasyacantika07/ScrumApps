import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, Info, 
  LogOut, Layers3, User, Bell, Settings
} from 'lucide-react';
import api from '../api/axios'; 
import './css/ProjectList.css'; 
import './css/KelolaProfil.css';

const KelolaProfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    nik: "",
    alamat: "",
    phone: "",
    email: "",
    password: "" // Optional field
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(loggedInUser);
    setUserData(user);
    
    // Inisialisasi form dengan data dari LocalStorage/DB
    setFormData({
      name: user.name || "",
      gender: user.gender || "laki",
      nik: user.nik || "",
      alamat: user.alamat || "",
      phone: user.phone || "",
      email: user.email || "",
      password: "" 
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put(`/users/update/${userData.id}`, formData);
      
      if (response.status === 200) {
        // Sinkronisasi data baru ke LocalStorage agar navbar terupdate otomatis
        const updatedUser = { ...userData, ...formData };
        delete updatedUser.password; // Jangan simpan password di localstorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        alert("Profil berhasil diperbarui!");
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Gagal update profil:", err);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!userData) return null;

  return (
    <div className="scrumapps-wrapper">
      <aside className="scrum-sidebar">
        <div className="sidebar-logo">
          <Layers3 color="#ee1e2d" size={28} />
          <span>ScrumApps</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="nav-item"><LayoutDashboard size={20} /> <span>Dashboard</span></NavLink>
          <NavLink to="/projects" className="nav-item"><Briefcase size={20} /> <span>Proyek</span></NavLink>
          <NavLink to="/users" className="nav-item"><Users size={20} /> <span>Pengguna</span></NavLink>
          <NavLink to="/info" className="nav-item"><Info size={20} /> <span>Informasi</span></NavLink>
        </nav>
      </aside>

      <main className="scrum-main">
        <header className="scrum-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="bc-icon" style={{backgroundColor: '#ee1e2d', color: 'white'}}><User size={16} /></span>
              <span className="bc-text bc-active">Kelola Profil</span>
            </div>
          </div>
          <div className="header-right">
             <div className="flex items-center gap-3 mr-4">
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-800">{userData.name}</p>
                  <p className="text-[10px] text-gray-400">{userData.email}</p>
                </div>
                <img 
                  src={`https://ui-avatars.com/api/?name=${userData.name}&background=ee1e2d&color=fff`} 
                  className="w-10 h-10 rounded-full" 
                  alt="avatar" 
                />
             </div>
             <LogOut size={20} color="#a0aec0" className="cursor-pointer" onClick={handleLogout} />
          </div>
        </header>

        <div className="scrum-content">
          <div className="profile-card bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-6">Informasi Akun</h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 flex items-center gap-6 mb-4">
                <img 
                  src={`https://ui-avatars.com/api/?name=${formData.name}&background=f8fafc&color=cbd5e1&size=128`} 
                  className="w-24 h-24 rounded-2xl border" 
                  alt="Preview"
                />
                <div>
                  <button type="button" className="text-sm font-semibold text-red-500">Ubah Foto</button>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG maksimal 2MB.</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Nama Lengkap</label>
                <input 
                  type="text" name="name" 
                  value={formData.name} onChange={handleChange} 
                  className="p-2 bg-gray-50 border rounded-lg text-sm" required 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Email</label>
                <input 
                  type="email" name="email" 
                  value={formData.email} onChange={handleChange} 
                  className="p-2 bg-gray-50 border rounded-lg text-sm" required 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">NIK</label>
                <input 
                  type="text" name="nik" 
                  value={formData.nik} onChange={handleChange} 
                  className="p-2 bg-gray-50 border rounded-lg text-sm" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">No. Telepon</label>
                <input 
                  type="tel" name="phone" 
                  value={formData.phone} onChange={handleChange} 
                  className="p-2 bg-gray-50 border rounded-lg text-sm" 
                />
              </div>

              <div className="col-span-2 flex flex-col gap-2">
                <label className="text-sm font-semibold">Alamat</label>
                <textarea 
                  name="alamat" value={formData.alamat} onChange={handleChange} 
                  className="p-2 bg-gray-50 border rounded-lg text-sm" rows="3"
                ></textarea>
              </div>

              <div className="col-span-2 border-t pt-6 mt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 rounded-lg bg-gray-100 text-sm font-bold"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-6 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors"
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KelolaProfil;