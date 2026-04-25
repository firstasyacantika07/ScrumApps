import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, NavLink, useParams, Navigate } from 'react-router-dom';
import { 
  Briefcase, LayoutDashboard, Users, Calendar, Settings, 
  ChevronDown, Plus, Monitor, MoreVertical, Search, X, Eye, Pencil, Trash2,
  CheckCircle, Clock, Link as LinkIcon, FileText, Layout, Store,
  Bell, Sun, Moon, User, Shield, ChevronRight
} from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  
  // --- STATE MODAL ---
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [isBacklogModalOpen, setIsBacklogModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isKanbanModalOpen, setIsKanbanModalOpen] = useState(false);

  // --- NEW STATE: TOP NAV DROPDOWNS ---
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const profileRef = useRef(null);
  const themeRef = useRef(null);

  // --- STATE DATA ---
  const [visionData, setVisionData] = useState([{ id: 1, name: 'Versi 1.0 - Initial Release' }]);
  const [backlogData, setBacklogData] = useState([]);
  const [sprintData, setSprintData] = useState([]);
  const [kanbanData, setKanbanData] = useState([]);

  // --- STATE FORM INPUT ---
  const [newSprint, setNewSprint] = useState({
    nama: '', deskripsi: '', tanggalMulai: '', tanggalBerakhir: '', status: false
  });

  const [newBacklog, setNewBacklog] = useState({
    userStory: '', deskripsi: '', prioritas: '', status: false, sprint: '', ditujukan: '', dibuatOleh: 'Clariva PO'
  });

  const [newKanban, setNewKanban] = useState({
    nama: '', deskripsi: '', lampiranLink: '', lampiranFile: null
  });

  // --- HANDLERS ---
  const handleSaveBacklog = () => {
    if (newBacklog.userStory) {
      setBacklogData([...backlogData, { ...newBacklog, id: Date.now() }]);
      setIsBacklogModalOpen(false);
      setNewBacklog({ userStory: '', deskripsi: '', prioritas: '', status: false, sprint: '', ditujukan: '', dibuatOleh: 'Clariva PO' });
    }
  };

  const handleSaveSprint = () => {
    if (newSprint.nama) {
      setSprintData([...sprintData, { ...newSprint, id: Date.now() }]);
      setIsSprintModalOpen(false);
      setNewSprint({ nama: '', deskripsi: '', tanggalMulai: '', tanggalBerakhir: '', status: false });
    }
  };

  const handleSaveKanban = () => {
    if (newKanban.nama) {
      setKanbanData([...kanbanData, { ...newKanban, id: Date.now(), status: 'To Do' }]);
      setIsKanbanModalOpen(false);
      setNewKanban({ nama: '', deskripsi: '', lampiranLink: '', lampiranFile: null });
    }
  };

  // --- LOGIC CLOSE DROPDOWNS ON CLICK OUTSIDE ---
  useEffect(() => {
    const closeDropdowns = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
      if (themeRef.current && !themeRef.current.contains(e.target)) setIsThemeOpen(false);
    };
    document.addEventListener("mousedown", closeDropdowns);
    return () => document.removeEventListener("mousedown", closeDropdowns);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* RENDER SEMUA MODAL */}
      {isMemberModalOpen && <AddMemberModal onClose={() => setIsMemberModalOpen(false)} />}
      {isVisionModalOpen && <AddVisionModal onClose={() => setIsVisionModalOpen(false)} />}
      {isBacklogModalOpen && <AddBacklogModal onClose={() => setIsBacklogModalOpen(false)} data={newBacklog} setData={setNewBacklog} onSave={handleSaveBacklog} />}
      {isSprintModalOpen && <AddSprintModal onClose={() => setIsSprintModalOpen(false)} data={newSprint} setData={setNewSprint} onSave={handleSaveSprint} />}
      {isKanbanModalOpen && <AddKanbanModal onClose={() => setIsKanbanModalOpen(false)} data={newKanban} setData={setNewKanban} onSave={handleSaveKanban} />}
      
      {/* SIDEBAR */}
      <aside style={sidebarStyle}>
        <div style={sidebarLogoStyle}>
          <div style={logoIconStyle}><Settings size={18} color="white" /></div>
          <span>ScrumApps</span>
        </div>
        <nav style={{ padding: '20px 15px', flex: 1 }}>
          <NavLink to="/projects" style={navLinkStyle}><Briefcase size={18} /> Proyek</NavLink>
          <div style={{ marginTop: '10px' }}>
            <div style={activeDetailMenuStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><LayoutDashboard size={18} /> Detail</div>
              <ChevronDown size={14} />
            </div>
            <div style={treeWrapperStyle}>
              <TreeLink to={`/projects/${id}/vision-board`} label="Vision Board" />
              <TreeLink to={`/projects/${id}/backlog`} label="Backlog" />
              <TreeLink to={`/projects/${id}/sprint`} label="Sprint" />
              <TreeLink to={`/projects/${id}/pengembangan`} label="Pengembangan" isLast />
            </div>
          </div>
          <NavLink to={`/projects/${id}/kalender`} style={navLinkStyle}><Calendar size={18} /> Kalender</NavLink>
          <NavLink to={`/projects/${id}/member`} style={navLinkStyle}><Users size={18} /> Member</NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* TOP NAVIGATION UPDATED WITH THEME & PROFILE */}
        <header style={topNavStyle}>
           <div style={breadcrumbStyle}>
             <span style={bcIconStyle}><Briefcase size={14}/></span> 
             Proyek &gt; <span style={bcActiveStyle}>Detail</span>
           </div>

           <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
             {/* Notification Icon */}
             <button style={btnRawStyle}><Bell size={20} color="#a0aec0" /></button>

             {/* Theme Switcher */}
             <div style={{ position: 'relative' }} ref={themeRef}>
               <button onClick={() => setIsThemeOpen(!isThemeOpen)} style={btnRawStyle}>
                 <Sun size={20} color="#ee1e2d" />
               </button>
               {isThemeOpen && (
                 <div style={dropdownThemeStyle}>
                   <div style={themeItemStyleActive}><Sun size={16} color="#ee1e2d" /> Light</div>
                   <div style={themeItemStyle}><Moon size={16} /> Dark</div>
                   <div style={themeItemStyle}><Monitor size={16} /> System</div>
                 </div>
               )}
             </div>

             {/* User Profile Dropdown */}
             <div style={{ position: 'relative' }} ref={profileRef}>
               <div 
                 onClick={() => setIsProfileOpen(!isProfileOpen)} 
                 style={{ ...avatarStyle, cursor: 'pointer' }}
               >
                 AD
               </div>
               
               {isProfileOpen && (
                 <div style={profileDropdownContainer}>
                   {/* Info User */}
                   <div style={profileHeaderInfo}>
                     <div style={smallAvatarStyle}><Monitor size={14} /></div>
                     <div>
                       <div style={{ fontWeight: '700', fontSize: '13px' }}>Super Admin ScrumA...</div>
                       <div style={{ fontSize: '11px', color: '#a0aec0' }}>Superadmin</div>
                     </div>
                   </div>
                   <hr style={dividerStyle} />
                   {/* Menu Items */}
                   <div style={dropdownItemStyle}><User size={14} /> Profil Saya</div>
                   <div style={dropdownItemStyle}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}><Settings size={14} /> Pengaturan</div>
                     <ChevronRight size={12} />
                   </div>
                   <div style={dropdownItemStyle}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, color: '#ee1e2d' }}><Shield size={14} /> Keamanan</div>
                     <ChevronRight size={12} />
                   </div>
                   <button style={btnLogoutStyle}>Keluar</button>
                 </div>
               )}
             </div>
           </div>
        </header>

        <div style={{ padding: '30px', flex: 1, overflowY: 'auto' }}>
          {/* HEADER INFO PROYEK */}
          <ProjectHeaderInfo />
          
          <Routes>
            <Route path="vision-board" element={
              <ContentCard title="Daftar Vision Board" desc="Halaman ini digunakan untuk mendeskripsikan proyek sesuai dengan versi pengembangan.">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                  <button onClick={() => setIsVisionModalOpen(true)} style={btnAddRed}><Plus size={16} /> Tambah</button>
                </div>
                {visionData.map((item) => (
                  <div key={item.id} style={visionCardItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={visionIconBox}><LayoutDashboard size={20} color="#ee1e2d" /></div>
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>{item.name}</span>
                    </div>
                    <ActionMenu onEdit={() => {}} onDelete={() => setVisionData(visionData.filter(v => v.id !== item.id))} />
                  </div>
                ))}
              </ContentCard>
            } />

            <Route path="backlog" element={
              <ContentCard title="Daftar Backlog" desc="Halaman ini digunakan untuk menyimpan daftar Backlog pada proyek.">
                <div style={tableHeaderAction}>
                  <button onClick={() => setIsBacklogModalOpen(true)} style={btnAddRed}><Plus size={16} /> Tambah</button>
                </div>
                <table style={tableStyle}>
                  <thead>
                    <tr style={tableRowHeadStyle}>
                      <th style={thStyle}>No</th>
                      <th style={thStyle}>User Story</th>
                      <th style={thStyle}>Prioritas</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backlogData.length > 0 ? backlogData.map((item, idx) => (
                      <tr key={item.id} style={tableRowBodyStyle}>
                        <td style={tdStyle}>{idx + 1}</td>
                        <td style={tdStyle}>{item.userStory}</td>
                        <td style={tdStyle}><span style={getPriorityBadge(item.prioritas)}>{item.prioritas}</span></td>
                        <td style={tdStyle}>{item.status ? 'Selesai' : 'Pending'}</td>
                        <td style={tdStyle}><ActionMenu onEdit={() => {}} onDelete={() => setBacklogData(backlogData.filter(b => b.id !== item.id))} /></td>
                      </tr>
                    )) : <tr><td colSpan="5" style={emptyTableStyle}>Tidak ada data backlog</td></tr>}
                  </tbody>
                </table>
              </ContentCard>
            } />

            <Route path="sprint" element={
              <ContentCard title="Daftar Sprint" desc="Halaman ini digunakan untuk menyimpan daftar sprint pada proyek.">
                <div style={tableHeaderAction}>
                  <button onClick={() => setIsSprintModalOpen(true)} style={btnAddRed}><Plus size={16} /> Tambah</button>
                </div>
                <table style={tableStyle}>
                  <thead>
                    <tr style={tableRowHeadStyle}>
                      <th style={thStyle}>No</th>
                      <th style={thStyle}>Nama</th>
                      <th style={thStyle}>Mulai</th>
                      <th style={thStyle}>Berakhir</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sprintData.length > 0 ? sprintData.map((item, idx) => (
                      <tr key={item.id} style={tableRowBodyStyle}>
                        <td style={tdStyle}>{idx + 1}</td>
                        <td style={tdStyle}>{item.nama}</td>
                        <td style={tdStyle}>{item.tanggalMulai}</td>
                        <td style={tdStyle}>{item.tanggalBerakhir}</td>
                        <td style={tdStyle}>
                          <span style={{ 
                            backgroundColor: item.status ? '#d1fae5' : '#f3f4f6', 
                            color: item.status ? '#10b981' : '#6b7280',
                            padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600'
                          }}>{item.status ? 'Selesai' : 'Aktif'}</span>
                        </td>
                        <td style={tdStyle}><ActionMenu onEdit={() => {}} onDelete={() => setSprintData(sprintData.filter(s => s.id !== item.id))} /></td>
                      </tr>
                    )) : <tr><td colSpan="6" style={emptyTableStyle}>Tidak ada data sprint</td></tr>}
                  </tbody>
                </table>
              </ContentCard>
            } />

            <Route path="pengembangan" element={
              <div style={{ padding: '0px' }}>
                <div style={headerKanbanStyle}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Halaman Pengembangan</h3>
                    <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#a0aec0' }}>Halaman ini digunakan untuk menyimpan daftar pengembangan proyek.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button style={btnTrelloStyle}><Layout size={16} /> Integrasikan dengan Trello</button>
                    <button onClick={() => setIsKanbanModalOpen(true)} style={btnAddRed}><Plus size={16} /> Tambah</button>
                  </div>
                </div>
                <div style={kanbanGridStyle}>
                  <KanbanColumn title="To Do" color="#3b82f6" items={kanbanData.filter(i => i.status === 'To Do')} />
                  <KanbanColumn title="In Progress" color="#f59e0b" items={kanbanData.filter(i => i.status === 'In Progress')} />
                  <KanbanColumn title="Quality Assurance" color="#8b5cf6" items={kanbanData.filter(i => i.status === 'Quality Assurance')} />
                  <KanbanColumn title="Done" color="#10b981" items={kanbanData.filter(i => i.status === 'Done')} />
                </div>
              </div>
            } />

            <Route path="kalender" element={<CalendarContent />} />
            <Route path="member" element={
              <ContentCard title="Daftar Member" desc="Tim pengembang proyek.">
                <div style={tableHeaderAction}>
                  <button onClick={() => setIsMemberModalOpen(true)} style={btnAddRed}><Plus size={16} /> Tambah</button>
                </div>
                <div style={emptyTableStyle}>Tidak ada data member</div>
              </ContentCard>
            } />
            <Route path="*" element={<Navigate to="vision-board" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

// --- LOGIKA HEADER INFO & MENU TITIK TIGA ---
const ProjectHeaderInfo = () => {
  const { id } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Database Proyek (ID string sesuai URL)
  const projectDatabase = {
    "15": { 
      name: 'TOKO BANGUNAN', 
      type: 'Eksternal', 
      po: 'Clariva PO', 
      range: '01 Juni 2025, 05:30 - 09 Juli 2025, 08:05',
      icon: <Store color="white" /> 
    },
    "16": { 
      name: 'TOKO SEPEDA', 
      type: 'Eksternal', 
      po: 'Clariva PO', 
      range: '10 Juli 2025, 09:00 - 20 Agustus 2025, 17:00',
      icon: <Monitor color="white" /> 
    }
  };

  const currentProject = projectDatabase[String(id)] || { 
    name: 'PROYEK BARU', 
    type: 'Internal', 
    po: 'Admin PO', 
    range: '-',
    icon: <Monitor color="white" /> 
  };

  useEffect(() => {
    const closeMenu = (e) => { 
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false); 
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '25px', border: '1px solid #edf2f7' }}>
      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{ backgroundColor: '#ee1e2d', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {currentProject.icon}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>{currentProject.name}</h2>
            <span style={{ fontSize: '10px', color: '#4299e1', backgroundColor: '#ebf8ff', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>Hold</span>
          </div>
          <p style={{ fontSize: '12px', color: '#a0aec0', margin: '5px 0 0' }}>
            {currentProject.po} • <span style={{ color: '#ee1e2d', fontWeight: '600' }}>{currentProject.type}</span> • {currentProject.range}
          </p>
        </div>
      </div>

      <div style={{ position: 'relative' }} ref={menuRef}>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={btnRawStyle}>
          <MoreVertical size={20} color="#cbd5e0" />
        </button>
        {isMenuOpen && (
          <div style={dropdownHeaderStyle}>
            <div style={dropdownItemStyle} onClick={() => { alert('Edit Proyek'); setIsMenuOpen(false); }}>
              <Pencil size={14} /> Edit Proyek
            </div>
            <div style={{ ...dropdownItemStyle, color: '#ee1e2d' }} onClick={() => { alert('Hapus Proyek'); setIsMenuOpen(false); }}>
              <Trash2 size={14} /> Hapus Proyek
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB-KOMPONEN PENUNJANG ---

const KanbanColumn = ({ title, color, items }) => (
  <div style={columnStyle}>
    <div style={{ ...columnHeaderStyle, backgroundColor: color }}>{title}</div>
    <div style={columnBodyStyle}>
      {items.map(item => (
        <div key={item.id} style={cardKanbanStyle}>
          <div style={{ fontWeight: '600', fontSize: '13px' }}>{item.nama}</div>
          <div style={{ fontSize: '11px', color: '#718096', marginTop: '4px' }}>{item.deskripsi}</div>
        </div>
      ))}
    </div>
  </div>
);

const AddKanbanModal = ({ onClose, data, setData, onSave }) => (
  <div style={modalOverlayStyle}>
    <div style={{ ...modalContentStyle, width: '700px' }}>
      <div style={modalTitleFlex}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Tambah Kanban Board</h3>
        <button onClick={onClose} style={btnRawStyle}><X size={20} color="#a0aec0" /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={labelStyle}>Nama</label>
          <input type="text" placeholder="Nama Kanban Board" style={inputStyle} value={data.nama} onChange={(e) => setData({...data, nama: e.target.value})} />
        </div>
        <div>
          <label style={labelStyle}>Deskripsi</label>
          <textarea placeholder="Deskripsi Kanban Board" style={{ ...inputStyle, height: '80px', resize: 'none' }} value={data.deskripsi} onChange={(e) => setData({...data, deskripsi: e.target.value})} />
        </div>
        <div>
          <label style={labelStyle}>Lampiran</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={inputIconWrapper}>
              <LinkIcon size={14} color="#a0aec0" />
              <input type="text" placeholder="Lampiran Link" style={bareInputStyle} value={data.lampiranLink} onChange={(e) => setData({...data, lampiranLink: e.target.value})} />
            </div>
            <div style={inputIconWrapper}>
              <FileText size={14} color="#a0aec0" />
              <input type="file" style={bareInputStyle} onChange={(e) => setData({...data, lampiranFile: e.target.files[0]})} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px' }}>
        <button onClick={onSave} style={{ ...btnSaveStyle, width: '100%' }}>Simpan Data Kanban</button>
      </div>
    </div>
  </div>
);

const AddSprintModal = ({ onClose, data, setData, onSave }) => (
  <div style={modalOverlayStyle}>
    <div style={{ ...modalContentStyle, width: '650px' }}>
      <div style={modalTitleFlex}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Tambah Sprint</h3>
        <button onClick={onClose} style={btnRawStyle}><X size={20} color="#a0aec0" /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={formRowStyle}>
          <label style={labelRowStyle}>Nama</label>
          <input type="text" placeholder="Nama Sprint Proyek" style={inputStyle} value={data.nama} onChange={(e) => setData({...data, nama: e.target.value})} />
        </div>
        <VisionTextArea label="Deskripsi Sprint" placeholder="Deskripsikan sprint ini..." />
        <div style={formRowStyle}>
          <label style={labelRowStyle}><Calendar size={14}/> Mulai</label>
          <input type="date" style={inputStyle} value={data.tanggalMulai} onChange={(e) => setData({...data, tanggalMulai: e.target.value})} />
        </div>
        <div style={formRowStyle}>
          <label style={labelRowStyle}><Calendar size={14}/> Berakhir</label>
          <input type="date" style={inputStyle} value={data.tanggalBerakhir} onChange={(e) => setData({...data, tanggalBerakhir: e.target.value})} />
        </div>
        <div style={formRowStyle}>
          <label style={labelRowStyle}><CheckCircle size={14}/> Selesai</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={data.status} onChange={(e) => setData({...data, status: e.target.checked})} />
            <span style={{ fontSize: '13px' }}>Status Selesai</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '25px' }}>
        <button onClick={onClose} style={btnCancelStyle}>Batal</button>
        <button onClick={onSave} style={btnSaveStyle}>Simpan</button>
      </div>
    </div>
  </div>
);

const AddBacklogModal = ({ onClose, data, setData, onSave }) => (
  <div style={modalOverlayStyle}>
    <div style={{ ...modalContentStyle, width: '600px' }}>
      <div style={modalTitleFlex}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Tambah Backlog</h3>
        <button onClick={onClose} style={btnRawStyle}><X size={20} color="#a0aec0" /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <textarea placeholder="Masukkan User Story Proyek" style={{ ...inputStyle, height: '80px', resize: 'none' }} value={data.userStory} onChange={(e) => setData({...data, userStory: e.target.value})} />
        <div style={formRowStyle}><label style={labelRowStyle}><Pencil size={14}/> Deskripsi</label><input type="text" placeholder="Deskripsi" style={inputStyle} value={data.deskripsi} onChange={(e) => setData({...data, deskripsi: e.target.value})} /></div>
        <div style={formRowStyle}><label style={labelRowStyle}><Clock size={14}/> Prioritas</label>
          <select style={selectStyle} value={data.prioritas} onChange={(e) => setData({...data, prioritas: e.target.value})}>
            <option value="">Pilih</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div><label style={labelStyle}>Sprint</label><select style={selectStyle}><option>Pilih Sprint</option></select></div>
          <div><label style={labelStyle}>Ditujukan</label><input type="text" style={inputStyle} value={data.ditujukan} onChange={(e) => setData({...data, ditujukan: e.target.value})} /></div>
        </div>
      </div>
      <button onClick={onSave} style={{ ...btnSaveStyle, width: '100%', marginTop: '20px' }}>Simpan Data Backlog</button>
    </div>
  </div>
);

const AddVisionModal = ({ onClose }) => (
  <div style={modalOverlayStyle}>
    <div style={{ ...modalContentStyle, width: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={modalTitleFlex}><h3>Tambah Vision Board</h3><button onClick={onClose} style={btnRawStyle}><X size={20}/></button></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div><label style={labelStyle}>Nama</label><input type="text" style={inputStyle} /></div>
        <VisionTextArea label="Vision (Visi)" placeholder="Deskripsikan visi proyek..." />
        <VisionTextArea label="Target Group" placeholder="Siapa pengguna target?" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
        <button onClick={onClose} style={btnCancelStyle}>Batal</button>
        <button style={btnSaveStyle}>Simpan</button>
      </div>
    </div>
  </div>
);

const AddMemberModal = ({ onClose }) => (
  <div style={modalOverlayStyle}>
    <div style={modalContentStyle}>
      <div style={modalTitleFlex}><h3>Tambah Member</h3><button onClick={onClose} style={btnRawStyle}><X size={20}/></button></div>
      <div style={{ marginBottom: '15px' }}><label style={labelStyle}>Team Developer</label><select style={selectStyle}><option>Pilih Team</option></select></div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}><button onClick={onClose} style={btnCancelStyle}>Batal</button><button style={btnSaveStyle}>Simpan</button></div>
    </div>
  </div>
);

const ActionMenu = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    const closeMenu = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);
  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} style={btnRawStyle}><MoreVertical size={18} color="#cbd5e0" /></button>
      {isOpen && (
        <div style={dropdownMenuStyle}>
          <div style={dropdownItemStyle} onClick={() => { onEdit(); setIsOpen(false); }}><Pencil size={14} /> Edit</div>
          <div style={{ ...dropdownItemStyle, color: '#ee1e2d' }} onClick={() => { onDelete(); setIsOpen(false); }}><Trash2 size={14} /> Hapus</div>
        </div>
      )}
    </div>
  );
};

const VisionTextArea = ({ label, placeholder }) => (
  <div style={{ marginBottom: '15px' }}>
    <label style={labelStyle}>{label}</label>
    <div style={richTextToolbar}>
        <div style={{ display: 'flex', gap: '8px', padding: '8px', borderBottom: '1px solid #edf2f7' }}>
          <span style={toolIconStyle}>B</span><span style={toolIconStyle}>I</span><span style={toolIconStyle}>U</span>
        </div>
        <textarea placeholder={placeholder} style={visionTextAreaStyle}></textarea>
    </div>
  </div>
);

const TreeLink = ({ to, label, isLast }) => (
  <NavLink to={to} style={({isActive}) => ({ ...treeLinkStyle, color: isActive ? '#ee1e2d' : '#94a3b8', fontWeight: isActive ? '600' : '400' })}>
    <div style={{ ...treeBranchLine, borderLeft: isLast ? 'none' : '1px solid #4a5568' }}></div>{label}
  </NavLink>
);

const ContentCard = ({ title, desc, children }) => (
  <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #edf2f7', marginBottom: '20px' }}>
    <div style={{ padding: '20px', borderBottom: '1px solid #f7fafc' }}>
      <h3 style={{ margin: 0, fontSize: '16px' }}>{title}</h3>
      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#a0aec0' }}>{desc}</p>
    </div>
    <div style={{ padding: '20px' }}>{children}</div>
  </div>
);

const CalendarContent = () => (
  <ContentCard title="Kalender Proyek" desc="Tanggal-tanggal pengembangan proyek.">
    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
      <div style={legendItem}><div style={{ ...dotStyle, backgroundColor: '#ecc94b' }}></div> Mulai</div>
      <div style={legendItem}><div style={{ ...dotStyle, backgroundColor: '#48bb78' }}></div> Berakhir</div>
    </div>
    <div style={calendarContainer}>
      <div style={calendarHeaderUI}><h2 style={{ fontSize: '18px', margin: 0 }}>April 2026</h2></div>
      <div style={gridCalendar}>
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => <div key={d} style={dayHead}>{d}</div>)}
        {Array.from({length: 30}).map((_, i) => <div key={i} style={dayCell}>{i + 1}</div>)}
      </div>
    </div>
  </ContentCard>
);

