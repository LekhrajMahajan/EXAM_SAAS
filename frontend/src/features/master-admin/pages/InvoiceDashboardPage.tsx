import React, { useState } from 'react';
import { useInvoiceStats, useInvoiceCharts, useTopCompanies } from '../hooks/invoice.hooks';
import { MasterAdminStatCard as StatCard } from '../components/cards/MasterAdminStatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { LineChart, BarChart, DoughnutChart } from '@/shared/components/charts';
import { GenericDataTable } from '@/shared/components/datatable/GenericDataTable';
import { formatCurrency } from '../../../utils/currency';
import { FileText, IndianRupee, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from "@/providers/theme-context";

export const InvoiceDashboardPage = () => {
  const [filters] = useState<Record<string, unknown>>({});

  const { data: stats, isLoading: statsLoading } = useInvoiceStats(filters);
  const { data: charts, isLoading: chartsLoading } = useInvoiceCharts(filters);
  const { data: topCompanies, isLoading: companiesLoading } = useTopCompanies(filters);
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';

  // Strict Priority Palette
  const lightColors = ['#2D3E2C', '#E4FD97', '#4A5D4E', '#BEEF68', '#7B9B7B'];
  const darkColors = ['#E4FD97', '#BEEF68', '#7B9B7B', '#4A5D4E', '#8CA38C'];
  const chartColors = isDark ? darkColors : lightColors;

  const chartOptions = {
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
    plugins: chartOptions.plugins,
  };

  // Mappers for Chart.js
  const revenueTrendData = {
    labels: charts?.revenueTrend?.map((item: { _id: { month: number; year: number } }) => `${item._id.month}/${item._id.year}`) || [],
    datasets: [
      {
        label: 'Revenue',
        data: charts?.revenueTrend?.map((item: { revenue: number }) => item.revenue) || [],
        borderColor: chartColors[0], // Priority 1
        backgroundColor: 'rgba(45, 62, 44, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const volumeByMonthData = {
    labels: charts?.volumeByMonth?.map((item: { _id: { month: number; year: number } }) => `${item._id.month}/${item._id.year}`) || [],
    datasets: [
      {
        label: 'Invoice Volume',
        data: charts?.volumeByMonth?.map((item: { count: number }) => item.count) || [],
        backgroundColor: chartColors[0], // Priority 1
      }
    ]
  };

  const statusDistributionData = {
    labels: charts?.statusDistribution?.map((item: { _id: string }) => item._id) || [],
    datasets: [
      {
        data: charts?.statusDistribution?.map((item: { count: number }) => item.count) || [],
        backgroundColor: charts?.statusDistribution?.map((_: any, i: number) => chartColors[i % chartColors.length]) || [],
      }
    ]
  };

  const paymentDistributionData = {
    labels: charts?.paymentDistribution?.map((item: { _id: string }) => item._id || 'UNPAID') || [],
    datasets: [
      {
        data: charts?.paymentDistribution?.map((item: { count: number }) => item.count) || [],
        backgroundColor: charts?.paymentDistribution?.map((_: any, i: number) => chartColors[i % chartColors.length]) || [],
      }
    ]
  };

  const companyColumns: any[] = [
    { id: 'companyName', header: 'Company', accessorKey: 'companyName' },
    { id: 'invoices', header: 'Invoices', accessorKey: 'invoices' },
    { 
      id: 'revenue',
      header: 'Revenue', 
      accessorKey: 'revenue',
      cell: ({ row }: any) => formatCurrency(row.revenue, 'INR') 
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Invoice Analytics</h1>
        {/* Filter controls can go here */}
      </div>

      {statsLoading ? (
        <div>Loading stats...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats?.totalRevenue || 0, 'INR')}
            icon={IndianRupee}
            accent='green'
          />
          <StatCard
            title="Pending Revenue"
            value={formatCurrency(stats?.pendingRevenue || 0, 'INR')}
            icon={Clock}
            accent='amber'
          />
          <StatCard
            title="Overdue Revenue"
            value={formatCurrency(stats?.overdueRevenue || 0, 'INR')}
            icon={AlertCircle}
            accent='red'
          />
          <StatCard
            title="Average Invoice Value"
            value={formatCurrency(stats?.averageInvoiceValue || 0, 'INR')}
            icon={FileText}
            accent='slate'
          />
          <StatCard
            title="Paid Invoices"
            value={stats?.paidInvoices || 0}
            icon={CheckCircle}
            accent='lime'
          />
          <StatCard
            title="Pending Invoices"
            value={stats?.pendingInvoices || 0}
            icon={Clock}
            accent='amber'
          />
          <StatCard
            title="Total Invoices"
            value={stats?.totalInvoices || 0}
            icon={FileText}
            accent='slate'
          />
          <StatCard
            title="Credit/Debit Notes"
            value={`${stats?.creditNotes || 0} / ${stats?.debitNotes || 0}`}
            icon={FileText}
            accent='slate'
          />
        </div>
      )}

      {chartsLoading ? (
        <div>Loading charts...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 h-[300px]">
              <LineChart data={revenueTrendData} options={chartOptions} />
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex justify-center pb-8">
              <DoughnutChart data={statusDistributionData} options={pieOptions} />
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex justify-center pb-8">
              <DoughnutChart data={paymentDistributionData} options={pieOptions} />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Volume by Month</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             <BarChart data={volumeByMonthData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Companies by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {companiesLoading ? (
              <div>Loading companies...</div>
            ) : (
              <GenericDataTable
                data={topCompanies || []}
                columns={companyColumns}
                keyExtractor={(item: any) => item._id}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
