import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
  TooltipItem
} from 'chart.js';
import type { Tick, ActiveElement, ChartEvent } from 'chart.js';
import { Chart, getElementsAtEvent } from 'react-chartjs-2';
import { RevenueChartDataPoint } from '../types';
import { format, parseISO, startOfWeek, endOfMonth, isWithinInterval, subYears } from 'date-fns';
import { useRef } from 'react';
import type { MouseEvent } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RevenueChartProps {
  data: RevenueChartDataPoint[];
  viewMode: 'week' | 'month' | 'year';
  onDateClick: (date: string) => void;
}

// Helper function to get weather emoji
const getWeatherEmoji = (icon?: string): string => {
  if (!icon) return '';
  switch (icon) {
    case 'sun': return '☀️';
    case 'moon': return '🌙'; // Assuming 'moon' might be used for night
    case 'cloud-sun': return '⛅️';
    case 'cloud-moon': return '☁️🌙'; // Placeholder
    case 'cloud': return '☁️';
    case 'cloud-drizzle': return '🌦️';
    case 'cloud-rain': return '🌧️';
    case 'cloud-lightning': return '⛈️';
    case 'snowflake': return '❄️';
    case 'cloud-fog': return '🌫️';
    default: return '';
  }
};

export default function RevenueChart({ data: chartInputData, viewMode, onDateClick }: RevenueChartProps) {
  const chartRef = useRef<ChartJS>(null);

  const filteredData = chartInputData.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  let displayData: RevenueChartDataPoint[];

  if (viewMode === 'week') {
    displayData = filteredData.slice(-7);
  } else if (viewMode === 'month') {
    displayData = filteredData.slice(-30);
  } else {
    displayData = filteredData.slice(-365);
  }

  const chartDataConfig: ChartData<any> = {
    labels: displayData.map(item => item.date),
    datasets: [
      {
        type: 'line' as const,
        label: 'Actual Revenue',
        data: displayData.map((item) => item.amount ?? null),
        borderColor: '#4338CA',
        backgroundColor: '#4338CA',
        pointRadius: viewMode === 'year' ? 1 : 3,
        tension: viewMode === 'year' ? 0.4 : 0.2,
        yAxisID: 'y',
        order: 1,
      },
      {
        type: 'line' as const,
        label: 'Last Year Revenue',
        data: displayData.map((item) => item.lastYearAmount ?? null),
        borderColor: '#9CA3AF',
        borderDash: [4, 4],
        pointRadius: viewMode === 'year' ? 0 : 0,
        tension: viewMode === 'year' ? 0.4 : 0.2,
        yAxisID: 'y',
        order: 2,
      },
      ...(viewMode !== 'year' ? [
        {
          type: 'line' as const,
          label: 'Forecast',
          data: displayData.map((item) => item.forecast ?? null),
          borderColor: '#0D9488',
          backgroundColor: '#0D9488',
          pointRadius: 3,
          pointStyle: 'triangle',
          tension: 0.2,
          borderDash: [5, 5],
          yAxisID: 'y',
          order: 1,
        },
        {
          type: 'line' as const,
          label: 'Baseline',
          data: displayData.map((item) => item.baseline ?? null),
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          pointRadius: 0,
          tension: 0.2,
          fill: true,
          yAxisID: 'y',
          order: 3,
        },
        {
          type: 'bar' as const,
          label: 'Staff Count',
          data: displayData.map((item) => item.staffCount ?? 0),
          backgroundColor: 'rgba(156, 163, 175, 0.4)',
          borderColor: 'rgba(156, 163, 175, 0.6)',
          borderWidth: 1,
          yAxisID: 'y1',
          order: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.7,
        },
      ] : []),
    ],
  };

  const handleClick = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return;
    const elements = getElementsAtEvent(chartRef.current, event);

    if (elements.length > 0) {
      const elementIndex = elements[0].index;
      const clickedDate = displayData[elementIndex]?.date;
      if (clickedDate) {
        onDateClick(clickedDate);
      }
    }
  };

  const options: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleClick,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context: TooltipItem<any>) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.yAxisID === 'y') {
                label += new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(context.parsed.y);
              } else {
                label += context.parsed.y + ' Staff';
              }
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: false,
        grid: {
          display: true,
          drawBorder: false,
          drawOnChartArea: true,
        },
        ticks: {
          callback: function(value: string | number) {
            return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD', maximumFractionDigits: 0 }).format(Number(value));
          },
        },
      },
      ...(viewMode !== 'year' ? {
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          beginAtZero: true,
          grid: { drawOnChartArea: false },
          ticks: {
            precision: 0,
            callback: function(value: string | number) {
              return Number(value).toFixed(0) + ' Staff';
            },
          },
        },
      } : { y1: { display: false } }),
      x: {
        grid: {
          display: false,
        },
        ticks: {
          callback: function(this: Tick, tickValue: string | number, index: number): string | string[] {
            const dataPoint = displayData[index];
            if (!dataPoint || !dataPoint.date) return ''; 
            
            let dateLabel = dataPoint.date; // Fallback label
            try {
                const parsedDate = parseISO(dataPoint.date);
                if (viewMode === 'week') {
                    dateLabel = format(parsedDate, 'EEE dd MMM');
                } else if (viewMode === 'month') {
                    dateLabel = format(parsedDate, 'dd MMM');
                } else { // year
                    dateLabel = format(parsedDate, 'MMM yy');
                }
            } catch (e) {
                console.error("Error parsing date for chart label:", dataPoint.date, e);
                // Keep dateLabel as the original string on error
            }
            
            // No weather icon for year view
            const emoji = viewMode !== 'year' ? getWeatherEmoji(dataPoint.weatherIcon) : ''; 

            // Return label or array [label, emoji]
            return emoji ? [dateLabel, emoji] : dateLabel;
          },
          font: { size: 11 },
          maxRotation: viewMode === 'year' ? 45 : 0, 
          minRotation: viewMode === 'year' ? 45 : 0,
          autoSkip: true, 
          maxTicksLimit: viewMode === 'year' ? 12 : undefined, 
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="h-96">
      <Chart ref={chartRef} type='bar' data={chartDataConfig} options={options} onClick={handleClick} />
    </div>
  );
}