import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, Info as InfoIcon, 
  Settings, LogOut, Layers3, Bell, User, ChevronRight, ChevronDown 
} from 'lucide-react';
import './CSS/ProjectList.css'; 

const Info = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: 'Admin', role: 'Superadmin' });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUserData(JSON.parse(loggedInUser));
    }
  }, []);

  const infoItems = [
    { 
      title: "Kegunaan Utama Sistem ScrumApps", 
      content: "ScrumApps dirancang untuk mempermudah pengelolaan proyek secara kolaboratif menggunakan kerangka kerja Scrum. Pengguna dapat membuat, memantau, dan mengelola tugas dalam proyek sesuai dengan role dan hak akses yang dimiliki." 
    },
    { 
      title: "Pengguna Sistem", 
      content: "Dalam sistem menggunakan pengguna yang terdiri dari:\n- Business Analyst (Seorang yang yang memberikan detail informasi yang diperoleh dari clien sebagai requirement proyek yang akan dikembangkan)\n- Tim Developer (Terdiri dari Backend, Frontend, Desaigner UI/UX, dan Sofware Tester)" 
    },
    { 
      title: "Hak Akses Pengguna", 
      content: "Setiap pengguna memiliki hak akses untuk menjaga keamanan dan keteraturan informasi yang terdiri dari:\n- Hak Akses Business Analyst (Berperan mengeola detail Vision Board dan Backlog dari proyek dan mengundang Tim Developer untuk memulai proyek)\n- Hak Akses Tim Developer (Berperan mengerjakan tugas sesuai dengan ketentuan saat perencanaan proyek pada menu Tim Developer dalam kanban)" 
    },
    { 
      title: "Manajemen Vision Board dan Backlog", 
      content: "- Fitur Vision Board digunakan untuk mendeskripsikan sistem secara terperinci pada setiap versinya.\n- Fitur Backlog digunakan untuk mencatat permintaan tugas dari clien dan juga etimasi status prioritas pengembangan." 
    },
    { 
      title: "Struktur Proyek dan Sprint", 
      content: "Proyek dalam sistem ini terdiri dari beberapa sprint. Setiap sprint berisi task atau backlog yang harus diselesaikan dalam periode tertentu. Ini membantu pengelolaan waktu dan progres proyek." 
    },
    { 
      title: "Notifikasi dan Aktivitas Pengguna", 
      content: "Sistem memberikan notifikasi untuk setiap perubahan status proyek \"Done\" atau \"Late\". Riwayat aktivitas juga dapat dilihat oleh anggota proyek terkait." 
    },
    { 
      title: "Kontak yang Dapat Dihubungi", 
      content: "Jika mengalami kendala, pengguna dapat menghubungi tim support melalui email: support@scrumapps.id" 
    },
    { 
      title: "Panduan Penggunaan Sistem", 
      content: "Pengguna baru dapat mengakses dokumentasi lengkap atau mengikuti tutorial penggunaan sistem yang tersedia. Untuk unduh panduan penggunaan sistem ",
      link: "klik di sini." 
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="scrumapps-wrapper">
      <aside className="scrum-sidebar">
        <div className="sidebar-logo">
          <div className="logo-box" style={{ backgroundColor: '#ee1e2d', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}>
            <Layers3 color="white" size={18} />
          </div>
          <span className="logo-text">SrcumApps</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Briefcase size={18} /> <span>Proyek</span>
          </NavLink>

          {userData.role === 'Superadmin' && (
            <NavLink to="/users" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <Users size={18} /> <span>Pengguna</span>
            </NavLink>
          )}

          <NavLink to="/info" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <InfoIcon size={18} /> <span>Informasi Sistem</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <p>© Copyright 2024 ScrumApps.</p>
          <p>Rights Reserved. Version 0.5.0-alpha</p>
        </div>
      </aside>

      <main className="scrum-main">
        <header className="scrum-header">
          <div className="header-left">
            <div className="breadcrumb">
               <span className="bc-icon" style={{ backgroundColor: '#ee1e2d', color: 'white', borderRadius: '4px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <InfoIcon size={14} />
               </span>
               <span className="bc-text bc-active" style={{ marginLeft: '10px', fontWeight: '500' }}>Informasi Sistem</span>
            </div>
          </div>

          <div className="header-right">
            <div className="flex items-center gap-3 mr-4 border-r pr-4 border-gray-100">
              <div className="text-right">
                <p className="text-xs font-bold text-gray-800">{userData.name}</p>
                <p className="text-[10px] text-gray-400">{userData.role}</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                <User size={18} color="#a0aec0" />
              </div>
            </div>
            <Bell size={18} color="#a0aec0" className="cursor-pointer hover:text-gray-600 transition-colors" />
            <div style={{ position: 'relative', marginLeft: '15px' }}>
              <Settings 
                size={18} 
                color="#a0aec0" 
                className="cursor-pointer hover:text-gray-600 transition-colors" 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              />
              {isSettingsOpen && (
                <div style={dropdownStyle}>
                  <div onClick={() => {navigate('/kelolaprofil'); setIsSettingsOpen(false);}} style={dropdownItemStyle} className="hover:bg-gray-50">
                    <User size={14} /> Kelola Profil
                  </div>
                  <div style={{ height: '1px', backgroundColor: '#edf2f7', margin: '4px 0' }}></div>
                  <div onClick={handleLogout} style={{ ...dropdownItemStyle, color: '#ee1e2d' }} className="hover:bg-red-50">
                    <LogOut size={14} /> Keluar Sesi
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="scrum-content" style={{ padding: '40px' }}>
          <div className="info-container" style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div className="content-header" style={{ marginBottom: '40px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>Informasi Sistem ScrumApps</h2>
              <p style={{ color: '#a0aec0', fontSize: '14px' }}>
                Halaman ini berisi informasi umum terkait sistem, kebijakan, dan panduan penggunaan aplikasi.
              </p>
            </div>

            <div className="info-list">
              {infoItems.map((item, index) => (
                <div key={index} style={{ marginBottom: '15px', borderBottom: '1px solid #fafafa', paddingBottom: '15px' }}>
                  <div 
                    onClick={() => handleToggle(index)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      gap: '15px',
                      color: openIndex === index ? '#ee1e2d' : '#4a5568',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {openIndex === index ? (
                      <ChevronDown size={18} strokeWidth={2.5} />
                    ) : (
                      <ChevronRight size={18} strokeWidth={2.5} />
                    )}
                    <span style={{ fontSize: '15px', fontWeight: openIndex === index ? '700' : '500' }}>
                      {item.title}
                    </span>
                  </div>
                  
                  {openIndex === index && (
                    <div style={{ 
                      padding: '15px 0 5px 33px', 
                      fontSize: '14px', 
                      color: '#718096', 
                      lineHeight: '1.7',
                      whiteSpace: 'pre-line', 
                      animation: 'fadeIn 0.4s ease'
                    }}>
                      {item.content}
                      {item.link && (
                        <a 
                          href="/guide.pdf" 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ color: '#ee1e2d', fontWeight: '600', textDecoration: 'none', marginLeft: '4px' }}
                        >
                          {item.link}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

const dropdownStyle = {
  position: 'absolute', top: '35px', right: '0', backgroundColor: 'white',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderRadius: '10px', padding: '8px 0',
  zIndex: 1000, width: '180px', border: '1px solid #edf2f7'
};

const dropdownItemStyle = {
  padding: '10px 15px', fontSize: '13px', cursor: 'pointer', display: 'flex',
  alignItems: 'center', gap: '10px', color: '#4a5568', transition: 'all 0.2s'
};

export default Info;
