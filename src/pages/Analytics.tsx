import { useState, useMemo } from 'react';
// Import necessary data, ensuring no duplicates
import { promos, dayOfWeekTrends, weatherData, allRevenueMap } from '../services/mockData';
import DayOfWeekChart from '../components/DayOfWeekChart';
import { format, parseISO, subDays, isWithinInterval, startOfDay, subYears } from 'date-fns';
import { TrendingUp, TrendingDown, Cloud, CloudRain, Sun } from 'lucide-react';

// Helper to format currency (or import from a shared util)
const formatNZD = (value?: number | null): string => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('month');
  
  // Calculate Weather Impact based on timeRange
  const weatherImpact = useMemo(() => {
    const impactData = [];
    const now = startOfDay(new Date());
    const daysToShow = timeRange === 'week' ? 7 : 30;
    const startDate = subDays(now, daysToShow - 1); // Start of the period

    // Use weatherData as the loop base as it's likely shorter than 3+ years of revenue
    for (const weatherDay of weatherData) {
      const weatherDate = parseISO(weatherDay.date);
      
      // Check if the weather data date falls within the selected display time range (Week/Month)
      if (isWithinInterval(weatherDate, { start: startDate, end: now })) {
          const currentRevenue = allRevenueMap.get(weatherDay.date);
          
          // Ensure current revenue data exists for baseline comparison
          if (currentRevenue && typeof currentRevenue.amount === 'number' && currentRevenue.amount > 0 && currentRevenue.baseline > 0) {
            const difference = ((currentRevenue.amount - currentRevenue.baseline) / currentRevenue.baseline) * 100;
            
            let lastYearRevenue: number | null = null;
            let threeYearAvgRevenue: number | null = null;

            // Calculate historicals only for month view
            if (timeRange === 'month') {
                const dateYearMinus1 = format(subYears(weatherDate, 1), 'yyyy-MM-dd');
                const dateYearMinus2 = format(subYears(weatherDate, 2), 'yyyy-MM-dd');
                const dateYearMinus3 = format(subYears(weatherDate, 3), 'yyyy-MM-dd');

                const revY1 = allRevenueMap.get(dateYearMinus1)?.amount;
                const revY2 = allRevenueMap.get(dateYearMinus2)?.amount;
                const revY3 = allRevenueMap.get(dateYearMinus3)?.amount;

                lastYearRevenue = revY1 ?? null;

                const pastRevenues = [revY1, revY2, revY3].filter(r => typeof r === 'number') as number[];
                if (pastRevenues.length > 0) {
                    threeYearAvgRevenue = pastRevenues.reduce((sum, r) => sum + r, 0) / pastRevenues.length;
                }
            }

            impactData.push({
              date: weatherDay.date,
              weather: weatherDay.description,
              icon: weatherDay.icon,
              temperature: weatherDay.temperature,
              precipitation: Math.round(weatherDay.precipitation),
              revenue: currentRevenue.amount,
              baseline: currentRevenue.baseline,
              difference: difference,
              lastYearRevenue: lastYearRevenue, // Add historical data
              threeYearAvgRevenue: threeYearAvgRevenue // Add historical data
            });
          }
      }
    }
    // Sort by date descending for display
    return impactData.sort((a, b) => b.date.localeCompare(a.date));
  }, [timeRange]); // Dependency only on timeRange (allRevenueMap is stable)

  // Calculate top performing promos
  const topPromos = [...promos]
    .filter(p => p.actualRevenue !== undefined)
    .map(p => ({
      ...p,
      roi: (p.actualRevenue! - p.cost) / p.cost * 100
    }))
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 5);
  
  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'cloud':
        return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'cloud-rain':
        return <CloudRain className="w-5 h-5 text-primary-500" />;
      case 'sun':
        return <Sun className="w-5 h-5 text-accent-500" />;
      default:
        return <Sun className="w-5 h-5 text-accent-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500">Analyze your business performance</p>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">Time Range:</span>
          <div className="inline-flex rounded-md shadow-sm" role="group">
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
            <button
              type="button"
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === 'month'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-300 rounded-r-md focus:z-10 focus:ring-2 focus:ring-primary-500`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Day of Week Analysis */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Day of Week Analysis
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Compare revenue trends by day of week
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <DayOfWeekChart trends={dayOfWeekTrends} />
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
          <div className="text-sm">
            <span className="font-medium text-gray-900">Summary: </span>
            <span className="text-gray-500">
              Saturday has the highest average revenue ($6,000), while Monday has the lowest ($2,800).
              Friday to Sunday account for 68% of weekly revenue.
            </span>
          </div>
        </div>
      </div>

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

      {/* Weather Impact */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Weather Impact on Revenue ({timeRange === 'week' ? 'Last 7 Days' : 'Last 30 Days'})
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            How weather conditions affect your daily revenue
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weather</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rain</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">vs Base</th>
                {/* Conditional Columns */} 
                {timeRange === 'month' && (
                    <>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Last Yr</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">3yr Avg</th>
                    </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {weatherImpact.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{format(parseISO(day.date), 'EEE, MMM d')}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center" title={day.weather}>
                      {getWeatherIcon(day.icon)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{day.temperature}°C</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{day.precipitation} mm</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">{formatNZD(day.revenue)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className={`flex items-center justify-end ${day.difference > 0 ? 'text-success-600' : 'text-error-600'}`}>
                      {day.difference > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      <span className="text-sm font-medium">{day.difference > 0 ? '+' : ''}{day.difference.toFixed(0)}%</span>
                    </div>
                  </td>
                  {/* Conditional Cells */} 
                  {timeRange === 'month' && (
                      <>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{formatNZD(day.lastYearRevenue)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{formatNZD(day.threeYearAvgRevenue)}</td>
                      </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {weatherImpact.length === 0 && (
            <p className="text-center text-gray-500 py-4 text-sm">No weather impact data available for the selected period.</p>
          )}
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
          <div className="text-sm">
            <span className="font-medium text-gray-900">Key Insight: </span>
            <span className="text-gray-500">
              Clear, sunny days show an average 15% increase in revenue, while rainy days see a 12% decrease.
              Consider running weather-triggered promotions on rainy days to boost sales.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}