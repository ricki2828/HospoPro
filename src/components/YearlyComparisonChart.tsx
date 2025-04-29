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
import { YearlyComparisonData } from '../types'; // Adjust path if needed

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface YearlyComparisonChartProps {
  data: YearlyComparisonData | null;
}

export default function YearlyComparisonChart({ data }: YearlyComparisonChartProps) {
   if (!data) return <div className="h-72 flex items-center justify-center text-gray-500">Loading data...</div>;

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false, 
      },
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
                 return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD', maximumFractionDigits: 0, notation: 'compact' }).format(Number(value));
             }
        }
      },
      x: {
         grid: { display: false }
      }
    },
  };

  const chartData: ChartData<'bar'> = {
    labels: data.monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'TTM Revenue',
        data: data.monthlyData.map(d => d.ttmRevenue),
        backgroundColor: 'rgba(5, 150, 105, 0.6)', // Emerald-600 with opacity
        borderColor: 'rgba(5, 150, 105, 1)',
        borderWidth: 1,
      },
      {
        label: 'Prior Year Month',
        data: data.monthlyData.map(d => d.priorYearRevenue),
        backgroundColor: 'rgba(209, 213, 219, 0.6)', // Gray-300 with opacity
        borderColor: 'rgba(209, 213, 219, 1)',
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