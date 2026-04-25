import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, Info as InfoIcon, 
  Settings, LogOut, Layers3, Terminal, CheckCircle2, 
  ShieldCheck, Smartphone, Zap, Bell, User
} from 'lucide-react';
import './CSS/ProjectList.css'; 

const Info = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const fiturSistem = [
    {
      title: "Manajemen Proyek",
      desc: "Fitur utama untuk memantau progres tugas, mengatur deadline, dan menetapkan anggota tim pada proyek tertentu.",
      icon: <Briefcase size={24} color="#ee1e2d" />
    },
    {
      title: "Manajemen Pengguna",
      desc: "Mengelola hak akses anggota tim, mulai dari Project Owner, Business Analyst, hingga Team Developer.",
      icon: <Users size={24} color="#ee1e2d" />
    },
    {
      title: "Real-time Dashboard",
      desc: "Visualisasi data statistik proyek yang sedang berjalan guna mempermudah pengambilan keputusan cepat.",
      icon: <LayoutDashboard size={24} color="#ee1e2d" />
    },
    {
      title: "Sistem Keamanan",
      desc: "Enkripsi data sensitif dan sistem login yang aman untuk melindungi informasi proyek perusahaan.",
      icon: <ShieldCheck size={24} color="#ee1e2d" />
    },
    {
      title: "Notifikasi Cerdas",
      desc: "Sistem pengingat otomatis untuk setiap perubahan status tugas atau mendekati batas waktu pengerjaan.",
      icon: <Zap size={24} color="#ee1e2d" />
    },
    {
      title: "Responsivitas Tinggi",
      desc: "Akses sistem dengan nyaman melalui perangkat apa pun, baik desktop maupun perangkat seluler.",
      icon: <Smartphone size={24} color="#ee1e2d" />
    }
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="scrumapps-wrapper">
      {/* 1. SIDEBAR */}
      <aside className="scrum-sidebar">
        <div className="sidebar-logo">
          <Layers3 color="#ee1e2d" size={28} />
          <span>ScrumApps</span>
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
            <InfoIcon size={20} /> <span>Informasi Sistem</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <p>Copyright 2024 ScrumApps.</p>
          <p>Rights Reserved. Version 0.5.0-alpha</p>
        </div>
      </aside>

      {/* 2. AREA UTAMA */}
      <main className="scrum-main">
        {/* TOP NAVBAR */}
        <header className="scrum-header">
          <div className="header-left">
            <div className="breadcrumb">
               <span className="bc-icon" style={{ backgroundColor: '#ee1e2d', color: 'white' }}>
                 <InfoIcon size={16} />
               </span>
               <span className="bc-text bc-active">Informasi Sistem</span>
            </div>
          </div>

          <div className="header-right">
            <div className="flex items-center gap-3 mr-4 border-r pr-4 border-gray-100">
              <div className="text-right">
                <p className="text-xs font-bold text-gray-800">Halo, Admin!</p>
                <p className="text-[10px] text-gray-400">admin@scrumapps.com</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Admin&background=ee1e2d&color=fff" alt="avatar" />
              </div>
            </div>

            <Bell size={20} color="#a0aec0" className="cursor-pointer" />
            
            {/* DROPDOWN SETTINGS */}
            <div style={{ position: 'relative' }}>
              <Settings 
                size={20} 
                color="#a0aec0" 
                className="cursor-pointer" 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              />
              
              {isSettingsOpen && (
                <div style={dropdownStyle}>
                  <div 
                    onClick={() => { navigate('/kelolaprofil'); setIsSettingsOpen(false); }}
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <User size={16} /> Kelola Profil
                  </div>

                  <div style={{ height: '1px', backgroundColor: '#edf2f7', margin: '4px 0' }}></div>

                  <div 
                    onClick={handleLogout}
                    style={{ ...dropdownItemStyle, color: '#ee1e2d' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#fff5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={16} color="#ee1e2d" /> Keluar Sesi
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ISI KONTEN */}
        <div className="scrum-content">
          <div className="content-header" style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c' }}>Tentang ScrumApps</h2>
            <p style={{ color: '#718096', maxWidth: '800px' }}>
              ScrumApps adalah platform manajemen proyek berbasis metodologi Agile yang dirancang untuk meningkatkan produktivitas tim melalui transparansi data dan kolaborasi yang efisien.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {fiturSistem.map((fitur, index) => (
              <div key={index} className="project-card" style={{ padding: '25px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ 
                  backgroundColor: '#fff5f5', 
                  padding: '12px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {fitur.icon}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#2d3748' }}>
                    {fitur.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>
                    {fitur.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sistem Status Section */}
          <div className="project-card" style={{ marginTop: '30px', padding: '30px', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Terminal size={20} color="#4a5568" />
              <h4 style={{ margin: 0 }}>Log Pembaruan Sistem</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <CheckCircle2 size={16} color="#48bb78" />
                <span style={{ color: '#4a5568' }}><strong>Versi 0.5.0-alpha:</strong> Implementasi manajemen pengguna dan UI dashboard baru.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <CheckCircle2 size={16} color="#48bb78" />
                <span style={{ color: '#4a5568' }}><strong>Versi 0.4.2-alpha:</strong> Optimasi database dan perbaikan sistem autentikasi.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Objek style dropdown agar konsisten di semua halaman
const dropdownStyle = {
  position: 'absolute',
  top: '35px',
  right: '0',
  backgroundColor: 'white',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  borderRadius: '10px',
  padding: '8px 0',
  zIndex: 1000,
  width: '180px',
  border: '1px solid #edf2f7'
};

const dropdownItemStyle = {
  padding: '10px 20px',
  fontSize: '13px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#4a5568',
  transition: 'background 0.2s'
};

export default Info;