import type React from 'react';
import { useEffect, useState } from 'react';
import { useTelegram } from '../../hooks/useTelegram';

const ThemeToggle: React.FC = () => {
  const { isInTelegram, theme: telegramTheme } = useTelegram();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // При изменении темы в Telegram, автоматически меняем тему в приложении
  useEffect(() => {
    if (isInTelegram && telegramTheme) {
      setTheme(telegramTheme);
      updateTheme(telegramTheme);
    } else {
      // Если не в Telegram, пробуем загрузить сохраненную тему из localStorage
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
      setTheme(savedTheme);

      if (savedTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        updateTheme(systemTheme);
      } else {
        updateTheme(savedTheme);
      }
    }
  }, [isInTelegram, telegramTheme]);

  // Функция для обновления темы
  const updateTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    const actualTheme =
      newTheme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : newTheme;

    if (actualTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Сохраняем выбор темы в localStorage, если не в Telegram
    if (!isInTelegram) {
      localStorage.setItem('theme', newTheme);
    }
  };

  // Обработчик изменения темы
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    if (isInTelegram) {
      // В Telegram WebApp нельзя менять тему программно
      return;
    }

    setTheme(newTheme);
    updateTheme(newTheme);
  };

  // Если в Telegram, кнопка не активна
  if (isInTelegram) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span>Тема:</span>
        <span className="font-medium">{telegramTheme === 'dark' ? 'Темная' : 'Светлая'}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">Тема:</span>
      <div className="flex rounded-md overflow-hidden">
        <button
          className={`px-3 py-1 text-xs font-medium ${theme === 'light' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
          onClick={() => handleThemeChange('light')}
        >
          Светлая
        </button>
        <button
          className={`px-3 py-1 text-xs font-medium ${theme === 'dark' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
          onClick={() => handleThemeChange('dark')}
        >
          Темная
        </button>
        <button
          className={`px-3 py-1 text-xs font-medium ${theme === 'system' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
          onClick={() => handleThemeChange('system')}
        >
          Системная
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
