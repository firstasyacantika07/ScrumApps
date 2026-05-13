import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderOpen, RefreshCcw, CheckCircle2, 
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
    const fetchInitialData = async () => {
      const loggedInUser = localStorage.getItem('user');
      if (!loggedInUser) {
        navigate('/login');
        return;
      }

      try {
        const user = JSON.parse(loggedInUser);
        setUserData(user);

        setLoading(true);
        const roleLower = user.role?.toString().toLowerCase() || '';
        
        // Memastikan endpoint sesuai dengan role
        const statsEndpoint = (roleLower.includes('admin') || roleLower.includes('owner')) 
          ? '/dashboard/admin-stats' 
          : '/projects/stats';
        
        const [statsRes, projectsRes] = await Promise.all([
          api.get(statsEndpoint).catch(() => ({ data: null })),
          api.get('/projects').catch(() => ({ data: [] }))
        ]);
        
        if (statsRes?.data) {
          setStats({
            total: Number(statsRes.data.total) || 0,
            hold: Number(statsRes.data.hold) || 0,
            progress: Number(statsRes.data.progress) || 0,
            done: Number(statsRes.data.done) || 0,
            late: Number(statsRes.data.late) || 0,
            total_users: Number(statsRes.data.total_users) || 0
          });
        }
        
        const projectList = projectsRes.data?.data || projectsRes.data || [];
        setRecentProjects(Array.isArray(projectList) ? projectList.slice(0, 3) : []); 

      } catch (error) {
        console.error("Dashboard Data Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [navigate]);

  if (!userData || loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
      <div className="w-10 h-10 border-4 border-slate-100 border-t-[#ee1e2d] rounded-full animate-spin"></div>
    </div>
  );

  const isRole = (target) => userData.role?.toString().toLowerCase().includes(target.toLowerCase());

  const pieData = [
    { name: 'HOLD', value: stats.hold, color: '#3b82f6' },
    { name: 'IN PROGRESS', value: stats.progress, color: '#f59e0b' },
    { name: 'DONE', value: stats.done, color: '#ee1e2d' },
    { name: 'LATE', value: stats.late, color: '#ef4444' },
  ].filter(item => item.value > 0);

  return (
    <div className="p-8 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          Halo, {userData.name || userData.username || 'User'}! 👋
        </h2>
        <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-[3px]">
          Berikut ringkasan performa pengerjaan secara real-time.
        </p>
      </div>

      {/* View dibedakan berdasarkan Role */}
      {isRole('superadmin') && <SuperAdminView stats={stats} recentProjects={recentProjects} navigate={navigate} />}
      {isRole('analyst') && <AnalystView stats={stats} navigate={navigate} userData={userData} />}
      {isRole('developer') && <DeveloperView stats={stats} recentProjects={recentProjects} navigate={navigate} />}
      {isRole('owner') && <ProjectOwnerView stats={stats} pieData={pieData} navigate={navigate} />}
    </div>
  );
};

// Reusable Stat Card
const StatCardModern = ({ label, value, icon, color, isDashed }) => (
  <div className={`bg-white p-6 rounded-[2rem] flex items-center gap-5 transition-all shadow-sm border border-slate-50 ${isDashed ? 'border-2 border-dashed border-slate-100' : ''}`}>
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 flex-shrink-0" style={{ borderColor: color + '15', color: color, backgroundColor: color + '05' }}>
      {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
    </div>
    <div>
      <div className="text-3xl font-black text-slate-800 leading-none">{value ?? 0}</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-wider leading-none">{label}</div>
    </div>
  </div>
);

// --- VIEW: SUPERADMIN ---
const SuperAdminView = ({ stats, recentProjects, navigate }) => {
  const chartData = [
    { name: 'Hold', value: stats.hold, color: '#3b82f6' },
    { name: 'In Progress', value: stats.progress, color: '#f59e0b' },
    { name: 'Done', value: stats.done, color: '#ee1e2d' },
    { name: 'Late', value: stats.late, color: '#ef4444' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* 5 Kartu Statistik Utama (Tanpa Kartu Pengguna karena sudah ada di Sidebar) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCardModern label="Total Unit" value={stats.total} icon={<Activity/>} color="#ee1e2d" isDashed />
        <StatCardModern label="Hold" value={stats.hold} icon={<FolderOpen/>} color="#3b82f6" isDashed />
        <StatCardModern label="Progress" value={stats.progress} icon={<RefreshCcw/>} color="#f59e0b" isDashed />
        <StatCardModern label="Done" value={stats.done} icon={<CheckCircle2/>} color="#ee1e2d" isDashed />
        <StatCardModern label="Late" value={stats.late} icon={<AlertCircle/>} color="#ef4444" isDashed />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart Area */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[500px] flex flex-col">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[3px] border-l-4 border-slate-200 pl-4 mb-8">Statistik Proyek</h3>
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Unit<br/>Pengerjaan</span>
            </div>
          </div>
        </div>

        {/* Sidebar Dashboard: Proyek & SaaS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Recent Projects */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-black uppercase tracking-[2px] text-slate-800">Proyek Terbaru</h4>
              <button onClick={() => navigate('/projects')} className="text-[#ee1e2d] hover:bg-red-50 p-2 rounded-lg transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="space-y-4">
              {recentProjects.map((p, i) => (
                <div key={i} onClick={() => navigate(`/projects/${p.id}`)} className="p-4 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-white transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#ee1e2d] font-bold border border-slate-100 group-hover:bg-[#ee1e2d] group-hover:text-white transition-all">
                      {p.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-slate-800 truncate">{p.name || 'Proyek'}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1 mt-1"><Clock size={10} /> {p.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SaaS Plan (Tetap di Dashboard sesuai request sebelumnya) */}
          <div className="bg-[#ee1e2d] p-8 rounded-[3rem] text-white shadow-2xl shadow-red-200 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <p className="text-[9px] font-black uppercase tracking-[2px] opacity-70 mb-2">Layanan Kami</p>
              <h3 className="text-xl font-black leading-tight mb-6">Paket SaaS &<br />Pricing Plan</h3>
              <button 
                onClick={() => navigate('/settings/billing')}
                className="flex items-center gap-2 px-5 py-3 bg-white text-[#ee1e2d] rounded-xl text-[9px] font-black uppercase tracking-widest hover:shadow-lg transition-all"
              >
                Lihat Harga <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- VIEW LAINNYA (Analyst, Developer, Owner) ---
// (Tetap sama seperti versi sebelumnya namun pastikan tidak ada kartu "Pengguna")

const AnalystView = ({ stats, navigate, userData }) => {
  const saasPlans = {
    FREE: { name: "FREE", icon: <Zap size={14} />, color: "text-slate-500 bg-slate-100", features: ["1 Proyek", "Maks 5 Orang"] },
    PRO: { name: "PRO", icon: <Star size={14} />, color: "text-amber-600 bg-amber-50", features: ["15 Proyek", "Maks 25 Orang"] },
    ENTERPRISE: { name: "ENTERPRISE", icon: <ShieldCheck size={14} />, color: "text-[#ee1e2d] bg-red-50", features: ["Unlimited", "Priority Support"] }
  };
  const currentPlan = saasPlans[userData?.plan_type?.toUpperCase()] || saasPlans.FREE;

  return (
    <div className="flex flex-col gap-8">
      <div onClick={() => navigate('/settings/billing')} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center cursor-pointer hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${currentPlan.color}`}> {currentPlan.icon} </div>
          <div>
            <h4 className="text-[11px] font-black uppercase">Paket {currentPlan.name} Aktif</h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Klik untuk detail atau upgrade</p>
          </div>
        </div>
        <div className="flex gap-2">
          {currentPlan.features.map((f, i) => <span key={i} className="text-[9px] font-black px-3 py-1.5 bg-slate-50 rounded-xl uppercase">{f}</span>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCardModern label="SaaS Projects" value={stats.total} icon={<Package/>} color="#ee1e2d" />
        <StatCardModern label="On Progress" value={stats.progress} icon={<RefreshCcw/>} color="#f59e0b" />
        <StatCardModern label="Done" value={stats.done} icon={<CheckCircle2/>} color="#ee1e2d" />
        <StatCardModern label="Market Hold" value={stats.hold} icon={<FolderOpen/>} color="#64748b" />
      </div>
    </div>
  );
};

const DeveloperView = ({ stats, recentProjects, navigate }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCardModern label="Hold" value={stats.hold} icon={<FolderOpen/>} color="#64748b" />
      <StatCardModern label="Progress" value={stats.progress} icon={<RefreshCcw/>} color="#f59e0b" />
      <StatCardModern label="Done" value={stats.done} icon={<CheckCircle2/>} color="#ee1e2d" />
      <StatCardModern label="Late" value={stats.late} icon={<AlertCircle/>} color="#ef4444" />
    </div>
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <h3 className="text-xs font-black text-slate-300 uppercase mb-6">Daftar Pengerjaan</h3>
      <div className="space-y-4">
        {recentProjects.map((p, i) => (
          <div key={i} className="flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#ee1e2d] font-black">{p.name?.charAt(0).toUpperCase()}</div>
              <div><p className="text-sm font-black text-slate-800">{p.name}</p><p className="text-[10px] font-bold text-slate-400 uppercase">{p.status}</p></div>
            </div>
            <button onClick={() => navigate(`/projects/${p.id}`)} className="text-slate-300 hover:text-[#ee1e2d]"><ArrowRight size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProjectOwnerView = ({ stats, pieData, navigate }) => (
  <div className="flex flex-col gap-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCardModern label="Hold" value={stats.hold} icon={<FolderOpen/>} color="#64748b" />
      <StatCardModern label="Progress" value={stats.progress} icon={<RefreshCcw/>} color="#f59e0b" />
      <StatCardModern label="Done" value={stats.done} icon={<CheckCircle2/>} color="#ee1e2d" />
      <StatCardModern label="Late" value={stats.late} icon={<AlertCircle/>} color="#ef4444" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} innerRadius={80} outerRadius={110} dataKey="value" stroke="none">
              {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="lg:col-span-4 bg-white p-10 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center text-center">
        <ShieldCheck size={48} className="text-[#ee1e2d] mb-4" />
        <h3 className="text-base font-black uppercase mb-4">Panel Owner</h3>
        <button onClick={() => navigate('/projects')} className="w-full py-5 bg-[#1b1b28] text-white rounded-2xl text-[11px] font-black uppercase">Kelola Proyek</button>
      </div>
    </div>
  </div>
);

export default Dashboard;