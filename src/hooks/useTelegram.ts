import { useEffect, useState, useCallback } from 'react';
import type { TelegramUser, TelegramWebApp, TelegramInitData, TelegramPopupParams } from '../types/telegram';

interface UseTelegramReturn {
  user: TelegramUser | null;
  isInTelegram: boolean;
  theme: 'light' | 'dark';
  ready: boolean;
  expand: () => void;
  close: () => void;
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
  sendData: (data: Record<string, unknown>) => void;
  isExpanded: boolean;
  initDataUnsafe: TelegramInitData | null;
  popupParams: TelegramPopupParams;
  showPopup: (params: TelegramPopupParams, callback: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  } | null;
}

export function useTelegram(): UseTelegramReturn {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isInTelegram, setIsInTelegram] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [ready, setReady] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [initDataUnsafe, setInitDataUnsafe] = useState<TelegramInitData | null>(null);
  const [hapticFeedback, setHapticFeedback] = useState<UseTelegramReturn['HapticFeedback']>(null);

  // Инициализация Telegram Web App
  useEffect(() => {
    const webApp = window.Telegram?.WebApp;

    if (webApp) {
      setTg(webApp);
      setIsInTelegram(true);

      // Установка темы
      setTheme(webApp.colorScheme);

      // Пользователь и данные инициализации
      if (webApp.initDataUnsafe?.user) {
        setUser(webApp.initDataUnsafe.user);
        setInitDataUnsafe(webApp.initDataUnsafe);
      }

      // Проверка, развернуто ли приложение
      setIsExpanded(webApp.isExpanded);

      // Установка HapticFeedback API
      if (webApp.HapticFeedback) {
        setHapticFeedback({
          impactOccurred: (style) => webApp.HapticFeedback.impactOccurred(style),
          notificationOccurred: (type) => webApp.HapticFeedback.notificationOccurred(type),
          selectionChanged: () => webApp.HapticFeedback.selectionChanged()
        });
      }

      // Событие готовности
      webApp.ready();
      setReady(true);

      // Подписка на события изменения
      const onThemeChanged = () => {
        setTheme(webApp.colorScheme);
      };

      const onViewportChanged = () => {
        setIsExpanded(webApp.isExpanded);
      };

      webApp.onEvent('themeChanged', onThemeChanged);
      webApp.onEvent('viewportChanged', onViewportChanged);

      return () => {
        webApp.offEvent('themeChanged', onThemeChanged);
        webApp.offEvent('viewportChanged', onViewportChanged);
      };
    }

    console.log('Telegram WebApp не доступен. Работаем в режиме браузера.');

    // Emulate haptic feedback for browser development
    setHapticFeedback({
      impactOccurred: (style) => {
        console.log(`[Haptic] Impact: ${style}`);
      },
      notificationOccurred: (type) => {
        console.log(`[Haptic] Notification: ${type}`);
      },
      selectionChanged: () => {
        console.log('[Haptic] Selection Changed');
      }
    });

    // Заглушки для разработки вне Telegram
    setUser({
      id: 12345678,
      first_name: 'Тестовый',
      last_name: 'Пользователь',
      username: 'test_user',
      photo_url: 'https://placehold.co/200x200?text=User'
    });

    // Установка темы из localStorage или prefers-color-scheme для разработки
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light');
  }, []);

  // Сохранение темы в localStorage для разработки вне Telegram
  useEffect(() => {
    if (!isInTelegram) {
      localStorage.setItem('theme', theme);
    }
  }, [theme, isInTelegram]);

  // Методы для работы с Telegram WebApp
  const expand = useCallback(() => {
    tg?.expand();
  }, [tg]);

  const close = useCallback(() => {
    tg?.close();
  }, [tg]);

  const showMainButton = useCallback((text: string, onClick: () => void) => {
    const mainButton = tg?.MainButton;
    if (mainButton) {
      mainButton.setText(text);
      mainButton.onClick(onClick);
      mainButton.show();
    } else {
      console.log(`[MainButton] Show: ${text}`);
    }
  }, [tg]);

  const hideMainButton = useCallback(() => {
    if (tg?.MainButton) {
      tg.MainButton.hide();
    } else {
      console.log('[MainButton] Hide');
    }
  }, [tg]);

  const showBackButton = useCallback((onClick: () => void) => {
    const backButton = tg?.BackButton;
    if (backButton) {
      backButton.onClick(onClick);
      backButton.show();
    } else {
      console.log('[BackButton] Show');
    }
  }, [tg]);

  const hideBackButton = useCallback(() => {
    if (tg?.BackButton) {
      tg.BackButton.hide();
    } else {
      console.log('[BackButton] Hide');
    }
  }, [tg]);

  const sendData = useCallback((data: Record<string, unknown>) => {
    const jsonData = JSON.stringify(data);
    if (tg) {
      tg.sendData(jsonData);
    } else {
      console.log('[SendData]', data);
    }
  }, [tg]);

  const showPopup = useCallback((params: TelegramPopupParams, callback: (buttonId: string) => void) => {
    if (tg) {
      tg.showPopup(params, callback);
    } else {
      console.log('[Popup]', params);
      // Простая эмуляция для браузера
      setTimeout(() => callback('ok'), 500);
    }
  }, [tg]);

  const showAlert = useCallback((message: string, callback?: () => void) => {
    if (tg) {
      tg.showAlert(message, callback || (() => {}));
    } else {
      // Эмуляция для браузера
      alert(message);
      if (callback) callback();
    }
  }, [tg]);

  const showConfirm = useCallback((message: string, callback?: (confirmed: boolean) => void) => {
    if (tg) {
      tg.showConfirm(message, callback || (() => {}));
    } else {
      // Эмуляция для браузера
      const confirmed = window.confirm(message);
      if (callback) callback(confirmed);
    }
  }, [tg]);

  // Попытка получить параметры инициализации из URL-параметров
  // Это нужно для тестирования вне Telegram
  useEffect(() => {
    if (!isInTelegram) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const tgWebAppData = urlParams.get('tgWebAppData');

        if (tgWebAppData) {
          // В реальности, здесь нужно проверять подпись initData
          console.log('Получены данные из URL-параметра:', tgWebAppData);
        }
      } catch (e) {
        console.error('Ошибка при обработке данных из URL:', e);
      }
    }
  }, [isInTelegram]);

  return {
    user,
    isInTelegram,
    theme,
    ready,
    expand,
    close,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    sendData,
    isExpanded,
    initDataUnsafe,
    popupParams: {
      message: ''
    },
    showPopup,
    showAlert,
    showConfirm,
    HapticFeedback: hapticFeedback
  };
}
