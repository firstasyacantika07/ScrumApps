import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users as UsersIcon, Info, 
  Settings, LogOut, Layers3, Bell, Plus, X, UserSquare2, Save, User
} from 'lucide-react';
import './css/Projectlist.css'; 
// Impor service API
import { getUsers, createUser, deleteUser } from '../service/userService'; 

const Users = () => {
  const navigate = useNavigate();

  // 1. STATE SEKARANG KOSONG (Diisi dari Database)
  const [usersData, setUsersData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: '', phone: '', email: '', role: 'Team Developer' });

  // 2. FETCH DATA SAAT KOMPONEN DI-LOAD
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsersData(response.data);
    } catch (error) {
      console.error("Gagal memuat user:", error);
      alert("Gagal mengambil data dari server.");
    } finally {
      setLoading(false);
    }
  };

  // 3. FUNGSI HANDLER (Dihubungkan ke API)
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      try {
        await deleteUser(id);
        setUsersData(usersData.filter(user => user.id !== id));
      } catch (error) {
        alert("Gagal menghapus user.");
      }
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // Kirim ke Backend
      const response = await createUser(newUser);
      
      // Update state lokal dengan data dari response (termasuk ID dari DB)
      setUsersData([...usersData, { ...newUser, id: response.data.id }]);
      
      setIsModalOpen(false); 
      setNewUser({ name: '', phone: '', email: '', role: 'Team Developer' }); 
    } catch (error) {
      alert("Gagal menambah user. Pastikan backend menyala.");
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="scrumapps-wrapper">
      {/* --- SIDEBAR & HEADER TETAP SAMA --- */}
      <aside className="scrum-sidebar">
        <div className="sidebar-logo">
          <Layers3 color="#ee1e2d" size={28} />
          <span>ScrumApps</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Briefcase size={20} /> <span>Proyek</span>
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <UsersIcon size={20} /> <span>Pengguna</span>
          </NavLink>
          <NavLink to="/info" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Info size={20} /> <span>Informasi Sistem</span>
          </NavLink>
        </nav>
      </aside>

      <main className="scrum-main">
        {/* Header content ... */}
        <header className="scrum-header">
           {/* (Gunakan kode header kamu sebelumnya di sini) */}
           <div className="header-left">
            <div className="breadcrumb">
              <span className="bc-icon" style={{ backgroundColor: '#ee1e2d', color: 'white' }}>
                <UsersIcon size={16} />
              </span>
              <span className="bc-text bc-active">Daftar Pengguna</span>
            </div>
          </div>
          {/* ... bagian header-right tetap sama */}
        </header>

        <div className="scrum-content">
          <div className="project-card" style={{ height: 'auto', padding: '0', overflow: 'hidden', backgroundColor: 'white' }}>
            
            <div style={{ padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <button className="btn-add" onClick={() => setIsModalOpen(true)}>
                  <Plus size={16} /> Tambah
               </button>
            </div>

            <div style={{ width: '100%', overflowX: 'auto' }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#a0aec0' }}>Memproses data...</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #edf2f7', color: '#a0aec0', fontSize: '11px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '15px 30px' }}>No</th>
                      <th style={{ padding: '15px' }}>Nama</th>
                      <th style={{ padding: '15px' }}>No Telepon</th>
                      <th style={{ padding: '15px' }}>Email</th>
                      <th style={{ padding: '15px' }}>Role</th>
                      <th style={{ padding: '15px 30px', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '13px', color: '#4a5568' }}>
                    {usersData.length > 0 ? (
                      usersData.map((user, index) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #f7fafc' }}>
                          <td style={{ padding: '20px 30px' }}>{index + 1}</td>
                          <td style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <UserSquare2 size={18} color="#a0aec0" />
                              <span style={{ fontWeight: '700', color: '#3182ce' }}>{user.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '20px' }}>{user.phone || '-'}</td>
                          <td style={{ padding: '20px' }}>{user.email}</td>
                          <td style={{ padding: '20px' }}>
                             <span style={{ backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                                {user.role}
                             </span>
                          </td>
                          <td style={{ padding: '20px 30px', textAlign: 'center' }}>
                            <button 
                              onClick={() => handleDelete(user.id)}
                              style={{ backgroundColor: '#fff5f5', color: '#ee1e2d', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                            >
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#a0aec0' }}>Tidak ada pengguna ditemukan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL FORM TETAP SAMA --- */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Tambah Pengguna</h3>
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(false)} />
            </div>

            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="text" placeholder="Nama Lengkap" required
                style={inputStyle} value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
              <input 
                type="text" placeholder="No Telepon" required
                style={inputStyle} value={newUser.phone}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
              />
              <input 
                type="email" placeholder="Email" required
                style={inputStyle} value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
              <select 
                style={inputStyle} value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="Team Developer">Team Developer</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="Project Owner">Super Admin</option>
              </select>

              <button type="submit" className="btn-add" style={{ width: '100%', marginTop: '10px', justifyContent: 'center' }}>
                <Save size={16} /> Simpan Data
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- STYLES OBJECTS ---
const dropdownStyle = {
  position: 'absolute', top: '35px', right: '0', backgroundColor: 'white',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderRadius: '10px',
  padding: '8px 0', zIndex: 1000, width: '180px', border: '1px solid #edf2f7'
};

const dropdownItemStyle = {
  padding: '10px 20px', fontSize: '13px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: '10px', color: '#4a5568',
  transition: 'background 0.2s'
};

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
  alignItems: 'center', zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: 'white', padding: '30px', borderRadius: '15px',
  width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
};

const inputStyle = {
  padding: '12px', borderRadius: '8px', border: '1px solid #edf2f7',
  backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none'
};

export default Users;