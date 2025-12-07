import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl p-8 transition-all duration-200 hover:shadow-2xl ${
        onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
