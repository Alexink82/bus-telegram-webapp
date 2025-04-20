import type React from 'react';
import { useState, useEffect } from 'react';
import type { Route } from '../../types/models';
import { routesApi } from '../../lib/api';

interface TicketCountStepProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
  selectedRouteId: string;
}

const TicketCountStep: React.FC<TicketCountStepProps> = ({
  value,
  onChange,
  onNext,
  onBack,
  selectedRouteId,
}) => {
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Загрузка информации о маршруте
    const fetchRouteInfo = async () => {
      if (!selectedRouteId) return;

      setLoading(true);
      setError('');

      try {
        const routeInfo = await routesApi.getById(selectedRouteId);
        setRoute(routeInfo);
      } catch (err) {
        console.error('Ошибка загрузки информации о маршруте:', err);
        setError('Не удалось загрузить информацию о маршруте. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchRouteInfo();
  }, [selectedRouteId]);

  // Обработчики изменения количества билетов
  const decreaseCount = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const increaseCount = () => {
    // Ограничиваем максимальное количество билетов для одного бронирования (например, 10)
    if (value < 10) {
      onChange(value + 1);
    }
  };

  // Расчет итоговой стоимости
  const totalPrice = route ? route.price * value : 0;

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
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Quantity</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select the number of tickets you need</p>
            </div>

            {loading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff7a5c]" />
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 dark:bg-red-900 rounded-md text-red-600 dark:text-red-300">
                {error}
              </div>
            ) : route ? (
              <>
                {/* Route info */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="bg-[#ffebe8] dark:bg-[#4a2218] rounded-md p-3">
                    <div className="font-medium text-[#ff7a5c] dark:text-[#ff9e85] mb-1">{route.name}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {route.origin} → {route.destination}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      Duration: {route.duration}
                    </div>
                  </div>
                </div>

                {/* Ticket count selector */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={decreaseCount}
                      disabled={value <= 1}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                        value <= 1
                          ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-[#ffebe8] text-[#ff7a5c] hover:bg-[#ffddd5] dark:bg-[#4a2218] dark:text-[#ff9e85]'
                      }`}
                    >
                      -
                    </button>
                    <div className="mx-8 text-center">
                      <div className="text-4xl font-bold text-gray-800 dark:text-white">{value}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">tickets</div>
                    </div>
                    <button
                      type="button"
                      onClick={increaseCount}
                      disabled={value >= 10}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                        value >= 10
                          ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-[#ffebe8] text-[#ff7a5c] hover:bg-[#ffddd5] dark:bg-[#4a2218] dark:text-[#ff9e85]'
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price summary */}
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">Price per ticket:</div>
                      <div className="text-gray-800 dark:text-white font-medium">{route.price} {route.currency}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-600 dark:text-gray-400 text-sm">Total price:</div>
                      <div className="text-[#ff7a5c] dark:text-[#ff9e85] font-bold text-lg">{totalPrice} {route.currency}</div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
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
          disabled={loading || !!error}
          onClick={onNext}
          className={`flex-1 py-3 rounded-md font-medium text-white ${
            loading || !!error
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

export default TicketCountStep;
