export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

export const ProjectCard = ({ title, subtitle, icon, onClick }) => (
  <Card className="hover:shadow-md transition-all cursor-pointer group">
    <div className="h-24 bg-rose-50 flex items-center justify-center text-3xl group-hover:bg-rose-100 transition-colors">
      {icon}
    </div>
    <div className="p-5 relative">
      <h3 className="font-bold text-gray-800 text-sm uppercase">{title}</h3>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center text-[10px]">👤</div>
        <span className="text-xs text-gray-400">{subtitle}</span>
      </div>
      <button className="absolute bottom-5 right-5 w-8 h-8 bg-scrum-red text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        →
      </button>
    </div>
  </Card>
);