import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useTelegram } from "./hooks/useTelegram";

// Компоненты UI
import Window from "./components/ui/Window";
import ThemeToggle from "./components/ui/ThemeToggle";
import OfflineIndicator from "./components/ui/OfflineIndicator";

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
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  ),
  Share: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Scan: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
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
  const {
    theme,
    user,
    HapticFeedback,
    showAlert,
    scanQrCode,
    shareData,
    setThemeCssVars
  } = useTelegram();

  const [activeMenu, setActiveMenu] = useState<string>('booking');
  const [currentWindow, setCurrentWindow] = useState<string>('booking');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);

  // Эффект для установки темы и CSS переменных
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    // Обновляем CSS переменные на основе темы Telegram
    setThemeCssVars();
  }, [theme, setThemeCssVars]);

  // Обработчик клика по пункту меню с тактильной обратной связью
  const handleMenuClick = (menuId: string) => {
    if (menuId === 'admin' && !isAdminAuthenticated) {
      setShowAdminLogin(true);
      setIsMenuOpen(false);
      // Тактильная обратная связь при попытке доступа к админ-панели
      HapticFeedback?.impactOccurred('medium');
      return;
    }

    // Тактильная обратная связь при переключении меню
    HapticFeedback?.selectionChanged();

    setActiveMenu(menuId);
    setCurrentWindow(menuId);
    setIsMenuOpen(false);
  };

  // Обработчик закрытия меню при клике вне его области
  const handleCloseMenus = () => {
    if (isMenuOpen || isSettingsOpen) {
      setIsMenuOpen(false);
      setIsSettingsOpen(false);
      // Легкая тактильная обратная связь при закрытии меню
      HapticFeedback?.impactOccurred('light');
    }
  };

  // Обработчик авторизации администратора
  const handleAdminLogin = () => {
    // В реальном приложении здесь должна быть проверка через API
    if (adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      setActiveMenu('admin');
      setCurrentWindow('admin');
      setShowAdminLogin(false);
      // Тактильная обратная связь при успешной авторизации
      HapticFeedback?.notificationOccurred('success');
    } else {
      // Вместо обычного alert используем Telegram API
      showAlert('Неверный пароль администратора');
      // Тактильная обратная связь при ошибке
      HapticFeedback?.notificationOccurred('error');
    }
  };

  // Обработчик сканирования QR-кода (новая функция)
  const handleScanQR = () => {
    scanQrCode((text) => {
      showAlert(`Отсканированный QR-код: ${text}`);
      // Тактильная обратная связь при успешном сканировании
      HapticFeedback?.notificationOccurred('success');
    });
  };

  // Обработчик шаринга билетов (новая функция)
  const handleShareTicket = () => {
    const shareText = "Я забронировал билет на автобус через сервис бронирования билетов. Присоединяйтесь!";
    shareData(shareText);
    // Тактильная обратная связь при шаринге
    HapticFeedback?.impactOccurred('medium');
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
              <div className="bg-red-50 dark:bg-gray-800 p-4 rounded-lg text-red-600 dark:text-red-300 border border-red-200 dark:border-red-900">
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
      {/* Индикатор состояния сети */}
      <OfflineIndicator />

      {/* Верхняя навигация */}
      <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center">
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsSettingsOpen(false);
              // Легкая тактильная обратная связь
              HapticFeedback?.impactOccurred('light');
            }}
            className="mr-4 relative tg-ripple"
            aria-label="Меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>

            {/* Выпадающее меню */}
            {isMenuOpen && (
              <>
                {/* Затемнение фона при открытом меню */}
                <div
                  className="fixed inset-0 z-[90]"
                  onClick={handleCloseMenus}
                />
                <div className="absolute left-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-[100]">
                  {filteredItems.map(item => (
                    <button
                      key={item.id}
                      className={`w-full text-left flex items-center px-4 py-3 tg-ripple transition-colors duration-150 ${
                        activeMenu === item.id
                          ? 'bg-[var(--app-primary-light)] dark:bg-[var(--app-primary-dark-bg)] text-[var(--app-primary)] dark:text-[var(--app-primary-dark)]'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => handleMenuClick(item.id)}
                    >
                      <span className="w-5 h-5 mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </button>
          <h1 className="font-medium">{getWindowTitle(currentWindow)}</h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Кнопка сканирования QR-кода */}
          <button
            onClick={handleScanQR}
            className="tg-ripple w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Сканировать QR-код"
          >
            <span className="w-5 h-5">{MenuIcons.Scan}</span>
          </button>

          {/* Кнопка шаринга */}
          <button
            onClick={handleShareTicket}
            className="tg-ripple w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Поделиться"
          >
            <span className="w-5 h-5">{MenuIcons.Share}</span>
          </button>

          {/* Кнопка настроек */}
          <button
            onClick={() => {
              setIsSettingsOpen(!isSettingsOpen);
              setIsMenuOpen(false);
              // Легкая тактильная обратная связь
              HapticFeedback?.impactOccurred('light');
            }}
            className="tg-ripple w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Настройки"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>

            {/* Выпадающее меню настроек */}
            {isSettingsOpen && (
              <>
                {/* Затемнение фона при открытом меню настроек */}
                <div
                  className="fixed inset-0 z-[90]"
                  onClick={handleCloseMenus}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-[100]">
                  <div className="p-2">
                    <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                      <span className="text-sm font-medium">Темная тема</span>
                      <ThemeToggle />
                    </div>

                    {!isAdminAuthenticated && (
                      <button
                        className="w-full text-left flex items-center p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded tg-ripple"
                        onClick={() => {
                          setShowAdminLogin(true);
                          setIsSettingsOpen(false);
                          // Тактильная обратная связь
                          HapticFeedback?.impactOccurred('light');
                        }}
                      >
                        <span className="w-5 h-5 mr-3">{MenuIcons.Admin}</span>
                        <span>Вход для администратора</span>
                      </button>
                    )}

                    {isAdminAuthenticated && (
                      <button
                        className="w-full text-left flex items-center p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded tg-ripple"
                        onClick={() => {
                          setIsAdminAuthenticated(false);
                          setIsSettingsOpen(false);
                          if (currentWindow === 'admin') {
                            setCurrentWindow('booking');
                            setActiveMenu('booking');
                          }
                          // Тактильная обратная связь
                          HapticFeedback?.impactOccurred('medium');
                        }}
                      >
                        <span className="w-5 h-5 mr-3">{MenuIcons.Admin}</span>
                        <span>Выйти из режима администратора</span>
                      </button>
                    )}

                    {/* Информация о пользователе */}
                    {user && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center p-2">
                          {user.photo_url ? (
                            <img
                              src={user.photo_url}
                              alt={user.first_name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[var(--app-primary)] flex items-center justify-center text-white mr-3">
                              {user.first_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-800 dark:text-white">
                              {user.first_name} {user.last_name || ''}
                            </div>
                            {user.username && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                @{user.username}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
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
                  // Тактильная обратная связь при закрытии окна
                  HapticFeedback?.impactOccurred('medium');
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setShowAdminLogin(false);
            // Тактильная обратная связь
            HapticFeedback?.impactOccurred('light');
          }}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике на модальное окно
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Вход для администратора</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Пароль администратора
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]"
                placeholder="Введите пароль администратора"
              />
              <p className="text-xs text-gray-500 mt-1">Для демо используйте: admin123</p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 tg-ripple"
                onClick={() => {
                  setShowAdminLogin(false);
                  // Тактильная обратная связь
                  HapticFeedback?.impactOccurred('light');
                }}
              >
                Отмена
              </button>
              <button
                className="px-4 py-2 bg-[var(--app-primary)] text-white rounded-md hover:bg-[var(--app-primary-hover)] tg-ripple"
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
