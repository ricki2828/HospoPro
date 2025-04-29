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
  amount?: number;
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

export type Team = 'Kitchen' | 'Front of House' | 'Management';

export interface StaffMember {
  id: string;
  name: string;
  team: Team;
}

export interface Shift {
  id: string;
  staffId: string;
  startTime: Date;
  endTime: Date;
  date: string; // Store as YYYY-MM-DD string for consistency
}

// Represents the roster for a specific period (e.g., a week)
export interface RosterData {
  startDate: Date;
  endDate: Date;
  shifts: Shift[];
}

// Type for combined data used in the main revenue chart
export interface RevenueChartDataPoint {
  date: string;
  amount?: number; // Actual revenue
  baseline?: number;
  forecast?: number;
  staffCount?: number;
  lastYearAmount?: number; // Add last year's revenue
}