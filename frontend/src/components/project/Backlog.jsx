import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const Backlog = ({ projectId }) => {
  const [backlogs, setBacklogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Initial State untuk Form
  const initialFormState = {
    name: '',
    description: '',
    priority: 'low',
    applicant: '',
    status: 'inactive',
    sprint_id: null,
    project_id: projectId
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchBacklogs();
  }, [projectId]);

  const fetchBacklogs = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/backlogs`);
      setBacklogs(res.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/backlogs/${currentId}`, formData);
      } else {
        await api.post(`/projects/${projectId}/backlogs`, formData);
      }
      setFormData(initialFormState);
      setIsEditing(false);
      fetchBacklogs();
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      priority: item.priority,
      applicant: item.applicant,
      status: item.status,
      sprint_id: item.sprint_id,
      project_id: projectId
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await api.delete(`/backlogs/${id}`);
        fetchBacklogs();
      } catch (err) {
        console.error("Gagal menghapus data:", err);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Product Backlog</h2>

      {/* Form Tambah/Edit */}
      <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Judul Backlog"
            className="border p-2 rounded-lg"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="applicant"
            placeholder="Pengaju (Applicant)"
            className="border p-2 rounded-lg"
            value={formData.applicant}
            onChange={handleInputChange}
          />
          <select 
            name="priority" 
            className="border p-2 rounded-lg"
            value={formData.priority}
            onChange={handleInputChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select 
            name="status" 
            className="border p-2 rounded-lg"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="inactive">Inactive</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <textarea
            name="description"
            placeholder="Deskripsi"
            className="border p-2 rounded-lg md:col-span-2"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">
            {isEditing ? 'Update Backlog' : 'Tambah Backlog'}
          </button>
          {isEditing && (
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); setFormData(initialFormState); }}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* List Backlog */}
      <div className="space-y-4">
        {backlogs.map((item) => (
          <div key={item.id} className="border rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                <div className="flex gap-4 mt-3 text-xs font-medium text-gray-400">
                  <span>Applicant: {item.applicant}</span>
                  <span>Status: <span className="capitalize">{item.status}</span></span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.priority === 'high' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                }`}>
                  {item.priority}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Backlog;