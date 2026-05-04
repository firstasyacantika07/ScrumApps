import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-scrum-red text-white hover:bg-red-700 shadow-md shadow-red-200',
    secondary: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-600 hover:bg-gray-50',
    ghost: 'text-gray-400 hover:text-scrum-red hover:bg-rose-50'
  };

  return (
    <button 
      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;