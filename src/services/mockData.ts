import { Promo, Booking, Revenue, WeatherData, DayOfWeekTrend, Forecast } from '../types';
import { addDays, format, subDays, startOfDay } from 'date-fns';

// Helper function to create dates
const createDate = (daysFromToday: number) => {
  return format(
    daysFromToday >= 0 
      ? addDays(startOfDay(new Date()), daysFromToday)
      : subDays(startOfDay(new Date()), Math.abs(daysFromToday)),
    'yyyy-MM-dd'
  );
};

// Mock promos
export const promos: Promo[] = [
  {
    id: '1',
    name: 'Happy Hour Fridays',
    type: 'Happy Hour',
    startDate: createDate(1),
    endDate: createDate(1),
    cost: 200,
    expectedRevenue: 800,
    actualRevenue: 950,
  },
  {
    id: '2',
    name: 'Live Jazz Night',
    type: 'Live Music',
    startDate: createDate(2),
    endDate: createDate(2),
    cost: 500,
    expectedRevenue: 1500,
  },
  {
    id: '3',
    name: 'Two for One Tuesdays',
    type: 'Discount',
    startDate: createDate(5),
    endDate: createDate(5),
    cost: 300,
    expectedRevenue: 1200,
  },
  {
    id: '4',
    name: 'Cocktail Masterclass',
    type: 'Event',
    startDate: createDate(7),
    endDate: createDate(7),
    cost: 400,
    expectedRevenue: 1600,
  },
  {
    id: '5',
    name: 'Wine Tasting Evening',
    type: 'Event',
    startDate: createDate(10),
    endDate: createDate(10),
    cost: 600,
    expectedRevenue: 2000,
  },
];

// Mock bookings
export const bookings: Booking[] = [
  {
    id: '1',
    date: createDate(0),
    time: '19:00',
    partySize: 6,
    customerName: 'John Smith',
    phoneNumber: '021-555-1234',
    email: 'john.smith@example.com',
    source: 'Website',
    status: 'confirmed',
    noShowRisk: 'low',
  },
  {
    id: '2',
    date: createDate(0),
    time: '20:00',
    partySize: 4,
    customerName: 'Emma Johnson',
    phoneNumber: '022-555-5678',
    email: 'emma.j@example.com',
    source: 'Phone',
    status: 'confirmed',
    noShowRisk: 'low',
  },
  {
    id: '3',
    date: createDate(1),
    time: '18:30',
    partySize: 8,
    customerName: 'Corporate Group',
    phoneNumber: '027-555-9012',
    email: 'events@company.com',
    source: 'Website',
    status: 'confirmed',
    noShowRisk: 'medium',
  },
  {
    id: '4',
    date: createDate(2),
    time: '19:30',
    partySize: 2,
    customerName: 'Sarah Wilson',
    phoneNumber: '021-555-3456',
    email: 'sarah.w@example.com',
    source: 'Google',
    status: 'confirmed',
    noShowRisk: 'low',
  },
  {
    id: '5',
    date: createDate(2),
    time: '20:30',
    partySize: 10,
    customerName: 'Birthday Party',
    phoneNumber: '022-555-7890',
    email: 'mike.b@example.com',
    source: 'Phone',
    status: 'confirmed',
    noShowRisk: 'high',
  },
  {
    id: '6',
    date: createDate(3),
    time: '19:00',
    partySize: 4,
    customerName: 'David Lee',
    phoneNumber: '027-555-2345',
    email: 'david.l@example.com',
    source: 'Website',
    status: 'pending',
    noShowRisk: 'medium',
  },
];

// Mock revenue data
export const revenueData: Revenue[] = [
  { date: createDate(-6), amount: 3200, baseline: 3000 },
  { date: createDate(-5), amount: 2800, baseline: 2700 },
  { date: createDate(-4), amount: 3500, baseline: 3200 },
  { date: createDate(-3), amount: 4200, baseline: 3800 },
  { date: createDate(-2), amount: 5000, baseline: 4500 },
  { date: createDate(-1), amount: 6200, baseline: 5500 },
  { date: createDate(0), amount: 5800, baseline: 5000 },
  { date: createDate(1), forecast: 4800, baseline: 4000, amount: 0 },
  { date: createDate(2), forecast: 5200, baseline: 4600, amount: 0 },
  { date: createDate(3), forecast: 3900, baseline: 3500, amount: 0 },
  { date: createDate(4), forecast: 3200, baseline: 3000, amount: 0 },
  { date: createDate(5), forecast: 4500, baseline: 4000, amount: 0 },
  { date: createDate(6), forecast: 5500, baseline: 4800, amount: 0 },
  { date: createDate(7), forecast: 6000, baseline: 5200, amount: 0 },
];

