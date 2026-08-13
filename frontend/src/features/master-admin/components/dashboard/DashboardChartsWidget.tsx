import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { TrendingUp, LineChart, BarChart, PieChart } from "lucide-react";
import { useDashboardCharts } from "../../hooks/dashboard.hooks";
import { useTheme } from "@/providers/theme-context";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const DashboardChartsWidget = () => {
  const { data: charts, isLoading, isError } = useDashboardCharts();
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  
  const lightColors = ['#2D3E2C', '#E4FD97', '#4A5D4E', '#BEEF68', '#7B9B7B'];
  const darkColors = ['#E4FD97', '#BEEF68', '#7B9B7B', '#4A5D4E', '#8CA38C'];
  
  const chartColors = isDark ? darkColors : lightColors;

  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200 w-full h-[300px] flex items-center justify-center">
        Failed to load charts.
      </div>
    );
  }

  if (isLoading || !charts?.data) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
            <CardContent><Skeleton className="h-[250px] w-full" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const { companyGrowth, subscriptionTrend, revenueTrend, companyStatusDistribution } = charts.data;

  // Chart configs
  const companyGrowthData = {
    labels: companyGrowth?.labels || [],
    datasets: (companyGrowth?.series || []).map((s) => ({
      label: s.name,
      data: s.data,
      borderColor: chartColors[0],
      backgroundColor: isDark ? 'rgba(228, 253, 151, 0.12)' : 'rgba(45, 62, 44, 0.1)',
      tension: 0.4,
      fill: true,
    })),
  };

  const subscriptionTrendData = {
    labels: subscriptionTrend?.labels || [],
    datasets: (subscriptionTrend?.series || []).map((s, i) => {
      return {
        label: s.name,
        data: s.data,
        borderColor: chartColors[i % chartColors.length],
        tension: 0.4,
      };
    }),
  };

  const revenueTrendData = {
    labels: revenueTrend?.labels || [],
    datasets: (revenueTrend?.series || []).map((s, i) => {
      return {
        label: s.name.replace('$', '₹'),
        data: s.data,
        backgroundColor: chartColors[i % chartColors.length],
        borderRadius: 4,
      }
    }),
  };

  const companyStatusData = {
    labels: companyStatusDistribution?.labels || [],
    datasets: (companyStatusDistribution?.series || []).map((s) => ({
      label: s.name,
      data: s.data,
      backgroundColor: chartColors,
      borderWidth: 0,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: isDark ? '#94A3B8' : '#64748B' } },
      tooltip: {
        backgroundColor: isDark ? '#111827' : 'rgba(0, 0, 0, 0.8)',
        titleColor: isDark ? '#F8FAFC' : '#fff',
        bodyColor: isDark ? '#F8FAFC' : '#fff',
        borderColor: isDark ? '#334155' : 'rgba(0,0,0,0)',
        borderWidth: isDark ? 1 : 0,
      }
    },
    scales: {
      x: {
        grid: { color: isDark ? '#263244' : '#E2E8F0' },
        ticks: { color: isDark ? '#94A3B8' : '#64748B' }
      },
      y: {
        grid: { color: isDark ? '#263244' : '#E2E8F0' },
        ticks: { color: isDark ? '#94A3B8' : '#64748B' }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: options.plugins,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Company Growth
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Line data={companyGrowthData} options={options} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Subscription Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Line data={subscriptionTrendData} options={options} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Bar data={revenueTrendData} options={options} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Company Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Doughnut 
            data={companyStatusData} 
            options={{ ...options, cutout: '65%' }} 
          />
        </CardContent>
      </Card>
    </div>
  );
};
