import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useTelegram } from "./hooks/useTelegram";

// Компоненты UI
import Window from "./components/ui/Window";
import ThemeToggle from "./components/ui/ThemeToggle";

// Компоненты страниц
import BookingWizard from "./components/booking/BookingWizard";
import SchedulePage from "./components/schedule/SchedulePage";
import PricesPage from "./components/prices/PricesPage";
import MyBookingsPage from "./components/myBookings/MyBookingsPage";
import AdminPage from "./components/admin/AdminPage";

// Иконки для меню
const MenuIcons = {
  Booking: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  ),
  Schedule: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Prices: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  MyBookings: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Admin: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Settings: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
      <path d="M12 16v-4"></path>
      <path d="M12 8h.01"></path>
    </svg>
  ),
};

// Пункты меню
const menuItems = [
  { id: 'booking', label: 'Бронирование', icon: MenuIcons.Booking },
  { id: 'schedule', label: 'Расписание', icon: MenuIcons.Schedule },
  { id: 'prices', label: 'Цены', icon: MenuIcons.Prices },
  { id: 'my-bookings', label: 'Мои билеты', icon: MenuIcons.MyBookings },
  { id: 'admin', label: 'Админ', icon: MenuIcons.Admin, isAdmin: true },
];

// Настройки внешнего вида окон
const windowStyles = {
  booking: {
    width: "100%",
    height: "calc(100% - 64px)",
    statusBarStyle: "default" as const,
  },
  schedule: {
    width: "100%",
    height: "calc(100% - 64px)",
    statusBarStyle: "alternate" as const,
  },
  prices: {
    width: "100%",
    height: "calc(100% - 64px)",
    statusBarStyle: "default" as const,
  },
  "my-bookings": {
    width: "100%",
    height: "calc(100% - 64px)",
    statusBarStyle: "alternate" as const,
  },
  admin: {
    width: "100%",
    height: "calc(100% - 64px)",
    statusBarStyle: "default" as const,
  },
};

export default function App() {
  const { theme, user } = useTelegram();
  const [activeMenu, setActiveMenu] = useState<string>('booking');
  const [currentWindow, setCurrentWindow] = useState<string>('booking');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);

  // Эффект для установки темы
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Обработчик клика по пункту меню
  const handleMenuClick = (menuId: string) => {
    if (menuId === 'admin' && !isAdminAuthenticated) {
      setShowAdminLogin(true);
      setIsMenuOpen(false);
      return;
    }

    setActiveMenu(menuId);
    setCurrentWindow(menuId);
    setIsMenuOpen(false);
  };

  // Обработчик авторизации администратора
  const handleAdminLogin = () => {
    // В реальном приложении здесь должна быть проверка через API
    if (adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      setActiveMenu('admin');
      setCurrentWindow('admin');
      setShowAdminLogin(false);
    } else {
      alert('Неверный пароль администратора');
    }
  };

  // Получение контента для окна
  const getWindowContent = (windowId: string) => {
    switch (windowId) {
      case 'booking':
        return <BookingWizard onComplete={() => {}} />;
      case 'schedule':
        return <SchedulePage />;
      case 'prices':
        return <PricesPage />;
      case 'my-bookings':
        return <MyBookingsPage />;
      case 'admin':
        return isAdminAuthenticated ? <AdminPage /> : (
          <div className="p-4 flex items-center justify-center h-full">
            <div className="text-center">
              <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg text-red-600 dark:text-red-300">
                Доступ запрещен. Необходима авторизация администратора.
              </div>
            </div>
          </div>
        );
      default:
        return <div>Окно не найдено</div>;
    }
  };

  // Получение заголовка для окна
  const getWindowTitle = (windowId: string) => {
    const menuItem = menuItems.find(item => item.id === windowId);
    return menuItem ? menuItem.label : 'Окно';
  };

  // Получение иконки для окна
  const getWindowIcon = (windowId: string) => {
    const menuItem = menuItems.find(item => item.id === windowId);
    return menuItem ? menuItem.icon : null;
  };

  // Фильтруем элементы для обычных пользователей (скрываем админские, если не авторизован)
  const filteredItems = menuItems.filter(item =>
    isAdminAuthenticated || !item.isAdmin
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Верхняя навигация */}
      <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mr-4 relative"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>

            {/* Выпадающее меню */}
            {isMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                {filteredItems.map(item => (
                  <button
                    key={item.id}
                    className={`w-full text-left flex items-center px-4 py-3 ${
                      activeMenu === item.id
                        ? 'bg-[#fff3f1] dark:bg-[#5c2d25] text-[#ff7a5c] dark:text-[#ff9580]'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    <span className="w-5 h-5 mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </button>
          <h1 className="font-medium">{getWindowTitle(currentWindow)}</h1>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="relative"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>

            {/* Выпадающее меню настроек */}
            {isSettingsOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-2">
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm font-medium">Темная тема</span>
                    <ThemeToggle />
                  </div>

                  {!isAdminAuthenticated && (
                    <button
                      className="w-full text-left flex items-center p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      onClick={() => {
                        setShowAdminLogin(true);
                        setIsSettingsOpen(false);
                      }}
                    >
                      <span className="w-5 h-5 mr-3">{MenuIcons.Admin}</span>
                      <span>Вход для администратора</span>
                    </button>
                  )}

                  {isAdminAuthenticated && (
                    <button
                      className="w-full text-left flex items-center p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      onClick={() => {
                        setIsAdminAuthenticated(false);
                        setIsSettingsOpen(false);
                        if (currentWindow === 'admin') {
                          setCurrentWindow('booking');
                          setActiveMenu('booking');
                        }
                      }}
                    >
                      <span className="w-5 h-5 mr-3">{MenuIcons.Admin}</span>
                      <span>Выйти из режима администратора</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Основная область с окнами */}
      <div className="flex-1 relative overflow-hidden">
        {/* Контейнер для окон */}
        <div className="h-full relative">
          <AnimatePresence mode="wait">
            <Window
              key={currentWindow}
              title={getWindowTitle(currentWindow)}
              icon={getWindowIcon(currentWindow)}
              isActive={true}
              onClose={() => {
                // В мобильном приложении нет смысла закрывать единственное окно
                // Просто переходим на главную
                if (currentWindow !== 'booking') {
                  setCurrentWindow('booking');
                  setActiveMenu('booking');
                }
              }}
              initialX={0}
              initialY={0}
              width={windowStyles[currentWindow as keyof typeof windowStyles].width}
              height={windowStyles[currentWindow as keyof typeof windowStyles].height}
              statusBarStyle={windowStyles[currentWindow as keyof typeof windowStyles].statusBarStyle}
              className="rounded-2xl overflow-hidden"
              hideHeader={true} // Скрываем заголовок окна, так как у нас есть верхняя панель
            >
              {getWindowContent(currentWindow)}
            </Window>
          </AnimatePresence>
        </div>
      </div>

      {/* Модальное окно входа для администратора */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Вход для администратора</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Пароль администратора
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Введите пароль администратора"
              />
              <p className="text-xs text-gray-500 mt-1">Для демо используйте: admin123</p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowAdminLogin(false)}
              >
                Отмена
              </button>
              <button
                className="px-4 py-2 bg-[#ff7a5c] text-white rounded-md hover:bg-[#ff6347]"
                onClick={handleAdminLogin}
              >
                Войти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
