import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, Info, 
  Settings, LogOut, Layers3, Bell, User,
  Package, FolderOpen, RefreshCcw, CheckCircle2, AlertCircle, Search 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../api/axios';
import './css/Projectlist.css'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State untuk data dari Database
  const [stats, setStats] = useState({ total: 0, hold: 0, progress: 0, done: 0, late: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // 1. Ambil data user dari localStorage
    const loggedInUser = localStorage.getItem('user');
    
    if (!loggedInUser) {
      navigate('/login');
      return;
    }

    // Parsing data user dengan aman
    try {
      const user = JSON.parse(loggedInUser);
      setUserData(user);
    } catch (e) {
      console.error("Gagal parsing user data");
      navigate('/login');
      return;
    }

    // 2. Definisikan fungsi fetch TERLEBIH DAHULU
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, projectsRes] = await Promise.all([
          api.get('/projects/stats'),
          api.get('/projects')
        ]);
        
        setStats(statsRes.data || { total: 0, hold: 0, progress: 0, done: 0, late: 0 });
        setRecentProjects(projectsRes.data ? projectsRes.data.slice(0, 2) : []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    // 3. Panggil fungsi SETELAH didefinisikan
    fetchDashboardData();

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Konfigurasi Pie Chart
  const pieData = [
    { name: 'HOLD', value: stats.hold || 0, color: '#A0AEC0' },
    { name: 'IN PROGRESS', value: stats.progress || 0, color: '#F6AD55' },
    { name: 'DONE', value: stats.done || 0, color: '#68D391' },
    { name: 'LATE', value: stats.late || 0, color: '#FC8181' },
  ];

  // Cegah layar putih: Tampilkan loading jika data user belum siap
  if (!userData) {
    return <div className="loading-screen">Mengautentikasi...</div>;
  }

  return (
    <div className="scrumapps-wrapper">
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
          <div className="sidebar-profile">
            <img src={`https://ui-avatars.com/api/?name=${userData?.username || 'User'}&background=ee1e2d&color=fff`} alt="User" />
            <div className="profile-info">
              <p className="p-name">{userData?.username || 'Guest'}</p>
              <p className="p-role">{userData?.role || 'User'}</p>
            </div>
          </div>
          <div className="sidebar-footer">
            <p>© 2026 <strong>ScrumApps</strong>.</p>
          </div>
        </div>
      </aside>

      <main className="scrum-main">
        <header className="scrum-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="bc-icon-red"><LayoutDashboard size={16} /></span>
              <span className="bc-text bc-active">Dashboard</span>
            </div>
            <form className="header-search-form">
              <Search size={18} color="#a0aec0" className="search-icon" />
              <input 
                type="text" 
                placeholder="Cari proyek..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          
          <div className="header-right">
            <div className="admin-profile-section">
              <div className="text-right">
                {/* Gunakan optional chaining agar tidak crash jika username null */}
                <p className="admin-name">Halo, {userData?.username?.split(' ')[0] || 'User'}!</p>
                <p className="admin-email">{userData?.email || ''}</p>
              </div>
              <div className="admin-avatar">
                <img src={`https://ui-avatars.com/api/?name=${userData?.username || 'User'}&background=ee1e2d&color=fff`} alt="avatar" />
              </div>
            </div>
            <Bell size={20} color="#a0aec0" className="cursor-pointer" />
            <div className="settings-wrapper">
              <Settings size={20} color="#a0aec0" className="cursor-pointer" onClick={() => setIsSettingsOpen(!isSettingsOpen)} />
              {isSettingsOpen && (
                <div className="dropdown-menu-custom">
                  <div onClick={() => navigate('/kelolaprofil')} className="dropdown-item">
                    <User size={16} /> Profil
                  </div>
                  <div className="dropdown-divider"></div>
                  <div onClick={handleLogout} className="dropdown-item text-red">
                    <LogOut size={16} /> Keluar
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="scrum-content">
          <div className="dashboard-stats-grid">
            <StatCardSmall label="Total Proyek" value={stats.total} icon={<Package size={22}/>} borderColor="#3182CE" />
            <StatCardSmall label="Hold" value={stats.hold} icon={<FolderOpen size={22}/>} borderColor="#718096" />
            <StatCardSmall label="In Progress" value={stats.progress} icon={<RefreshCcw size={22}/>} borderColor="#D69E2E" />
            <StatCardSmall label="Done" value={stats.done} icon={<CheckCircle2 size={22}/>} borderColor="#38A169" />
            <StatCardSmall label="Late" value={stats.late || 0} icon={<AlertCircle size={22}/>} borderColor="#E53E3E" />
          </div>

          <div className="dashboard-main-layout">
            <div className="chart-container-card">
              <h3 className="chart-title">Status Proyek Real-time</h3>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="custom-legend">
                {pieData.map((item) => (
                  <div key={item.name} className="legend-item">
                    <span className="dot" style={{ backgroundColor: item.color }}></span>
                    <span>{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="info-illustration-card">
              <div className="info-header">
                <h3 className="info-title">ScrumApps Productivity</h3>
                <span className="badge-new">v1.0</span>
              </div>
              <div className="illustration-wrapper">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/business-task-management-4487339-3723237.png" alt="Scrum" />
              </div>
              <p className="info-text">Monitoring progres tim Informatics Engineering secara real-time.</p>
            </div>
          </div>

          <div className="recent-projects-section">
            <div className="section-header">
               <h3 className="section-title">Proyek Terbaru</h3>
               <button className="btn-text-only" onClick={() => navigate('/projects')}>Lihat Semua</button>
            </div>
            <div className="recent-grid">
              {recentProjects.length > 0 ? recentProjects.map((p) => (
                <ProjectMiniCard 
                  key={p.id} 
                  title={p.project_name} 
                  status={p.project_status} 
                  icon={p.project_status === 'Done' ? '✅' : '📁'} 
                  onClick={() => navigate(`/projects/${p.id}`)} 
                />
              )) : (
                <p className="text-gray-400">Belum ada proyek terbaru.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCardSmall = ({ label, value, icon, borderColor }) => (
  <div className="stat-card-small" style={{ borderLeft: `4px solid ${borderColor}` }}>
    <div className="stat-content">
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
    <div className="stat-icon" style={{ backgroundColor: `${borderColor}20`, color: borderColor }}>{icon}</div>
  </div>
);

const ProjectMiniCard = ({ title, status, icon, onClick }) => (
  <div className="mini-project-card" onClick={onClick}>
    <div className="mini-card-left">
      <span className="mini-icon-circle">{icon}</span>
      <div>
        <h4>{title}</h4>
        <p className="status-text">{status}</p>
      </div>
    </div>
    <div className="mini-card-arrow">→</div>
  </div>
);

export default Dashboard;