import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Briefcase, Plus, RefreshCw, Target, ChevronLeft, 
  ExternalLink, Clock, Users, X, Database, Activity, 
  Calendar as CalendarIcon
} from 'lucide-react';
import api from '../api/axios'; 

// Import komponen detail
import VisionBoard from '../components/project/VisionBoard';
import Backlog from '../components/project/Backlog';
import Sprint from '../components/project/Sprint';
import Development from '../components/project/Development';
import Members from '../components/project/Members';
import ProjectCalendar from '../components/project/ProjectCalendar';
import ActivityLogs from '../components/project/ActivityLogs'; 

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper untuk label modal
  const getModalType = () => {
    if (location.pathname.includes('vision-board')) return 'Vision Board';
    if (location.pathname.includes('backlog')) return 'Backlog';
    if (location.pathname.includes('sprint')) return 'Sprint';
    if (location.pathname.includes('development')) return 'Development Task';
    if (location.pathname.includes('calendar')) return 'Event';
    if (location.pathname.includes('logs')) return 'Activity';
    return 'Item';
  };

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      setError(err.response?.status === 404 ? "Proyek tidak ditemukan." : "Gagal memuat data proyek.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchProject();
  }, [id, fetchProject]);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      let endpoint = '';
      
      if (location.pathname.includes('backlog')) endpoint = `/projects/${id}/backlogs`;
      else if (location.pathname.includes('sprint')) endpoint = `/projects/${id}/sprints`;
      else if (location.pathname.includes('development')) endpoint = `/projects/${id}/developments`;

      if (endpoint) {
        const payload = {
          ...formData,
          name: formData.title 
        };

        await api.post(endpoint, payload);
        setShowAddModal(false);
        setFormData({});
        window.location.reload(); 
      }
    } catch (err) {
      alert("Gagal menyimpan: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/projects')} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
            <ChevronLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{project?.name}</h2>
              <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-black rounded-md uppercase border border-green-100">{project?.status}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Mulai: {project?.start_date ? new Date(project.start_date).toLocaleDateString('id-ID') : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tombol Add Task hanya tampil di halaman yang mendukung */}
          {['backlog', 'sprint', 'development'].some(p => location.pathname.includes(p)) && (
            <button onClick={() => { setFormData({}); setShowAddModal(true); }}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
              <Plus size={18} strokeWidth={3} /> TAMBAH {getModalType().toUpperCase()}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* SIDEBAR */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
          <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-1 sticky top-8">
            <SideLink to="" icon={<Briefcase size={18}/>} label="Overview" end={true} />
            <SideLink to="calendar" icon={<CalendarIcon size={18}/>} label="Calendar" />
            <SideLink to="vision-board" icon={<Target size={18}/>} label="Vision Board" />
            <SideLink to="backlog" icon={<Database size={18}/>} label="Backlog" />
            <SideLink to="sprint" icon={<RefreshCw size={18}/>} label="Sprint" />
            <SideLink to="development" icon={<Activity size={18}/>} label="Development" />
            
            {/* Link Activity Log */}
            <SideLink to="logs" icon={<Clock size={18}/>} label="Activity Log" /> 
            
            <hr className="my-2 border-slate-50" />
            <SideLink to="members" icon={<Users size={18}/>} label="Members" />
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="col-span-12 lg:col-span-9 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm min-h-[600px]">
          <Routes>
            <Route path="/" element={<DefaultView project={project} />} />
            <Route path="calendar" element={<ProjectCalendar projectId={id} />} />
            <Route path="vision-board" element={<VisionBoard projectId={id} />} />
            <Route path="backlog" element={<Backlog projectId={id} />} />
            <Route path="sprint" element={<Sprint projectId={id} />} />
            <Route path="development" element={<Development projectId={id} />} />
            <Route path="members" element={<Members projectId={id} />} />
            <Route path="logs" element={<ActivityLogs projectId={id} />} /> 
          </Routes>
        </div>
      </div>

      {/* MODAL DYNAMIC */}
      {showAddModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Tambah {getModalType()}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
            </div>

            <div className="p-8 space-y-5">
              <FormInput 
                label="Nama / Judul" 
                placeholder={`Masukkan nama ${getModalType()}...`}
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              
              {location.pathname.includes('development') && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none"
                      value={formData.status || 'todo'}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="qa">QA / Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <FormInput 
                    label="Ref Link (URL)" 
                    placeholder="https://..."
                    value={formData.link || ''}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                  />
                </div>
              )}

              <FormTextarea 
                label="Deskripsi / Detail" 
                value={formData.description || ''} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Tulis detail pengerjaan..." 
              />

              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddModal(false)} 
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-200 transition-all">
                  Batal
                </button>
                <button onClick={handleSave} disabled={isSubmitting}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
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

// UI HELPER COMPONENTS
const SideLink = ({ to, icon, label, end = false }) => (
  <NavLink to={to} end={end}
    className={({ isActive }) => `flex items-center gap-3 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all ${
      isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
    }`}>
    {icon} {label}
  </NavLink>
);

const DefaultView = ({ project }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center animate-in slide-in-from-bottom-4 duration-700">
    <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-200 mb-6 border border-blue-100">
      <Briefcase size={48} />
    </div>
    <h3 className="text-2xl font-black text-slate-800 mb-2">{project?.name}</h3>
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] max-w-sm leading-relaxed">
      Project Dashboard. Gunakan navigasi samping untuk mengelola Development & Backlog.
    </p>
  </div>
);

const FormInput = ({ label, placeholder, value, onChange, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} 
      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all" />
  </div>
);

const FormTextarea = ({ label, placeholder, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <textarea rows="4" value={value} onChange={onChange} placeholder={placeholder} 
      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all" />
  </div>
);

export default ProjectDetail;