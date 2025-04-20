import type React from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { BookingFormData } from '../../types/models';

import NameStep from './NameStep';
import DateStep from './DateStep';
import RouteStep from './RouteStep';
import TicketCountStep from './TicketCountStep';
import PhoneStep from './PhoneStep';
import ConfirmationStep from './ConfirmationStep';

interface BookingWizardProps {
  onComplete: () => void;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ onComplete }) => {
  // Текущий шаг мастера
  const [currentStep, setCurrentStep] = useState(0);

  // Данные формы бронирования
  const [formData, setFormData] = useState<BookingFormData>({
    passengerName: '',
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
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Обработчик завершения бронирования
  const handleComplete = () => {
    // Здесь можно отправить данные на сервер или другие действия
    onComplete();
  };

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

  return (
    <div className="h-full relative">
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
  );
};

export default BookingWizard;
