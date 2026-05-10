import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Briefcase, Plus, RefreshCw, AlertCircle, 
  Layout as KanbanIcon, Target, ChevronLeft,
  ExternalLink, Clock, Users, X,
  Settings, Database, Activity
} from 'lucide-react';
import api from '../api/axios'; 

// Import komponen detail
import VisionBoard from '../components/project/VisionBoard';
import Backlog from '../components/project/Backlog';
import Sprint from '../components/project/Sprint';
import TaskBoard from '../components/project/TaskBoard';
import Development from '../components/project/Development';
import Members from '../components/project/Members';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // State untuk form tambah
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setError(null);
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Proyek tidak ditemukan atau Anda tidak memiliki akses.");
      } else {
        setError("Terjadi kesalahan koneksi ke server.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchProject();
  }, [id, fetchProject]);

  // Fungsi untuk menangani simpan data baru
  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      let endpoint = '';
      if (location.pathname.includes('backlog')) endpoint = `/projects/${id}/backlog`;
      else if (location.pathname.includes('sprint')) endpoint = `/projects/${id}/sprints`;
      // Tambahkan logika endpoint lainnya...

      if (endpoint) {
        await api.post(endpoint, formData);
        setShowAddModal(false);
        setFormData({});
        // Trigger refresh data pada komponen anak jika diperlukan
        window.location.reload(); 
      }
    } catch (err) {
      alert("Gagal menyimpan data: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/projects')}
            className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
          >
            <ChevronLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {project?.name}
              </h2>
              <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-black rounded-md uppercase border border-green-100">
                {project?.status}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Mulai: {project?.start_date ? new Date(project.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
            <Settings size={20} />
          </button>
          <button 
            onClick={() => { setFormData({}); setShowAddModal(true); }}
            className="bg-[#ee1e2d] text-white px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> TAMBAH {getModalType().toUpperCase()}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* SIDEBAR */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
          <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-1">
            <SideLink to="" icon={<Briefcase size={18}/>} label="Overview" end={true} />
            <SideLink to="vision-board" icon={<ExternalLink size={18}/>} label="Vision Board" />
            <SideLink to="backlog" icon={<Database size={18}/>} label="Backlog" />
            <SideLink to="sprint" icon={<RefreshCw size={18}/>} label="Sprint" />
            <SideLink to="task-board" icon={<KanbanIcon size={18}/>} label="Board" />
            <SideLink to="development" icon={<Activity size={18}/>} label="Pengembangan" />
            <hr className="my-2 border-slate-50" />
            <SideLink to="members" icon={<Users size={18}/>} label="Members" />
          </div>
        </div>

        {/* CONTENT */}
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

      {/* MODAL TAMBAH */}
      {showAddModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="sticky top-0 bg-white border-b border-slate-50 p-6 flex justify-between items-center z-10">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Tambah {getModalType()}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
            </div>

            <div className="p-8 space-y-6">
              <FormInput 
                label="Nama / Judul" 
                placeholder={`Masukkan nama ${getModalType()}...`}
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              
              {location.pathname.includes('vision-board') && (
                <>
                  <FormTextarea label="Vision" value={formData.vision || ''} onChange={(e) => setFormData({...formData, vision: e.target.value})} placeholder="Visi proyek..." />
                  <FormTextarea label="Target Group" value={formData.target || ''} onChange={(e) => setFormData({...formData, target: e.target.value})} placeholder="Target pengguna..." />
                </>
              )}

              {location.pathname.includes('backlog') && (
                <>
                  <FormTextarea label="User Story" value={formData.user_story || ''} onChange={(e) => setFormData({...formData, user_story: e.target.value})} placeholder="As a user, I want to..." />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prioritas</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee1e2d]"
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex gap-3 mt-8">
                <button 
                  disabled={isSubmitting}
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={handleSave}
                  className="flex-1 py-4 bg-[#ee1e2d] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : `Simpan ${getModalType()}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SideLink = ({ to, icon, label, end = false }) => (
  <NavLink 
    to={to} 
    end={end}
    className={({ isActive }) => `flex items-center gap-3 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all ${
      isActive 
        ? 'bg-[#ee1e2d] text-white shadow-lg shadow-red-100' 
        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
    }`}
  >
    {icon} {label}
  </NavLink>
);

const DefaultView = ({ project }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
      <Briefcase size={40} />
    </div>
    <h3 className="text-xl font-black text-slate-800 mb-2">Manajemen Proyek: {project?.name}</h3>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest max-w-sm">
      Kelola scrum task, backlog, dan progres sprint Anda secara terintegrasi di sini.
    </p>
  </div>
);

const FormInput = ({ label, placeholder, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input 
      type="text" 
      value={value}
      onChange={onChange}
      placeholder={placeholder} 
      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee1e2d] transition-all" 
    />
  </div>
);

const FormTextarea = ({ label, placeholder, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <textarea 
      rows="3" 
      value={value}
      onChange={onChange}
      placeholder={placeholder} 
      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee1e2d] transition-all" 
    />
  </div>
);

export default ProjectDetail;