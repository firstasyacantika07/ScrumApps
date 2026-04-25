import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom'; 
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Info, 
  Settings, 
  LogOut, 
  Layers3, 
  FolderPlus, 
  Building2, 
  Store,
  Bell,
  User,
  X,
  Monitor
} from 'lucide-react';
import './css/ProjectList.css';

const ProjectList = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // --- STATE TAMBAHAN UNTUK MODAL TAMBAH PROYEK ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    type: 'Eksternal'
  });

  // Data dummy untuk daftar proyek
  const projects = [
    { 
      id: 1, 
      name: "TOKO BANGUNAN", 
      client: "Clariva PO", 
      icon: <Building2 size={32} color="#ee1e2d" />, 
      status: "Done" 
    },
    { 
      id: 2, 
      name: "TOKO SEPEDA", 
      client: "Clariva PO", 
      icon: <Store size={32} color="#ee1e2d" />, 
      status: "In Progress" 
    },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  // Handler Simpan Proyek (Logika Dasar)
  const handleSaveProject = () => {
    console.log("Menyimpan Proyek:", newProject);
    setIsAddModalOpen(false);
    // Reset form
    setNewProject({ name: '', client: '', type: 'Eksternal' });
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
            <Info size={20} /> <span>Informasi Sistem</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <p>Copyright 2024 ScrumApps.</p>
          <p>Rights Reserved. Version 0.5.0-alpha</p>
        </div>
      </aside>

      {/* 2. AREA UTAMA */}
      <main className="scrum-main">
        <header className="scrum-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="bc-icon" style={{ backgroundColor: '#ee1e2d', color: 'white' }}>
                <Briefcase size={16} />
              </span>
              <span className="bc-text bc-active">Daftar Proyek</span>
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
                    onClick={() => {
                      navigate('/kelolaprofil');
                      setIsSettingsOpen(false);
                    }}
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

        <div className="scrum-content">
          <div className="content-header" style={{ marginBottom: '25px' }}>
            <h2>Daftar Proyek</h2>
            <p>Halaman ini berisi daftar proyek yang ada sesuai dengan hak akses dan kontribusi pengguna.</p>
          </div>

          <div className="project-grid">
            {/* CARD TAMBAH PROYEK (Trigger Modal) */}
            <div className="project-card add-new-card" onClick={() => setIsAddModalOpen(true)} style={{ cursor: 'pointer' }}>
              <div className="card-body">
                <p className="add-label">Buat Proyek Baru</p>
                <button className="btn-add">
                  <FolderPlus size={18} />
                  <span>Tambah</span>
                </button>
              </div>
            </div>

            {/* Iterasi Data Proyek dengan LINK */}
            {projects.map((project) => (
              <Link 
                to={`/projects/${project.id}`} 
                key={project.id} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="project-card data-card" style={{ cursor: 'pointer' }}>
                  <div className={`card-status-strip ${project.status === 'Done' ? 'bg-done' : 'bg-progress'}`}></div>
                  <div className="card-body">
                    <div className="client-icon-wrapper">
                      {project.icon}
                    </div>
                    <h4 className="project-title">{project.name}</h4>
                    <p className="project-client">{project.client}</p>
                    <div className="card-footer-info">
                      <span className={`status-badge ${project.status === 'Done' ? 'done' : 'progress'}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* --- MODAL TAMBAH PROYEK --- */}
      {isAddModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={modalTitleFlex}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Tambah Proyek Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={btnRawStyle}><X size={20} color="#a0aec0" /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Nama Proyek</label>
                <input 
                  type="text" 
                  placeholder="Masukkan Nama Proyek" 
                  style={inputStyle}
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                />
              </div>
              <div>
                <label style={labelStyle}>Client / PO</label>
                <input 
                  type="text" 
                  placeholder="Nama Client atau Product Owner" 
                  style={inputStyle}
                  value={newProject.client}
                  onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                />
              </div>
              <div>
                <label style={labelStyle}>Tipe Proyek</label>
                <select 
                  style={inputStyle}
                  value={newProject.type}
                  onChange={(e) => setNewProject({...newProject, type: e.target.value})}
                >
                  <option value="Eksternal">Eksternal</option>
                  <option value="Internal">Internal</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
              <button onClick={() => setIsAddModalOpen(false)} style={btnCancelStyle}>Batal</button>
              <button onClick={handleSaveProject} style={btnSaveStyle}>Simpan Proyek</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- STYLES ---

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

const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '12px',
  width: '500px',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
};

const modalTitleFlex = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '13px',
  fontWeight: '600',
  color: '#4a5568'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #edf2f7',
  backgroundColor: '#f8fafc',
  boxSizing: 'border-box',
  fontSize: '13px'
};

const btnSaveStyle = {
  backgroundColor: '#ee1e2d',
  color: 'white',
  border: 'none',
  padding: '10px 25px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600'
};

const btnCancelStyle = {
  backgroundColor: '#f7fafc',
  color: '#a0aec0',
  border: 'none',
  padding: '10px 25px',
  borderRadius: '8px',
  cursor: 'pointer'
};

const btnRawStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '5px'
};

export default ProjectList;