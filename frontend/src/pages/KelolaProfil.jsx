import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, Info, 
  Settings, LogOut, Layers3, User, Bell
} from 'lucide-react';
import api from '../api/axios'; // Pastikan path axios sudah benar
import './css/Projectlist.css';
import './css/KelolaProfil.css';

const KelolaProfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    gender: "",
    nik: "",
    alamat: "",
    phone: "",
    email: ""
  });

  // 1. Ambil data dari sesi saat halaman dimuat
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(loggedInUser);
    setUserData(user);
    
    // Isi form dengan data dari sesi/database
    setFormData({
      username: user.name || "",
      gender: user.gender || "laki",
      nik: user.nik || "",
      alamat: user.alamat || "",
      phone: user.phone || "",
      email: user.email || ""
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
      // 2. Kirim update ke Backend (Pastikan endpoint /users/update sesuai)
      const response = await api.put(`/users/update/${userData.id}`, formData);
      
      if (response.status === 200) {
        // Update localStorage agar nama di navbar juga berubah
        const updatedUser = { ...userData, ...formData };
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
      {/* SIDEBAR - Konsisten dengan Dashboard */}
      <aside className="scrum-sidebar">
        <div className="sidebar-logo">
          <div className="logo-box"><Layers3 color="white" size={20} /></div>
          <span className="logo-text">ScrumApps</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Briefcase size={20} /> <span>Proyek</span>
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Users size={20} /> <span>Pengguna</span>
          </NavLink>
          <NavLink to="/info" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Info size={20} /> <span>Sistem</span>
          </NavLink>
        </nav>
        <div className="sidebar-bottom-section">
           <div className="sidebar-footer">
            <p>© 2026 <strong>ScrumApps</strong>.</p>
          </div>
        </div>
      </aside>

      <main className="scrum-main">
        <header className="scrum-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="bc-icon-red"><User size={16} /></span>
              <span className="bc-text bc-active">Pengaturan</span>
              <span className="bc-sep">›</span>
              <span className="bc-text">Profil Saya</span>
            </div>
          </div>
          <div className="header-right">
             <div className="admin-profile-section">
                <div className="text-right">
                  <p className="admin-name">{userData.username}</p>
                  <p className="admin-email">{userData.email}</p>
                </div>
                <div className="admin-avatar">
                   <img src={`https://ui-avatars.com/api/?name=${userData.username}&background=ee1e2d&color=fff`} alt="avatar" />
                </div>
             </div>
             <LogOut size={20} color="#a0aec0" className="cursor-pointer" onClick={handleLogout} />
          </div>
        </header>

        <div className="scrum-content">
          <div className="content-header">
            <h2>Kelola Profil</h2>
            <p>Perbarui informasi pribadi Anda untuk koordinasi tim yang lebih baik.</p>
          </div>

          <div className="profile-card">
            <form className="profile-form" onSubmit={handleSubmit}>
              
              <div className="photo-upload-section">
                <label className="input-label">Foto Profil</label>
                <div className="photo-container">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${formData.username}&background=f1f5f9&color=cbd5e1&size=128`} 
                    className="avatar-preview" 
                    alt="Preview"
                  />
                  <div className="photo-actions">
                    <button type="button" className="btn-change">Ubah Foto</button>
                    <button type="button" className="btn-delete-photo">Hapus</button>
                  </div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Nama Lengkap</label>
                  <input 
                    type="text" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Jenis Kelamin</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" name="gender" value="laki" checked={formData.gender === 'laki'} onChange={handleChange} />
                      <span>Laki-laki</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="gender" value="perempuan" checked={formData.gender === 'perempuan'} onChange={handleChange} />
                      <span>Perempuan</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>NIK</label>
                  <input type="text" name="nik" value={formData.nik} onChange={handleChange} placeholder="351xxxxxxxxxxxxx" />
                </div>

                <div className="form-group full-width">
                  <label>Alamat Lengkap</label>
                  <textarea name="alamat" rows="3" value={formData.alamat} onChange={handleChange}></textarea>
                </div>

                <div className="form-group">
                  <label>No Telepon</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Alamat Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-footer">
                <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard')}>Batal</button>
                <button type="submit" className="btn-save" disabled={loading}>
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