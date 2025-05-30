tsx
import React from 'react';

interface InputProps {
  type?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className,
  label,
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-telegram-blue bg-background border-border dark:bg-[#333] dark:border-[#444]`}
      />
    </div>
  );
};

export default Input;