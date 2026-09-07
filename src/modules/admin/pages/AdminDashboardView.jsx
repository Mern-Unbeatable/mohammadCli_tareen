import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import StatCard from '@/components/data-display/StatCard/StatCard';
import LineChartCard from '@/components/data-display/LineChartCard/LineChartCard';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import { fetchAdminDashboardStats, fetchAdminStatistics } from '@/features/admin/adminSlice';
import {
  DEMO_CHART_MONTHS,
  DEMO_REVENUE_CHART,
  DEMO_STAT_CARDS,
  DEMO_USER_GROWTH_CHART,
} from '@/data/demoData';

const filterPeriodOptions = ['This year', 'This month', 'Last 3 months', 'Last 6 months'];

/**
 * Filters labels and series values based on selected period dropdown option
 */
const filterChartData = (rawLabels = [], rawSeries = [], selectedPeriod = 'This year') => {
  if (!rawLabels.length) return { labels: [], series: rawSeries };

  const currentMonthIdx = new Date().getMonth(); // 0 to 11

  let startIndex = 0;
  let endIndex = rawLabels.length;

  if (selectedPeriod === 'This month') {
    startIndex = currentMonthIdx;
    endIndex = currentMonthIdx + 1;
  } else if (selectedPeriod === 'Last 3 months') {
    startIndex = Math.max(0, currentMonthIdx - 2);
    endIndex = currentMonthIdx + 1;
  } else if (selectedPeriod === 'Last 6 months') {
    startIndex = Math.max(0, currentMonthIdx - 5);
    endIndex = currentMonthIdx + 1;
  } else {
    // 'This year'
    startIndex = 0;
    endIndex = rawLabels.length;
  }

  const labels = rawLabels.slice(startIndex, endIndex);
  const series = rawSeries.map((s) => ({
    ...s,
    values: (s.values || []).slice(startIndex, endIndex),
  }));

  return { labels, series };
};

const AdminDashboardView = () => {
  const dispatch = useDispatch();
  const { stats, statistics, loading } = useSelector((state) => state.admin);

  const [userYear, setUserYear] = useState('This year');
  const [revenueYear, setRevenueYear] = useState('This year');

  useEffect(() => {
    dispatch(fetchAdminDashboardStats());
    dispatch(fetchAdminStatistics());
  }, [dispatch]);

  // Use API stats if present, otherwise fallback to DEMO_STAT_CARDS
  const displayStats = stats && stats.length > 0 ? stats : DEMO_STAT_CARDS;

  // Base API statistics or fallbacks
  const rawChartLabels = statistics?.labels || DEMO_CHART_MONTHS;
  const rawUserGrowthSeries = statistics?.series
    ? [
        {
          id: 'newUsers',
          label: 'New Users',
          color: '#F97316',
          values: statistics.series.newUsers || [],
        },
        {
          id: 'newSubscribers',
          label: 'Subscribers',
          color: '#EC4899',
          values: statistics.series.newSubscribers || [],
        },
      ]
    : DEMO_USER_GROWTH_CHART.series;

  const rawRevenueSeries = statistics?.series
    ? [
        {
          id: 'monthlyRevenue',
          label: 'Monthly Revenue (€)',
          color: '#10B981',
          values: statistics.series.monthlyRevenue || [],
        },
        {
          id: 'yearlyRevenue',
          label: 'Yearly Revenue (€)',
          color: '#3B82F6',
          values: statistics.series.yearlyRevenue || [],
        },
      ]
    : DEMO_REVENUE_CHART.series;

  // Apply active period filter to chart data
  const userGrowthFiltered = filterChartData(rawChartLabels, rawUserGrowthSeries, userYear);
  const revenueFiltered = filterChartData(rawChartLabels, rawRevenueSeries, revenueYear);

  return (
    <PanelPage>
      <PanelPageHeader
        title="Dashboard"
        subtitle="Overview of your Lab Unity platform."
      />

      {loading ? (
        <div className="flex h-28 items-center justify-center rounded-xl bg-white p-6 shadow-sm">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
          <span className="text-[14px] font-medium text-[#64748B]">
            Loading statistics from API...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 xl:grid-cols-6">
          {displayStats.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <LineChartCard
          title="User Growth"
          series={userGrowthFiltered.series}
          labels={userGrowthFiltered.labels}
          yearOptions={filterPeriodOptions}
          yearValue={userYear}
          onYearChange={setUserYear}
        />
        <LineChartCard
          title="Revenue"
          series={revenueFiltered.series}
          labels={revenueFiltered.labels}
          yearOptions={filterPeriodOptions}
          yearValue={revenueYear}
          onYearChange={setRevenueYear}
        />
      </div>
    </PanelPage>
  );
};

export default AdminDashboardView;
