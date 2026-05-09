import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, MoreVertical, 
  ChevronLeft, ChevronRight, ChevronDown 
} from 'lucide-react';
import api from '../../api/axios';
import Layout from '../shared/Layout';

const Sprint = ({ projectId }) => {
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSprints();
  }, [projectId]);

  const fetchSprints = async () => {
    try {
      setLoading(false);
      const res = await api.get(`/projects/${projectId}/sprints`);
      setSprints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION: DAFTAR SPRINT CARD */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Header Title */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Daftar Sprint</h2>
          <p className="text-sm text-gray-500 mt-1">
            Halaman ini digunakan untuk menyimpan daftar sprint pada proyek.
          </p>
        </div>

        {/* Toolbar: Button & Search */}
        <div className="p-6 flex items-center justify-between gap-4 border-b border-gray-100">
          <button className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-red-700 transition shadow-md">
            <Plus size={18} /> Tambah
          </button>
          
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-11 pr-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50 text-sm focus:ring-1 focus:ring-red-200 focus:border-red-300 outline-none transition"
            />
          </div>
        </div>

        {/* TABLE CONTENT */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Deskripsi</th>
                <th className="px-6 py-4">Tanggal Mulai</th>
                <th className="px-6 py-4">Tanggal Selesai</th>
                <th className="px-6 py-4">Hasil Review</th>
                <th className="px-6 py-4">Hasil Retrospektif</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sprints.length > 0 ? (
                sprints.map((sprint, index) => (
                  <tr key={sprint.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{sprint.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sprint.description || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sprint.start_date}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sprint.end_date}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sprint.review || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sprint.retrospective || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 uppercase">
                        {sprint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-20 text-sm text-gray-400">
                    Tidak ada data yang tersedia dalam tabel
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-gray-100 transition">
            10 <ChevronDown size={14} />
          </div>
          
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 transition">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 transition">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sprint;