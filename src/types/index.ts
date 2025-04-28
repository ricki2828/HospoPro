// Common types used across the application

export type PromoType = 'Happy Hour' | 'Live Music' | 'Special Menu' | 'Discount' | 'Event';

export interface Promo {
  id: string;
  name: string;
  type: PromoType;
  startDate: string;
  endDate: string;
  cost: number;
  expectedRevenue: number;
  actualRevenue?: number;
}

export interface Booking {
  id: string;
  date: string;
  time: string;
  partySize: number;
  customerName: string;
  phoneNumber: string;
  email: string;
  source: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  noShowRisk: 'low' | 'medium' | 'high';
}

export interface Revenue {
  date: string;
  amount: number;
  baseline: number;
  forecast?: number;
}

export interface WeatherData {
  date: string;
  description: string;
  icon: string;
  temperature: number;
  precipitation: number;
}

export interface DayOfWeekTrend {
  dayOfWeek: string;
  averageRevenue: number;
  lastWeekRevenue: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Forecast {
  date: string;
  minRevenue: number;
  maxRevenue: number;
  expectedRevenue: number;
  confidence: number;
  factors: {
    weather: number;
    bookings: number;
    dayOfWeek: number;
    promos: number;
  };
}