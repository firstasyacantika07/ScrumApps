import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, useParams, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Plus, MoreVertical, RefreshCw, AlertCircle, Calendar, 
  Layout as KanbanIcon, Target, CheckCircle2
} from 'lucide-react';
import api from '../api/axios'; 
import Layout from '../components/shared/Layout';

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

  if (loading) return <div className="flex h-screen items-center justify-center text-scrum-red font-bold">Memuat...</div>;

  return (
    <Layout title={projectData?.name || "Detail Proyek"}>
      <div className="space-y-6">
        {/* Header / Tab Navigation */}
        <div className="flex items-center justify-between bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex gap-1">
            <TabLink to="backlog" icon={<Target size={16}/>} label="Backlog" />
            <TabLink to="sprint" icon={<RefreshCw size={16}/>} label="Sprint" />
            <TabLink to="board" icon={<KanbanIcon size={16}/>} label="Board" />
          </div>
          <button className="bg-scrum-red text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-red-700">
            <Plus size={16} /> Item Baru
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm min-h-[400px]">
          <Routes>
            <Route path="/" element={<div className="text-center text-gray-400 mt-20">Pilih menu di atas untuk melihat detail.</div>} />
            <Route path="backlog" element={<BacklogContent />} />
            <Route path="sprint" element={<SprintContent />} />
          </Routes>
        </div>
      </div>
    </Layout>
  );
};

const TabLink = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
      isActive ? 'bg-scrum-red text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'
    }`}
  >
    {icon} {label}
  </NavLink>
);

const BacklogContent = () => (
  <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
    <div className="p-4 bg-rose-50 text-scrum-red rounded-full mb-4"><AlertCircle size={32}/></div>
    <h3 className="font-bold text-gray-700">Belum ada Backlog</h3>
    <p className="text-sm text-gray-400">Tambahkan requirement proyek untuk memulai.</p>
  </div>
);

const SprintContent = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <KanbanColumn title="To Do" color="bg-gray-100" />
    <KanbanColumn title="In Progress" color="bg-blue-50 text-blue-600" />
    <KanbanColumn title="Done" color="bg-green-50 text-green-600" />
  </div>
);

const KanbanColumn = ({ title, color }) => (
  <div className="bg-gray-50 rounded-2xl min-h-[300px]">
    <div className={`p-4 font-bold text-sm border-b border-gray-200/50 ${color} rounded-t-2xl`}>
      {title}
    </div>
    <div className="p-4">
      <div className="text-center text-[11px] text-gray-400 py-10 uppercase tracking-widest font-bold">Kosong</div>
    </div>
  </div>
);

export default ProjectDetail;