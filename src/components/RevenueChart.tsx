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
  TooltipItem,
  Tick
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { RevenueChartDataPoint } from '../types';
import { format, parseISO, startOfWeek, endOfMonth, isWithinInterval } from 'date-fns';

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
  viewMode: 'week' | 'month';
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

export default function RevenueChart({ data: chartInputData, viewMode }: RevenueChartProps) {
  const filteredData = chartInputData.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  let displayData: RevenueChartDataPoint[];

  if (viewMode === 'week') {
    displayData = filteredData.slice(-7);
  } else {
    displayData = filteredData.slice(-30);
  }

  const data: ChartData<any> = {
    labels: displayData.map(item => item.date),
    datasets: [
      {
        type: 'line' as const,
        label: 'Actual Revenue',
        data: displayData.map((item) => item.amount),
        borderColor: '#4338CA',
        backgroundColor: '#4338CA',
        pointRadius: 3,
        tension: 0.2,
        yAxisID: 'y',
        order: 1,
      },
      {
        type: 'line' as const,
        label: 'Last Year Revenue',
        data: displayData.map((item) => item.lastYearAmount),
        borderColor: '#9CA3AF',
        borderDash: [4, 4],
        pointRadius: 0,
        tension: 0.2,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'line' as const,
        label: 'Forecast',
        data: displayData.map((item) => item.forecast || null),
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
        data: displayData.map((item) => item.baseline),
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
        data: displayData.map((item) => item.staffCount),
        backgroundColor: 'rgba(156, 163, 175, 0.4)',
        borderColor: 'rgba(156, 163, 175, 0.6)',
        borderWidth: 1,
        yAxisID: 'y1',
        order: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
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
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          precision: 0,
          callback: function(value: string | number) {
            return Number(value).toFixed(0) + ' Staff';
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          callback: function(this: Tick, tickValue: string | number, index: number): string | string[] {
            const dateStr = displayData[index]?.date;
            if (!dateStr) return '';

            const dateLabel = format(parseISO(dateStr), viewMode === 'week' ? 'EEE dd MMM' : 'dd MMM');
            
            const weatherIcon = displayData[index]?.weatherIcon;
            const emoji = getWeatherEmoji(weatherIcon);

            return [dateLabel, emoji];
          },
          font: {
             size: 11, 
          },
           maxRotation: 0,
           minRotation: 0,
           autoSkip: false,
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
      <Chart type='bar' data={data} options={options} />
    </div>
  );
}