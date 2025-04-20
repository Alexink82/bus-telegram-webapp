import type React from 'react';
import type { BookingFormData } from '../../types/models';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ConfirmationStepProps {
  formData: BookingFormData;
  onBack: () => void;
  onComplete: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ formData, onBack, onComplete }) => {
  // Форматируем дату
  const formattedDate = formData.selectedDate
    ? format(new Date(formData.selectedDate), 'd MMMM yyyy', { locale: ru })
    : '';

  // Форматируем номер телефона
  const formatPhoneNumber = (phone: string, countryCode: string) => {
    if (!phone) return '';

    // Простое форматирование номеров для демо
    switch (countryCode) {
      case 'BY': // Беларусь
        return `+375 ${phone.slice(0, 2)} ${phone.slice(2, 5)}-${phone.slice(5, 7)}-${phone.slice(7)}`;
      case 'RU': // Россия
        return `+7 ${phone.slice(0, 3)} ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
      default:
        return phone;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">My Booking</h2>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="px-4 py-3">
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            {/* Title section */}
            <div className="p-4 bg-[#ff7a5c] text-white">
              <h3 className="text-lg font-medium">Confirmation</h3>
              <p className="text-sm opacity-90">Please review your booking details</p>
            </div>

            {/* Booking details */}
            <div className="p-4 space-y-4">
              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Passenger</div>
                  <div className="font-medium text-gray-800 dark:text-white">{formData.passengerName || 'Not specified'}</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Date</div>
                  <div className="font-medium text-gray-800 dark:text-white">{formattedDate || 'Not specified'}</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Route</div>
                  <div className="font-medium text-gray-800 dark:text-white">{formData.selectedRoute || 'Not specified'}</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Ticket quantity</div>
                  <div className="font-medium text-gray-800 dark:text-white">{formData.ticketCount} ticket(s)</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Contact phone</div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    {formatPhoneNumber(formData.passengerPhone, formData.countryCode) || 'Not specified'}
                  </div>
                </div>
              </div>
            </div>

            {/* Price summary */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Price:</div>
                <div className="text-lg font-bold text-[#ff7a5c]">100 BYN</div>
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
          onClick={onComplete}
          className="flex-1 py-3 rounded-md font-medium text-white bg-[#ff7a5c] hover:bg-[#ff6347]"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