// Mock weather data
export const weatherData: WeatherData[] = [
  {
    date: createDate(0),
    description: 'Clear Sky',
    icon: 'sun',
    temperature: 22,
    precipitation: 0,
  },
  {
    date: createDate(1),
    description: 'Scattered Clouds',
    icon: 'cloud',
    temperature: 20,
    precipitation: 0,
  },
  {
    date: createDate(2),
    description: 'Light Rain',
    icon: 'cloud-rain',
    temperature: 18,
    precipitation: 2.5,
  },
  {
    date: createDate(3),
    description: 'Overcast',
    icon: 'cloud',
    temperature: 19,
    precipitation: 0,
  },
  {
    date: createDate(4),
    description: 'Heavy Rain',
    icon: 'cloud-rain',
    temperature: 17,
    precipitation: 8.2,
  },
  {
    date: createDate(5),
    description: 'Clear Sky',
    icon: 'sun',
    temperature: 21,
    precipitation: 0,
  },
  {
    date: createDate(6),
    description: 'Partly Cloudy',
    icon: 'cloud-sun',
    temperature: 20,
    precipitation: 0,
  },
];

// Mock day of week trends
export const dayOfWeekTrends: DayOfWeekTrend[] = [
  {
    dayOfWeek: 'Monday',
    averageRevenue: 2800,
    lastWeekRevenue: 2900,
    trend: 'up',
  },
  {
    dayOfWeek: 'Tuesday',
    averageRevenue: 3000,
    lastWeekRevenue: 2800,
    trend: 'down',
  },
  {
    dayOfWeek: 'Wednesday',
    averageRevenue: 3500,
    lastWeekRevenue: 3600,
    trend: 'up',
  },
  {
    dayOfWeek: 'Thursday',
    averageRevenue: 4200,
    lastWeekRevenue: 4300,
    trend: 'up',
  },
  {
    dayOfWeek: 'Friday',
    averageRevenue: 5500,
    lastWeekRevenue: 5400,
    trend: 'down',
  },
  {
    dayOfWeek: 'Saturday',
    averageRevenue: 6000,
    lastWeekRevenue: 6200,
    trend: 'up',
  },
  {
    dayOfWeek: 'Sunday',
    averageRevenue: 4800,
    lastWeekRevenue: 4600,
    trend: 'down',
  },
];

// Mock forecast data
export const forecastData: Forecast[] = [
  {
    date: createDate(1),
    minRevenue: 4200,
    maxRevenue: 5200,
    expectedRevenue: 4800,
    confidence: 85,
    factors: {
      weather: 5,
      bookings: 35,
      dayOfWeek: 30,
      promos: 30,
    },
  },
  {
    date: createDate(2),
    minRevenue: 4600,
    maxRevenue: 5600,
    expectedRevenue: 5200,
    confidence: 80,
    factors: {
      weather: -10,
      bookings: 40,
      dayOfWeek: 35,
      promos: 35,
    },
  },
  {
    date: createDate(3),
    minRevenue: 3400,
    maxRevenue: 4400,
    expectedRevenue: 3900,
    confidence: 75,
    factors: {
      weather: 0,
      bookings: 20,
      dayOfWeek: 80,
      promos: 0,
    },
  },
  {
    date: createDate(4),
    minRevenue: 2700,
    maxRevenue: 3700,
    expectedRevenue: 3200,
    confidence: 70,
    factors: {
      weather: -15,
      bookings: 10,
      dayOfWeek: 105,
      promos: 0,
    },
  },
  {
    date: createDate(5),
    minRevenue: 4000,
    maxRevenue: 5000,
    expectedRevenue: 4500,
    confidence: 65,
    factors: {
      weather: 10,
      bookings: 15,
      dayOfWeek: 40,
      promos: 35,
    },
  },
  {
    date: createDate(6),
    minRevenue: 5000,
    maxRevenue: 6000,
    expectedRevenue: 5500,
    confidence: 60,
    factors: {
      weather: 5,
      bookings: 25,
      dayOfWeek: 70,
      promos: 0,
    },
  },
  {
    date: createDate(7),
    minRevenue: 5500,
    maxRevenue: 6500,
    expectedRevenue: 6000,
    confidence: 55,
    factors: {
      weather: 5,
      bookings: 35,
      dayOfWeek: 40,
      promos: 20,
    },
  },
];