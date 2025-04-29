import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MonthlyComparisonData } from '../types'; // Adjust path if needed
import { format, parseISO, getDate } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyComparisonChartProps {
  data: MonthlyComparisonData | null;
}

export default function MonthlyComparisonChart({ data }: MonthlyComparisonChartProps) {
  if (!data) return <div className="h-72 flex items-center justify-center text-gray-500">Loading data...</div>;

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false }, // Title handled in parent
      tooltip: {
         callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
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
      x: { // Display day of month
         grid: { display: false },
         ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 15 // Show fewer labels for clarity
         }
      }
    },
  };

  const chartData: ChartData<'line'> = {
    // Use day of month as labels
    labels: data.dailyData.map(d => getDate(parseISO(d.date))),
    datasets: [
      {
        label: 'This Month',
        data: data.dailyData.map(d => d.currentMonthRevenue ?? null),
        borderColor: 'rgb(79, 70, 229)', // Indigo-600
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Last Year',
        data: data.dailyData.map(d => d.priorYearRevenue ?? null),
        borderColor: 'rgb(156, 163, 175)', // Gray-400
        backgroundColor: 'rgba(156, 163, 175, 0.5)',
        tension: 0.1,
        borderDash: [5, 5],
      },
    ],
  };

  return (
    <div className="h-72"> {/* Adjust height as needed */}
        <Line options={options} data={chartData} />
    </div>
  );
} 