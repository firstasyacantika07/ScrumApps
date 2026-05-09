import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, useParams, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Plus, RefreshCw, AlertCircle, 
  Layout as KanbanIcon, Target, ChevronLeft,
  ExternalLink, Clock, MoreHorizontal, Users
} from 'lucide-react';
import api from '../api/axios'; 

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const projRes = await api.get(`/projects/${id}`);
      setProjectData(projRes.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-slate-100 border-t-[#ee1e2d] rounded-full animate-spin"></div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Project...</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
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
                {projectData?.name || "Project Detail"}
              </h2>
              <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-black rounded-md uppercase border border-green-100">Active</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Created 2 days ago</span>
              </div>
              <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">4 Members</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
            <MoreHorizontal size={20} />
          </button>
          <button className="bg-[#ee1e2d] text-white px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-95">
            <Plus size={18} strokeWidth={3} /> NEW ITEM
          </button>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 w-fit gap-1">
        <TabLink to="vision-board" icon={<ExternalLink size={16}/>} label="Vision" />
        <TabLink to="backlog" icon={<Target size={16}/>} label="Backlog" />
        <TabLink to="sprint" icon={<RefreshCw size={16}/>} label="Sprint" />
        <TabLink to="board" icon={<KanbanIcon size={16}/>} label="Board" />
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm min-h-[450px]">
        <Routes>
          <Route path="/" element={<DefaultView project={projectData} />} />
          <Route path="vision-board" element={<VisionBoardContent />} />
          <Route path="backlog" element={<BacklogContent />} />
          <Route path="sprint" element={<SprintContent />} />
          <Route path="board" element={<SprintContent />} />
        </Routes>
      </div>
    </div>
  );
};

// COMPONENT: TAB LINK
const TabLink = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-[1px] transition-all duration-300 ${
      isActive 
        ? 'bg-[#ee1e2d] text-white shadow-md shadow-red-200 translate-y-[-2px]' 
        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
    }`}
  >
    {icon} {label}
  </NavLink>
);

// COMPONENT: DEFAULT VIEW
const DefaultView = ({ project }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-500">
    <div className="relative mb-8">
      <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
        <Briefcase size={48} />
      </div>
      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#ee1e2d] rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-white">
        <Target size={18} />
      </div>
    </div>
    <h3 className="text-2xl font-black text-slate-800 mb-3">Welcome to {project?.name}!</h3>
    <p className="text-slate-400 text-sm max-w-sm leading-relaxed font-medium">
      Everything is set. Choose a tab above to manage your backlog or start a new sprint.
    </p>
  </div>
);

// COMPONENT: BACKLOG
const BacklogContent = () => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
    <div className="flex items-center justify-between">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[3px]">Project Backlog</h3>
      <div className="flex gap-2">
        <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase">0 Issues</div>
      </div>
    </div>
    <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#ee1e2d] shadow-sm mb-4">
        <AlertCircle size={28} />
      </div>
      <h4 className="font-black text-slate-700">No Items Found</h4>
      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2">Start by adding your first requirement</p>
    </div>
  </div>
);

// COMPONENT: SPRINT / KANBAN
const SprintContent = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
    <KanbanColumn title="To Do" count="0" color="bg-slate-500" />
    <KanbanColumn title="In Progress" count="0" color="bg-amber-500" isSpecial />
    <KanbanColumn title="Done" count="0" color="bg-[#ee1e2d]" />
  </div>
);

const KanbanColumn = ({ title, count, color, isSpecial }) => (
  <div className={`flex flex-col rounded-[2rem] ${isSpecial ? 'bg-slate-50/80 border-2 border-white shadow-inner' : 'bg-slate-50/40'} min-h-[400px]`}>
    <div className="p-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{title}</span>
      </div>
      <span className="text-[10px] font-black text-slate-400 bg-white px-2.5 py-1 rounded-lg shadow-sm border border-slate-100">{count}</span>
    </div>
    <div className="flex-1 p-4">
      <div className="h-full border-2 border-dashed border-slate-100 rounded-[1.5rem] flex items-center justify-center">
         <span className="text-[9px] font-black text-slate-300 uppercase tracking-[2px]">Empty Slot</span>
      </div>
    </div>
  </div>
);

const VisionBoardContent = () => (
  <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95">
    <div className="p-8 bg-rose-50 text-[#ee1e2d] rounded-[2.5rem] mb-6">
      <ExternalLink size={48} />
    </div>
    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Vision Board</h3>
    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[2px] mt-2">No Vision Defined Yet</p>
  </div>
);

export default ProjectDetail;