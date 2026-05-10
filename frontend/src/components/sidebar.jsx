import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Info, 
  ChevronRight, 
  ChevronLeft, 
  Layers3 
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed, userRole }) => {
  // Filter menu berdasarkan role (Sama dengan logika di Dashboard)
  const isRole = (targetRole) => userRole?.toLowerCase().includes(targetRole.toLowerCase());

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, show: true },
    { name: 'Proyek', path: '/projects', icon: <Briefcase size={20} />, show: true },
    { 
      name: 'Pengguna', 
      path: '/users', 
      icon: <Users size={20} />, 
      // Hanya muncul untuk admin atau superadmin sesuai data di database
      show: isRole('Superadmin') 
    },
    { name: 'Sistem', path: '/info', icon: <Info size={20} />, show: true },
  ];

  return (
    <div 
      className={`flex h-screen flex-col bg-[#1b1b28] text-slate-300 relative transition-all duration-300 border-r border-white/5 z-50 shadow-2xl ${
        isCollapsed ? 'w-[80px]' : 'w-[260px]'
      }`}
    >
      {/* TOMBOL TOGGLE SIDEBAR */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-[#ee1e2d] p-1 rounded-lg text-white shadow-lg z-[100] hover:scale-110 transition-all active:scale-95 border border-white/10"
      >
        {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
      </button>

      {/* LOGO SECTION - Disamakan dengan Dashboard Header */}
      <div className={`h-20 flex items-center gap-3 border-b border-white/5 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
        <div className="w-9 h-9 bg-[#ee1e2d] rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-950/20 shrink-0">
          <Layers3 size={20} strokeWidth={2.5}/>
        </div>
        {!isCollapsed && (
          <span className="text-xl font-black text-white tracking-tight">ScrumApps</span>
        )}
      </div>

      {/* NAVIGATION MENU */}
      <nav className={`flex-1 pt-6 space-y-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {menuItems.filter(item => item.show).map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3.5 rounded-xl transition-all duration-300 ${
                isCollapsed ? 'justify-center py-4' : 'px-4 py-3.5'
              } ${
                isActive 
                  ? 'bg-[#ee1e2d] text-white shadow-lg shadow-red-900/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Indikator Titik Kuning */}
                {isActive && !isCollapsed && (
                  <div className="absolute left-1.5 w-1 h-4 bg-yellow-400 rounded-full"></div>
                )}
                
                <div className={`${isActive ? 'text-white' : 'group-hover:text-white'} transition-colors`}>
                  {item.icon}
                </div>

                {!isCollapsed && (
                  <span className="text-sm font-bold tracking-wide whitespace-nowrap">{item.name}</span>
                )}

                {/* Tooltip saat Sidebar Mengecil */}
                {isCollapsed && (
                  <div className="absolute left-16 bg-[#2b2b40] text-white text-[10px] font-black px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all transform translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-50 shadow-2xl border border-white/5 uppercase tracking-widest">
                    {item.name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER - Clean Version */}
      <div className={`p-6 border-t border-white/5 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {!isCollapsed ? (
          <div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[2px]">Core Version</p>
            <p className="text-[9px] text-slate-600 font-bold mt-1">v2.0.26 Build</p>
          </div>
        ) : (
          <div className="w-2 h-2 bg-slate-700 rounded-full animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;