import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Hash, UserCircle } from 'lucide-react';
import api from '../api/axios'; 
import Layout from '../components/shared/Layout';
import Button from '../components/ui/Button';

const KelolaProfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", gender: "", nik: "", alamat: "", phone: "", email: "", password: ""
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) { navigate('/login'); return; }
    const user = JSON.parse(loggedInUser);
    setFormData({
      name: user.name || "", gender: user.gender || "laki", nik: user.nik || "",
      alamat: user.alamat || "", phone: user.phone || "", email: user.email || "", password: "" 
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await api.put(`/users/${user.id}`, formData);
      alert("Profil berhasil diperbarui!");
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui profil.");
    } finally { setLoading(false); }
  };

  return (
    <Layout title="Kelola Profil">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center gap-4">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-scrum-red">
              <UserCircle size={40} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Informasi Pribadi</h2>
              <p className="text-sm text-gray-400">Perbarui informasi profil dan pengaturan akun Anda.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Nama Lengkap" name="name" icon={<User size={18}/>} value={formData.name} onChange={handleChange} />
            <InputGroup label="Email" name="email" type="email" icon={<Mail size={18}/>} value={formData.email} onChange={handleChange} />
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Jenis Kelamin</label>
              <select 
                name="gender" value={formData.gender} onChange={handleChange}
                className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-scrum-red outline-none transition-all"
              >
                <option value="laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
            </div>

            <InputGroup label="NIK" name="nik" icon={<Hash size={18}/>} value={formData.nik} onChange={handleChange} />
            <InputGroup label="No. Telepon" name="phone" icon={<Phone size={18}/>} value={formData.phone} onChange={handleChange} />
            
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alamat</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                <textarea 
                  name="alamat" value={formData.alamat} onChange={handleChange}
                  className="w-full p-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-scrum-red outline-none transition-all min-h-[100px]"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-50 mt-4">
              <Button variant="secondary" type="button" onClick={() => navigate('/dashboard')}>Batal</Button>
              <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Perubahan"}</Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

const InputGroup = ({ label, name, icon, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
      <input 
        type={type} name={name} value={value} onChange={onChange}
        className="w-full p-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-scrum-red outline-none transition-all"
      />
    </div>
  </div>
);

export default KelolaProfil;