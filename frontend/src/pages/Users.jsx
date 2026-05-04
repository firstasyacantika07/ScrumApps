import React, { useState, useEffect } from 'react';
import Layout from '../components/shared/Layout';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Search, Filter, Plus, X, User } from 'lucide-react';
import { getUsers, createUser, deleteUser } from '../service/userService';

const Users = () => {

  // ================= STATE =================
  const [usersData, setUsersData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    role: 'TeamDeveloper',
    gender: 'male'
  });

  // ================= EFFECT =================
  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= GET USERS =================
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsersData(res.data);
    } catch (err) {
      console.error("GET USERS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE USER =================
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await createUser(newUser);

      setIsModalOpen(false);

      setNewUser({
        name: '',
        email: '',
        password: '',
        phone_number: '',
        role: 'TeamDeveloper',
        gender: 'male'
      });

      fetchUsers();
    } catch (err) {
      console.error("CREATE ERROR:", err?.response?.data || err);
    }
  };

  // ================= DELETE USER =================
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  // ================= CONFIRM DELETE =================
  const confirmDelete = async () => {
    try {
      await handleDelete(deleteTarget);
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UI =================
  return (
    <Layout title="Daftar Pengguna">

      {/* TOP BAR */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">

          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Tambah Pengguna
          </Button>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                placeholder="Cari nama atau email..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
            </div>

            <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading...</div>
          ) : (

            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-400 border-b">
                  <th>No</th>
                  <th>Nama</th>
                  <th>Telepon</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {usersData.map((u, i) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">

                    <td className="py-3">{i + 1}</td>

                    <td className="flex items-center gap-2 font-semibold text-blue-600">
                      <User size={14} />
                      {u.name}
                    </td>

                    <td>{u.phone_number}</td>
                    <td>{u.email}</td>

                    <td>
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                        {u.role}
                      </span>
                    </td>

                    <td className="text-center">
                      <button
                        onClick={() => {
                          setDeleteTarget(u.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded"
                      >
                        <X size={14} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>

      {/* ================= CREATE MODAL ================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah User"
      >
        <form onSubmit={handleCreate} className="space-y-3">

          <input
            placeholder="Nama"
            className="w-full p-2 border rounded"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />

          <input
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />

          <input
            placeholder="Password"
            type="password"
            className="w-full p-2 border rounded"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />

          <input
            placeholder="No HP"
            className="w-full p-2 border rounded"
            value={newUser.phone_number}
            onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })}
          />

          <select
            className="w-full p-2 border rounded"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option>Superadmin</option>
            <option>TeamDeveloper</option>
            <option>BusinessAnalyst</option>
          </select>

          <Button className="w-full" type="submit">
            Simpan
          </Button>

        </form>
      </Modal>

      {/* ================= DELETE MODAL ================= */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus User"
      >
        <div className="space-y-4">

          <p className="text-gray-600">
            Apakah kamu yakin ingin menghapus user ini?
          </p>

          <div className="flex gap-3">

            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="w-full py-2 border rounded-lg"
            >
              Batal
            </button>

            <button
              onClick={confirmDelete}
              className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Hapus
            </button>

          </div>
        </div>
      </Modal>

    </Layout>
  );
};

export default Users;