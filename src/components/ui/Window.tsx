import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WindowProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  zIndex?: number;
  initialX?: number;
  initialY?: number;
  width?: string | number;
  height?: string | number;
  onClose?: () => void;
  isActive?: boolean;
  setActive?: () => void;
  className?: string;
  statusBarStyle?: 'default' | 'alternate';
}

const Window: React.FC<WindowProps> = ({
  title,
  icon,
  children,
  zIndex = 1,
  initialX = 0,
  initialY = 0,
  width = 'auto',
  height = 'auto',
  onClose,
  isActive = false,
  setActive,
  className = '',
  statusBarStyle = 'default',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const windowRef = useRef<HTMLDivElement>(null);

  // Обработчик клика по окну для активации
  const handleWindowClick = () => {
    if (setActive) {
      setActive();
    }
  };

  // Предотвращаем клик на содержимом, если окно перемещается
  const handleContentClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.stopPropagation();
    }
  };

  // Установка фокуса на окно при монтировании, если оно активно
  useEffect(() => {
    if (isActive && windowRef.current) {
      windowRef.current.focus();
    }
  }, [isActive]);

  // Генерация иконок статус-бара (время, батарея, сигнал и т.д.)
  const renderStatusBar = () => (
    <div className="flex justify-between items-center px-2 py-1 text-xs">
      <div className="flex space-x-1">
        {statusBarStyle === 'default' ? (
          <span>12:45</span>
        ) : (
          <span className="font-semibold">12:45</span>
        )}
      </div>
      <div className="flex items-center space-x-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
        </svg>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
        </svg>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z" />
        </svg>
      </div>
    </div>
  );

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        width,
        height,
        zIndex: isActive ? 999 : zIndex
      }}
      className={`rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className} ${isActive ? 'ring-1 ring-blue-500' : ''}`}
      onClick={handleWindowClick}
      tabIndex={0}
    >
      {/* Статус-бар (мобильный стиль) */}
      <div className={`${statusBarStyle === 'default' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-600 text-white'}`}>
        {renderStatusBar()}
      </div>

      {/* Заголовок окна и панель */}
      <motion.div
        className="p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-move"
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(e, info) => {
          setIsDragging(false);
          setPosition(prev => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y
          }));
        }}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <h3 className="font-medium text-gray-800 dark:text-white">{title}</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
          </button>
        )}
      </motion.div>

      {/* Содержимое окна */}
      <div
        className="overflow-auto"
        style={{ maxHeight: 'calc(100% - 70px)' }}
        onClick={handleContentClick}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default Window;
