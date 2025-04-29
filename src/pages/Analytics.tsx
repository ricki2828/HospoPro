import { useState, useMemo } from 'react';
// Import necessary data, ensuring no duplicates
import { promos, weatherData as liveWeatherData, allRevenueMap } from '../services/mockData';
// Import historical weather data
import historicalWeatherData from '../data/historicalWeatherData.json';
import { WeatherData, WeeklyComparison, MonthlyComparisonData, MonthlyComparisonDay, YearlyComparisonData, YearlyComparisonMonth, FactorAnalysisResults, FactorImpact, Promo } from '../types'; // Import WeatherData type, WeeklyComparison, Monthly types
import WeeklyComparisonChart from '../components/WeeklyComparisonChart';
import MonthlyComparisonChart from '../components/MonthlyComparisonChart';
import YearlyComparisonChart from '../components/YearlyComparisonChart';
import FactorAnalysisDisplay from '../components/FactorAnalysisDisplay';
import { format, parseISO, subDays, startOfDay, subYears, eachDayOfInterval, getDay, startOfWeek, endOfWeek, subWeeks, isSameDay, getMonth, getYear, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { TrendingUp, TrendingDown, Cloud, CloudRain, Sun } from 'lucide-react';

// Helper to format currency (or import from a shared util)
const formatNZD = (value?: number | null): string => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  // --- Combine historical and live weather data --- 
  const allWeatherDataMap = useMemo(() => {
    const map = new Map<string, WeatherData>();
    // Load historical data first
    (historicalWeatherData as WeatherData[]).forEach(day => {
      map.set(day.date, day);
    });
    // Add/overwrite with live data (more recent)
    // Assuming liveWeatherData is the mock future data
    liveWeatherData.forEach(day => {
      map.set(day.date, day);
    });
    return map;
  }, [liveWeatherData]); // Depend on liveWeatherData if it can change
  
  // --- Calculate WEEKLY comparison data (Monday start) ---
  const weeklyComparisonData = useMemo((): WeeklyComparison[] => {
    // Adjust daysOfWeek array for Monday start
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; 
    // Map keys 1 (Mon) to 0 (Sun) to match getDay() output shifted
    const currentWeekData: { [key: number]: number } = {}; 
    const previousWeekData: { [key: number]: number } = {};
    daysOfWeek.forEach((_, i) => { 
        const dayIndex = (i + 1) % 7; // Mon=1, Tue=2, ..., Sun=0
        currentWeekData[dayIndex] = 0;
        previousWeekData[dayIndex] = 0;
    });
    
    const today = startOfDay(new Date());
    // Add weekStartsOn: 1 option (Monday)
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
    const startOfPreviousWeek = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
    const endOfPreviousWeek = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });

    // Sum revenue for current week
    eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek }).forEach(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const revenue = allRevenueMap.get(dateStr)?.amount;
        if (typeof revenue === 'number') {
            const dayIndex = getDay(date); // getDay() still returns 0 for Sun, 1 for Mon
            currentWeekData[dayIndex] += revenue;
        }
    });

    // Sum revenue for previous week
    eachDayOfInterval({ start: startOfPreviousWeek, end: endOfPreviousWeek }).forEach(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const revenue = allRevenueMap.get(dateStr)?.amount;
        if (typeof revenue === 'number') {
            const dayIndex = getDay(date);
            previousWeekData[dayIndex] += revenue;
        }
    });

    // Format for chart, mapping index back to Mon-Sun order
    return daysOfWeek.map((dayName, index) => {
        const dayIndex = (index + 1) % 7; // Get correct day index (Mon=1, ..., Sun=0)
        return {
            dayOfWeek: dayName,
            currentWeekRevenue: Math.round(currentWeekData[dayIndex]),
            previousWeekRevenue: Math.round(previousWeekData[dayIndex]),
        };
    });

  }, []); 

  // --- Calculate MONTHLY comparison data ---
  const monthlyComparisonData = useMemo((): MonthlyComparisonData | null => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now); // Use endOfMonth, but only iterate up to `now`
    const priorYearMonthStart = startOfMonth(subYears(now, 1));
    const priorYearMonthEnd = endOfMonth(subYears(now, 1));

    const dailyData: MonthlyComparisonDay[] = [];
    let currentMonthTotal = 0;
    let priorYearMonthTotal = 0;

    // Iterate through days of the current month up to today
    eachDayOfInterval({ start: currentMonthStart, end: now }).forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const priorYearDateStr = format(subYears(day, 1), 'yyyy-MM-dd');

        const currentRevenue = allRevenueMap.get(dateStr)?.amount;
        const priorRevenue = allRevenueMap.get(priorYearDateStr)?.amount;

        dailyData.push({
            date: dateStr,
            currentMonthRevenue: currentRevenue,
            priorYearRevenue: priorRevenue
        });

        if (typeof currentRevenue === 'number') {
            currentMonthTotal += currentRevenue;
        }
    });

    // Calculate prior year total for the *entire* corresponding month
    eachDayOfInterval({ start: priorYearMonthStart, end: priorYearMonthEnd }).forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const revenue = allRevenueMap.get(dateStr)?.amount;
        if (typeof revenue === 'number') {
             priorYearMonthTotal += revenue;
        }
    });

    return {
        dailyData: dailyData.sort((a,b) => a.date.localeCompare(b.date)), // Ensure sorted by date
        currentMonthTotal: Math.round(currentMonthTotal),
        priorYearMonthTotal: Math.round(priorYearMonthTotal)
    };
    
  }, []); // Recalculates only on mount (uses current month)

  // --- Calculate YEARLY comparison data (DUMMY DATA for now) ---
  const yearlyComparisonData = useMemo((): YearlyComparisonData => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dummyMonthlyData: YearlyComparisonMonth[] = months.map(month => ({
        month: month,
        // Placeholder values - replace with real TTM/Prior Year calculation later
        ttmRevenue: Math.round(40000 + Math.random() * 20000), 
        priorYearRevenue: Math.round(35000 + Math.random() * 15000) 
    }));

    return {
        monthlyData: dummyMonthlyData
    };
  }, []); // No dependencies for dummy data

  // --- Factor Analysis (Last 30 Days) ---
  const factorAnalysis = useMemo((): FactorAnalysisResults => {
    const results: { [factor: string]: { variances: number[], count: number } } = {};
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = startOfDay(new Date());
    const startDate = subDays(now, 29); // Last 30 days including today
    const dateInterval = { start: startDate, end: now };

    // Helper to add variance to a factor
    const addVariance = (factorKey: string, variance: number) => {
        if (!results[factorKey]) {
            results[factorKey] = { variances: [], count: 0 };
        }
        results[factorKey].variances.push(variance);
        results[factorKey].count++;
    };

    // 1. Iterate over the last 30 days
    eachDayOfInterval(dateInterval).forEach(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const revenue = allRevenueMap.get(dateStr);
        const weather = allWeatherDataMap.get(dateStr);

        if (revenue && weather && typeof revenue.amount === 'number' && revenue.baseline > 0) {
            const variance = ((revenue.amount - revenue.baseline) / revenue.baseline) * 100;
            const dayIndex = getDay(date);

            // Add variance for Day of Week
            addVariance(`Day: ${daysOfWeek[dayIndex]}`, variance);

            // Add variance for Weather Category
            let weatherCategory = 'Other';
            if (weather.precipitation > 1) {
                weatherCategory = 'Rainy';
            } else if (weather.icon.includes('sun')) {
                weatherCategory = 'Sunny/Clear';
            } else if (weather.icon.includes('cloud')) {
                weatherCategory = 'Cloudy/Overcast';
            }
            addVariance(`Weather: ${weatherCategory}`, variance);

            // Add variance for Promotion Presence
            const activePromos = promos.filter(promo => 
                isWithinInterval(date, { start: parseISO(promo.startDate), end: parseISO(promo.endDate) })
            );
            addVariance(activePromos.length > 0 ? 'Promo: Active' : 'Promo: None', variance);
            
            // Optional: Add variance per specific promo type if active
            /*
            activePromos.forEach(promo => {
                 addVariance(`Promo Type: ${promo.type}`, variance);
            });
            */
        }
    });

    // 2. Calculate Average Variance for each factor
    const factorImpacts: FactorImpact[] = Object.entries(results).map(([factorName, data]) => {
        const averageVariance = data.variances.reduce((sum, v) => sum + v, 0) / data.count;
        return { factorName, averageVariance };
    });

    // 3. Sort and get top/bottom factors
    factorImpacts.sort((a, b) => b.averageVariance - a.averageVariance); // Descending sort

    const topPositiveFactors = factorImpacts.filter(f => f.averageVariance > 0).slice(0, 3); // Top 3 positive
    const topNegativeFactors = factorImpacts.filter(f => f.averageVariance < 0).reverse().slice(0, 3); // Top 3 negative

    return { topPositiveFactors, topNegativeFactors };

  }, [allRevenueMap, allWeatherDataMap, promos]); // Dependencies

  // Calculate top performing promos
  const topPromos = useMemo(() => {
    return [...promos]
      .filter(p => p.actualRevenue !== undefined)
      .map(p => ({
        ...p,
        roi: (p.actualRevenue! - p.cost) / p.cost * 100
      }))
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 5);
  }, [promos]);
  
  // --- getWeatherIcon --- 
  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'cloud': return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'cloud-rain': return <CloudRain className="w-5 h-5 text-primary-500" />;
      case 'sun': return <Sun className="w-5 h-5 text-accent-500" />;
      default: return <Sun className="w-5 h-5 text-accent-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500">Analyze your business performance</p>
      </div>

      {/* Time Range Selector - Add Year button */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">Time Range:</span>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {/* Week Button */}
            <button
              type="button"
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === 'week'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300 rounded-l-md focus:z-10 focus:ring-2 focus:ring-primary-500`}
            >
              Week
            </button>
            {/* Month Button - remove rounded-r */}
            <button
              type="button"
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === 'month'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300 focus:z-10 focus:ring-2 focus:ring-primary-500`}
            >
              Month
            </button>
            {/* Year Button */}
            <button
              type="button"
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === 'year'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300 rounded-r-md focus:z-10 focus:ring-2 focus:ring-primary-500`}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* --- CONDITIONAL CHART RENDERING --- */}
      
      {/* WEEK VIEW */}
      {timeRange === 'week' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Weekly Revenue Comparison
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                This week vs. last week by day
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <WeeklyComparisonChart data={weeklyComparisonData} />
            </div>
          </div>
      )}

      {/* MONTH VIEW */}
      {timeRange === 'month' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Monthly Revenue Comparison
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Daily revenue this month vs. same day last year
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <MonthlyComparisonChart data={monthlyComparisonData} />
            </div>
            {/* Add Monthly Summary Total */}
            {monthlyComparisonData && (
                <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">This Month Total (MTD)</dt>
                            <dd className="mt-1 text-xl font-semibold text-gray-900">{formatNZD(monthlyComparisonData.currentMonthTotal)}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Prior Year Month Total</dt>
                            <dd className="mt-1 text-xl font-semibold text-gray-900">{formatNZD(monthlyComparisonData.priorYearMonthTotal)}</dd>
                        </div>
                    </dl>
                </div>
            )}
          </div>
      )}
      
      {/* YEAR VIEW */}
       {timeRange === 'year' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Yearly Revenue Comparison
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Trailing 12 Months vs. Prior Year Month
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <YearlyComparisonChart data={yearlyComparisonData} />
            </div>
          </div>
      )}

      {/* Top Performing Promotions */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Top Performing Promotions
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Ranked by ROI (Return on Investment)
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promotion
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROI
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topPromos.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{promo.name}</div>
                    <div className="text-xs text-gray-500">{promo.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(parseISO(promo.startDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${promo.cost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${promo.actualRevenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {promo.roi > 0 ? (
                        <TrendingUp className="h-5 w-5 text-success-500 mr-1.5" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-error-500 mr-1.5" />
                      )}
                      <span className={`${promo.roi > 0 ? 'text-success-700' : 'text-error-700'} font-medium`}>
                        {promo.roi.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Factor Analysis Display */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Key Factor Analysis (Last 30 Days)</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Factors influencing revenue variance from baseline</p>
        </div>
        <div className="p-6">
           <FactorAnalysisDisplay results={factorAnalysis} />
        </div>
      </div>
    </div>
  );
}