import React, { useState, useEffect } from "react";
// Layout dihapus dari import jika tidak digunakan lagi
import Modal from "../components/ui/Modal";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit3, Folder, MoreHorizontal, User, Clock, ChevronRight } from "lucide-react";
import '../index.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const initialForm = {
    name: "",
    start_date: "",
    end_date: "",
    status: "hold",
    icon: "ki-duotone ki-star",
    label: "external"
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("GET ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setSelectedId(null);
    setIsEdit(false);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/projects/${selectedId}`, formData);
      } else {
        await api.post("/projects", formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchProjects();
    } catch (err) {
      console.error("SAVE ERROR:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Yakin ingin menghapus project ini?")) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err.message);
    }
  };

  const handleEdit = (e, project) => {
    e.stopPropagation();
    setFormData({
      name: project.name || "",
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      status: project.status || "hold",
      icon: project.icon || "ki-duotone ki-star",
      label: project.label || "external"
    });
    setSelectedId(project.id);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'done': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'on_progress': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'hold': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <> {/* Layout diganti dengan fragment agar tidak merusak struktur DOM */}
      <div className="max-w-[1600px] mx-auto p-8 pb-20 animate-in fade-in duration-700">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Manajemen Proyek</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[3px]">
              Pantau dan kelola seluruh inisiatif tim dalam satu dasbor.
            </p>
          </div>
          <button 
            onClick={openCreate}
            className="bg-[#ee1e2d] hover:bg-red-700 text-white px-8 py-4 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-200 active:scale-95 text-xs font-black uppercase tracking-widest"
          >
            <Plus size={20} strokeWidth={3} />
            Buat Proyek Baru
          </button>
        </div>

        {/* MAIN CONTAINER */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 min-h-[600px]">
          
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                <Folder size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Daftar Aktif</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total {projects.length} Proyek Terdaftar</p>
              </div>
            </div>
          </div>

          {/* GRID SYSTEM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="group bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-[320px] relative"
              >
                {/* Status Badge - Floating */}
                <div className="absolute top-6 right-6 z-10">
                  <span className={`text-[9px] px-3 py-1.5 rounded-xl font-black uppercase tracking-wider border shadow-sm ${getStatusStyle(p.status)}`}>
                    {p.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Card Header (Visual) */}
                <div className="h-32 bg-slate-50/50 flex items-center justify-center relative">
                   <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <div className="w-12 h-12 bg-[#ee1e2d] rounded-xl flex items-center justify-center text-white font-black text-xl">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                   </div>
                </div>

                {/* Card Body */}
                <div className="p-8 pt-4 flex flex-col flex-grow items-center text-center">
                  <h3 className="font-black text-slate-800 text-lg mb-1 group-hover:text-[#ee1e2d] transition-colors line-clamp-1 uppercase tracking-tight">
                    {p.name}
                  </h3>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-6">
                    {p.label || 'INTERNAL PROJECT'}
                  </p>
                  
                  {/* Card Footer Info */}
                  <div className="w-full mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-tighter">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-white shadow-sm">
                        <User size={12} />
                      </div>
                      Owner
                    </div>
                    
                    {/* Hover Actions */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={(e) => handleEdit(e, p)}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, p.id)}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#ee1e2d] hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* EMPTY STATE */}
            {projects.length === 0 && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center border-4 border-dashed border-slate-50 rounded-[3rem]">
                 <div className="bg-slate-50 p-8 rounded-full mb-6">
                    <Folder className="text-slate-200" size={64} />
                 </div>
                 <h3 className="text-slate-800 font-black uppercase tracking-widest text-sm mb-2">Tidak Ada Proyek</h3>
                 <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[3px]">Silakan buat proyek baru untuk memulai.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL FORM */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={isEdit ? "PERBARUI DATA PROYEK" : "REGISTRASI PROYEK BARU"}
      >
        <form onSubmit={handleSubmit} className="space-y-8 p-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Nama Proyek</label>
            <input
              placeholder="Masukkan Nama Proyek..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black focus:ring-4 focus:ring-red-500/5 focus:border-[#ee1e2d] outline-none transition-all placeholder:text-slate-300 uppercase tracking-tight"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Mulai</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold outline-none focus:border-[#ee1e2d] transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Deadline</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold outline-none focus:border-[#ee1e2d] transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Status Pengerjaan</label>
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black uppercase tracking-widest appearance-none outline-none focus:border-[#ee1e2d] transition-all cursor-pointer"
              >
                <option value="hold">Hold (Ditunda)</option>
                <option value="on_progress">On Progress (Berjalan)</option>
                <option value="done">Done (Selesai)</option>
                <option value="archive">Archive (Arsip)</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <MoreHorizontal size={20} />
              </div>
            </div>
          </div>

          <button className="w-full bg-[#ee1e2d] hover:bg-red-700 text-white py-6 rounded-3xl font-black text-xs shadow-2xl shadow-red-200 transition-all active:scale-[0.98] mt-4 uppercase tracking-[4px]">
            {isEdit ? "Simpan Perubahan" : "Finalisasi Proyek"}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default ProjectList;