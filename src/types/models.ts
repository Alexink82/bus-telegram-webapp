// Типы данных для моделей приложения

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  duration: string; // в формате "HH:MM"
  price: number;
  currency: string;
  availableDays: number[]; // 0-6, где 0 - воскресенье, 6 - суббота
}

export interface Schedule {
  id: string;
  routeId: string;
  departureTime: string; // в формате "HH:MM"
  arrivalTime: string; // в формате "HH:MM"
  date: string; // в формате "YYYY-MM-DD"
  availableSeats: number;
  totalSeats: number;
}

export interface Booking {
  id: string;
  userId: number; // Telegram User ID
  routeId: string;
  scheduleId: string;
  passengerName: string;
  passengerPhone: string;
  ticketCount: number;
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string; // в формате "YYYY-MM-DD HH:MM:SS"
}

export interface BookingFormData {
  passengerName: string;
  passengerPhone: string;
  ticketCount: number;
  selectedDate: string;
  selectedRoute: string;
  selectedSchedule: string;
  countryCode: string;
}

export interface Country {
  name: string;
  code: string;
  dialCode: string;
  operatorCodes: string[];
}

export default {};
