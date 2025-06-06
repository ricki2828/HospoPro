import { Promo, Booking, Revenue, WeatherData, DayOfWeekTrend, Forecast, StaffMember, Shift, FoodSafetyTask } from '../types';
import { addDays, format, subDays, startOfDay, setHours, setMinutes, subYears, parseISO, addWeeks, addMonths, startOfWeek, endOfDay, subMonths } from 'date-fns';

// Helper function to create dates
const createDate = (daysFromToday: number): string => {
  return format(
    addDays(startOfDay(new Date()), daysFromToday),
    'yyyy-MM-dd'
  );
};

// Helper function to create Date objects
const createDateTime = (daysFromToday: number, hour: number = 0, minute: number = 0): Date => {
  const baseDate = addDays(startOfDay(new Date()), daysFromToday);
  return setMinutes(setHours(baseDate, hour), minute);
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

// Mock revenue data (current + forecast)
export const currentRevenueData: Revenue[] = [
  { date: createDate(-30), amount: 2500, baseline: 2800 }, // Add more history
  { date: createDate(-29), amount: 2600, baseline: 2700 },
  { date: createDate(-28), amount: 2700, baseline: 2900 },
  { date: createDate(-27), amount: 3300, baseline: 3100 },
  { date: createDate(-26), amount: 3800, baseline: 3500 },
  { date: createDate(-25), amount: 4500, baseline: 4200 },
  { date: createDate(-24), amount: 5500, baseline: 5000 },
  { date: createDate(-23), amount: 5200, baseline: 4800 },
  { date: createDate(-22), amount: 3100, baseline: 3000 },
  { date: createDate(-21), amount: 2900, baseline: 2800 },
  { date: createDate(-20), amount: 2800, baseline: 2900 },
  { date: createDate(-19), amount: 3600, baseline: 3300 },
  { date: createDate(-18), amount: 4100, baseline: 3700 },
  { date: createDate(-17), amount: 4900, baseline: 4500 },
  { date: createDate(-16), amount: 5900, baseline: 5400 },
  { date: createDate(-15), amount: 5700, baseline: 5200 },
  { date: createDate(-14), amount: 3300, baseline: 3100 }, 
  { date: createDate(-13), amount: 3000, baseline: 2800 }, 
  { date: createDate(-12), amount: 2700, baseline: 2600 },
  { date: createDate(-11), amount: 3400, baseline: 3100 },
  { date: createDate(-10), amount: 4000, baseline: 3700 },
  { date: createDate(-9), amount: 4800, baseline: 4400 },
  { date: createDate(-8), amount: 6000, baseline: 5400 },
  { date: createDate(-7), amount: 5600, baseline: 4900 },
  { date: createDate(-6), amount: 3200, baseline: 3000 },
  { date: createDate(-5), amount: 2800, baseline: 2700 },
  { date: createDate(-4), amount: 3500, baseline: 3200 },
  { date: createDate(-3), amount: 4200, baseline: 3800 },
  { date: createDate(-2), amount: 5000, baseline: 4500 },
  { date: createDate(-1), amount: 6200, baseline: 5500 },
  { date: createDate(0), amount: 5800, baseline: 5000 },
  { date: createDate(1), forecast: 4800, baseline: 4000 },
  { date: createDate(2), forecast: 5200, baseline: 4600 },
  { date: createDate(3), forecast: 3900, baseline: 3500 },
  { date: createDate(4), forecast: 3200, baseline: 3000 },
  { date: createDate(5), forecast: 4500, baseline: 4000 },
  { date: createDate(6), forecast: 5500, baseline: 4800 },
  { date: createDate(7), forecast: 6000, baseline: 5200 },
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

// Mock Staff Members
export const staffMembers: StaffMember[] = [
  // Kitchen
  { id: 'k1', name: 'Alice Chef', team: 'Kitchen' },
  { id: 'k2', name: 'Bob Sous-Chef', team: 'Kitchen' },
  { id: 'k3', name: 'Charlie Cook', team: 'Kitchen' },
  { id: 'k4', name: 'Diana Dishwasher', team: 'Kitchen' },
  // Front of House
  { id: 'f1', name: 'Eve Waitress', team: 'Front of House' },
  { id: 'f2', name: 'Frank Waiter', team: 'Front of House' },
  { id: 'f3', name: 'Grace Host', team: 'Front of House' },
  { id: 'f4', name: 'Henry Bartender', team: 'Front of House' },
  { id: 'f5', name: 'Ivy Barback', team: 'Front of House' },
  // Management
  { id: 'm1', name: 'Judy Manager', team: 'Management' },
  { id: 'm2', name: 'Ken Assistant Manager', team: 'Management' },
];

// Helper function to generate plausible shifts for a given day
const generateShiftsForDay = (dayOffset: number): Shift[] => {
  const date = createDate(dayOffset);
  const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 6 = Saturday
  const generatedShifts: Shift[] = [];
  let shiftIdCounter = dayOffset * 100; // Simple unique ID generation

  // Example: Fewer staff on Mon/Tue, more on Fri/Sat
  const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;
  const isQuietDay = dayOfWeek === 1 || dayOfWeek === 2;

  // Kitchen Staff
  generatedShifts.push({ id: `s${shiftIdCounter++}`, staffId: 'k1', date, startTime: createDateTime(dayOffset, 8, 0), endTime: createDateTime(dayOffset, 16, 0) }); // Always Alice
  if (!isQuietDay) {
    generatedShifts.push({ id: `s${shiftIdCounter++}`, staffId: 'k2', date, startTime: createDateTime(dayOffset, 9, 0), endTime: createDateTime(dayOffset, 17, 0) }); // Bob on busier days
  }
  generatedShifts.push({ id: `s${shiftIdCounter++}`, staffId: 'k3', date, startTime: createDateTime(dayOffset, 15, 0), endTime: createDateTime(dayOffset, 23, 0) }); // Always Charlie

  // FOH Staff
  generatedShifts.push({ id: `s${shiftIdCounter++}`, staffId: 'f1', date, startTime: createDateTime(dayOffset, 11, 0), endTime: createDateTime(dayOffset, 19, 0) }); // Always Eve
  if (isWeekend || dayOfWeek === 5) { // Frank Fri/Sat/Sun
    generatedShifts.push({ id: `s${shiftIdCounter++}`, staffId: 'f2', date, startTime: createDateTime(dayOffset, 17, 0), endTime: createDateTime(dayOffset, 23, 30) });
  }
  if (isWeekend) { // Grace Host Sat/Sun
     generatedShifts.push({ id: `s${shiftIdCounter++}`, staffId: 'f3', date, startTime: createDateTime(dayOffset, 17, 0), endTime: createDateTime(dayOffset, 22, 0) });
  }
  if (!isQuietDay) { // Henry Bartender not Mon/Tue
      generatedShifts.push({ id: `s${shiftIdCounter++}`, staffId: 'f4', date, startTime: createDateTime(dayOffset, 16, 0), endTime: createDateTime(dayOffset + (dayOfWeek === 6 ? 1 : 0), 0, 0) }); // Ends midnight, next day if Sat
  }

  // Management
  if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Judy Mon-Fri
    generatedShifts.push({ id: `s${shiftIdCounter++}`, staffId: 'm1', date, startTime: createDateTime(dayOffset, 9, 0), endTime: createDateTime(dayOffset, 17, 0) });
  } else { // Ken Sat/Sun
     generatedShifts.push({ id: `s${shiftIdCounter++}`, staffId: 'm2', date, startTime: createDateTime(dayOffset, 14, 0), endTime: createDateTime(dayOffset, 22, 0) });
  }

  return generatedShifts;
};

// Generate mock shifts from 30 days ago up to 14 days in the future
const shifts: Shift[] = [];
for (let i = -30; i <= 14; i++) {
  shifts.push(...generateShiftsForDay(i));
}
export const mockShifts: Shift[] = shifts;

// --- Generate Historical Revenue Data --- 

// Helper to generate plausible revenue data for a specific year offset
const generateRevenueForYear = (yearOffset: number, baseRevenueData: Revenue[]): Revenue[] => {
  return baseRevenueData.map(currentYearData => {
    const pastDate = format(subYears(parseISO(currentYearData.date), yearOffset), 'yyyy-MM-dd');
    // Assume baseline was slightly lower in the past, decreases further back
    const baselineAdjustment = 1 - (0.05 * yearOffset); 
    const pastBaseline = Math.round((currentYearData.baseline || 3000) * baselineAdjustment);
    // Generate amount based on past baseline with some variation
    const variationFactor = (0.85 + Math.random() * 0.3); // Random factor 0.85 - 1.15
    const pastAmount = Math.round(pastBaseline * variationFactor);

    return {
      date: pastDate,
      amount: pastAmount,
      baseline: pastBaseline, 
    };
  });
};

// Generate data for the last 3 years
const revenueYearMinus1 = generateRevenueForYear(1, currentRevenueData);
const revenueYearMinus2 = generateRevenueForYear(2, currentRevenueData);
const revenueYearMinus3 = generateRevenueForYear(3, currentRevenueData);

// Combine all revenue data into one array/map
// Using a Map is efficient for lookups by date
export const allRevenueMap = new Map<string, Revenue>();
[...currentRevenueData, ...revenueYearMinus1, ...revenueYearMinus2, ...revenueYearMinus3].forEach(rev => {
    // Only add if amount exists, prioritize more recent data if dates overlap (shouldn't with this gen method)
    if (rev.amount !== undefined) {
       allRevenueMap.set(rev.date, rev);
    }
});

// Export for legacy use if needed (e.g., dashboard card still uses this?)
export const revenueData = currentRevenueData;
export const lastYearRevenueData = revenueYearMinus1; 

// --- Mock Food Safety Tasks ---

// Helper to calculate next due date based on frequency and last completion
// For simplicity in mock data, we'll often set nextDueDate directly based on today
const today = startOfDay(new Date());

export const mockFoodSafetyTasks: FoodSafetyTask[] = [
  {
    id: 'fst1',
    name: 'Check Fridge Temperatures (Walk-in)',
    frequency: 'Daily',
    category: 'Temperature',
    lastCompletedDate: createDate(-1), // Yesterday
    nextDueDate: createDate(0), // Today
  },
  {
    id: 'fst2',
    name: 'Check Freezer Temperatures',
    frequency: 'Daily',
    category: 'Temperature',
    // No last completion, assume due today
    nextDueDate: createDate(0), // Today
  },
  {
    id: 'fst3',
    name: 'Clean Coffee Machine',
    frequency: 'Daily',
    category: 'Cleaning',
    lastCompletedDate: createDate(-1),
    nextDueDate: createDate(0),
  },
   {
    id: 'fst4',
    name: 'Weekly Staff Hygiene Review',
    frequency: 'Weekly',
    category: 'Staff Training',
    // Assume last done last Monday, due next Monday
    lastCompletedDate: format(startOfWeek(subDays(today, 7), { weekStartsOn: 1 }), 'yyyy-MM-dd'), 
    nextDueDate: format(startOfWeek(addDays(today, 7), { weekStartsOn: 1 }), 'yyyy-MM-dd'), // Next Monday
  },
  {
    id: 'fst5',
    name: 'Deep Clean Fryers',
    frequency: 'Weekly',
    category: 'Cleaning',
    lastCompletedDate: format(subDays(today, 3), 'yyyy-MM-dd'), // 3 days ago
    nextDueDate: format(addDays(subDays(today, 3), 7), 'yyyy-MM-dd'), // 4 days from now
  },
   {
    id: 'fst6',
    name: 'Monthly Pest Control Check',
    frequency: 'Monthly',
    category: 'Maintenance',
    lastCompletedDate: format(subMonths(today, 1), 'yyyy-MM-dd'), // Last month
    nextDueDate: format(addMonths(today, 1), 'yyyy-MM-dd'), // Next month same day
  },
  {
    id: 'fst7',
    name: 'Rangehood Filter Clean',
    frequency: 'Monthly',
    category: 'Cleaning',
    lastCompletedDate: format(subDays(today, 10), 'yyyy-MM-dd'), // 10 days ago
    nextDueDate: format(addMonths(subDays(today, 10), 1), 'yyyy-MM-dd'), // ~20 days from now
  },
  {
    id: 'fst8',
    name: 'Annual Fire Safety Inspection',
    frequency: 'Annually',
    category: 'Maintenance',
    // Assume due in 2 months
    nextDueDate: format(addMonths(today, 2), 'yyyy-MM-dd'), 
  },
   {
    id: 'fst9',
    name: 'Review Food Safety Plan',
    frequency: 'Once',
    category: 'Documentation',
    // Specific one-off due date
    nextDueDate: createDate(14), // In 2 weeks
  },
];