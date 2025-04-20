import type { Booking, BookingFormData, Route, Schedule } from '../types/models';

// Константы для ключей localStorage
const STORAGE_KEYS = {
  BOOKINGS: 'bus_app_bookings',
  ROUTES: 'bus_app_routes',
  SCHEDULES: 'bus_app_schedules',
};

// Демо-маршруты
export const DEMO_ROUTES: Route[] = [
  {
    id: 'minsk-vilnus',
    name: 'Минск - Вильнюс',
    origin: 'Минск',
    destination: 'Вильнюс',
    duration: '04:30',
    price: 45,
    currency: 'BYN',
    availableDays: [0, 1, 2, 3, 4, 5, 6], // ежедневно
  },
  {
    id: 'minsk-warsaw',
    name: 'Минск - Варшава',
    origin: 'Минск',
    destination: 'Варшава',
    duration: '06:15',
    price: 90,
    currency: 'BYN',
    availableDays: [1, 3, 5], // понедельник, среда, пятница
  },
  {
    id: 'minsk-riga',
    name: 'Минск - Рига',
    origin: 'Минск',
    destination: 'Рига',
    duration: '08:00',
    price: 70,
    currency: 'BYN',
    availableDays: [0, 4, 6], // воскресенье, четверг, суббота
  },
  {
    id: 'minsk-kyiv',
    name: 'Минск - Киев',
    origin: 'Минск',
    destination: 'Киев',
    duration: '10:30',
    price: 85,
    currency: 'BYN',
    availableDays: [2, 5], // вторник, пятница
  },
];

// Инициализация хранилища при первом запуске
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.ROUTES)) {
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(DEMO_ROUTES));
  }

  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.SCHEDULES)) {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify([]));
  }
};

// Инициализация при импорте модуля
initializeStorage();

// Функции API для работы с маршрутами
export const routesApi = {
  getAll: async (): Promise<Route[]> => {
    await simulateNetworkDelay();
    const routesData = localStorage.getItem(STORAGE_KEYS.ROUTES);
    return JSON.parse(routesData || '[]');
  },

  getById: async (id: string): Promise<Route | null> => {
    await simulateNetworkDelay();
    const routes = await routesApi.getAll();
    return routes.find(route => route.id === id) || null;
  },

  getAvailableForDate: async (date: string): Promise<Route[]> => {
    await simulateNetworkDelay();
    const dayOfWeek = new Date(date).getDay();
    const routes = await routesApi.getAll();
    return routes.filter(route => route.availableDays.includes(dayOfWeek));
  },

  create: async (route: Omit<Route, 'id'>): Promise<Route> => {
    await simulateNetworkDelay();
    const routes = await routesApi.getAll();
    const newRoute: Route = {
      ...route,
      id: `route-${Date.now()}`,
    };

    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify([...routes, newRoute]));
    return newRoute;
  },

  update: async (id: string, data: Partial<Route>): Promise<Route | null> => {
    await simulateNetworkDelay();
    const routes = await routesApi.getAll();
    const index = routes.findIndex(route => route.id === id);

    if (index === -1) return null;

    const updatedRoute = { ...routes[index], ...data };
    routes[index] = updatedRoute;

    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
    return updatedRoute;
  },

  delete: async (id: string): Promise<boolean> => {
    await simulateNetworkDelay();
    const routes = await routesApi.getAll();
    const filteredRoutes = routes.filter(route => route.id !== id);

    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(filteredRoutes));
    return true;
  },
};

// Функции API для работы с бронированиями
export const bookingsApi = {
  getAll: async (): Promise<Booking[]> => {
    await simulateNetworkDelay();
    const bookingsData = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return JSON.parse(bookingsData || '[]');
  },

  getById: async (id: string): Promise<Booking | null> => {
    await simulateNetworkDelay();
    const bookings = await bookingsApi.getAll();
    return bookings.find(booking => booking.id === id) || null;
  },

  getByUserId: async (userId: number): Promise<Booking[]> => {
    await simulateNetworkDelay();
    const bookings = await bookingsApi.getAll();
    return bookings.filter(booking => booking.userId === userId);
  },

  create: async (data: BookingFormData, userId: number): Promise<Booking> => {
    await simulateNetworkDelay();
    const route = await routesApi.getById(data.selectedRoute);

    if (!route) {
      throw new Error('Маршрут не найден');
    }

    const bookings = await bookingsApi.getAll();
    const newBooking: Booking = {
      id: `BK-${Date.now().toString().slice(-8)}`,
      userId,
      routeId: data.selectedRoute,
      scheduleId: data.selectedSchedule || '',
      passengerName: data.passengerName,
      passengerPhone: data.passengerPhone,
      ticketCount: data.ticketCount,
      totalPrice: route.price * data.ticketCount,
      currency: route.currency,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([...bookings, newBooking]));
    return newBooking;
  },

  update: async (id: string, data: Partial<Booking>): Promise<Booking | null> => {
    await simulateNetworkDelay();
    const bookings = await bookingsApi.getAll();
    const index = bookings.findIndex(booking => booking.id === id);

    if (index === -1) return null;

    const updatedBooking = { ...bookings[index], ...data };
    bookings[index] = updatedBooking;

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return updatedBooking;
  },

  delete: async (id: string): Promise<boolean> => {
    await simulateNetworkDelay();
    const bookings = await bookingsApi.getAll();
    const filteredBookings = bookings.filter(booking => booking.id !== id);

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(filteredBookings));
    return true;
  },
};

// Функции API для работы с расписанием
export const schedulesApi = {
  getAll: async (): Promise<Schedule[]> => {
    await simulateNetworkDelay();
    const schedulesData = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    return JSON.parse(schedulesData || '[]');
  },

  getByRouteAndDate: async (routeId: string, date: string): Promise<Schedule[]> => {
    await simulateNetworkDelay();
    const schedules = await schedulesApi.getAll();
    return schedules.filter(schedule =>
      schedule.routeId === routeId &&
      schedule.date === date
    );
  },

  create: async (schedule: Omit<Schedule, 'id'>): Promise<Schedule> => {
    await simulateNetworkDelay();
    const schedules = await schedulesApi.getAll();
    const newSchedule: Schedule = {
      ...schedule,
      id: `schedule-${Date.now()}`,
    };

    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify([...schedules, newSchedule]));
    return newSchedule;
  },
};

// Вспомогательные функции
function simulateNetworkDelay(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
