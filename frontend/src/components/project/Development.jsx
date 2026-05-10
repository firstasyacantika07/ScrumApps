import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Trophy, 
  Trash2, 
  Activity, 
  Calendar,
  AlertCircle 
} from 'lucide-react';
import api from '../../api/axios';
import Modal from '../ui/Modal';

const Development = ({ projectId }) => {
  const [developments, setDevelopments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State untuk form tambah data
  const [formData, setFormData] = useState({
    title: '',
    progress: 0,
    description: ''
  });

  /* =====================================================
      FETCH DATA
  ===================================================== */
  const fetchDevelopment = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}/developments`);
      setDevelopments(res.data);
    } catch (err) {
      console.error('GET DEVELOPMENTS ERROR:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchDevelopment();
    }
  }, [projectId]);

  /* =====================================================
      HANDLERS
  ===================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${projectId}/developments`, formData);
      setIsModalOpen(false);
      setFormData({ title: '', progress: 0, description: '' });
      fetchDevelopment(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menambah data');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus progress development ini?')) {
      try {
        await api.delete(`/projects/${projectId}/developments/${id}`);
        fetchDevelopment();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-100 text-blue-500">
            <Activity size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Development Progress</h2>
            <p className="text-sm text-gray-400">Pantau tahapan pengerjaan proyek</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all"
        >
          <Plus size={18} />
          Add Milestone
        </button>
      </div>

      {/* CONTENT SECTION */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 italic">Loading development data...</div>
      ) : developments.length === 0 ? (
        <div className="bg-gray-50 rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="flex justify-center mb-4 text-gray-300">
            <Trophy size={48} />
          </div>
          <p className="text-gray-500 font-medium">Belum ada milestone yang tercatat.</p>
          <p className="text-sm text-gray-400">Klik "Add Milestone" untuk mulai mencatat progress.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {developments.map((dev) => (
            <div
              key={dev.id}
              className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-gray-800">{dev.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={12} />
                    <span>Updated: {new Date(dev.updated_at || dev.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    dev.progress === 100 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {dev.progress}% {dev.progress === 100 ? 'Completed' : 'In Progress'}
                  </span>
                  <button 
                    onClick={() => handleDelete(dev.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${dev.progress}%` }}
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    dev.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                />
              </div>
              
              {dev.description && (
                <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                  {dev.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ADD MILESTONE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Development Milestone"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700">Milestone Name</label>
            <input
              type="text"
              required
              placeholder="Contoh: Integrasi Database atau Slicing UI"
              className="w-full mt-2 p-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Progress Percentage</label>
              <span className="text-blue-600 font-bold">{formData.progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              value={formData.progress}
              onChange={(e) => setFormData({...formData, progress: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Description (Optional)</label>
            <textarea
              className="w-full mt-2 p-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
              placeholder="Apa saja yang sudah dikerjakan?"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all"
          >
            Create Milestone
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Development;