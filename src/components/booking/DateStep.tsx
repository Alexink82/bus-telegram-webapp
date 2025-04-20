import type React from 'react';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

interface DateStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const DateStep: React.FC<DateStepProps> = ({ value, onChange, onNext, onBack }) => {
  const [selected, setSelected] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  // Минимальная дата - сегодня
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Максимальная дата - 3 месяца вперед
  const maxDate = addDays(today, 90);

  // Обработчик выбора даты
  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'));
    } else {
      onChange('');
    }
  };

  // Функция для отключения дат (прошедшие и более 3 месяцев)
  const isDateDisabled = (date: Date) => {
    return isBefore(date, today) || isAfter(date, maxDate);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">My Bookings</h2>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="px-4 py-3">
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            {/* Title section for the date selection */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Time selection</h3>
            </div>

            {/* Calendar styles and component */}
            <div className="p-4">
              <style>{`
                .rdp {
                  --rdp-cell-size: 40px;
                  --rdp-accent-color: #ff7a5c;
                  --rdp-background-color: #ffebe8;
                  --rdp-accent-color-dark: #ff7a5c;
                  --rdp-background-color-dark: #4a2218;
                  margin: 0 auto;
                }

                .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
                  background-color: var(--rdp-accent-color);
                  color: white;
                }

                .dark .rdp-day:not(.rdp-day_selected):not(.rdp-day_disabled):not(.rdp-day_outside) {
                  color: #e5e7eb;
                }

                .dark .rdp-day_selected:not(.rdp-day_disabled):not(.rdp-day_outside) {
                  color: white;
                  background-color: var(--rdp-accent-color-dark);
                }

                .dark .rdp-day:hover:not(.rdp-day_disabled):not(.rdp-day_outside) {
                  background-color: #374151;
                }

                .dark .rdp-caption_label,
                .dark .rdp-head_cell {
                  color: #e5e7eb;
                }

                .rdp-head_cell {
                  font-weight: 600;
                  text-transform: uppercase;
                  font-size: 0.75rem;
                  color: #374151;
                }

                .dark .rdp-head_cell {
                  color: #9ca3af;
                }

                .rdp-day {
                  border-radius: 9999px;
                }

                .rdp-day_today {
                  border: 1px solid var(--rdp-accent-color);
                  font-weight: bold;
                }

                .dark .rdp-day_today {
                  border: 1px solid var(--rdp-accent-color-dark);
                }
              `}</style>
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={handleSelect}
                disabled={isDateDisabled}
                locale={ru}
                weekStartsOn={1}
                showOutsideDays
                modifiersClassNames={{
                  selected: 'bg-[#ff7a5c] text-white',
                }}
              />
            </div>

            {/* Display selected date */}
            {selected && (
              <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <div className="p-3 bg-[#ffebe8] dark:bg-[#4a2218] rounded-md">
                  <p className="text-center text-[#ff7a5c] dark:text-[#ff9e85] font-medium">
                    Выбрана дата: {format(selected, 'd MMMM yyyy', { locale: ru })}
                  </p>
                </div>
              </div>
            )}
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
          disabled={!selected}
          onClick={onNext}
          className={`flex-1 py-3 rounded-md font-medium text-white ${
            !selected
              ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              : 'bg-[#ff7a5c] hover:bg-[#ff6347]'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default DateStep;
