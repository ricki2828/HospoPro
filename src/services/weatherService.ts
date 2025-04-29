import { format, fromUnixTime } from 'date-fns';
import { WeatherData } from '../types';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const LAT = -43.5321; // Christchurch Latitude
const LON = 172.6362; // Christchurch Longitude
const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

// Map OpenWeather icon codes to simple strings (or potentially Lucide icon names)
const mapIcon = (iconCode: string): string => {
  const mapping: Record<string, string> = {
    '01d': 'sun', '01n': 'moon', // clear sky
    '02d': 'cloud-sun', '02n': 'cloud-moon', // few clouds
    '03d': 'cloud', '03n': 'cloud', // scattered clouds
    '04d': 'cloud', '04n': 'cloud', // broken clouds
    '09d': 'cloud-drizzle', '09n': 'cloud-drizzle', // shower rain
    '10d': 'cloud-rain', '10n': 'cloud-rain', // rain
    '11d': 'cloud-lightning', '11n': 'cloud-lightning', // thunderstorm
    '13d': 'snowflake', '13n': 'snowflake', // snow
    '50d': 'cloud-fog', '50n': 'cloud-fog', // mist
  };
  return mapping[iconCode] || 'cloud'; // Default to cloud if unknown
};

export const fetchWeatherData = async (): Promise<WeatherData[]> => {
  if (!API_KEY) {
    console.error('OpenWeather API key is missing. Add VITE_OPENWEATHER_API_KEY to your .env file.');
    // Return empty array or throw error, depending on desired handling
    return []; 
  }

  const url = `${BASE_URL}?lat=${LAT}&lon=${LON}&exclude=minutely,hourly,current,alerts&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    const data = await response.json();

    if (!data.daily) {
      throw new Error('Weather data response does not contain daily forecast.');
    }

    // Transform the daily data (usually 8 days including today)
    // Let's take 7 days starting from today to match the previous mock structure
    const transformedData = data.daily.slice(0, 7).map((day: any): WeatherData => ({
      date: format(fromUnixTime(day.dt), 'yyyy-MM-dd'),
      description: day.weather[0]?.description || 'N/A',
      icon: mapIcon(day.weather[0]?.icon || ''),
      temperature: Math.round(day.temp?.day ?? 0), // Use average day temperature
      precipitation: day.rain ?? day.snow ?? 0, // Use rain or snow volume if available
    }));

    return transformedData;

  } catch (error) {
    console.error("Error fetching or processing weather data:", error);
    return []; // Return empty array on error
  }
}; 