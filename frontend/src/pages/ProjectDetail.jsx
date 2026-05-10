import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Briefcase, Plus, RefreshCw, AlertCircle, 
  Layout as KanbanIcon, Target, ChevronLeft,
  ExternalLink, Clock, MoreHorizontal, Users, X,
  Settings, Database, Activity
} from 'lucide-react';
import api from '../api/axios'; 

// Import komponen-komponen detail
import VisionBoard from '../components/project/VisionBoard';
import Backlog from '../components/project/Backlog';
import Sprint from '../components/project/Sprint';
import TaskBoard from '../components/project/TaskBoard';
import Development from '../components/project/Development';
import Members from '../components/project/Members';
import CalendarPage from '../components/project/CalendarPage';
import Notifications from '../components/project/Notifications';
import ActivityLogs from '../components/project/ActivityLogs';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Menentukan tipe modal berdasarkan path aktif
  const getModalType = () => {
    if (location.pathname.includes('vision-board')) return 'Vision Board';
    if (location.pathname.includes('backlog')) return 'Backlog';
    if (location.pathname.includes('sprint')) return 'Sprint';
    if (location.pathname.includes('development')) return 'Pengembangan';
    return 'Item';
  };

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-slate-100 border-t-[#ee1e2d] rounded-full animate-spin"></div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Project...</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 relative">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/projects')}
            className="group p-3 bg-slate-50 hover:bg-[#ee1e2d] rounded-2xl transition-all duration-300"
          >
            <ChevronLeft size={20} className="text-slate-400 group-hover:text-white transition-colors" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {project?.name || "Project Detail"}
              </h2>
              <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-black rounded-md uppercase border border-green-100">Active</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">ScrumApps Platform</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
            <Settings size={20} />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#ee1e2d] text-white px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> TAMBAH {getModalType().toUpperCase()}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* SIDEBAR INTERNAL PROYEK */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
          <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-1">
            <SideLink to="vision-board" icon={<ExternalLink size={18}/>} label="Vision Board" />
            <SideLink to="backlog" icon={<Database size={18}/>} label="Backlog" />
            <SideLink to="sprint" icon={<RefreshCw size={18}/>} label="Sprint" />
            <SideLink to="task-board" icon={<KanbanIcon size={18}/>} label="Board" />
            <SideLink to="development" icon={<Activity size={18}/>} label="Pengembangan" />
            <hr className="my-2 border-slate-50" />
            <SideLink to="members" icon={<Users size={18}/>} label="Members" />
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="col-span-12 lg:col-span-9 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm min-h-[600px]">
          <Routes>
            <Route path="/" element={<DefaultView project={project} />} />
            <Route path="vision-board" element={<VisionBoard projectId={id} />} />
            <Route path="backlog" element={<Backlog projectId={id} />} />
            <Route path="sprint" element={<Sprint projectId={id} />} />
            <Route path="task-board" element={<TaskBoard projectId={id} />} />
            <Route path="development" element={<Development projectId={id} />} />
            <Route path="members" element={<Members projectId={id} />} />
          </Routes>
        </div>
      </div>

      {/* DYNAMIC MODAL TAMBAH */}
      {showAddModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="sticky top-0 bg-white border-b border-slate-50 p-6 flex justify-between items-center z-10">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Tambah {getModalType()}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
            </div>

            <div className="p-8 space-y-6">
              <FormInput label="Nama / Judul" placeholder={`Masukkan nama ${getModalType()}...`} />
              
              {location.pathname.includes('vision-board') && (
                <>
                  <FormTextarea label="Vision (Visi)" placeholder="Visi proyek..." />
                  <FormTextarea label="Target Group" placeholder="Target pengguna..." />
                  <FormTextarea label="Business Goals" placeholder="Tujuan bisnis..." />
                </>
              )}

              {location.pathname.includes('backlog') && (
                <>
                  <FormTextarea label="User Story" placeholder="As a user, I want to..." />
                  <FormInput label="Priority" placeholder="High / Medium / Low" />
                </>
              )}

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200">Batal</button>
                <button className="flex-1 py-4 bg-[#ee1e2d] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-red-700">Simpan {getModalType()}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-komponen Sidebar Link
const SideLink = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `flex items-center gap-3 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all ${
      isActive 
        ? 'bg-[#ee1e2d] text-white shadow-lg shadow-red-100' 
        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
    }`}
  >
    {icon}
    {label}
  </NavLink>
);

const DefaultView = ({ project }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
      <Briefcase size={40} />
    </div>
    <h3 className="text-xl font-black text-slate-800 mb-2">Manajemen Proyek: {project?.name}</h3>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Silakan pilih menu di samping untuk mulai mengelola.</p>
  </div>
);

const FormInput = ({ label, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input type="text" placeholder={placeholder} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee1e2d] transition-all" />
  </div>
);

const FormTextarea = ({ label, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <textarea rows="3" placeholder={placeholder} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee1e2d] transition-all" />
  </div>
);

export default ProjectDetail;