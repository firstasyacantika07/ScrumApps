import { useState } from 'react';

const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left font-medium text-gray-800 hover:text-blue-600 transition"
      >
        <span>{title}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600 text-sm leading-relaxed animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionItem;