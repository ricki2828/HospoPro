import { useState } from 'react';
import { promos, dayOfWeekTrends, revenueData, weatherData } from '../services/mockData';
import DayOfWeekChart from '../components/DayOfWeekChart';
import { format, parseISO, subDays } from 'date-fns';
import { TrendingUp, TrendingDown, Cloud, CloudRain, Sun } from 'lucide-react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  
  // Calculate top performing promos
  const topPromos = [...promos]
    .filter(p => p.actualRevenue !== undefined)
    .map(p => ({
      ...p,
      roi: (p.actualRevenue! - p.cost) / p.cost * 100
    }))
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 5);
  
  // Weather impact
  const weatherImpact = [];
  for (let i = 0; i < Math.min(weatherData.length, revenueData.length); i++) {
    const weatherDay = weatherData[i];
    const revenueDay = revenueData.find(r => r.date === weatherDay.date);
    
    if (revenueDay && revenueDay.amount > 0) {
      weatherImpact.push({
        date: weatherDay.date,
        weather: weatherDay.description,
        icon: weatherDay.icon,
        temperature: weatherDay.temperature,
        precipitation: weatherDay.precipitation,
        revenue: revenueDay.amount,
        baseline: revenueDay.baseline,
        difference: ((revenueDay.amount - revenueDay.baseline) / revenueDay.baseline) * 100
      });
    }
  }

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
              } border-t border-b border-gray-300 focus:z-10 focus:ring-2 focus:ring-primary-500`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('quarter')}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === 'quarter'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300 rounded-r-md focus:z-10 focus:ring-2 focus:ring-primary-500`}
            >
              Quarter
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
            Weather Impact on Revenue
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            How weather conditions affect your daily revenue
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weather
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temperature
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precipitation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  vs. Baseline
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {weatherImpact.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(parseISO(day.date), 'EEE, MMM d')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getWeatherIcon(day.icon)}
                      <span className="ml-1.5 text-sm text-gray-900">{day.weather}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.temperature}°C
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.precipitation} mm
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${day.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {day.difference > 0 ? (
                        <TrendingUp className="h-5 w-5 text-success-500 mr-1.5" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-error-500 mr-1.5" />
                      )}
                      <span className={`${day.difference > 0 ? 'text-success-700' : 'text-error-700'} font-medium`}>
                        {day.difference > 0 ? '+' : ''}{day.difference.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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