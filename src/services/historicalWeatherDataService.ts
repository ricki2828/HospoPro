import { format, subDays, eachDayOfInterval } from 'date-fns';
import { WeatherData } from '../types'; // Adjust path if needed

// Christchurch approx coordinates used for basic seasonality
const LATITUDE = -43.5;

// Simplified icon mapping based on precipitation and temperature
const determineIcon = (temp: number, precip: number): string => {
  if (precip > 5) return 'cloud-rain';
  if (precip > 1) return 'cloud-drizzle';
  if (temp < 5) return 'snowflake'; // Less likely in Chch but possible
  if (temp < 15) return 'cloud'; // Cooler days often cloudy
  // Add more variation based on random chance for sunny/partly cloudy
  const rand = Math.random();
  if (rand < 0.6) return 'sun';
  if (rand < 0.85) return 'cloud-sun';
  return 'cloud';
};

// Generates mock historical weather data for a number of years back from today
export const generateHistoricalWeatherData = (years: number): WeatherData[] => {
  const endDate = subDays(new Date(), 1); // End yesterday
  const startDate = subDays(endDate, 365 * years -1); // Start approx 'years' years ago
  const interval = { start: startDate, end: endDate };
  const historicalData: WeatherData[] = [];

  eachDayOfInterval(interval).forEach(date => {
    const dayOfYear = parseInt(format(date, 'DDD')); // Use DDD for Day of Year (1-366)
    const year = date.getFullYear();

    // Simulate Temperature (simple sinusoidal based on day of year)
    // Max temp around day 30 (late Jan), Min around day 210 (late July) for Southern Hemisphere
    const tempAmplitude = 8; // Variation around the average
    const averageAnnualTemp = 12; // Approx Christchurch average C
    const tempOffset = 210; // Day of year for minimum temperature
    const radians = ((dayOfYear - tempOffset + 365) % 365) * (2 * Math.PI / 365);
    // Cosine wave peaks at 0/2pi, so offset puts min temp correctly
    let temperature = averageAnnualTemp - tempAmplitude * Math.cos(radians);
    // Add some daily random variation
    temperature += (Math.random() - 0.5) * 4; 
    temperature = Math.round(temperature);

    // Simulate Precipitation (higher chance in winter/spring)
    let precipitation = 0;
    const precipChanceBase = 0.1; // Base daily chance
    // Increase chance around mid-year (winter/spring)
    const precipSeasonality = Math.sin(((dayOfYear - 90 + 365) % 365) * (Math.PI / 365)); // Peaks around day 90 (Spring start)
    const precipChance = precipChanceBase + Math.max(0, precipSeasonality * 0.2); // Increase chance up to 0.3

    if (Math.random() < precipChance) {
      precipitation = Math.random() * 10; // Random amount up to 10mm
      // Occasional heavier rain
      if (Math.random() < 0.1) {
        precipitation *= 3;
      }
      precipitation = Math.round(precipitation * 10) / 10; // Round to 1 decimal place
    }

    const icon = determineIcon(temperature, precipitation);

    historicalData.push({
      date: format(date, 'yyyy-MM-dd'),
      description: `Mock ${icon}`, // Simple description
      icon: icon,
      temperature: temperature,
      precipitation: precipitation,
    });
  });

  // Ensure data is sorted by date ascending
  return historicalData.sort((a, b) => a.date.localeCompare(b.date));
}; 