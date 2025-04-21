import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-telegram-blue text-white px-4 py-2 rounded-md hover:scale-105 active:scale-95 transition-transform duration-150 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;