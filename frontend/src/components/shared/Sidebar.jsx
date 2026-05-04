import { LayoutDashboard, FolderKanban, Users, Info, ChevronLeft } from 'lucide-react';

const Sidebar = () => (
  <aside className="w-64 bg-scrum-dark text-gray-400 flex flex-col shrink-0 transition-all">
    <div className="p-6 flex items-center justify-between text-white">
      <div className="flex items-center gap-3">
        <div className="bg-scrum-red p-1.5 rounded-lg shadow-lg shadow-red-900/20">
          <FolderKanban size={20} />
        </div>
        <span className="font-bold text-lg tracking-tight">SrcumApps</span>
      </div>
      <button className="bg-scrum-red p-1 rounded-md text-white"><ChevronLeft size={14}/></button>
    </div>

    <nav className="flex-1 px-4 py-4 space-y-1.5">
      <SidebarItem icon={<LayoutDashboard size={18}/>} label="Dashboard" />
      <SidebarItem icon={<FolderKanban size={18}/>} label="Proyek" active />
      <SidebarItem icon={<Users size={18}/>} label="Pengguna" />
      <SidebarItem icon={<Info size={18}/>} label="Informasi Sistem" />
    </nav>

    <div className="p-6 text-[10px] text-gray-600 border-t border-gray-800/50">
      © Copyright 2024 ScrumApps.<br/>All Rights Reserved. Version 0.5.0
    </div>
  </aside>
);

const SidebarItem = ({ icon, label, active }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
    active ? 'bg-scrum-red text-white shadow-lg shadow-red-900/20' : 'hover:bg-white/5 hover:text-gray-200'
  }`}>
    {icon}
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

export default Sidebar;