import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { WeeklyComparison } from '../types'; // Adjust path if needed

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface WeeklyComparisonChartProps {
  data: WeeklyComparison[];
}

export default function WeeklyComparisonChart({ data }: WeeklyComparisonChartProps) {
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false, // Keep title in the parent component
      },
      tooltip: {
         callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                     label += new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD', maximumFractionDigits: 0 }).format(context.parsed.y);
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
                 return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD', maximumFractionDigits: 0 }).format(Number(value));
             }
        }
      },
      x: {
         grid: { display: false }
      }
    },
  };

  const chartData: ChartData<'bar'> = {
    labels: data.map(d => d.dayOfWeek),
    datasets: [
      {
        label: 'This Week',
        data: data.map(d => d.currentWeekRevenue),
        backgroundColor: 'rgba(67, 56, 202, 0.6)', // primary-700 with opacity
        borderColor: 'rgba(67, 56, 202, 1)',
        borderWidth: 1,
      },
      {
        label: 'Last Week',
        data: data.map(d => d.previousWeekRevenue),
        backgroundColor: 'rgba(156, 163, 175, 0.6)', // gray-400 with opacity
        borderColor: 'rgba(156, 163, 175, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-72"> {/* Adjust height as needed */}
        <Bar options={options} data={chartData} />
    </div>
  );
} 