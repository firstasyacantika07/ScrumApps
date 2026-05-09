import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, Info, 
  Settings, LogOut, Layers3, Bell, User,
  Package, FolderOpen, RefreshCcw, CheckCircle2, 
  AlertCircle, Zap, Star, ShieldCheck, 
  ChevronRight, Activity, Database
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../api/axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
          const statsEndpoint = (roleLower.includes('admin') || roleLower.includes('superadmin')) 
            ? '/dashboard/admin-stats' 
            : '/projects/stats';
          
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

  if (!userData || loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
      <div className="w-10 h-10 border-4 border-slate-100 border-t-[#ee1e2d] rounded-full animate-spin"></div>
    </div>
  );

  const isRole = (targetRole) => userData.role?.toLowerCase().includes(targetRole.toLowerCase());

  const pieData = [
    { name: 'HOLD', value: stats.hold || 0, color: '#3b82f6' },
    { name: 'IN PROGRESS', value: stats.progress || 0, color: '#f59e0b' },
    { name: 'DONE', value: stats.done || 0, color: '#ee1e2d' },
    { name: 'LATE', value: stats.late || 0, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans antialiased overflow-hidden">
      
      {/* SIDEBAR FIXED */}
      <aside className="w-[260px] bg-[#1b1b28] text-slate-300 flex flex-col fixed inset-y-0 left-0 z-50 shadow-xl">
        <div className="h-20 flex items-center gap-3 px-6 border-b border-white/5">
          <div className="w-9 h-9 bg-[#ee1e2d] rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-950/20">
            <Layers3 size={20} strokeWidth={2.5}/>
          </div>
          <span className="text-xl font-black text-white tracking-tight">ScrumApps</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-[#ee1e2d] text-white shadow-lg' : 'hover:bg-white/5'}`}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-[#ee1e2d] text-white shadow-lg' : 'hover:bg-white/5'}`}>
            <Briefcase size={20} /> <span>Proyek</span>
          </NavLink>
          {(isRole('admin') || isRole('superadmin')) && (
            <NavLink to="/users" className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-[#ee1e2d] text-white shadow-lg' : 'hover:bg-white/5'}`}>
              <Users size={20} /> <span>Pengguna</span>
            </NavLink>
          )}
          <NavLink to="/info" className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-[#ee1e2d] text-white shadow-lg' : 'hover:bg-white/5'}`}>
            <Info size={20} /> <span>Sistem</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
             <img src={`https://ui-avatars.com/api/?name=${userData.username}&background=ee1e2d&color=fff`} className="w-10 h-10 rounded-full border border-white/10" alt="User" />
             <div className="overflow-hidden">
                <p className="text-sm font-black text-white leading-none truncate">{userData.username}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-wider">{userData.role}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-[260px] flex flex-col h-screen overflow-y-auto">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#ee1e2d] rounded-xl text-white shadow-lg">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 leading-none">Console Management</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{userData.role} Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 relative">
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl relative transition-colors">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="relative">
              <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="flex items-center gap-2.5 p-1 pr-3 bg-slate-50 rounded-full border border-slate-100 hover:border-red-100 transition-all">
                <img src={`https://ui-avatars.com/api/?name=${userData.username}&background=ee1e2d&color=fff`} className="w-8 h-8 rounded-full shadow-sm" alt="Avatar" />
                <ChevronRight size={16} className={`text-slate-400 transition-transform ${isSettingsOpen ? 'rotate-90' : ''}`} />
              </button>
              {isSettingsOpen && (
                <div className="absolute top-12 right-0 w-48 bg-white p-2 rounded-2xl shadow-xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2">
                  <button onClick={() => navigate('/kelolaprofil')} className="w-full flex items-center gap-2.5 p-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl">
                    <User size={16}/> Profil Saya
                  </button>
                  <button onClick={() => {localStorage.clear(); navigate('/login');}} className="w-full flex items-center gap-2.5 p-2.5 text-xs font-black text-[#ee1e2d] hover:bg-red-50 rounded-xl mt-1 transition-all">
                    <LogOut size={16}/> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 p-8">
          {isRole('superadmin') && <SuperAdminView stats={stats} />}
          {isRole('analyst') && <AnalystView stats={stats} pieData={pieData} navigate={navigate} userData={userData} />}
          {isRole('developer') && <DeveloperView stats={stats} recentProjects={recentProjects} navigate={navigate} />}
          {isRole('owner') && <ProjectOwnerView stats={stats} pieData={pieData} navigate={navigate} />}
        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS (STAT CARDS) ---
const StatCardModern = ({ label, value, icon, color, isDashed }) => (
  <div className={`bg-white p-6 rounded-[2rem] flex items-center gap-5 transition-all hover:shadow-lg ${isDashed ? 'border-2 border-dashed border-slate-100' : 'border border-slate-50 shadow-sm'}`}>
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 flex-shrink-0" style={{ borderColor: color + '15', color: color, backgroundColor: color + '05' }}>
      {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
    </div>
    <div>
      <div className="text-3xl font-black text-slate-800 leading-none">{value}</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-wider leading-none">{label}</div>
    </div>
  </div>
);

// --- VIEW COMPONENTS ---

const SuperAdminView = ({ stats }) => (
  <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCardModern label="Hold" value={stats.hold} icon={<FolderOpen/>} color="#64748b" isDashed />
      <StatCardModern label="Progress" value={stats.progress} icon={<RefreshCcw/>} color="#f59e0b" isDashed />
      <StatCardModern label="Done" value={stats.done} icon={<CheckCircle2/>} color="#ee1e2d" isDashed />
      <StatCardModern label="Late" value={stats.late} icon={<AlertCircle/>} color="#ef4444" isDashed />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[400px] flex flex-col">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[3px] mb-8 border-l-4 border-slate-200 pl-4">Monitoring Aktivitas Sistem</h3>
        <div className="flex-1 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 text-center">
           <Activity size={40} className="text-slate-200 animate-pulse" />
           <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest leading-relaxed">Infrastruktur berjalan normal. Log akan muncul secara real-time.</p>
        </div>
      </div>

      <div className="lg:col-span-4 bg-[#1b1b28] p-10 rounded-[2.5rem] text-white shadow-2xl flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1.5 h-6 bg-[#ee1e2d] rounded-full"></div>
          <h4 className="text-xs font-black uppercase tracking-[3px] text-white/80">Kontrol Panel</h4>
        </div>
        <div className="space-y-4 mt-auto">
            <button className="w-full flex items-center justify-center gap-3 py-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                <Settings size={18} className="text-slate-500" /> Kelola Konfigurasi
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-5 bg-[#ee1e2d] hover:bg-red-600 rounded-2xl text-[11px] font-black uppercase shadow-lg shadow-red-900/40 tracking-widest transition-all">
                <Database size={18} /> Backup Data Sistem
            </button>
        </div>
        <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/5">
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Terakhir Backup:</p>
           <p className="text-xs font-black text-white/70">09 Mei 2026 - 20:15 WIB</p>
        </div>
      </div>
    </div>
  </div>
);

const AnalystView = ({ stats, pieData, navigate, userData }) => {
  const saasPlans = {
    FREE: { name: "FREE", icon: <Zap size={14} />, color: "text-slate-500 bg-slate-100", features: ["1 Proyek", "Maks 5 Orang"] },
    PRO: { name: "PRO", icon: <Star size={14} />, color: "text-amber-600 bg-amber-50", features: ["15 Proyek", "Maks 25 Orang"] },
    ENTERPRISE: { name: "ENTERPRISE", icon: <ShieldCheck size={14} />, color: "text-[#ee1e2d] bg-red-50", features: ["Unlimited", "Priority Support"] }
  };
  const currentPlan = saasPlans[userData?.plan_type] || saasPlans.FREE;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${currentPlan.color}`}> {currentPlan.icon} </div>
          <div>
            <h4 className="text-[11px] font-black text-slate-700 uppercase">Paket {currentPlan.name} Aktif</h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Analisis Skalabilitas SaaS</p>
          </div>
        </div>
        <div className="flex gap-2">
          {currentPlan.features.map((f, i) => (
            <span key={i} className="text-[9px] font-black px-3 py-1.5 bg-slate-50 text-slate-400 rounded-xl uppercase border border-slate-100">{f}</span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCardModern label="SaaS Projects" value={stats.total} icon={<Package/>} color="#ee1e2d" />
        <StatCardModern label="On Progress" value={stats.progress} icon={<RefreshCcw/>} color="#f59e0b" isDashed />
        <StatCardModern label="Done" value={stats.done} icon={<CheckCircle2/>} color="#ee1e2d" isDashed />
        <StatCardModern label="Market Hold" value={stats.hold} icon={<FolderOpen/>} color="#64748b" isDashed />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-10">Statistik Distribusi</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={105} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={8}>
                  {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[2.5rem] text-white shadow-2xl flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase opacity-60 tracking-widest mb-2">Upgrade?</p>
                <h4 className="text-2xl font-black leading-tight uppercase">Beralih ke<br/>Enterprise</h4>
                <button onClick={() => navigate('/pricing')} className="mt-8 bg-[#ee1e2d] text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase shadow-lg shadow-red-900/40">UPGRADE NOW</button>
            </div>
            <Zap className="absolute -right-6 -bottom-6 w-40 h-40 text-white/5 -rotate-12" />
        </div>
      </div>
    </div>
  );
};

const DeveloperView = ({ stats, recentProjects, navigate }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <StatCardModern label="Proyek" value={stats.total} icon={<Package/>} color="#3b82f6" />
      <StatCardModern label="Hold" value={stats.hold} icon={<FolderOpen/>} color="#64748b" isDashed />
      <StatCardModern label="Progress" value={stats.progress} icon={<RefreshCcw/>} color="#f59e0b" isDashed />
      <StatCardModern label="Done" value={stats.done} icon={<CheckCircle2/>} color="#ee1e2d" isDashed />
      <StatCardModern label="Late" value={stats.late} icon={<AlertCircle/>} color="#ef4444" isDashed />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[300px]">
        <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-8">Status Pengerjaan</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={[{name:'P', value:stats.progress, color:'#f59e0b'}, {name:'D', value:stats.done, color:'#ee1e2d'}]} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
              {(entry, index) => <Cell fill={entry.color} />}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Pantau Backlog Anda secara Real-time.</p>
      </div>
    </div>
  </div>
);

const ProjectOwnerView = ({ stats, pieData, navigate }) => (
  <div className="flex flex-col gap-8 animate-in fade-in duration-700">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCardModern label="Hold" value={stats.hold} icon={<FolderOpen/>} color="#64748b" />
      <StatCardModern label="Progress" value={stats.progress} icon={<RefreshCcw/>} color="#f59e0b" isDashed />
      <StatCardModern label="Done" value={stats.done} icon={<CheckCircle2/>} color="#ee1e2d" isDashed />
      <StatCardModern label="Late" value={stats.late} icon={<AlertCircle/>} color="#ef4444" isDashed />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-10">Pemantauan Target</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} innerRadius={80} outerRadius={110} dataKey="value" stroke="none">
              {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom"/>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="lg:col-span-4 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="bg-red-50 p-6 rounded-[2rem] mb-8"><ShieldCheck size={48} className="text-[#ee1e2d]" /></div>
        <h3 className="text-base font-black text-slate-800 uppercase mb-4 tracking-tight">Otoritas Owner</h3>
        <button onClick={() => navigate('/projects')} className="w-full py-5 bg-[#1b1b28] text-white rounded-2xl text-[11px] font-black uppercase tracking-[2px]">Buka Proyek</button>
      </div>
    </div>
  </div>
);

export default Dashboard;