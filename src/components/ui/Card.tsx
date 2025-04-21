tsx
import React, { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`
      bg-card dark:bg-card 
      text-foreground dark:text-foreground 
      rounded-lg shadow-md border border-border p-4 ${className}`}>
        {children}
    </div>
  );
};
export default Card;