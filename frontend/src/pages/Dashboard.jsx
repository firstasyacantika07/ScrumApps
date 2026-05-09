import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, Info, 
  Settings, LogOut, Layers3, Bell, User,
  Package, FolderOpen, RefreshCcw, CheckCircle2, AlertCircle, Search 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../api/axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ total: 0, hold: 0, progress: 0, done: 0, late: 0, total_users: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) { navigate('/login'); return; }

    try {
      const user = JSON.parse(loggedInUser);
      setUserData(user);

      const fetchDashboardData = async () => {
        try {
          setLoading(true);
          const roleLower = user.role?.toLowerCase() || '';
          const statsEndpoint = roleLower.includes('admin') ? '/dashboard/admin-stats' : '/projects/stats';
          
          const [statsRes, projectsRes] = await Promise.all([
            api.get(statsEndpoint),
            api.get('/projects')
          ]);
          
          setStats(statsRes.data || { total: 0, hold: 0, progress: 0, done: 0, late: 0, total_users: 0 });
          
          const projectList = projectsRes.data?.data || projectsRes.data || [];
          setRecentProjects(projectList.slice(0, 3)); 
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardData();
    } catch (e) { navigate('/login'); }
  }, [navigate]);

  const pieData = [
    { name: 'HOLD', value: stats.hold || 0, color: '#A0AEC0' },
    { name: 'IN PROGRESS', value: stats.progress || 0, color: '#F6AD55' },
    { name: 'DONE', value: stats.done || 0, color: '#68D391' },
    { name: 'LATE', value: stats.late || 0, color: '#FC8181' },
  ];

  if (!userData || loading) return <div className="loading-screen">Memuat Dashboard...</div>;

  const isRole = (targetRole) => userData.role?.toLowerCase().includes(targetRole.toLowerCase());

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
          {isRole('admin') && (
            <NavLink to="/users" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <Users size={20} /> <span>Pengguna</span>
            </NavLink>
          )}
          <NavLink to="/info" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Info size={20} /> <span>Sistem</span>
          </NavLink>
        </nav>

        <div className="sidebar-bottom-section">
          <div className="sidebar-profile">
            <div className="admin-avatar">
               <img src={`https://ui-avatars.com/api/?name=${userData.username}&background=ee1e2d&color=fff`} alt="User" />
            </div>
            <div className="profile-info">
              <p className="p-name">{userData.username}</p>
              <p className="p-role">{userData.role}</p>
            </div>
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
          </div>
          
          <div className="header-right">
            <div className="settings-wrapper">
              <Settings className="cursor-pointer" onClick={() => setIsSettingsOpen(!isSettingsOpen)} />
              {isSettingsOpen && (
                <div className="dropdown-menu-custom">
                  <div onClick={() => navigate('/kelolaprofil')} className="dropdown-item"><User size={16}/> Profil</div>
                  <div className="dropdown-item text-red" onClick={() => {localStorage.clear(); navigate('/login');}}><LogOut size={16}/> Keluar</div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="scrum-content">
          {isRole('admin') && <SuperAdminView stats={stats} />}

          {isRole('analyst') && (
            <AnalystView stats={stats} pieData={pieData} navigate={navigate} />
          )}

          {isRole('developer') && (
            <DeveloperView stats={stats} recentProjects={recentProjects} navigate={navigate} />
          )}

          {/* New Project Owner View Integration */}
          {isRole('owner') && (
            <ProjectOwnerView stats={stats} pieData={pieData} navigate={navigate} />
          )}
        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SuperAdminView = ({ stats }) => (
  <div className="fade-in">
    <div className="dashboard-stats-grid">
      <StatCardSmall label="Total Pengguna" value={stats.total_users || 0} icon={<Users/>} borderColor="#3182CE" />
      <StatCardSmall label="Admin Sistem" value="1" icon={<Settings/>} borderColor="#38A169" />
      <StatCardSmall label="Keamanan" value="Aktif" icon={<CheckCircle2/>} borderColor="#718096" />
    </div>
    <div className="info-illustration-card saas-card">
      <h3>System Overview</h3>
      <p>Kelola infrastruktur SaaS ScrumApps dan kendalikan akses seluruh pengguna dari panel ini.</p>
    </div>
  </div>
);

const AnalystView = ({ stats, pieData, navigate }) => (
  <div className="fade-in">
    <div className="dashboard-stats-grid">
      <StatCardSmall label="SaaS Projects" value={stats.total} icon={<Package/>} borderColor="#3182CE" />
      <StatCardSmall label="Market Hold" value={stats.hold} icon={<FolderOpen/>} borderColor="#718096" />
    </div>
    <div className="dashboard-main-layout responsive-stack">
      <div className="chart-container-card">
        <h3 className="chart-title">Analisis Skalabilitas SaaS</h3>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="info-illustration-card saas-info">
        <h3>SaaS Insight</h3>
        <p>Gunakan data distribusi ini untuk menentukan fitur prioritas pada sprint berikutnya guna meningkatkan retensi pengguna platform.</p>
        <button className="btn-primary" onClick={() => navigate('/projects')}>Detail Analisis</button>
      </div>
    </div>
  </div>
);

const DeveloperView = ({ stats, recentProjects, navigate }) => {
  const pieDataDev = [
    { name: 'HOLD', value: stats.hold || 0, color: '#A0AEC0' },
    { name: 'IN PROGRESS', value: stats.progress || 0, color: '#F6AD55' },
    { name: 'DONE', value: stats.done || 0, color: '#48BB78' },
    { name: 'LATE', value: stats.late || 0, color: '#F56565' },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCardDashed label="Total Proyek" value={stats.total} color="blue" icon={<Package size={24}/>} />
        <StatCardDashed label="Hold" value={stats.hold} color="gray" icon={<FolderOpen size={24}/>} />
        <StatCardDashed label="In Progress" value={stats.progress} color="orange" icon={<RefreshCcw size={24}/>} />
        <StatCardDashed label="Done" value={stats.done} color="green" icon={<CheckCircle2 size={24}/>} />
        <StatCardDashed label="Late" value={stats.late} color="red" icon={<AlertCircle size={24}/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Pie Chart Proyek</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieDataDev} cx="50%" cy="50%" outerRadius={100} dataKey="value">
                  {pieDataDev.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-[11px] font-bold text-gray-500">
            {pieDataDev.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ backgroundColor: item.color }}></div>
                <span>{item.name} {((item.value / (stats.total || 1)) * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
          <h3 className="text-lg font-bold text-gray-800 text-left mb-4">ScrumApps</h3>
          <div className="flex flex-col items-center">
            <img 
              src="https://img.freepik.com/free-vector/scrum-method-concept-illustration_114360-10025.jpg" 
              alt="Scrum Illustration" 
              className="w-44 mb-6"
            />
            <p className="text-[12px] text-gray-500 leading-relaxed text-justify">
              ScrumApps adalah aplikasi manajemen proyek yang dirancang khusus untuk tim yang menggunakan framework Scrum.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Proyek Terbaru</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {recentProjects.length > 0 ? recentProjects.map(p => (
            <ProjectMiniCard 
              key={p.id} 
              title={p.name} 
              status={p.status} 
              icon="💻" 
              onClick={() => navigate(`/projects/${p.id}`)} 
            />
          )) : <p className="text-gray-400 text-sm">Tidak ada proyek aktif.</p>}
        </div>
        <button 
          onClick={() => navigate('/projects')}
          className="px-5 py-2 border border-red-300 text-red-500 text-sm font-bold rounded-lg hover:bg-red-50 transition-all border-dashed"
        >
          Lihat Lebih Lengkap
        </button>
      </div>
    </div>
  );
};

// --- NEW COMPONENT: PROJECT OWNER VIEW ---
const ProjectOwnerView = ({ stats, pieData, navigate }) => (
  <div className="fade-in space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCardSmall label="Hold" value={stats.hold} icon={<FolderOpen/>} borderColor="#A0AEC0" />
      <StatCardSmall label="In Progress" value={stats.progress} icon={<RefreshCcw/>} borderColor="#F6AD55" />
      <StatCardSmall label="Done" value={stats.done} icon={<CheckCircle2/>} borderColor="#68D391" />
      <StatCardSmall label="Late" value={stats.late} icon={<AlertCircle/>} borderColor="#FC8181" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Statistik Proyek</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={pieData} 
                cx="50%" 
                cy="50%" 
                innerRadius={70} 
                outerRadius={90} 
                paddingAngle={8} 
                dataKey="value"
              >
                {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col justify-center items-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">ScrumApps</h3>
        <img 
          src="https://img.freepik.com/free-vector/scrum-method-concept-illustration_114360-10025.jpg" 
          alt="Scrum Illustration" 
          className="w-40 mb-6"
        />
        <p className="text-sm text-gray-500 leading-relaxed px-4 mb-6 text-justify">
          Sebagai Project Owner, Anda dapat memantau efisiensi tim dan memastikan setiap sprint berjalan sesuai jadwal untuk mencapai target produk secara maksimal.
        </p>
        <button 
          className="w-full py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
          onClick={() => navigate('/projects')}
        >
          Pantau Semua Proyek
        </button>
      </div>
    </div>
  </div>
);

// --- SHARED UI COMPONENTS ---

const StatCardDashed = ({ label, value, color, icon }) => {
  const styles = {
    blue: "border-blue-300 text-blue-500 bg-blue-50",
    gray: "border-gray-300 text-gray-500 bg-gray-50",
    orange: "border-orange-300 text-orange-500 bg-orange-50",
    green: "border-green-300 text-green-500 bg-green-50",
    red: "border-red-300 text-red-500 bg-red-50"
  };

  return (
    <div className={`p-4 rounded-xl border-2 border-dashed bg-white flex items-center justify-between ${styles[color]?.split(' ')[0]}`}>
      <div>
        <p className={`text-2xl font-bold ${styles[color]?.split(' ')[1]}`}>{value || 0}</p>
        <p className="text-[11px] font-bold text-gray-400 uppercase">{label}</p>
      </div>
      <div className={`p-3 rounded-2xl ${styles[color]?.split(' ')[2]} ${styles[color]?.split(' ')[1]}`}>
        {icon}
      </div>
    </div>
  );
};

const StatCardSmall = ({ label, value, icon, borderColor }) => (
  <div className="stat-card-small" style={{ borderLeft: `5px solid ${borderColor}` }}>
    <div className="stat-content">
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
    <div className="stat-icon" style={{ color: borderColor }}>{icon}</div>
  </div>
);

const ProjectMiniCard = ({ title, status, icon, onClick }) => (
  <div className="mini-project-card" onClick={onClick} style={{ cursor: 'pointer' }}>
    <div className="mini-card-left">
      <span className="mini-icon-circle">{icon}</span>
      <div>
        <h4>{title}</h4>
        <p className={`status-pill ${status?.toLowerCase()}`}>{status}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;