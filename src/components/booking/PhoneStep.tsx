import type React from 'react';
import { useState, useEffect } from 'react';
import type { Country } from '../../types/models';
import { useTelegram } from '../../hooks/useTelegram';

interface PhoneStepProps {
  phoneValue: string;
  onPhoneChange: (value: string) => void;
  countryValue: string;
  onCountryChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

// Заглушка стран и кодов операторов
const DEMO_COUNTRIES: Country[] = [
  {
    name: 'Беларусь',
    code: 'BY',
    dialCode: '+375',
    operatorCodes: ['29', '33', '44', '25'],
  },
  {
    name: 'Россия',
    code: 'RU',
    dialCode: '+7',
    operatorCodes: ['900', '901', '902', '903', '904', '905', '906', '9'],
  },
  {
    name: 'Украина',
    code: 'UA',
    dialCode: '+380',
    operatorCodes: ['50', '63', '66', '67', '68', '93', '95', '96', '97', '98', '99'],
  },
  {
    name: 'Литва',
    code: 'LT',
    dialCode: '+370',
    operatorCodes: ['6'],
  },
  {
    name: 'Польша',
    code: 'PL',
    dialCode: '+48',
    operatorCodes: ['5', '6', '7', '8'],
  },
];

const PhoneStep: React.FC<PhoneStepProps> = ({
  phoneValue,
  onPhoneChange,
  countryValue,
  onCountryChange,
  onNext,
  onBack,
}) => {
  const { user, isInTelegram, HapticFeedback, showAlert, showConfirm } = useTelegram();
  const [error, setError] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Проверка, есть ли у нас возможность запросить номер телефона через Telegram API
  const hasTelegramPhoneRequest = isInTelegram && user;

  // При изменении выбранной страны находим ее данные
  useEffect(() => {
    const country = DEMO_COUNTRIES.find((c) => c.code === countryValue);
    setSelectedCountry(country || null);

    // Сброс телефона при смене страны
    if (phoneValue && country) {
      validatePhone(phoneValue, country);
    }
  }, [countryValue, phoneValue]);

  // Обработчик изменения страны
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCountryChange(e.target.value);
    setRawPhone('');
    onPhoneChange('');
    setError('');

    // Вибрация при смене страны
    HapticFeedback?.selectionChanged();
  };

  // Запрос номера телефона из Telegram (имитация)
  // В реальном приложении здесь будет вызов Telegram API
  const requestPhoneFromTelegram = () => {
    showConfirm('Разрешить приложению доступ к вашему номеру телефона?', (confirmed) => {
      if (confirmed) {
        // Это демо-функция, в реальном приложении здесь будет настоящий запрос к Telegram
        // Предположим, что полученный номер начинается с +7 и это Россия
        const telegramPhone = '+79001234567';

        // Находим страну по коду
        const dialCode = telegramPhone.startsWith('+') ? telegramPhone.substring(0, 2) : '';
        const country = DEMO_COUNTRIES.find(c => telegramPhone.startsWith(c.dialCode));

        if (country) {
          onCountryChange(country.code);

          // Удаляем код страны из номера
          const phoneWithoutCode = telegramPhone.substring(country.dialCode.length);
          setRawPhone(phoneWithoutCode);
          onPhoneChange(phoneWithoutCode.replace(/\D/g, ''));

          // Валидируем полученный номер
          validatePhone(phoneWithoutCode, country);

          HapticFeedback?.notificationOccurred('success');
        } else {
          // Если не удалось определить страну, используем Россию по умолчанию
          const defaultCountry = DEMO_COUNTRIES.find(c => c.code === 'RU');
          if (defaultCountry) {
            onCountryChange('RU');
            setRawPhone(telegramPhone);
            onPhoneChange(telegramPhone.replace(/\D/g, ''));
            validatePhone(telegramPhone, defaultCountry);
          }

          showAlert('Не удалось автоматически определить страну. Пожалуйста, выберите страну вручную.');
        }
      }
    });
  };

