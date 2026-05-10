import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, useParams, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Plus, RefreshCw, AlertCircle, 
  Layout as KanbanIcon, Target, ChevronLeft,
  ExternalLink, Clock
} from 'lucide-react';
import api from '../api/axios'; 

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Memastikan memanggil URL: /api/projects/:id
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      if (err.response?.status === 404) {
        setError("Proyek tidak ditemukan atau Anda tidak memiliki akses.");
      } else {
        setError("Terjadi kesalahan pada server.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchProject();
  }, [id, fetchProject]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ee1e2d]"></div>
    </div>
  );

  if (error) return (
    <div className="flex h-screen flex-col items-center justify-center p-10 text-center bg-white">
      <AlertCircle className="text-red-500 mb-4" size={60} />
      <h2 className="text-2xl font-black text-slate-800 mb-2">Oops!</h2>
      <p className="text-slate-500 max-w-sm mb-6">{error}</p>
      <button 
        onClick={() => navigate('/projects')} 
        className="bg-[#ee1e2d] text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-red-100 hover:scale-105 transition-transform"
      >
        KEMBALI KE LIST PROYEK
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col gap-6">
      {/* HEADER DETAIL */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/projects')}
            className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
          >
            <ChevronLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight lowercase">
                {project?.name}
              </h1>
              <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase border border-green-100">
                {project?.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1">
                <Clock size={14} /> Start: {project?.start_date ? new Date(project.start_date).toLocaleDateString() : '-'}
              </span>
            </div>
          </div>
        </div>
        <button className="bg-[#ee1e2d] text-white px-6 py-4 rounded-[1.5rem] text-xs font-black flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-xl shadow-red-100">
          <Plus size={20} strokeWidth={3} /> NEW SPRINT
        </button>
      </div>

      {/* NAVIGATION TABS */}
      <nav className="flex bg-white p-2 rounded-[1.8rem] shadow-sm border border-slate-100 w-fit gap-1 self-center md:self-start">
        <TabLink to="" icon={<Briefcase size={16}/>} label="Overview" />
        <TabLink to="backlog" icon={<Target size={16}/>} label="Backlog" />
        <TabLink to="board" icon={<KanbanIcon size={16}/>} label="Board" />
      </nav>

      {/* CONTENT AREA */}
      <main className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm min-h-[500px]">
        <Routes>
          <Route index element={<DefaultView project={project} />} />
          <Route path="backlog" element={<div className="py-20 text-center font-black text-slate-300 text-3xl uppercase italic tracking-tighter">Backlog Section</div>} />
          <Route path="board" element={<div className="py-20 text-center font-black text-slate-300 text-3xl uppercase italic tracking-tighter">Kanban Board</div>} />
        </Routes>
      </main>
    </div>
  );
};

// Helper Components
const TabLink = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    end={to === ""}
    className={({ isActive }) => `flex items-center gap-2 px-8 py-3 rounded-[1.2rem] text-[11px] font-black uppercase tracking-wider transition-all ${
      isActive ? 'bg-[#ee1e2d] text-white shadow-lg shadow-red-100' : 'text-slate-400 hover:bg-slate-50'
    }`}
  >
    {icon} {label}
  </NavLink>
);

const DefaultView = ({ project }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-8">
      <Briefcase size={48} />
    </div>
    <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tighter">Selamat Datang di {project?.name}</h2>
    <p className="text-slate-400 text-sm max-w-md leading-relaxed font-medium">
      Kelola scrum task, backlog, dan progres sprint Anda secara terintegrasi di sini.
    </p>
  </div>
);

export default ProjectDetail;