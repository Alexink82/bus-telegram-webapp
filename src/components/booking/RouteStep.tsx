import type React from 'react';
import { useState, useEffect } from 'react';
import type { Route } from '../../types/models';
import { routesApi } from '../../lib/api';

interface RouteStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  selectedDate: string;
}

const RouteStep: React.FC<RouteStepProps> = ({ value, onChange, onNext, onBack, selectedDate }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // Загружаем маршруты через API
    const fetchRoutes = async () => {
      if (!selectedDate) return;

      setLoading(true);
      setError('');

      try {
        // Получение маршрутов, доступных в выбранную дату
        const availableRoutes = await routesApi.getAvailableForDate(selectedDate);
        setRoutes(availableRoutes);

        // Если был выбран маршрут, которого больше нет в списке, сбрасываем выбор
        if (value && !availableRoutes.some(route => route.id === value)) {
          onChange('');
        }
      } catch (err) {
        console.error('Ошибка загрузки маршрутов:', err);
        setError('Не удалось загрузить маршруты. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [selectedDate, value, onChange]);

  // Фильтрация маршрутов по введенному тексту
  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(filter.toLowerCase()) ||
    route.origin.toLowerCase().includes(filter.toLowerCase()) ||
    route.destination.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelectRoute = (routeId: string) => {
    onChange(routeId);
  };

  // Сортировка маршрутов по цене (от дешевых к дорогим)
  const sortedRoutes = [...filteredRoutes].sort((a, b) => a.price - b.price);

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
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Select Route</h3>
            </div>

            {/* Search input */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search route..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Routes count info */}
              {!loading && !error && (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  {filter ?
                    `Found ${filteredRoutes.length} ${getRouteWord(filteredRoutes.length)}` :
                    `Total ${routes.length} ${getRouteWord(routes.length)} for this date`
                  }
                </div>
              )}
            </div>

            {/* Routes list */}
            <div className="p-4">
              {loading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff7a5c]" />
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 dark:bg-red-900 rounded-md text-red-600 dark:text-red-300">
                  {error}
                </div>
              ) : sortedRoutes.length === 0 ? (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 text-center">
                  {filter
                    ? 'No routes found. Try changing your search query.'
                    : 'No available routes for the selected date.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedRoutes.map((route) => (
                    <div
                      key={route.id}
                      onClick={() => handleSelectRoute(route.id)}
                      className={`p-4 rounded-lg cursor-pointer border transition-all ${
                        value === route.id
                          ? 'border-[#ff7a5c] bg-[#ffebe8] dark:bg-[#4a2218] dark:border-[#ff9e85]'
                          : 'border-gray-200 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className={`font-medium ${value === route.id ? 'text-[#ff7a5c] dark:text-[#ff9e85]' : 'text-gray-800 dark:text-white'}`}>
                          {route.name}
                        </h3>
                        <div className={`font-bold ${value === route.id ? 'text-[#ff7a5c] dark:text-[#ff9e85]' : 'text-gray-900 dark:text-gray-200'}`}>
                          {route.price} {route.currency}
                        </div>
                      </div>

                      <div className="mt-2 flex justify-between">
                        <div className={`text-sm ${value === route.id ? 'text-[#ff7a5c] dark:text-[#ff9e85]' : 'text-gray-600 dark:text-gray-400'}`}>
                          {route.origin} → {route.destination}
                        </div>
                        <div className={`text-sm ${value === route.id ? 'text-[#ff7a5c] dark:text-[#ff9e85]' : 'text-gray-600 dark:text-gray-400'}`}>
                          Duration: {route.duration}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
          disabled={!value || loading}
          onClick={onNext}
          className={`flex-1 py-3 rounded-md font-medium text-white ${
            !value || loading
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

// Вспомогательная функция для склонения слова "маршрут"
function getRouteWord(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) {
    return 'route';
  }

  return 'routes';
}

export default RouteStep;