  // Валидация телефона
  const validatePhone = (phone: string, country: Country) => {
    // Убираем все нецифровые символы
    const digits = phone.replace(/\D/g, '');

    if (!digits.length) {
      setError('Введите номер телефона');
      setIsValid(false);
      return false;
    }

    // Проверка длины (обычно 9-12 цифр)
    if (digits.length < 9) {
      setError('Номер телефона слишком короткий');
      setIsValid(false);
      return false;
    }

    // Проверка кода оператора
    let hasValidOperatorCode = false;
    for (const code of country.operatorCodes) {
      if (digits.startsWith(code)) {
        hasValidOperatorCode = true;
        break;
      }
    }

    if (!hasValidOperatorCode) {
      setError(`Неверный код оператора для ${country.name}`);
      setIsValid(false);
      return false;
    }

    setError('');
    setIsValid(true);
    return true;
  };

  // Обработчик изменения телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setRawPhone(inputValue);

    // Обработка и форматирование введенного номера
    const digits = inputValue.replace(/\D/g, '');
    onPhoneChange(digits);

    if (selectedCountry) {
      validatePhone(digits, selectedCountry);
    }
  };

  // Форматирование номера для отображения
  const formatPhoneForDisplay = () => {
    if (!selectedCountry) return rawPhone;

    // Базовое форматирование номера для разных стран
    // В реальном приложении можно использовать библиотеку типа libphonenumber-js
    let formatted = rawPhone;

    if (rawPhone.length > 0 && !rawPhone.startsWith(selectedCountry.dialCode)) {
      formatted = `${selectedCountry.dialCode} ${rawPhone}`;
    }

    return formatted;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCountry && validatePhone(phoneValue, selectedCountry)) {
      HapticFeedback?.impactOccurred('medium');
      onNext();
    } else {
      showAlert('Пожалуйста, введите корректный номер телефона');
      HapticFeedback?.notificationOccurred('error');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Контактный телефон</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Укажите номер телефона, на который мы отправим информацию о бронировании.
          </p>

          {/* Telegram Phone Request Button */}
          {hasTelegramPhoneRequest && (
            <button
              type="button"
              onClick={requestPhoneFromTelegram}
              className="w-full px-4 py-3 mb-4 flex items-center justify-center gap-2 bg-[#3390ec] text-white rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-6h2v6zm4 0h-2v-6h2v6z"/>
              </svg>
              Использовать номер из Telegram
            </button>
          )}

          <div className="space-y-4">
            {/* Country selection */}
            <div className="space-y-2">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Страна
              </label>
              <select
                id="country"
                value={countryValue}
                onChange={handleCountryChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a5c] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Выберите страну</option>
                {DEMO_COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.dialCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Phone entry */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Номер телефона
              </label>
              <input
                type="tel"
                id="phone"
                value={formatPhoneForDisplay()}
                onChange={handlePhoneChange}
                placeholder={selectedCountry ? `${selectedCountry.dialCode} xxx xx xx` : 'Сначала выберите страну'}
                disabled={!selectedCountry}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a5c] dark:bg-gray-700 dark:text-white ${
                  error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}

              {selectedCountry && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Доступные коды операторов: {selectedCountry.operatorCodes.join(', ')}
                </p>
              )}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="font-medium mb-1">Политика конфиденциальности</p>
              <p>
                Мы используем ваш номер телефона только для уведомлений о бронировании.
                Предоставляя свой номер, вы соглашаетесь получать SMS с информацией о вашем заказе.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons - для режима разработки или вне Telegram */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-md font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Назад
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || !selectedCountry}
          className={`flex-1 py-3 rounded-md font-medium text-white ${
            !isValid || !selectedCountry
              ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              : 'bg-[#ff7a5c] hover:bg-[#ff6347]'
          }`}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default PhoneStep;
