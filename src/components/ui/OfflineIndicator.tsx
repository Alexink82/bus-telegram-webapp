import type React from 'react';
import { useState, useEffect } from 'react';
import { useTelegram } from '../../hooks/useTelegram';

/**
 * Упрощенный компонент для отображения статуса сетевого подключения
 */
const OfflineIndicator: React.FC = () => {
  const { HapticFeedback } = useTelegram();
  const [status, setStatus] = useState<'online' | 'offline' | 'initial'>(
    navigator.onLine ? 'initial' : 'offline'
  );

  // Функции-обработчики определены вне useEffect
  const handleOnline = () => {
    if (status !== 'initial') {
      HapticFeedback?.notificationOccurred('success');
    }
    setStatus('online');
    // После 3 секунд возвращаем в начальное состояние
    setTimeout(() => setStatus('initial'), 3000);
  };

  const handleOffline = () => {
    setStatus('offline');
    if (status !== 'initial') {
      HapticFeedback?.notificationOccurred('error');
    }
  };

  // Устанавливаем обработчики только один раз при монтировании
  useEffect(() => {
    // Если онлайн и первый рендер, не показываем уведомление
    if (navigator.onLine && status === 'initial') {
      // ничего не делаем
    } else {
      // Устанавливаем обработчики
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Функция очистки
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Пустой массив зависимостей, подключаем обработчики только один раз

  // Не отображаем ничего, если онлайн и статус initial
  if (status === 'initial') return null;

  return (
    <div className={`network-status ${status === 'online' ? 'online' : 'offline'}`}>
      {status === 'online' ? (
        <span className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Соединение восстановлено
        </span>
      ) : (
        <span className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Нет соединения с сетью
        </span>
      )}
    </div>
  );
};

export default OfflineIndicator;
