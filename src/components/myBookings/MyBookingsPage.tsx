import type React from 'react';
import { useEffect, useState } from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import type { Booking, Route } from '../../types/models';
import { bookingsApi, routesApi } from '../../lib/api';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Расширенный интерфейс для бронирования с маршрутом
interface BookingWithRoute extends Booking {
  route?: Route;
}

const MyBookingsPage: React.FC = () => {
  const { user } = useTelegram();
  const [bookings, setBookings] = useState<BookingWithRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError('');

        // Получаем бронирования для текущего пользователя
        const userBookings = await bookingsApi.getByUserId(user.id);

        // Получаем информацию о маршрутах для каждого бронирования
        const bookingsWithRoutes: BookingWithRoute[] = await Promise.all(
          userBookings.map(async booking => {
            const route = await routesApi.getById(booking.routeId);
            return { ...booking, route: route || undefined };
          })
        );

        setBookings(bookingsWithRoutes);
      } catch (err) {
        console.error('Ошибка при загрузке бронирований:', err);
        setError('Не удалось загрузить ваши бронирования. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Получение CSS-класса для статуса бронирования
  const getStatusClass = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  // Отображение понятного текста статуса бронирования
  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Подтверждено';
      case 'cancelled':
        return 'Отменено';
      default:
        return 'Ожидание';
    }
  };

  // Функция для отмены бронирования
  const handleCancelBooking = async (bookingId: string) => {
    try {
      setLoading(true);
      await bookingsApi.update(bookingId, { status: 'cancelled' });

      // Обновляем список бронирований
      const updatedBookings = bookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: 'cancelled' as const }
          : booking
      );

      setBookings(updatedBookings);
    } catch (err) {
      console.error('Ошибка при отмене бронирования:', err);
      setError('Не удалось отменить бронирование. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Мои бронирования</h2>

      <div className="mb-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {user ? (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Здравствуйте, {user.first_name}! {bookings.length > 0
                  ? 'Вот ваши бронирования:'
                  : 'У вас пока нет бронирований.'}
              </p>

              {loading ? (
                <div className="py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff7a5c] mx-auto" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Загрузка бронирований...</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 dark:bg-red-900 rounded-md text-red-600 dark:text-red-300">
                  {error}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                    У вас пока нет бронирований
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Забронируйте билет и он появится здесь.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">{booking.route?.name || 'Маршрут недоступен'}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {format(new Date(booking.createdAt), 'd MMMM yyyy', { locale: ru })}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between text-sm flex-wrap">
                          <span className="text-gray-600 dark:text-gray-400 mr-2">Билеты:</span>
                          <span className="text-gray-800 dark:text-white">
                            {booking.ticketCount} x {booking.route?.price || 0} {booking.currency}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mt-1 flex-wrap">
                          <span className="text-gray-600 dark:text-gray-400 mr-2">Итого:</span>
                          <span className="font-medium text-[#ff7a5c] dark:text-[#ff9580]">
                            {booking.totalPrice} {booking.currency}
                          </span>
                        </div>
                      </div>

                      {booking.status !== 'cancelled' && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            className="flex-1 px-3 py-2 text-xs font-medium rounded border border-[#ff7a5c] text-[#ff7a5c] hover:bg-[#fff3f1] dark:hover:bg-[#5c2d25]"
                            onClick={() => {}}
                          >
                            Детали
                          </button>
                          <button
                            className="flex-1 px-3 py-2 text-xs font-medium rounded border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={loading}
                          >
                            Отменить
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                Необходима авторизация
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Для просмотра бронирований необходимо авторизоваться через Telegram.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
