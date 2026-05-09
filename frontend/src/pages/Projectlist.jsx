import React, { useState, useEffect } from "react";
import Layout from "../components/shared/Layout";
import Modal from "../components/ui/Modal";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Plus, MoreVertical, Trash2, Edit3 } from "lucide-react";
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

  return (
    <Layout title="Proyek">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* WHITE CONTAINER CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800">Daftar Proyek</h2>
            <p className="text-sm text-gray-400 mt-1">
              Halaman ini berisi daftar proyek yang ada sesuai dengan hak akses dan kontribusi pengguna.
            </p>
          </div>

          {/* GRID SYSTEM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* CREATE PROJECT CARD */}
            <div className="border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center justify-center p-8 h-[220px]">
              <span className="text-sm font-medium text-gray-600 mb-4">Buat Proyek Baru</span>
              <button 
                onClick={openCreate}
                className="bg-[#e11d48] hover:bg-red-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Plus size={18} />
                <span className="font-semibold text-sm">Tambah</span>
              </button>
            </div>

            {/* PROJECT ITEMS */}
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="group relative bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col h-[220px]"
              >
                {/* Header Background */}
                <div className="h-1/3 bg-[#fff1f2]"></div>

                {/* Floating Icon */}
                <div className="absolute top-[20%] left-6 p-2 bg-white rounded-lg shadow-sm border border-pink-50">
                  <div className="bg-[#e11d48] p-1.5 rounded text-white">
                    <Plus size={14} className="rotate-45" /> {/* Placeholder icon */}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-8 flex flex-col flex-grow">
                  <h3 className="font-bold text-gray-800 uppercase tracking-tight text-sm mb-1">{p.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                    <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-[8px] text-gray-500 uppercase">
                      {p.name.charAt(0)}
                    </div>
                    Clariva PO
                  </div>
                </div>

                {/* Action Hover Menu */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleEdit(e, p)}
                    className="p-1.5 bg-white shadow-sm border border-gray-100 rounded-md text-blue-500 hover:bg-blue-50"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, p.id)}
                    className="p-1.5 bg-white shadow-sm border border-gray-100 rounded-md text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* MODAL FORM TETAP SAMA */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={isEdit ? "Edit Project" : "Create Project"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">NAMA PROYEK</label>
            <input
              placeholder="Project Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none transition"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">TANGGAL MULAI</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">TANGGAL BERAKHIR</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">STATUS</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            >
              <option value="hold">Hold</option>
              <option value="on_progress">On Progress</option>
              <option value="done">Done</option>
              <option value="archive">Archive</option>
            </select>
          </div>
          <button className="w-full bg-[#e11d48] hover:bg-red-700 text-white p-3 rounded-lg font-bold text-sm shadow-md transition-all mt-4">
            {isEdit ? "PERBARUI PROYEK" : "SIMPAN PROYEK"}
          </button>
        </form>
      </Modal>
    </Layout>
  );
};

export default ProjectList;