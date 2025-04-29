import { X } from 'lucide-react';
import { ComparisonData, WeatherData, Promo } from '../types';
import { format, parseISO } from 'date-fns';

interface DateComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ComparisonData | null;
}

// Helper to format currency
const formatNZD = (value?: number): string => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

// Helper to display weather info
const WeatherInfo: React.FC<{ weather?: WeatherData }> = ({ weather }) => {
  if (!weather) return <span className="text-gray-400">N/A</span>;
  // Basic emoji mapping (could reuse from RevenueChart or enhance)
  const emojiMap: Record<string, string> = { 'sun': '☀️', 'cloud': '☁️', 'cloud-rain': '🌧️', 'cloud-sun': '⛅️', 'cloud-drizzle': '🌦️' /* add others */ };
  return (
    <span title={`${weather.description}, ${Math.round(weather.precipitation)}mm`}>
      {emojiMap[weather.icon] || '❔'} {weather.temperature}°C
    </span>
  );
};

// Helper to display promos
const PromoInfo: React.FC<{ promos: Promo[] }> = ({ promos }) => {
  if (promos.length === 0) return <span className="text-gray-400">None</span>;
  return (
    <ul className="list-disc list-inside text-xs">
      {promos.map(p => <li key={p.id} title={p.type}>{p.name}</li>)}
    </ul>
  );
};

export default function DateComparisonModal({ isOpen, onClose, data }: DateComparisonModalProps) {
  if (!isOpen || !data) return null;

  const { selectedDay, previousWeeks } = data;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            Comparison for {format(parseISO(selectedDay.date), 'EEEE, MMM d, yyyy')}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                <th className="px-3 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">
                  {format(parseISO(selectedDay.date), 'MMM d')}
                </th>
                {previousWeeks.map((week, index) => (
                  <th key={week.date} className="px-3 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">
                    {format(parseISO(week.date), 'MMM d')} (-{index + 1}wk)
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Revenue Row */}
              <tr>
                <td className="px-3 py-2 font-medium text-gray-900">Revenue</td>
                <td className="px-3 py-2 text-center">{formatNZD(selectedDay.revenue)}</td>
                {previousWeeks.map(week => (
                  <td key={week.date} className="px-3 py-2 text-center">{formatNZD(week.revenue)}</td>
                ))}
              </tr>
              {/* Weather Row */}
              <tr>
                <td className="px-3 py-2 font-medium text-gray-900">Weather</td>
                <td className="px-3 py-2 text-center"><WeatherInfo weather={selectedDay.weather} /></td>
                {previousWeeks.map(week => (
                  <td key={week.date} className="px-3 py-2 text-center"><WeatherInfo weather={week.weather} /></td>
                ))}
              </tr>
              {/* Promotions Row */}
              <tr>
                <td className="px-3 py-2 font-medium text-gray-900">Promotions</td>
                <td className="px-3 py-2"><PromoInfo promos={selectedDay.promos} /></td>
                {previousWeeks.map(week => (
                  <td key={week.date} className="px-3 py-2"><PromoInfo promos={week.promos} /></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal Footer (Optional) */}
        <div className="flex justify-end items-center p-4 border-t">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 