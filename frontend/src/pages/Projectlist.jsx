import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom'; 
import { 
  LayoutDashboard, Briefcase, Users, Info, LogOut, 
  Layers3, FolderPlus, Building2, Lock, Rocket, RefreshCw, 
  Trash2, Pencil, X, Plus, AlertCircle
} from 'lucide-react';
import api from '../api/axios'; 
import './css/Projectlist.css';

const ProjectList = () => {
  const navigate = useNavigate();
  
  // --- States ---
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // Null untuk Create, Object untuk Update
  
  // Form State
  const [formData, setFormData] = useState({
    project_name: '',
    client_name: '',
    project_status: 'In Progress',
    category: 'Web App'
  });

  const PLAN_LIMITS = { FREE: 1, PRO: 15, ENTERPRISE: Infinity };

  // --- Fetch Data (Read) ---
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error("Gagal mengambil proyek:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) return navigate('/login');
    setUserData(JSON.parse(loggedInUser));
    fetchProjects();
  }, [navigate, fetchProjects]);

  // --- Logic SaaS ---
  const userPlan = userData?.plan || "FREE"; 
  const isLimitReached = projects.length >= PLAN_LIMITS[userPlan];

  // --- Actions ---
  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        project_name: project.project_name,
        client_name: project.client_name || '',
        project_status: project.project_status,
        category: project.category || 'Web App'
      });
    } else {
      setEditingProject(null);
      setFormData({ project_name: '', client_name: '', project_status: 'In Progress', category: 'Web App' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        // UPDATE
        await api.put(`/projects/${editingProject.id}`, formData);
      } else {
        // CREATE
        await api.post('/projects', formData);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      alert("Operasi gagal: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus proyek ini secara permanen?")) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        alert("Gagal menghapus");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="scrumapps-wrapper">
      {/* Sidebar */}
      <aside className="scrum-sidebar">
        <div className="sidebar-logo">
          <div className="logo-box"><Layers3 color="white" size={20} /></div>
          <span className="logo-text">ScrumApps</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="nav-item"><LayoutDashboard size={20} /> <span>Dashboard</span></NavLink>
          <NavLink to="/projects" className="nav-item active"><Briefcase size={20} /> <span>Proyek</span></NavLink>
          <NavLink to="/users" className="nav-item"><Users size={20} /> <span>Pengguna</span></NavLink>
        </nav>

        <div className="sidebar-plan-info" style={planInfoSidebarStyle}>
           <div className="flex items-center gap-2 mb-1">
             <Rocket size={14} color="#ee1e2d"/>
             <span style={{fontSize: '11px', fontWeight: 'bold'}}>PAKET {userPlan}</span>
           </div>
           <p style={{fontSize: '10px', color: '#718096'}}>{projects.length} / {PLAN_LIMITS[userPlan] === Infinity ? '∞' : PLAN_LIMITS[userPlan]} Proyek</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="scrum-main">
        <header className="scrum-header">
           <div className="breadcrumb">
             <span className="bc-icon-red"><Briefcase size={16} /></span>
             <span className="bc-text bc-active">Daftar Proyek</span>
           </div>
           <div className="header-right">
              <RefreshCw size={18} className={loading ? 'animate-spin' : 'cursor-pointer'} onClick={fetchProjects} />
              <LogOut size={20} className="cursor-pointer" onClick={handleLogout} />
           </div>
        </header>

        <div className="scrum-content">
          <div className="content-header" style={{display:'flex', justifyContent:'space-between', marginBottom:'30px'}}>
            <h2>Proyek Anda</h2>
            {isLimitReached && <Link to="/pricing" style={upgradeBtnStyle}><Lock size={14}/> Upgrade ke PRO</Link>}
          </div>

          <div className="project-grid">
            {/* Create Card */}
            {!isLimitReached ? (
              <div className="project-card add-new-card" onClick={() => openModal()}>
                <div className="card-body-center">
                  <div className="add-icon-circle"><Plus size={24} color="#ee1e2d" /></div>
                  <p style={{color:'#ee1e2d', fontWeight:'600', marginTop:'10px'}}>Proyek Baru</p>
                </div>
              </div>
            ) : (
              <div className="project-card add-new-card disabled" style={{opacity:0.6, cursor:'not-allowed', border:'2px dashed #cbd5e0'}}>
                <div className="card-body-center">
                  <Lock size={24} color="#94a3b8" />
                  <p style={{color:'#94a3b8', marginTop:'10px'}}>Batas Tercapai</p>
                </div>
              </div>
            )}

            {/* Read & Delete/Update List */}
            {projects.map((project) => (
              <div key={project.id} className="project-card-container" style={{position:'relative'}}>
                <div className="action-buttons-overlay">
                  <button onClick={() => openModal(project)} className="btn-edit"><Pencil size={14}/></button>
                  <button onClick={() => handleDelete(project.id)} className="btn-delete"><Trash2 size={14}/></button>
                </div>
                
                <Link to={`/projects/${project.id}`} className="project-link">
                  <div className="project-card data-card">
                    <div className={`status-strip ${project.project_status === 'Done' ? 'bg-done' : 'bg-progress'}`}></div>
                    <div className="card-body">
                      <Building2 size={32} color="#ee1e2d" />
                      <h4 className="project-title">{project.project_name}</h4>
                      <p className="project-client">{project.client_name || 'No Client'}</p>
                      <span className="badge-status">{project.project_status}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* --- MODAL CRUD --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProject ? 'Edit Proyek' : 'Tambah Proyek Baru'}</h3>
              <X className="cursor-pointer" onClick={() => setIsModalOpen(false)} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Proyek</label>
                <input 
                  type="text" value={formData.project_name} required
                  onChange={(e) => setFormData({...formData, project_name: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>Klien</label>
                <input 
                  type="text" value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={formData.project_status} onChange={(e) => setFormData({...formData, project_status: e.target.value})}>
                  <option value="Hold">Hold</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-save">{editingProject ? 'Simpan Perubahan' : 'Buat Proyek'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Styles Tambahan ---
const planInfoSidebarStyle = { padding: '15px', margin: '15px', backgroundColor: '#fff5f5', borderRadius: '12px' };
const upgradeBtnStyle = { backgroundColor: '#ee1e2d', color: 'white', padding: '8px 15px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' };

export default ProjectList;