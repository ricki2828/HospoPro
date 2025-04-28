import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Revenue } from '../types';
import { format, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RevenueChartProps {
  revenueData: Revenue[];
}

export default function RevenueChart({ revenueData }: RevenueChartProps) {
  const data = {
    labels: revenueData.map((item) => format(parseISO(item.date), 'EEE dd MMM')),
    datasets: [
      {
        label: 'Actual Revenue',
        data: revenueData.map((item) => item.amount),
        borderColor: '#4338CA',
        backgroundColor: '#4338CA',
        pointRadius: 4,
        tension: 0.2,
      },
      {
        label: 'Forecast',
        data: revenueData.map((item) => item.forecast || null),
        borderColor: '#0D9488',
        backgroundColor: '#0D9488',
        pointRadius: 4,
        pointStyle: 'triangle',
        tension: 0.2,
        borderDash: [5, 5],
      },
      {
        label: 'Baseline',
        data: revenueData.map((item) => item.baseline),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        pointRadius: 0,
        tension: 0.2,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
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
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          display: true,
          drawBorder: false,
        },
        ticks: {
          callback: function(value) {
            return '$' + value;
          },
        },
      },
      x: {
        grid: {
          display: false,
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
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  );
}