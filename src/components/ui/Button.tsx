import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  onClick: () => void;
  className?:string
}

const Button: React.FC<ButtonProps> = ({ text, onClick,className,...props}) => {
  return (
    <button
      onClick={onClick}
      className={`
        bg-telegram-blue
        text-white
        px-4 py-2 rounded-md
        hover:scale-105
        active:scale-95
        transition-transform
        duration-150
        ${className}
      `}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;