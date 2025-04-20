import type React from 'react';
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isAfter, isBefore, addDays, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Route } from '../../types/models';
import { routesApi } from '../../lib/api';
import 'react-day-picker/dist/style.css';

const SchedulePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [showFilters, setShowFilters] = useState(false); // State to toggle filters visibility on mobile

  // Минимальная и максимальная даты для выбора
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = addDays(today, 90);

  // Загрузка маршрутов для выбранной даты
  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      setError('');

      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const availableRoutes = await routesApi.getAvailableForDate(dateStr);
        setRoutes(availableRoutes);

        // Сбрасываем выбранный маршрут, если его нет в новом списке
        if (selectedRoute && !availableRoutes.some(route => route.id === selectedRoute.id)) {
          setSelectedRoute(null);
        }
      } catch (err) {
        console.error('Ошибка загрузки маршрутов:', err);
        setError('Не удалось загрузить расписание. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [selectedDate, selectedRoute]);

  // Получение уникальных пунктов назначения для фильтра
  const destinations = [...new Set(routes.map(route => route.destination))];

  // Фильтрация маршрутов по тексту и пункту назначения
  const filteredRoutes = routes.filter(route => {
    const matchesFilter =
      route.name.toLowerCase().includes(filter.toLowerCase()) ||
      route.origin.toLowerCase().includes(filter.toLowerCase()) ||
      route.destination.toLowerCase().includes(filter.toLowerCase());

    const matchesDestination = !selectedDestination || route.destination === selectedDestination;

    return matchesFilter && matchesDestination;
  });

  // Сортировка маршрутов по цене
  const sortedRoutes = [...filteredRoutes].sort((a, b) => a.price - b.price);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Расписание рейсов</h2>

      {/* Mobile view: Toggle filters button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full py-2 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-800 dark:text-white"
        >
          {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`ml-2 h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Левая колонка - календарь */}
        <div className={`${showFilters || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block lg:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4`}>
          <h3 className="font-medium text-gray-800 dark:text-white mb-4">Выберите дату</h3>

          <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
            <style>{`
              .rdp {
                --rdp-cell-size: 35px;
                --rdp-accent-color: #ff7a5c;
                --rdp-background-color: #fff3f1;
                --rdp-accent-color-dark: #ff9580;
                --rdp-background-color-dark: #5c2d25;
                margin: 0 auto;
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
            `}</style>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={date => date && setSelectedDate(date)}
              disabled={date => isBefore(date, today) || isAfter(date, maxDate)}
              locale={ru}
              weekStartsOn={1}
              showOutsideDays
              modifiersClassNames={{
                selected: 'bg-[#ff7a5c] text-white',
                today: 'font-bold border border-[#ff7a5c]',
              }}
              modifiers={{
                today: date => isSameDay(date, today)
              }}
            />
          </div>

          {/* Фильтры */}
          <div className="mt-4">
            <h3 className="font-medium text-gray-800 dark:text-white mb-3">Фильтры</h3>

            <div className="space-y-4">
              {/* Фильтр по тексту */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Поиск
                </label>
                <input
                  type="text"
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  placeholder="Поиск по маршрутам..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Фильтр по пункту назначения */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Пункт назначения
                </label>
                <select
                  value={selectedDestination}
                  onChange={e => setSelectedDestination(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Все направления</option>
                  {destinations.map(destination => (
                    <option key={destination} value={destination}>
                      {destination}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Правая колонка - список маршрутов */}
        <div className="lg:w-2/3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-center mb-4 flex-wrap">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2 sm:mb-0">
              {format(selectedDate, 'd MMMM yyyy', { locale: ru })}
            </h3>

            {!loading && !error && (
              <span className="text-sm text-gray-600 dark:text-gray-400 w-full sm:w-auto">
                {sortedRoutes.length} {getRouteWord(sortedRoutes.length)}
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff7a5c]" />
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900 rounded-md text-red-600 dark:text-red-300">
              {error}
            </div>
          ) : sortedRoutes.length === 0 ? (
            <div className="py-20 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {filter || selectedDestination
                  ? 'Нет маршрутов, соответствующих заданным критериям.'
                  : 'На выбранную дату нет доступных маршрутов.'}
              </p>
              <button
                onClick={() => {
                  setFilter('');
                  setSelectedDestination('');
                }}
                className="mt-4 px-4 py-2 bg-[#ff7a5c] text-white rounded-md text-sm hover:bg-[#ff6347]"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedRoutes.map(route => (
                <div
                  key={route.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-[#ff7a5c] dark:hover:border-[#ff7a5c] transition-colors"
                  onClick={() => setSelectedRoute(route === selectedRoute ? null : route)}
                >
                  <div className="flex justify-between flex-wrap">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">{route.name}</h4>
                    <span className="font-bold text-[#ff7a5c] dark:text-[#ff9580]">{route.price} {route.currency}</span>
                  </div>

                  <div className="mt-2 flex justify-between flex-wrap text-sm">
                    <span className="text-gray-600 dark:text-gray-400 mr-2">
                      {route.origin} → {route.destination}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Время в пути: {route.duration}
                    </span>
                  </div>

                  {/* Дополнительная информация при выборе маршрута */}
                  {selectedRoute && selectedRoute.id === route.id && (
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-sm mb-2 flex-wrap">
                        <span className="text-gray-600 dark:text-gray-400 mr-2">Отправление:</span>
                        <span className="text-gray-800 dark:text-white">Уточняйте время</span>
                      </div>
                      <div className="flex justify-between text-sm flex-wrap">
                        <span className="text-gray-600 dark:text-gray-400 mr-2">Доступность:</span>
                        <span className="text-green-600 dark:text-green-400">Есть места</span>
                      </div>
                      <button
                        className="mt-3 w-full py-2 bg-[#ff7a5c] text-white rounded-md hover:bg-[#ff6347]"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Здесь можно добавить переход к бронированию
                          alert('Функция бронирования будет доступна в следующем обновлении');
                        }}
                      >
                        Забронировать
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Склонение слова "маршрут"
function getRouteWord(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) {
    return 'маршрут';
  }

  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return 'маршрута';
  }

  return 'маршрутов';
}

export default SchedulePage;