// --- STYLES ---
const sidebarStyle = { width: '260px', backgroundColor: '#1a1c23', color: '#94a3b8', display: 'flex', flexDirection: 'column' };
const sidebarLogoStyle = { padding: '25px', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' };
const logoIconStyle = { backgroundColor: '#ee1e2d', padding: '6px', borderRadius: '8px' };
const navLinkStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#94a3b8', textDecoration: 'none', fontSize: '14px' };
const activeDetailMenuStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#ee1e2d', color: 'white', borderRadius: '8px' };
const treeWrapperStyle = { marginLeft: '25px', marginTop: '5px' };
const treeLinkStyle = { display: 'block', padding: '8px 25px', fontSize: '13px', textDecoration: 'none', position: 'relative' };
const treeBranchLine = { position: 'absolute', left: -1, top: 0, width: '15px', height: '18px', borderLeft: '1px solid #4a5568', borderBottom: '1px solid #4a5568', borderBottomLeftRadius: '8px' };
const topNavStyle = { height: '70px', backgroundColor: 'white', borderBottom: '1px solid #edf2f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' };
const breadcrumbStyle = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' };
const bcIconStyle = { backgroundColor: '#ee1e2d', color: 'white', padding: '4px', borderRadius: '4px' };
const bcActiveStyle = { backgroundColor: '#fff5f5', color: '#ee1e2d', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' };
const avatarStyle = { width: '35px', height: '35px', backgroundColor: '#ee1e2d', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' };
const btnAddRed = { backgroundColor: '#ee1e2d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' };
const headerKanbanStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #edf2f7' };
const kanbanGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' };
const columnStyle = { backgroundColor: 'white', borderRadius: '12px', minHeight: '450px', border: '1px solid #edf2f7', overflow: 'hidden' };
const columnHeaderStyle = { padding: '12px 20px', color: 'white', fontWeight: '600', fontSize: '14px' };
const columnBodyStyle = { padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' };
const cardKanbanStyle = { padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #edf2f7', borderRadius: '8px' };
const btnTrelloStyle = { background: 'none', border: 'none', color: '#1a1c23', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' };
const modalTitleFlex = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#4a5568' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #edf2f7', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontSize: '13px' };
const selectStyle = { ...inputStyle };
const btnSaveStyle = { backgroundColor: '#ee1e2d', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };
const btnCancelStyle = { backgroundColor: '#f7fafc', color: '#a0aec0', border: 'none', padding: '10px 25px', borderRadius: '8px', cursor: 'pointer' };
const btnRawStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center' };
const bareInputStyle = { border: 'none', background: 'none', width: '100%', fontSize: '13px', outline: 'none' };
const inputIconWrapper = { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #edf2f7', borderRadius: '6px' };
const formRowStyle = { display: 'flex', alignItems: 'center', gap: '15px' };
const labelRowStyle = { minWidth: '120px', fontSize: '13px', color: '#4a5568', display: 'flex', alignItems: 'center', gap: '8px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
const tableRowHeadStyle = { borderBottom: '1px solid #edf2f7', textAlign: 'left' };
const tableRowBodyStyle = { borderBottom: '1px solid #f7fafc' };
const thStyle = { padding: '12px', fontSize: '13px', color: '#a0aec0', fontWeight: '500' };
const tdStyle = { padding: '12px', fontSize: '13px', color: '#2d3748' };
const emptyTableStyle = { textAlign: 'center', padding: '60px', color: '#cbd5e0', fontSize: '13px', borderTop: '1px solid #edf2f7' };
const tableHeaderAction = { display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' };
const getPriorityBadge = (p) => {
  const colors = { High: '#fee2e2', Medium: '#fef3c7', Low: '#d1fae5' };
  const text = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
  return { backgroundColor: colors[p] || '#f8fafc', color: text[p] || '#4a5568', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' };
};
const dropdownMenuStyle = { position: 'absolute', right: 0, top: '35px', backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderRadius: '12px', zIndex: 100, minWidth: '160px', border: '1px solid #edf2f7', padding: '8px' };
const dropdownHeaderStyle = { position: 'absolute', right: 0, top: '25px', backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderRadius: '8px', zIndex: 100, minWidth: '160px', border: '1px solid #edf2f7', padding: '6px' };
const dropdownItemStyle = { padding: '10px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', borderRadius: '8px', transition: '0.2s', color: '#4a5568' };
const visionCardItem = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #edf2f7', marginBottom: '10px' };
const visionIconBox = { backgroundColor: '#fff5f5', padding: '10px', borderRadius: '10px' };
const visionTextAreaStyle = { width: '100%', minHeight: '80px', border: 'none', padding: '10px', outline: 'none', resize: 'vertical', fontSize: '13px' };
const richTextToolbar = { border: '1px solid #edf2f7', borderRadius: '6px', backgroundColor: 'white' };
const toolIconStyle = { fontSize: '14px', fontWeight: 'bold', color: '#a0aec0', cursor: 'pointer', padding: '2px 6px' };
const legendItem = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' };
const dotStyle = { width: '10px', height: '10px', borderRadius: '2px', transform: 'rotate(45deg)' };
const calendarContainer = { border: '1px solid #edf2f7', borderRadius: '8px' };
const calendarHeaderUI = { padding: '20px', borderBottom: '1px solid #edf2f7' };
const gridCalendar = { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' };
const dayHead = { padding: '15px', textAlign: 'center', borderBottom: '1px solid #edf2f7', fontWeight: '600', fontSize: '14px' };
const dayCell = { height: '100px', padding: '10px', textAlign: 'right', borderBottom: '1px solid #edf2f7', borderRight: '1px solid #edf2f7', color: '#a0aec0', fontSize: '12px' };

// NEW COMPONENT STYLES FOR TOP NAV DROPDOWNS
const dropdownThemeStyle = {
  position: 'absolute', right: 0, top: '40px', backgroundColor: 'white',
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', borderRadius: '8px',
  zIndex: 100, minWidth: '130px', border: '1px solid #edf2f7', padding: '6px'
};

const themeItemStyle = {
  padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px',
  cursor: 'pointer', borderRadius: '6px', color: '#4a5568'
};

const themeItemStyleActive = {
  ...themeItemStyle, backgroundColor: '#fff5f5', color: '#ee1e2d', fontWeight: '600'
};

const profileDropdownContainer = {
  position: 'absolute', right: 0, top: '45px', backgroundColor: 'white',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', borderRadius: '12px',
  zIndex: 100, minWidth: '220px', border: '1px solid #edf2f7', padding: '12px'
};

const profileHeaderInfo = {
  display: 'flex', alignItems: 'center', gap: '12px', padding: '8px'
};

const smallAvatarStyle = {
  width: '32px', height: '32px', backgroundColor: '#f1f5f9', color: '#a0aec0',
  borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const btnLogoutStyle = {
  width: '100%', backgroundColor: '#ee1e2d', color: 'white', border: 'none',
  padding: '10px', borderRadius: '8px', marginTop: '10px', cursor: 'pointer',
  fontWeight: '600', fontSize: '13px'
};

const dividerStyle = { border: 'none', borderTop: '1px solid #edf2f7', margin: '8px 0' };

export default ProjectDetail;