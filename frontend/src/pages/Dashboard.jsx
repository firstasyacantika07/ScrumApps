import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, FolderOpen, RefreshCcw, CheckCircle2, 
  AlertCircle, Zap, Star, ShieldCheck, 
  ChevronRight, Activity, ArrowRight, Clock, Package 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../api/axios';

const Dashboard = () => {
  const navigate = useNavigate();
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
            ? '/dashboard/admin_stats' 
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
    <div className="p-8 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Halo, {userData.username}! 👋</h2>
        <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-[3px]">
          Berikut ringkasan performa pengerjaan hari ini.
        </p>
      </div>

      {/* Render View Berdasarkan Role */}
      {isRole('superadmin') && <SuperAdminView stats={stats} recentProjects={recentProjects} navigate={navigate} />}
      {isRole('analyst') && <AnalystView stats={stats} pieData={pieData} navigate={navigate} userData={userData} />}
      {isRole('developer') && <DeveloperView stats={stats} recentProjects={recentProjects} navigate={navigate} />}
      {isRole('owner') && <ProjectOwnerView stats={stats} pieData={pieData} navigate={navigate} />}
    </div>
  );
};

// --- REUSABLE COMPONENTS ---
// Menambahkan prop onClick agar kartu statistik bisa diklik untuk navigasi
const StatCardModern = ({ label, value, icon, color, isDashed, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-[2rem] flex items-center gap-5 transition-all hover:shadow-lg ${onClick ? 'cursor-pointer hover:border-red-200' : ''} ${isDashed ? 'border-2 border-dashed border-slate-100' : 'border border-slate-50 shadow-sm'}`}
  >
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

const SuperAdminView = ({ stats, recentProjects, navigate }) => {
  const chartData = [
    { name: 'Hold', value: stats.hold || 0, color: '#3b82f6' },
    { name: 'In Progress', value: stats.progress || 0, color: '#f59e0b' },
    { name: 'Done', value: stats.done || 0, color: '#ee1e2d' },
    { name: 'Late', value: stats.late || 0, color: '#ef4444' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        <StatCardModern label="Total Unit" value={stats.total} icon={<Activity/>} color="#ee1e2d" isDashed />
        <StatCardModern label="Hold" value={stats.hold} icon={<FolderOpen/>} color="#3b82f6" isDashed />
        <StatCardModern label="Progress" value={stats.progress} icon={<RefreshCcw/>} color="#f59e0b" isDashed />
        <StatCardModern label="Done" value={stats.done} icon={<CheckCircle2/>} color="#ee1e2d" isDashed />
        <StatCardModern label="Late" value={stats.late} icon={<AlertCircle/>} color="#ef4444" isDashed />
        {/* Sekarang klik pada kartu Pengguna akan mengarah ke menu /users */}
        <StatCardModern 
          label="Pengguna" 
          value={stats.total_users} 
          icon={<Users/>} 
          color="#6366f1" 
          isDashed 
          onClick={() => navigate('/users')}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[3px] border-l-4 border-slate-200 pl-4">Statistik Real-Time</h3>
            <div className="flex gap-4 text-[9px] font-bold uppercase text-slate-400">
              {chartData.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                  {d.name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={100} outerRadius={135} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={10}>
                  {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-800">{stats.total}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Unit</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-black uppercase tracking-[2px] text-slate-800">Proyek Terbaru</h4>
              <button onClick={() => navigate('/projects')} className="text-[#ee1e2d] hover:bg-red-50 p-2 rounded-lg transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="space-y-4">
              {recentProjects.map((p, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-red-100 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#ee1e2d] font-bold border border-slate-100 group-hover:bg-[#ee1e2d] group-hover:text-white transition-all shadow-sm">
                      {p.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-slate-800 truncate">{p.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1 mt-1"><Clock size={10} /> {p.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#ee1e2d] p-8 rounded-[3rem] text-white shadow-2xl shadow-red-200 relative overflow-hidden group min-h-[200px] flex flex-col justify-center">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <p className="text-[9px] font-black uppercase tracking-[2px] opacity-70 mb-2">Upgrade</p>
              <h3 className="text-xl font-black leading-tight mb-6">Panduan<br />Penggunaan</h3>
              <button className="flex items-center gap-2 px-5 py-3 bg-white text-[#ee1e2d] rounded-xl text-[9px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95">
                Dokumentasi <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalystView = ({ stats, pieData, navigate, userData }) => {
  const saasPlans = {
    FREE: { name: "FREE", icon: <Zap size={14} />, color: "text-slate-500 bg-slate-100", features: ["1 Proyek", "Maks 5 Orang"] },
    PRO: { name: "PRO", icon: <Star size={14} />, color: "text-amber-600 bg-amber-50", features: ["15 Proyek", "Maks 25 Orang"] },
    ENTERPRISE: { name: "ENTERPRISE", icon: <ShieldCheck size={14} />, color: "text-[#ee1e2d] bg-red-50", features: ["Unlimited", "Priority Support"] }
  };
  const currentPlan = saasPlans[userData?.plan_type?.toUpperCase()] || saasPlans.FREE;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div 
        onClick={() => navigate('/settings/billing')}
        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 cursor-pointer hover:border-[#ee1e2d]/30 hover:shadow-md transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${currentPlan.color}`}> {currentPlan.icon} </div>
          <div>
            <h4 className="text-[11px] font-black text-slate-700 uppercase flex items-center gap-2">
                Paket {currentPlan.name} Aktif
                <ChevronRight size={12} className="text-slate-300 group-hover:text-[#ee1e2d]" />
            </h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Klik untuk detail atau upgrade</p>
          </div>
        </div>
        <div className="flex gap-2">
          {currentPlan.features.map((f, i) => (
            <span key={i} className="text-[9px] font-black px-3 py-1.5 bg-slate-50 text-slate-400 rounded-xl uppercase border border-slate-100 group-hover:bg-white">{f}</span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCardModern label="SaaS Projects" value={stats.total} icon={<Package/>} color="#ee1e2d" />
        <StatCardModern label="On Progress" value={stats.progress} icon={<RefreshCcw/>} color="#f59e0b" isDashed />
        <StatCardModern label="Done" value={stats.done} icon={<CheckCircle2/>} color="#ee1e2d" isDashed />
        <StatCardModern label="Market Hold" value={stats.hold} icon={<FolderOpen/>} color="#64748b" isDashed />
      </div>
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-10">Analisis Distribusi</h3>
        <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie data={pieData} innerRadius={80} outerRadius={110} dataKey="value" stroke="none">
                {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
            </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const DeveloperView = ({ stats, recentProjects, navigate }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <StatCardModern label="Proyek" value={stats.total} icon={<Package/>} color="#3b82f6" />
      <StatCardModern label="Hold" value={stats.hold} icon={<FolderOpen/>} color="#64748b" isDashed />
      <StatCardModern label="Progress" value={stats.progress} icon={<RefreshCcw/>} color="#f59e0b" isDashed />
      <StatCardModern label="Done" value={stats.done} icon={<CheckCircle2/>} color="#ee1e2d" isDashed />
      <StatCardModern label="Late" value={stats.late} icon={<AlertCircle/>} color="#ef4444" isDashed />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[400px]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">Daftar Pengerjaan Terbaru</h3>
          <button onClick={() => navigate('/projects')} className="text-[10px] font-black text-[#ee1e2d] uppercase">Lihat Semua</button>
        </div>
        <div className="space-y-4">
          {recentProjects.map((p, i) => (
             <div key={i} className="flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 group hover:border-red-100 transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-[#ee1e2d] font-black group-hover:bg-[#ee1e2d] group-hover:text-white transition-all">{p.name?.charAt(0).toUpperCase()}</div>
                   <div>
                     <p className="text-sm font-black text-slate-800">{p.name}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-wider">{p.status}</p>
                   </div>
                </div>
                <button onClick={() => navigate(`/projects/${p.id}`)} className="p-2 bg-white rounded-lg text-slate-300 hover:text-[#ee1e2d] transition-all"><ArrowRight size={16} /></button>
             </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ProjectOwnerView = ({ stats, pieData, navigate }) => (
  <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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