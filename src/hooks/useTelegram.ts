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
  // Новые методы
  getTelegramThemeColor: (colorName: string, defaultColor: string) => string;
  scanQrCode: (callback: (text: string) => void) => void;
  shareData: (text: string) => void;
  themeParams: Record<string, string> | null;
  setThemeCssVars: () => void;
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
  const [themeParams, setThemeParams] = useState<Record<string, string> | null>(null);

  // Установка CSS переменных для темы Telegram
  const setThemeCssVars = useCallback(() => {
    const root = document.documentElement;

    if (tg?.themeParams) {
      root.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
      root.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
      root.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color);
      root.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color);
      root.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
      root.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);

      // Сохраняем параметры темы
      setThemeParams({
        bg_color: tg.themeParams.bg_color,
        text_color: tg.themeParams.text_color,
        hint_color: tg.themeParams.hint_color,
        link_color: tg.themeParams.link_color,
        button_color: tg.themeParams.button_color,
        button_text_color: tg.themeParams.button_text_color
      });
    } else {
      // Fallback для разработки вне Telegram
      const isDark = theme === 'dark';

      root.style.setProperty('--tg-theme-bg-color', isDark ? '#212121' : '#ffffff');
      root.style.setProperty('--tg-theme-text-color', isDark ? '#ffffff' : '#000000');
      root.style.setProperty('--tg-theme-hint-color', isDark ? '#aaaaaa' : '#999999');
      root.style.setProperty('--tg-theme-link-color', isDark ? '#64b5f6' : '#2678b6');
      root.style.setProperty('--tg-theme-button-color', isDark ? '#ff9580' : '#ff7a5c');
      root.style.setProperty('--tg-theme-button-text-color', '#ffffff');

      // Сохраняем параметры темы
      setThemeParams({
        bg_color: isDark ? '#212121' : '#ffffff',
        text_color: isDark ? '#ffffff' : '#000000',
        hint_color: isDark ? '#aaaaaa' : '#999999',
        link_color: isDark ? '#64b5f6' : '#2678b6',
        button_color: isDark ? '#ff9580' : '#ff7a5c',
        button_text_color: '#ffffff'
      });
    }
  }, [tg, theme]);

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

      // Устанавливаем CSS переменные темы
      setTimeout(() => setThemeCssVars(), 0);

      // Событие готовности
      webApp.ready();
      setReady(true);

      // Подписка на события изменения
      const onThemeChanged = () => {
        setTheme(webApp.colorScheme);
        // Обновляем CSS переменные при изменении темы
        setTimeout(() => setThemeCssVars(), 0);
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
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light');

    // Устанавливаем CSS переменные для fallback темы
    setTimeout(() => setThemeCssVars(), 0);
  }, [setThemeCssVars]);

  // Сохранение темы в localStorage для разработки вне Telegram
  useEffect(() => {
    if (!isInTelegram) {
      localStorage.setItem('theme', theme);
      // Обновляем CSS переменные при изменении темы
      setThemeCssVars();
    }
  }, [theme, isInTelegram, setThemeCssVars]);

  // Получение цветов темы Telegram
  const getTelegramThemeColor = useCallback((colorName: string, defaultColor: string): string => {
    if (tg?.themeParams) {
      switch (colorName) {
        case 'primary': return tg.themeParams.button_color;
        case 'text': return tg.themeParams.text_color;
        case 'hint': return tg.themeParams.hint_color;
        case 'link': return tg.themeParams.link_color;
        case 'bg': return tg.themeParams.bg_color;
        case 'button_text': return tg.themeParams.button_text_color;
        default: return defaultColor;
      }
    }

    // Fallback для разработки вне Telegram
    switch (colorName) {
      case 'primary': return theme === 'dark' ? '#ff9580' : '#ff7a5c';
      case 'text': return theme === 'dark' ? '#ffffff' : '#000000';
      case 'hint': return theme === 'dark' ? '#aaaaaa' : '#999999';
      case 'link': return theme === 'dark' ? '#64b5f6' : '#2678b6';
      case 'bg': return theme === 'dark' ? '#212121' : '#ffffff';
      case 'button_text': return '#ffffff';
      default: return defaultColor;
    }
  }, [tg, theme]);

  // Сканирование QR-кода (с fallback для браузера)
  const scanQrCode = useCallback((callback: (text: string) => void) => {
    if (tg && 'showScanQrPopup' in tg) {
      // @ts-ignore - тип для showScanQrPopup может отсутствовать в наших типах
      tg.showScanQrPopup({ text: 'Отсканируйте QR-код' }, callback);
    } else {
      console.log('[ScanQrCode] Не доступно в браузере');
      // Заглушка для браузера
      setTimeout(() => callback('example-qr-code-12345'), 1000);
    }
  }, [tg]);

  // Функция для шаринга данных
  const shareData = useCallback((text: string) => {
    if (tg) {
      tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`);
    } else if (navigator.share) {
      navigator.share({
        title: 'Информация о билете',
        text: text,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      console.log('[ShareData]', text);
    }
  }, [tg]);

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
    HapticFeedback: hapticFeedback,
    // Новые методы
    getTelegramThemeColor,
    scanQrCode,
    shareData,
    themeParams,
    setThemeCssVars
  };
}
