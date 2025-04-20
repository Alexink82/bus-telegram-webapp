import type React from 'react';
import { useEffect, useState } from 'react';
import { useTelegram } from '../../hooks/useTelegram';

interface NameStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const NameStep: React.FC<NameStepProps> = ({ value, onChange, onNext }) => {
  const { user, isInTelegram, showAlert } = useTelegram();
  const [error, setError] = useState('');

  // Если пользователь в Telegram, автоматически заполняем имя
  useEffect(() => {
    if (isInTelegram && user && !value) {
      const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
      onChange(fullName);
    }
  }, [isInTelegram, user, value, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Валидация
    if (newValue.trim().length < 3) {
      setError('Имя должно содержать не менее 3 символов');
    } else if (!/^[А-Яа-яЁёA-Za-z\s-]+$/.test(newValue)) {
      setError('Имя может содержать только буквы, пробелы и дефисы');
    } else {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!error && value.trim().length >= 3) {
      onNext();
    } else {
      showAlert('Пожалуйста, введите корректное имя для продолжения');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Укажите ваше имя</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Имя будет указано в вашем билете. Пожалуйста, введите его так, как в документе, удостоверяющем личность.
          </p>

          {/* Telegram User Profile */}
          {isInTelegram && user && (
            <div className="flex items-center p-3 mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              {user.photo_url ? (
                <img
                  src={user.photo_url}
                  alt={user.first_name}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#ff7a5c] dark:bg-[#ff9580] flex items-center justify-center text-white mr-3">
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
          )}

          <div className="space-y-3">
            <label htmlFor="passengerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Полное имя
            </label>
            <input
              type="text"
              id="passengerName"
              value={value}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a5c] dark:bg-gray-700 dark:text-white ${
                error ? 'border-red-500 dark:border-red-400' : 'border border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Иван Иванов"
              autoComplete="name"
            />
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            {isInTelegram && user && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Имя автоматически заполнено из данных вашего Telegram-профиля. Вы можете изменить его при необходимости.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Continue Button - Fixed at Bottom (for non-Telegram environments or testing) */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!!error || value.trim().length < 3}
          className={`w-full py-3 rounded-md font-medium text-white ${
            error || value.trim().length < 3
              ? 'bg-gray-300 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              : 'bg-[#ff7a5c] hover:bg-[#ff6347]'
          }`}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default NameStep;
