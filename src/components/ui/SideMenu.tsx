import type React from 'react';

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  isAdmin?: boolean;
}

interface SideMenuProps {
  items: MenuItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
  isUserAdmin?: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({
  items,
  activeItem,
  onItemClick,
  isUserAdmin = false,
}) => {
  // Фильтруем элементы для обычных пользователей (скрываем админские)
  const filteredItems = items.filter(item => isUserAdmin || !item.isAdmin);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-16 md:w-20 lg:w-24 overflow-hidden transition-all">
      <div className="flex-1 py-4">
        <div className="flex flex-col items-center space-y-4">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-12 md:w-16 h-16 ${
                activeItem === item.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => onItemClick(item.id)}
            >
              <div className="w-6 h-6">{item.icon}</div>
              <span className="text-xs mt-1 text-center font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
