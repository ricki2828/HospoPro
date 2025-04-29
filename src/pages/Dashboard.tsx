import { useState, useEffect, useMemo } from 'react';
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
import RosterSummaryCard from '../components/RosterSummaryCard';
import UpcomingChecksCard from '../components/UpcomingChecksCard';
import { 
  revenueData, 
  promos, 
  bookings,
  forecastData,
  mockShifts,
  lastYearRevenueData
} from '../services/mockData';
import { fetchWeatherData } from '../services/weatherService';
import { format, parseISO, subYears, subWeeks, getDay, startOfDay, endOfDay, isWithinInterval as dateFnsIsWithinInterval } from 'date-fns';
import { RevenueChartDataPoint, WeatherData, Revenue, Promo, ComparisonData, ComparisonDayData } from '../types';
import DateComparisonModal from '../components/DateComparisonModal';

// Import the generated historical data
import historicalWeatherData from '../data/historicalWeatherData.json';

// Helper function for NZD formatting
const formatNZD = (value: number) => {
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [liveWeatherData, setLiveWeatherData] = useState<WeatherData[]>([]);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [comparisonDate, setComparisonDate] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Combine live and historical weather data --- 
  const allWeatherDataMap = useMemo(() => {
    const map = new Map<string, WeatherData>();
    // Load historical data first
    (historicalWeatherData as WeatherData[]).forEach(day => {
      map.set(day.date, day);
    });
    // Add/overwrite with live data (more recent)
    liveWeatherData.forEach(day => {
      map.set(day.date, day);
    });
    return map;
  }, [liveWeatherData]); // Recalculate when live data updates

  // --- Fetch live weather data on mount --- 
  useEffect(() => {
    const loadWeatherData = async () => {
      setIsLoadingWeather(true);
      const data = await fetchWeatherData();
      setLiveWeatherData(data); // This will trigger re-calculation of allWeatherDataMap
      setIsLoadingWeather(false);
    };
    loadWeatherData();
  }, []);

  // Create a weather icon lookup map (using the combined map)
  const weatherIconMap = useMemo(() => {
      const iconMap = new Map<string, string>();
      allWeatherDataMap.forEach((data, date) => {
          iconMap.set(date, data.icon);
      });
      return iconMap;
  }, [allWeatherDataMap]);

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

  // Calculate weekly forecast total for card
  const weeklyForecastTotal = forecastData.slice(0, 7).reduce((sum, d) => sum + d.expectedRevenue, 0);

  // --- Calculate staff count per day ---
  const staffCountPerDay = mockShifts.reduce((acc, shift) => {
    const date = shift.date; // Already in yyyy-MM-dd format
    if (!acc[date]) {
      acc[date] = new Set<string>();
    }
    acc[date].add(shift.staffId);
    return acc;
  }, {} as Record<string, Set<string>>);

  // --- Create a lookup map for last year's data by date string ---
  const lastYearDataMap = new Map<string, Revenue>();
  lastYearRevenueData.forEach(data => {
    lastYearDataMap.set(data.date, data);
  });
  
  // --- Combine revenue data (now also use combined weather map for icons) ---
  // Let's also create a map for faster lookups later
  const combinedRevenueDataMap = useMemo(() => {
      const map = new Map<string, RevenueChartDataPoint>();
      revenueData.forEach(rev => {
          const dateOneYearAgo = format(subYears(parseISO(rev.date), 1), 'yyyy-MM-dd');
          const lastYearData = lastYearDataMap.get(dateOneYearAgo);
          const point: RevenueChartDataPoint = {
              ...rev,
              date: rev.date,
              staffCount: staffCountPerDay[rev.date]?.size || 0,
              lastYearAmount: lastYearData?.amount,
              weatherIcon: weatherIconMap.get(rev.date), // Get from our combined weather map derived icon map
          };
          map.set(rev.date, point);
      });
       // Add forecast-only entries too if they exist beyond revenueData dates
      forecastData.forEach(fcast => {
        if (!map.has(fcast.date)) {
          const dateOneYearAgo = format(subYears(parseISO(fcast.date), 1), 'yyyy-MM-dd');
          const lastYearData = lastYearDataMap.get(dateOneYearAgo);
          const point: RevenueChartDataPoint = {
            date: fcast.date,
            forecast: fcast.expectedRevenue,
            baseline: 0, // Assume 0 if no direct revenue entry
            staffCount: staffCountPerDay[fcast.date]?.size || 0,
            lastYearAmount: lastYearData?.amount,
            weatherIcon: weatherIconMap.get(fcast.date),
          };
          map.set(fcast.date, point);
        }
      });
      return map;
  }, [revenueData, forecastData, lastYearDataMap, staffCountPerDay, weatherIconMap]);

  const combinedRevenueDataArray = useMemo(() => 
      Array.from(combinedRevenueDataMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
      [combinedRevenueDataMap]
  );

  // Get upcoming forecast based on viewMode
  const upcomingForecasts = viewMode === 'week' 
    ? forecastData.slice(0, 4) // Show 4 days for week view
    : forecastData.slice(0, 14); // Show 14 days for month view

  // --- Helper to find active promos for a date --- 
  const getPromosForDate = (date: Date): Promo[] => {
    const start = startOfDay(date);
    const end = endOfDay(date);
    return promos.filter(promo => {
        const promoStart = parseISO(promo.startDate);
        const promoEnd = parseISO(promo.endDate);
        // Check if the promo's interval overlaps with the target date
        return dateFnsIsWithinInterval(start, { start: promoStart, end: promoEnd }) || 
               dateFnsIsWithinInterval(end, { start: promoStart, end: promoEnd }) ||
               (promoStart <= start && promoEnd >= end);
    });
  };

  // --- Function to get data for a specific day --- 
  const getDayData = (dateStr: string): ComparisonDayData => {
      const revenuePoint = combinedRevenueDataMap.get(dateStr);
      const weatherPoint = allWeatherDataMap.get(dateStr);
      const dateObj = parseISO(dateStr);
      const activePromos = getPromosForDate(dateObj);

      return {
          date: dateStr,
          revenue: revenuePoint?.amount,
          weather: weatherPoint,
          promos: activePromos,
      };
  };

  // --- Click Handler for Chart --- 
  const handleDateClick = (date: string) => {
    console.log("Date clicked:", date);
    const selectedDate = parseISO(date);

    // Calculate comparison dates (same day of week, previous 4 weeks)
    const comparisonDatesStr: string[] = [];
    for (let i = 1; i <= 4; i++) {
      comparisonDatesStr.push(format(subWeeks(selectedDate, i), 'yyyy-MM-dd'));
    }

    // Get data for selected day and comparison days
    const selectedDayData = getDayData(date);
    const previousWeeksData = comparisonDatesStr.map(compDate => getDayData(compDate));

    setComparisonData({
      selectedDay: selectedDayData,
      previousWeeks: previousWeeksData,
    });
    setComparisonDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setComparisonDate(null);
      setComparisonData(null);
  }

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Botanic Dashboard</h1>
        <p className="text-sm text-gray-500">Revenue overview and forecast for Botanic</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Today's Revenue" 
          value={formatNZD(todayTotal)}
          icon={<DollarSign className="h-5 w-5" />}
          change={{ value: percentChange, type: percentChange >= 0 ? 'increase' : 'decrease' }}
        />
        <DashboardCard 
          title="Weekly Forecast" 
          value={formatNZD(weeklyForecastTotal)}
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

      {/* Revenue Chart Section - Pass handleDateClick */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
         {/* ... chart header, buttons ... */}
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
                  viewMode === 'week'
                    ? 'bg-primary-50 text-primary-700 border-primary-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setViewMode('week')}
              >
                Week
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border border-l-0 ${
                  viewMode === 'month'
                    ? 'bg-primary-50 text-primary-700 border-primary-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setViewMode('month')}
              >
                Month
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <RevenueChart data={combinedRevenueDataArray} viewMode={viewMode} onDateClick={handleDateClick} />
        </div>
      </div>

      {/* Weather and Promo Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Weather Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden min-h-[200px]">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                {viewMode === 'week' ? '7-Day Weather' : 'Monthly Weather'}
              </h2>
              <Droplets className="h-5 w-5 text-gray-400" />
            </div>
            <div className="p-4">
              {isLoadingWeather ? (
                <p className="text-gray-500 text-sm">Loading weather...</p>
              ) : liveWeatherData.length > 0 ? (
                <WeatherForecast weatherData={liveWeatherData} viewMode={viewMode} />
              ) : (
                <p className="text-gray-500 text-sm">Could not load weather data.</p>
              )}
            </div>
          </div>

          {/* Upcoming Promotions */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Upcoming Promotions</h2>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="p-4">
              <UpcomingPromotions promotions={promos} viewMode={viewMode} />
            </div>
          </div>

          {/* Roster Summary */}
          <RosterSummaryCard />

          {/* Upcoming Food Safety Checks */}
          <UpcomingChecksCard />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Bookings Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Upcoming Bookings</h2>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <BookingsList bookings={bookings} viewMode={viewMode} />
          </div>

          {/* Forecast Cards */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-3">
              Revenue Forecast ({viewMode === 'week' ? 'Next 4 Days' : 'Next 14 Days'})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingForecasts.map((forecast) => (
                <ForecastCard key={forecast.date} forecast={forecast} viewMode={viewMode} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Render the Modal */}
      <DateComparisonModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          data={comparisonData} 
      />

    </div>
  );
}