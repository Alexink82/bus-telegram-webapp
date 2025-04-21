tsx
import React, { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={`bg-card dark:bg-[#222222] text-foreground dark:text-[#ffffff] rounded-lg shadow-md p-4 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;