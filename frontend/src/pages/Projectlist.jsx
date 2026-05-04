import React, { useState, useEffect } from 'react';
import Layout from '../components/shared/Layout';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Plus } from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    status: 'hold',
    icon: 'ki-duotone ki-star',
    label: 'external'
  });

const fetchProjects = async () => {
  try {
    const res = await api.get('/projects');
    setProjects(res.data);
  } catch (err) {
    console.error("ERROR GET PROJECT:", err.response?.data || err.message);
  }
};

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/projects', formData);
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  return (
    <Layout title="Projects">

      <div className="grid grid-cols-4 gap-4">

        <div
          onClick={() => setIsModalOpen(true)}
          className="p-6 border-2 border-dashed rounded-xl cursor-pointer"
        >
          + Create Project
        </div>

        {projects.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/projects/${p.id}`)}
            className="p-4 bg-white rounded-xl shadow"
          >
            <h3>{p.name}</h3>
            <p>{p.status}</p>
          </div>
        ))}

      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Project">
        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border"
          />

          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            className="w-full p-2 border"
          />

          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({...formData, end_date: e.target.value})}
            className="w-full p-2 border"
          />

          <button className="w-full bg-blue-500 text-white p-2 rounded">
            Save
          </button>

        </form>
      </Modal>

    </Layout>
  );
};

export default ProjectList;