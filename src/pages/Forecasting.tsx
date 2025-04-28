import { useState } from 'react';
import { Calendar, Cloud, Users, TrendingUp, RefreshCw } from 'lucide-react';
import { forecastData, weatherData, bookings, promos } from '../services/mockData';
import { format, parseISO, addDays } from 'date-fns';
import ForecastCard from '../components/ForecastCard';

export default function Forecasting() {
  const [refreshingForecast, setRefreshingForecast] = useState(false);

  const refreshForecast = () => {
    setRefreshingForecast(true);
    setTimeout(() => {
      setRefreshingForecast(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Forecasting</h1>
          <p className="text-sm text-gray-500">7-day revenue predictions based on multiple factors</p>
        </div>
        <button
          type="button"
          onClick={refreshForecast}
          disabled={refreshingForecast}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {refreshingForecast ? (
            <>
              <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-500" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Refresh Forecast
            </>
          )}
        </button>
      </div>

      {/* Forecast Methodology */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Forecast Methodology
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            How we calculate your revenue predictions
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Day of Week</h4>
                <p className="mt-2 text-sm text-gray-500">
                  We analyze historical patterns based on the day of the week to establish baseline expectations.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-100 text-secondary-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Bookings</h4>
                <p className="mt-2 text-sm text-gray-500">
                  Future bookings are factored in with historical conversion rates and no-show risk analysis.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent-100 text-accent-600">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Promotions</h4>
                <p className="mt-2 text-sm text-gray-500">
                  Active promotions are evaluated based on past performance of similar promos.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-error-100 text-error-600">
                  <Cloud className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Weather</h4>
                <p className="mt-2 text-sm text-gray-500">
                  Forecasted weather conditions are compared to historical revenue data during similar weather.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">7-Day Revenue Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {forecastData.map((forecast) => (
            <ForecastCard key={forecast.date} forecast={forecast} />
          ))}
        </div>
      </div>

      {/* Factors Detail */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Forecast Factors Detail
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Detailed breakdown of factors affecting each day's forecast
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
                  Bookings
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promotions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Forecast
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forecastData.map((forecast, index) => {
                const day = forecast.date;
                const dayWeather = weatherData.find(w => w.date === day);
                const dayBookings = bookings.filter(b => b.date === day);
                const dayPromos = promos.filter(p => p.startDate === day || p.endDate === day);
                
                return (
                  <tr key={day} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {format(parseISO(day), 'EEEE')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(parseISO(day), 'MMM d')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {dayWeather ? dayWeather.description : 'Unknown'}
                      </div>
                      <div className={`text-xs ${forecast.factors.weather > 0 ? 'text-success-600' : forecast.factors.weather < 0 ? 'text-error-600' : 'text-gray-500'}`}>
                        {forecast.factors.weather > 0 ? '+' : ''}
                        {forecast.factors.weather}% impact
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {dayBookings.length} bookings
                      </div>
                      <div className="text-xs text-gray-500">
                        {dayBookings.reduce((sum, b) => sum + b.partySize, 0)} people
                      </div>
                      <div className={`text-xs ${forecast.factors.bookings > 0 ? 'text-success-600' : forecast.factors.bookings < 0 ? 'text-error-600' : 'text-gray-500'}`}>
                        {forecast.factors.bookings > 0 ? '+' : ''}
                        {forecast.factors.bookings}% impact
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {dayPromos.length > 0 
                          ? dayPromos.map(p => p.name).join(', ') 
                          : 'None'
                        }
                      </div>
                      <div className={`text-xs ${forecast.factors.promos > 0 ? 'text-success-600' : forecast.factors.promos < 0 ? 'text-error-600' : 'text-gray-500'}`}>
                        {forecast.factors.promos > 0 ? '+' : ''}
                        {forecast.factors.promos}% impact
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${forecast.expectedRevenue}
                      </div>
                      <div className="text-xs text-gray-500">
                        Range: ${forecast.minRevenue} - ${forecast.maxRevenue}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        {forecast.confidence}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Optimization Recommendations
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Suggestions to improve your forecasted revenue
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div className="bg-accent-50 border-l-4 border-accent-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Calendar className="h-5 w-5 text-accent-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-accent-800">Consider a Wednesday Promotion</h3>
                  <div className="mt-2 text-sm text-accent-700">
                    <p>
                      Wednesday forecasts are consistently below average compared to other weekdays.
                      Adding a "Wine Wednesday" special could increase revenue by an estimated 25%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary-50 border-l-4 border-secondary-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Cloud className="h-5 w-5 text-secondary-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-secondary-800">Weather-Triggered Promotion</h3>
                  <div className="mt-2 text-sm text-secondary-700">
                    <p>
                      Heavy rain is forecasted for {format(addDays(new Date(), 4), 'EEEE')}, which typically reduces revenue by 15%. 
                      Consider running a "Rainy Day Special" to offset the expected decrease.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary-50 border-l-4 border-primary-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Users className="h-5 w-5 text-primary-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-primary-800">Follow Up on Large Booking</h3>
                  <div className="mt-2 text-sm text-primary-700">
                    <p>
                      The 10-person booking for {format(addDays(new Date(), 2), 'EEEE')} has a high no-show risk. 
                      We recommend confirming this booking to secure the expected revenue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}