import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
import { RevenueChartDataPoint } from '../pages/Dashboard';
import { format, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RevenueChartProps {
  data: RevenueChartDataPoint[];
}

export default function RevenueChart({ data: chartInputData }: RevenueChartProps) {
  const data: ChartData<any> = {
    labels: chartInputData.map((item) => format(parseISO(item.date), 'EEE dd MMM')),
    datasets: [
      {
        type: 'line' as const,
        label: 'Actual Revenue',
        data: chartInputData.map((item) => item.amount),
        borderColor: '#4338CA',
        backgroundColor: '#4338CA',
        pointRadius: 3,
        tension: 0.2,
        yAxisID: 'y',
        order: 1,
      },
      {
        type: 'line' as const,
        label: 'Forecast',
        data: chartInputData.map((item) => item.forecast || null),
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
        data: chartInputData.map((item) => item.baseline),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        pointRadius: 0,
        tension: 0.2,
        fill: true,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'bar' as const,
        label: 'Staff Count',
        data: chartInputData.map((item) => item.staffCount),
        backgroundColor: 'rgba(156, 163, 175, 0.4)',
        borderColor: 'rgba(156, 163, 175, 0.6)',
        borderWidth: 1,
        yAxisID: 'y1',
        order: 3,
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
                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
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
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value));
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
      <Chart type='bar' data={data} options={options} />
    </div>
  );
}