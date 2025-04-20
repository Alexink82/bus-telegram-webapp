import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { BookingFormData } from '../../types/models';
import { useTelegram } from '../../hooks/useTelegram';

import NameStep from './NameStep';
import DateStep from './DateStep';
import RouteStep from './RouteStep';
import TicketCountStep from './TicketCountStep';
import PhoneStep from './PhoneStep';
import ConfirmationStep from './ConfirmationStep';

interface BookingWizardProps {
  onComplete: () => void;
}

// Названия шагов для отображения в индикаторе прогресса
const stepNames = [
  'ФИО',
  'Дата',
  'Маршрут',
  'Билеты',
  'Телефон',
  'Подтверждение'
];

// Тексты для кнопок Telegram на каждом шаге
const buttonTexts = [
  'Продолжить',
  'Выбрать дату',
  'Выбрать маршрут',
  'Выбрать количество',
  'Продолжить',
  'Подтвердить бронирование'
];

const BookingWizard: React.FC<BookingWizardProps> = ({ onComplete }) => {
  const { showMainButton, hideMainButton, showBackButton, hideBackButton, HapticFeedback, user } = useTelegram();

  // Текущий шаг мастера
  const [currentStep, setCurrentStep] = useState(0);

  // Данные формы бронирования
  const [formData, setFormData] = useState<BookingFormData>({
    passengerName: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : '',
    passengerPhone: '',
    ticketCount: 1,
    selectedDate: '',
    selectedRoute: '',
    selectedSchedule: '',
    countryCode: '',
  });

  // Обработчики изменения данных формы
  const updateFormData = (key: keyof BookingFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Обработчики навигации между шагами
  const nextStep = useCallback(() => {
    if (currentStep < 5) {
      // Тактильная обратная связь при переходе на следующий шаг
      HapticFeedback?.impactOccurred('medium');
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  }, [currentStep, HapticFeedback]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      // Тактильная обратная связь при возврате на предыдущий шаг
      HapticFeedback?.impactOccurred('light');
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  }, [currentStep, HapticFeedback]);

  // Переход к конкретному шагу (если он уже был пройден)
  const goToStep = (step: number) => {
    // Можем переходить только на пройденные шаги
    if (step <= currentStep) {
      HapticFeedback?.selectionChanged();
      setCurrentStep(step);
    }
  };

  // Обработчик завершения бронирования
  const handleComplete = useCallback(() => {
    // Здесь можно отправить данные на сервер или другие действия
    HapticFeedback?.notificationOccurred('success');
    onComplete();
  }, [HapticFeedback, onComplete]);

  // Настройка кнопок Telegram при изменении шага
  useEffect(() => {
    // Показываем кнопку "Назад" начиная со второго шага
    if (currentStep > 0) {
      showBackButton(prevStep);
    } else {
      hideBackButton();
    }

    // Настраиваем главную кнопку для текущего шага
    showMainButton(buttonTexts[currentStep], () => {
      if (currentStep === 5) {
        handleComplete();
      } else {
        nextStep();
      }
    });

    // При размонтировании компонента скрываем кнопки
    return () => {
      hideMainButton();
      hideBackButton();
    };
  }, [
    currentStep,
    prevStep,
    nextStep,
    showBackButton,
    hideBackButton,
    showMainButton,
    hideMainButton,
    handleComplete
  ]);

  // Варианты анимации для переходов между шагами
  const fadeVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  // Отображение текущего шага мастера
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <NameStep
            value={formData.passengerName}
            onChange={(value) => updateFormData('passengerName', value)}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <DateStep
            value={formData.selectedDate}
            onChange={(value) => updateFormData('selectedDate', value)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 2:
        return (
          <RouteStep
            value={formData.selectedRoute}
            onChange={(value) => updateFormData('selectedRoute', value)}
            onNext={nextStep}
            onBack={prevStep}
            selectedDate={formData.selectedDate}
          />
        );
      case 3:
        return (
          <TicketCountStep
            value={formData.ticketCount}
            onChange={(value) => updateFormData('ticketCount', value)}
            onNext={nextStep}
            onBack={prevStep}
            selectedRouteId={formData.selectedRoute}
          />
        );
      case 4:
        return (
          <PhoneStep
            phoneValue={formData.passengerPhone}
            onPhoneChange={(value) => updateFormData('passengerPhone', value)}
            countryValue={formData.countryCode}
            onCountryChange={(value) => updateFormData('countryCode', value)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <ConfirmationStep
            formData={formData}
            onBack={prevStep}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  // Рендер индикатора прогресса (breadcrumb)
  const renderProgressIndicator = () => {
    return (
      <div className="bg-white dark:bg-gray-800 px-4 py-2 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Бронирование билета
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Шаг {currentStep + 1} из 6
          </span>
        </div>

        <div className="relative">
          {/* Линия прогресса */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-gray-200 dark:bg-gray-700 w-full" />
          <div
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-[#ff7a5c] dark:bg-[#ff9580]"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />

          {/* Индикаторы шагов */}
          <div className="relative flex justify-between">
            {stepNames.map((step, index) => (
              <div
                key={`step-${index}`}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => goToStep(index)}
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    index < currentStep
                      ? 'bg-[#ff7a5c] dark:bg-[#ff9580] text-white'
                      : index === currentStep
                        ? 'border-2 border-[#ff7a5c] dark:border-[#ff9580] text-[#ff7a5c] dark:text-[#ff9580] bg-white dark:bg-gray-800'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                  } text-xs font-medium z-10`}
                >
                  {index < currentStep ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 ${
                    index <= currentStep
                      ? 'text-[#ff7a5c] dark:text-[#ff9580]'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Индикатор прогресса */}
      {renderProgressIndicator()}

      {/* Содержимое шага */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeVariants}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingWizard;
