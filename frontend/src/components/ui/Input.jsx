export const Input = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />}
      <input 
        className={`w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-scrum-red outline-none transition-all ${Icon ? 'pl-10' : 'px-4'}`}
        {...props}
      />
    </div>
  </div>
);