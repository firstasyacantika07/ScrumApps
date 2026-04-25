import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, useParams, Navigate, useNavigate } from 'react-router-dom';
import { 
  Briefcase, LayoutDashboard, Users, Settings, ChevronDown, Plus, 
  MoreVertical, X, RefreshCw, Store, AlertCircle, Calendar, 
  Layout as KanbanIcon, Target, CheckCircle2
} from 'lucide-react';
import api from '../api/axios'; 

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- Global State ---
  const [projectData, setProjectData] = useState(null);
  const [backlogData, setBacklogData] = useState([]);
  const [sprintData, setSprintData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Data ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projRes, backlogRes, sprintRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/backlogs`),
        api.get(`/projects/${id}/sprints`)
      ]);
      
      setProjectData(projRes.data);
      setBacklogData(backlogRes.data);
      setSprintData(sprintRes.data);
    } catch (err) {
      setError("Gagal memuat data proyek. Periksa koneksi backend Anda.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div style={loadingOverlayStyle}><RefreshCw className="animate-spin" /> Memuat Proyek...</div>;

  return (
    <div style={containerStyle}>
      {/* SIDEBAR NAVIGATION */}
      <aside style={sidebarStyle}>
        <div style={sidebarLogoStyle}>
          <div style={logoBoxStyle}><Settings size={18} color="white" /></div>
          <span>ScrumApps</span>
        </div>
        
        <nav style={{ padding: '20px 15px', flex: 1 }}>
          <NavLink to="/projects" style={navLinkStyle}>
            <Briefcase size={18} /> <span>Semua Proyek</span>
          </NavLink>
          
          <div style={{ marginTop: '15px' }}>
            <div style={activeMenuItemStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <LayoutDashboard size={18} /> <span>Detail Proyek</span>
              </div>
              <ChevronDown size={14} />
            </div>
            <div style={treeWrapperStyle}>
              <TreeLink to={`/projects/${id}/vision`} label="Vision Board" icon={<Target size={14} />} />
              <TreeLink to={`/projects/${id}/backlog`} label="Backlog" icon={<RefreshCw size={14} />} />
              <TreeLink to={`/projects/${id}/sprint`} label="Sprint" icon={<CheckCircle2 size={14} />} />
              <TreeLink to={`/projects/${id}/dev`} label="Pengembangan" icon={<KanbanIcon size={14} />} />
              <TreeLink to={`/projects/${id}/calendar`} label="Kalender" icon={<Calendar size={14} />} isLast />
            </div>
          </div>

          <NavLink to={`/projects/${id}/member`} style={navLinkStyle}>
            <Users size={18} /> <span>Tim Pengembang</span>
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={headerStyle}>
          <div style={breadcrumbStyle}>
            <span style={bcBadgeStyle}><Briefcase size={14} /></span>
            <span style={{ color: '#718096' }}>Proyek</span> 
            <span style={{ margin: '0 8px', color: '#cbd5e0' }}>&gt;</span> 
            <span style={bcActiveStyle}>{projectData?.project_name || 'Memuat...'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={fetchData} style={refreshBtnStyle} title="Refresh Data">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <div style={avatarCircleStyle}>
              {projectData?.po_name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        <div style={{ padding: '30px', overflowY: 'auto', flex: 1 }}>
          <ProjectHero data={projectData} />
          
          <Routes>
            <Route path="vision" element={<VisionBoard data={projectData} />} />
            <Route path="backlog" element={<BacklogTable data={backlogData} onRefresh={fetchData} />} />
            <Route path="sprint" element={<SprintTable data={sprintData} />} />
            <Route path="dev" element={<KanbanBoard id={id} />} />
            <Route path="calendar" element={<ProjectCalendar data={sprintData} />} />
            <Route path="*" element={<Navigate to="backlog" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS (PAGES) ---

const VisionBoard = ({ data }) => (
  <div style={cardStyle}>
    <h3 style={cardTitleStyle}>Vision Board</h3>
    <p style={cardDescStyle}>Visi utama untuk proyek: <strong>{data?.project_name}</strong></p>
    <div style={placeholderArea}>
      <Target size={48} color="#edf2f7" />
      <p style={{ marginTop: '10px', color: '#a0aec0' }}>Visi pengembangan sedang disusun oleh Product Owner.</p>
    </div>
  </div>
);

const BacklogTable = ({ data, onRefresh }) => (
  <div style={cardStyle}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h3 style={cardTitleStyle}>Daftar Backlog</h3>
      <button style={btnRedStyle}><Plus size={16} /> Tambah Story</button>
    </div>
    <table style={tableStyle}>
      <thead>
        <tr style={thRowStyle}>
          <th style={thStyle}>No</th>
          <th style={thStyle}>User Story</th>
          <th style={thStyle}>Prioritas</th>
          <th style={thStyle}>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? data.map((item, idx) => (
          <tr key={item.id} style={tdRowStyle}>
            <td style={tdStyle}>{idx + 1}</td>
            <td style={tdStyle}>{item.user_story}</td>
            <td style={tdStyle}>
              <span style={getPriorityStyle(item.priority)}>{item.priority}</span>
            </td>
            <td style={tdStyle}><MoreVertical size={16} cursor="pointer" color="#cbd5e0" /></td>
          </tr>
        )) : (
          <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#a0aec0' }}>Belum ada backlog yang dibuat.</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const KanbanBoard = () => (
  <div style={{ display: 'flex', gap: '20px' }}>
    {['To Do', 'In Progress', 'Done'].map(col => (
      <div key={col} style={kanbanColStyle}>
        <div style={kanbanHeadStyle}>{col}</div>
        <div style={{ padding: '15px', textAlign: 'center', color: '#cbd5e0' }}>Kosong</div>
      </div>
    ))}
  </div>
);

const ProjectCalendar = () => (
  <div style={cardStyle}>
    <h3 style={cardTitleStyle}>Kalender Kegiatan</h3>
    <div style={calendarGrid}>
      {Array.from({ length: 31 }).map((_, i) => (
        <div key={i} style={calendarDay}>
          <span style={{ fontSize: '10px', color: '#cbd5e0' }}>{i + 1}</span>
        </div>
      ))}
    </div>
  </div>
);

const SprintTable = ({ data }) => (
  <div style={cardStyle}>
    <h3 style={cardTitleStyle}>Siklus Sprint</h3>
    {data.length > 0 ? (
       <div style={{ marginTop: '15px' }}>{/* Map data sprint di sini */}</div>
    ) : <p style={{ color: '#a0aec0' }}>Belum ada sprint aktif.</p>}
  </div>
);

const ProjectHero = ({ data }) => (
  <div style={heroWrapper}>
    <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
      <div style={heroIconBox}><Store color="white" size={24} /></div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>{data?.project_name}</h2>
          <span style={statusBadge}>{data?.project_status}</span>
        </div>
        <p style={heroSubText}>
          <strong>{data?.po_name}</strong> • <span style={{ color: '#ee1e2d' }}>{data?.category || 'Internal'}</span> • {data?.duration || 'Jangka Panjang'}
        </p>
      </div>
    </div>
  </div>
);

const TreeLink = ({ to, label, icon, isLast }) => (
  <NavLink to={to} style={({ isActive }) => ({ ...treeLinkStyle, color: isActive ? '#ee1e2d' : '#94a3b8', fontWeight: isActive ? '600' : '400' })}>
    <div style={{ ...treeLine, borderLeft: isLast ? 'none' : '1px solid #4a5568' }}></div>
    <span style={{ marginRight: '10px', display: 'flex' }}>{icon}</span> {label}
  </NavLink>
);

// --- STYLES (OBJECTS) ---
const containerStyle = { display: 'flex', height: '100vh', backgroundColor: '#f8fafc' };
const sidebarStyle = { width: '280px', backgroundColor: '#1a1c23', color: '#94a3b8', display: 'flex', flexDirection: 'column' };
const sidebarLogoStyle = { padding: '25px', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #2d3748' };
const logoBoxStyle = { backgroundColor: '#ee1e2d', padding: '6px', borderRadius: '8px' };
const navLinkStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#94a3b8', textDecoration: 'none', fontSize: '14px', borderRadius: '8px', marginBottom: '4px' };
const activeMenuItemStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#ee1e2d', color: 'white', borderRadius: '8px', fontSize: '14px' };
const treeWrapperStyle = { marginLeft: '25px', marginTop: '10px', borderLeft: '1px solid #2d3748' };
const treeLinkStyle = { display: 'flex', alignItems: 'center', padding: '10px 20px', fontSize: '13px', textDecoration: 'none', position: 'relative' };
const treeLine = { position: 'absolute', left: 0, top: 0, width: '15px', height: '20px', borderBottom: '1px solid #4a5568', borderBottomLeftRadius: '8px' };
const headerStyle = { height: '70px', backgroundColor: 'white', borderBottom: '1px solid #edf2f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' };
const bcBadgeStyle = { backgroundColor: '#ee1e2d', color: 'white', padding: '4px', borderRadius: '4px', display: 'flex' };
const bcActiveStyle = { color: '#1a202c', fontWeight: '700', backgroundColor: '#fff5f5', padding: '4px 10px', borderRadius: '6px' };
const breadcrumbStyle = { display: 'flex', alignItems: 'center', fontSize: '13px' };
const refreshBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0' };
const avatarCircleStyle = { width: '35px', height: '35px', backgroundColor: '#ee1e2d', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' };
const heroWrapper = { backgroundColor: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #edf2f7', marginBottom: '30px' };
const heroIconBox = { backgroundColor: '#ee1e2d', padding: '12px', borderRadius: '12px' };
const statusBadge = { fontSize: '10px', color: '#4299e1', backgroundColor: '#ebf8ff', padding: '2px 10px', borderRadius: '20px', fontWeight: 'bold', textTransform: 'uppercase' };
const heroSubText = { margin: '8px 0 0', fontSize: '13px', color: '#718096' };
const cardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #edf2f7' };
const cardTitleStyle = { margin: '0 0 10px', fontSize: '18px', fontWeight: '700' };
const cardDescStyle = { color: '#a0aec0', fontSize: '13px', margin: 0 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
const thStyle = { textAlign: 'left', padding: '15px', fontSize: '11px', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px' };
const tdStyle = { padding: '15px', fontSize: '14px', color: '#2d3748' };
const thRowStyle = { borderBottom: '1px solid #edf2f7' };
const tdRowStyle = { borderBottom: '1px solid #f7fafc' };
const btnRedStyle = { backgroundColor: '#ee1e2d', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '13px' };
const placeholderArea = { height: '180px', backgroundColor: '#f8fafc', borderRadius: '12px', marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #edf2f7' };
const kanbanColStyle = { flex: 1, backgroundColor: '#f1f5f9', borderRadius: '12px', minHeight: '400px' };
const kanbanHeadStyle = { padding: '15px', fontWeight: 'bold', fontSize: '14px', borderBottom: '2px solid #e2e8f0', color: '#4a5568' };
const calendarGrid = { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginTop: '20px' };
const calendarDay = { height: '50px', backgroundColor: '#f8fafc', border: '1px solid #edf2f7', borderRadius: '8px', padding: '5px' };
const loadingOverlayStyle = { display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', gap: '15px', color: '#ee1e2d', fontWeight: 'bold' };

const getPriorityStyle = (p) => {
  const colors = { High: { bg: '#fff5f5', c: '#e53e3e' }, Medium: { bg: '#fffaf0', c: '#dd6b20' }, Low: { bg: '#f0fff4', c: '#38a169' } };
  const s = colors[p] || { bg: '#f7fafc', c: '#718096' };
  return { backgroundColor: s.bg, color: s.c, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' };
};

export default ProjectDetail;