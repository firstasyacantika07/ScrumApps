import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, Info, ChevronRight, ChevronLeft, Settings } from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Proyek', path: '/projects', icon: <FolderKanban size={20} /> },
    { name: 'Pengguna', path: '/users', icon: <Users size={20} /> },
    { name: 'Informasi Sistem', path: '/info', icon: <Info size={20} /> },
  ];

  return (
    <div className="flex h-screen flex-col bg-[#1e1e2d] text-gray-400 relative transition-all duration-300 border-r border-white/5">
      
      {/* TOMBOL HIDE MENU (Sesuai gambar di sebelah kanan atas sidebar) */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-[#ee1e2d] p-1 rounded-md text-white shadow-lg z-[100] hover:scale-110 transition-all active:scale-95"
      >
        {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
      </button>

      {/* LOGO SECTION */}
      <div className={`flex items-center gap-3 py-8 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
        <div className="flex items-center gap-2">
          <div className="relative flex h-10 w-10 items-center justify-center shrink-0">
             {/* Icon melingkar sesuai gambar referensi */}
             <div className="absolute inset-0 border-4 border-[#ee1e2d] rounded-full border-t-transparent -rotate-45"></div>
             <Settings className="text-[#ee1e2d] fill-[#ee1e2d]" size={18} />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white tracking-tight whitespace-nowrap">SrcumApps</h1>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="px-6 mb-6">
          <div className="border-t border-dashed border-gray-700 opacity-30"></div>
        </div>
      )}

      {/* NAVIGATION MENU */}
      <nav className={`flex-1 space-y-1 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl transition-all duration-300 ${
                isCollapsed ? 'justify-center py-4' : 'px-4 py-3.5'
              } ${
                isActive 
                  ? 'bg-[#ee1e2d] text-white shadow-xl shadow-red-900/20' 
                  : 'text-gray-400 hover:bg-[#2b2b40] hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Indikator Titik Kuning di sebelah kiri */}
                {isActive && (
                  <div className="absolute left-1.5 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_8px_#facc15]"></div>
                )}
                
                <div className={`${isActive ? 'text-white' : 'text-red-500 group-hover:text-white'} transition-colors`}>
                  {item.icon}
                </div>

                {!isCollapsed && (
                  <span className="font-bold text-sm tracking-wide whitespace-nowrap">{item.name}</span>
                )}

                {/* Tooltip sederhana saat menu mengecil */}
                {isCollapsed && (
                  <div className="absolute left-16 bg-[#2b2b40] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                    {item.name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className={`p-6 border-t border-gray-800/50 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {!isCollapsed ? (
          <p className="text-[10px] text-gray-500 font-medium">© 2024 ScrumApps.</p>
        ) : (
          <div className="w-6 h-0.5 bg-gray-700 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;