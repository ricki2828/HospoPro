import { Cloud, CloudRain, Sun, CloudSun } from 'lucide-react';
import { WeatherData } from '../types';
import { format, parseISO } from 'date-fns';

interface WeatherForecastProps {
  weatherData: WeatherData[];
  viewMode: 'week' | 'month';
}

export default function WeatherForecast({ weatherData, viewMode }: WeatherForecastProps) {
  const displayData = viewMode === 'week' ? weatherData.slice(0, 7) : weatherData;

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'cloud':
        return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'cloud-rain':
        return <CloudRain className="w-6 h-6 text-primary-500" />;
      case 'sun':
        return <Sun className="w-6 h-6 text-accent-500" />;
      case 'cloud-sun':
        return <CloudSun className="w-6 h-6 text-accent-400" />;
      default:
        return <Sun className="w-6 h-6 text-accent-500" />;
    }
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {displayData.map((day) => (
        <div
          key={day.date}
          className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm transition hover:shadow-md"
        >
          <p className="text-xs font-medium text-gray-500">
            {format(parseISO(day.date), 'EEE')}
          </p>
          <div className="my-2">{getWeatherIcon(day.icon)}</div>
          <p className="text-sm font-semibold">{day.temperature}°C</p>
          {day.precipitation > 0 && (
            <p className="text-xs text-primary-600">{Math.round(day.precipitation)} mm</p>
          )}
        </div>
      ))}
    </div>
  );
}