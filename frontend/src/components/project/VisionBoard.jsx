import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../ui/Modal';

const VisionBoard = ({ projectId }) => {

  const [visions, setVisions] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const fetchVision = async () => {
    try {

      const res = await api.get(
        `/projects/${projectId}/vision-boards`
      );

      setVisions(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVision();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (editingId) {

        await api.put(
          `/vision-boards/${editingId}`,
          formData
        );

      } else {

        await api.post(
          `/projects/${projectId}/vision-boards`,
          formData
        );
      }

      setIsModalOpen(false);

      setEditingId(null);

      setFormData({
        title: '',
        description: ''
      });

      fetchVision();

    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {

    if (!window.confirm('Delete vision?')) return;

    try {

      await api.delete(`/vision-boards/${id}`);

      fetchVision();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-2xl font-bold">
            Vision Board
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Project goals and objectives
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 text-white px-5 py-3 rounded-2xl flex gap-2"
        >
          <Plus size={18} />
          Add Vision
        </button>

      </div>

      <div className="grid md:grid-cols-2 gap-5">

        {visions.map((item) => (

          <div
            key={item.id}
            className="border rounded-3xl p-6 bg-white shadow-sm"
          >

            <div className="flex justify-between">

              <div>
                <h3 className="font-bold text-lg">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm mt-2">
                  {item.description}
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => {
                    setEditingId(item.id);

                    setFormData({
                      title: item.title,
                      description: item.description
                    });

                    setIsModalOpen(true);
                  }}
                  className="p-2 bg-blue-50 rounded-xl text-blue-500"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-50 rounded-xl text-red-500"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Vision Board"
      >

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            placeholder="Vision Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value
              })
            }
            className="w-full p-3 border rounded-2xl"
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value
              })
            }
            className="w-full p-3 border rounded-2xl h-32"
          />

          <button className="w-full bg-red-500 text-white p-3 rounded-2xl font-bold">
            Save Vision
          </button>

        </form>

      </Modal>

    </div>
  );
};

export default VisionBoard;