import type React from 'react';
import { useState, useEffect } from 'react';
import type { Country } from '../../types/models';

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
  const [error, setError] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

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
      onNext();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">My Bookings</h2>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="px-4 py-3">
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            {/* Title section */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Contact Phone</h3>
            </div>

            {/* Country selection */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Country</span>
              </div>

              <div className="mt-3">
                <select
                  id="country"
                  value={countryValue}
                  onChange={handleCountryChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select a country</option>
                  {DEMO_COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.dialCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone entry */}
            <div className="p-4">
              <div className="flex items-center mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Phone Number</span>
              </div>

              <div className="mt-3">
                <input
                  type="tel"
                  id="phone"
                  value={formatPhoneForDisplay()}
                  onChange={handlePhoneChange}
                  placeholder={selectedCountry ? `${selectedCountry.dialCode} xxx xx xx` : 'Select a country first'}
                  disabled={!selectedCountry}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    error ? 'border-red-500 dark:border-red-400' : 'border-gray-300'
                  }`}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
                )}

                {selectedCountry && (
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Available operator codes: {selectedCountry.operatorCodes.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-md font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Cancel
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
          Confirm
        </button>
      </div>
    </div>
  );
};

export default PhoneStep;
