import { format, parseISO } from 'date-fns';
import { Forecast } from '../types';
import { TrendingUp, Users, Calendar, CloudRain } from 'lucide-react';

interface ForecastCardProps {
  forecast: Forecast;
  viewMode: 'week' | 'month';
}

export default function ForecastCard({ forecast, viewMode }: ForecastCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 transition hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">
            {format(parseISO(forecast.date), 'EEEE')}
          </h3>
          <p className="text-xs text-gray-500">
            {format(parseISO(forecast.date), 'MMM d')}
          </p>
        </div>
        <div className="bg-primary-50 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
          {forecast.confidence}% confidence
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between items-baseline">
          <p className="text-sm text-gray-500">Expected</p>
          <p className="text-xl font-semibold">${forecast.expectedRevenue}</p>
        </div>
        <div className="flex justify-between items-baseline mt-1">
          <p className="text-xs text-gray-400">Range</p>
          <p className="text-xs text-gray-500">
            ${forecast.minRevenue} - ${forecast.maxRevenue}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-gray-500 mb-2">Key Factors</p>
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center">
            <CloudRain className="h-4 w-4 text-secondary-500" />
            <span className={`text-xs mt-1 ${forecast.factors.weather < 0 ? 'text-error-500' : 'text-success-500'}`}>
              {forecast.factors.weather > 0 ? '+' : ''}
              {forecast.factors.weather}%
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Users className="h-4 w-4 text-primary-500" />
            <span className={`text-xs mt-1 ${forecast.factors.bookings < 0 ? 'text-error-500' : 'text-success-500'}`}>
              {forecast.factors.bookings > 0 ? '+' : ''}
              {forecast.factors.bookings}%
            </span>
          </div>
          <div className="flex flex-col items-center">
            <TrendingUp className="h-4 w-4 text-accent-500" />
            <span className={`text-xs mt-1 ${forecast.factors.dayOfWeek < 0 ? 'text-error-500' : 'text-success-500'}`}>
              {forecast.factors.dayOfWeek > 0 ? '+' : ''}
              {forecast.factors.dayOfWeek}%
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Calendar className="h-4 w-4 text-error-500" />
            <span className={`text-xs mt-1 ${forecast.factors.promos < 0 ? 'text-error-500' : 'text-success-500'}`}>
              {forecast.factors.promos > 0 ? '+' : ''}
              {forecast.factors.promos}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}