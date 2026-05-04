import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, Info, Bell, Sun, UserCircle } from 'lucide-react';

const Layout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const NavItem = ({ icon, label, path }) => {
    const active = location.pathname === path;

    return (
      <div
        onClick={() => navigate(path)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
          active ? 'bg-scrum-red text-white' : 'hover:bg-gray-800 hover:text-gray-200'
        }`}
      >
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-scrum-bg font-sans">

      {/* SIDEBAR */}
      <aside className="w-64 bg-scrum-dark text-gray-400 flex flex-col">

        <div className="p-6 flex items-center gap-3 text-white">
          <div className="bg-scrum-red p-1.5 rounded-lg">
            <FolderKanban size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">ScrumApps</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">

          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            path="/dashboard"
          />

          <NavItem
            icon={<FolderKanban size={18} />}
            label="Proyek"
            path="/projects"
          />

          <NavItem
            icon={<Users size={18} />}
            label="Pengguna"
            path="/users"
          />

          <NavItem
            icon={<Info size={18} />}
            label="Informasi Sistem"
            path="/info"
          />

        </nav>

        <div className="p-4 text-xs text-gray-600 border-t border-gray-800">
          © Copyright 2024 ScrumApps.
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOPBAR */}
        <header className="h-14 bg-white border-b flex items-center justify-between px-6">
          <div className="text-sm text-gray-500">
            {location.pathname.replace('/', '').toUpperCase() || 'DASHBOARD'}
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <Bell size={18} />
            <Sun size={18} />
            <UserCircle size={18} />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">

            <div className="mb-8">
              <h1 className="text-xl font-bold text-gray-800">{title}</h1>
              <p className="text-sm text-gray-400 mt-1">
                Halaman ini berisi data sesuai menu yang dipilih.
              </p>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;