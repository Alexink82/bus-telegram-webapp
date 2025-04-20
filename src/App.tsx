import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useTelegram } from "./hooks/useTelegram";

// Компоненты UI
import Window from "./components/ui/Window";
import SideMenu from "./components/ui/SideMenu";
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
    width: "340px",
    height: "calc(100% - 40px)",
    statusBarStyle: "default",
  },
  schedule: {
    width: "340px",
    height: "calc(100% - 40px)",
    statusBarStyle: "alternate",
  },
  prices: {
    width: "340px",
    height: "calc(100% - 40px)",
    statusBarStyle: "default",
  },
  "my-bookings": {
    width: "340px",
    height: "calc(100% - 40px)",
    statusBarStyle: "alternate",
  },
  admin: {
    width: "340px",
    height: "calc(100% - 40px)",
    statusBarStyle: "default",
  },
};

export default function App() {
  const { theme, user } = useTelegram();
  const [activeMenu, setActiveMenu] = useState<string>('booking');
  const [openWindows, setOpenWindows] = useState<string[]>(['booking']);
  const [activeWindow, setActiveWindow] = useState<string>('booking');

  // Определяем, является ли пользователь администратором (для демо всегда false)
  const isAdmin = false;

  // Эффект для установки темы
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Обработчик клика по пункту меню
  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);

    // Если окно уже открыто, делаем его активным
    if (openWindows.includes(menuId)) {
      setActiveWindow(menuId);
    } else {
      // Иначе добавляем новое окно
      setOpenWindows([...openWindows, menuId]);
      setActiveWindow(menuId);
    }
  };

  // Обработчик закрытия окна
  const handleCloseWindow = (windowId: string) => {
    // Закрываем окно
    const newOpenWindows = openWindows.filter(id => id !== windowId);
    setOpenWindows(newOpenWindows);

    // Если закрыли активное окно, активируем последнее открытое
    if (activeWindow === windowId && newOpenWindows.length > 0) {
      setActiveWindow(newOpenWindows[newOpenWindows.length - 1]);
      setActiveMenu(newOpenWindows[newOpenWindows.length - 1]);
    }
  };

  // Функция для активации окна
  const setWindowActive = (windowId: string) => {
    setActiveWindow(windowId);
    setActiveMenu(windowId);
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
        return <AdminPage />;
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

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Боковое меню */}
      <SideMenu
        items={menuItems}
        activeItem={activeMenu}
        onItemClick={handleMenuClick}
        isUserAdmin={isAdmin}
      />

      {/* Основная область с окнами */}
      <div className="flex-1 relative overflow-hidden">
        {/* Панель сверху */}
        <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
          <div className="font-medium">Bat-tel-web</div>
          <ThemeToggle />
        </div>

        {/* Контейнер для окон */}
        <div className="p-4 h-[calc(100%-3rem)] relative">
          <AnimatePresence>
            {openWindows.map((windowId, index) => {
              const windowStyle = windowStyles[windowId as keyof typeof windowStyles];
              return (
                <Window
                  key={windowId}
                  title={getWindowTitle(windowId)}
                  icon={getWindowIcon(windowId)}
                  isActive={activeWindow === windowId}
                  setActive={() => setWindowActive(windowId)}
                  onClose={() => handleCloseWindow(windowId)}
                  zIndex={activeWindow === windowId ? 999 : openWindows.indexOf(windowId) + 1}
                  initialX={20 + index * 15}
                  initialY={20 + index * 15}
                  width={windowStyle.width}
                  height={windowStyle.height}
                  statusBarStyle={windowStyle.statusBarStyle}
                  className="rounded-2xl overflow-hidden"
                >
                  {getWindowContent(windowId)}
                </Window>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
