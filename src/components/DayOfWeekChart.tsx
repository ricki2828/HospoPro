import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DayOfWeekTrend } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DayOfWeekChartProps {
  trends: DayOfWeekTrend[];
}

export default function DayOfWeekChart({ trends }: DayOfWeekChartProps) {
  const data = {
    labels: trends.map((trend) => trend.dayOfWeek),
    datasets: [
      {
        label: 'Average Revenue',
        data: trends.map((trend) => trend.averageRevenue),
        backgroundColor: '#4338CA',
      },
      {
        label: 'Last Week',
        data: trends.map((trend) => trend.lastWeekRevenue),
        backgroundColor: '#0D9488',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-NZ', { 
                style: 'currency', 
                currency: 'NZD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          },
        },
      },
    },
  };

  return (
    <div className="h-60">
      <Bar data={data} options={options} />
    </div>
  );
}