import { useState } from 'react';
import { 
  DollarSign, CalendarDays, Users, TrendingUp,
  Clock, Calendar, Droplets
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import RevenueChart from '../components/RevenueChart';
import WeatherForecast from '../components/WeatherForecast';
import UpcomingPromotions from '../components/UpcomingPromotions';
import BookingsList from '../components/BookingsList';
import ForecastCard from '../components/ForecastCard';
import { 
  revenueData, 
  weatherData, 
  promos, 
  bookings,
  forecastData
} from '../services/mockData';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  const todayTotal = revenueData.find(d => d.date === new Date().toISOString().split('T')[0])?.amount || 0;
  const yesterdayTotal = revenueData.find(d => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return d.date === yesterday.toISOString().split('T')[0];
  })?.amount || 0;
  
  const percentChange = yesterdayTotal ? Math.round((todayTotal - yesterdayTotal) / yesterdayTotal * 100) : 0;
  
  // Calculate total bookings for today
  const todayBookings = bookings.filter(b => 
    b.date === new Date().toISOString().split('T')[0]
  ).reduce((sum, b) => sum + b.partySize, 0);

  // Get upcoming forecast
  const upcomingForecasts = forecastData.slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Revenue overview and forecast</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Today's Revenue" 
          value={`$${todayTotal}`} 
          icon={<DollarSign className="h-5 w-5" />}
          change={{ value: percentChange, type: percentChange >= 0 ? 'increase' : 'decrease' }}
        />
        <DashboardCard 
          title="Weekly Forecast" 
          value={`$${forecastData.slice(0, 7).reduce((sum, d) => sum + d.expectedRevenue, 0)}`} 
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <DashboardCard 
          title="Today's Bookings" 
          value={todayBookings || 0}
          icon={<Users className="h-5 w-5" />}
        />
        <DashboardCard 
          title="Active Promotions" 
          value={promos.filter(p => new Date(p.startDate) <= new Date() && new Date(p.endDate) >= new Date()).length} 
          icon={<CalendarDays className="h-5 w-5" />}
        />
      </div>

      {/* Revenue Chart Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Revenue Overview</h2>
            <p className="mt-1 text-sm text-gray-500">
              Compare actual revenue against baseline and forecast
            </p>
          </div>
          <div className="mt-3 sm:mt-0">
            <div className="flex rounded-md shadow-sm overflow-hidden" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border ${
                  timeRange === 'week'
                    ? 'bg-primary-50 text-primary-700 border-primary-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setTimeRange('week')}
              >
                Week
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border border-l-0 ${
                  timeRange === 'month'
                    ? 'bg-primary-50 text-primary-700 border-primary-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setTimeRange('month')}
              >
                Month
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <RevenueChart revenueData={revenueData} />
        </div>
      </div>

      {/* Weather and Promo Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Weather Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">7-Day Weather</h2>
              <Droplets className="h-5 w-5 text-gray-400" />
            </div>
            <div className="p-4">
              <WeatherForecast weatherData={weatherData} />
            </div>
          </div>

          {/* Upcoming Promotions */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Upcoming Promotions</h2>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="p-4">
              <UpcomingPromotions promotions={promos} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Bookings Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Upcoming Bookings</h2>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <BookingsList bookings={bookings} />
          </div>

          {/* Forecast Cards */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Revenue Forecast</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingForecasts.map((forecast) => (
                <ForecastCard key={forecast.date} forecast={forecast} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}