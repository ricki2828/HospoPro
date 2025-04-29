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
  lastWeekRevenue?: number;
  trend?: 'up' | 'down' | 'stable';
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
  weatherIcon?: string; // Add optional weather icon identifier
}

// --- Comparison Data Types ---
export interface ComparisonDayData {
  date: string;
  revenue?: number;
  weather?: WeatherData;
  promos: Promo[];
}

export interface ComparisonData {
  selectedDay: ComparisonDayData;
  previousWeeks: ComparisonDayData[];
}

// --- Analytics View Data Types ---
export interface WeeklyComparison {
    dayOfWeek: string; // e.g., "Monday"
    currentWeekRevenue: number;
    previousWeekRevenue: number;
}

// Data for each day in the monthly comparison
export interface MonthlyComparisonDay {
    date: string; // YYYY-MM-DD
    currentMonthRevenue?: number;
    priorYearRevenue?: number;
}

// Structure for the entire monthly comparison
export interface MonthlyComparisonData {
    dailyData: MonthlyComparisonDay[];
    currentMonthTotal: number;
    priorYearMonthTotal: number;
}

// Data for each month in the yearly comparison
export interface YearlyComparisonMonth {
    month: string; // e.g., "Jan", "Feb"
    ttmRevenue: number; // Trailing Twelve Month revenue for that month
    priorYearRevenue: number; // Revenue for the corresponding month in the prior year
}

// Structure for the entire yearly comparison
export interface YearlyComparisonData {
    monthlyData: YearlyComparisonMonth[];
    // Add overall totals if needed later
}

// Type for representing the impact of a single factor
export interface FactorImpact {
    factorName: string; // e.g., "Weather: Sunny", "Promo: Happy Hour", "Day: Saturday"
    averageVariance: number; // Average % variance from baseline when this factor is present
    // Optional: Add sample size (number of days) if useful
    // sampleSize: number;
}

// Structure for the overall factor analysis results
export interface FactorAnalysisResults {
    topPositiveFactors: FactorImpact[];
    topNegativeFactors: FactorImpact[];
}

// --- Food Safety Types ---

export type TaskFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually' | 'Once';

export interface FoodSafetyTask {
  id: string;
  name: string;
  description?: string;
  frequency: TaskFrequency;
  // We'll store nextDueDate directly in mock data for simplicity
  // In a real app, this would often be calculated based on lastCompletedDate + frequency
  nextDueDate: string; // YYYY-MM-DD format
  lastCompletedDate?: string; // YYYY-MM-DD format
  category?: string; // e.g., Cleaning, Temperature, Maintenance
}

// Optional: Could add TaskLog later
// export interface TaskLog {
//   id: string;
//   taskId: string;
//   completedAt: Date;
//   completedByStaffId: string;
//   notes?: string;
//   status?: 'Pass' | 'Fail' | 'N/A';
// }