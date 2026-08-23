import { useState } from 'react';
import StatCard from '@/components/data-display/StatCard/StatCard';
import LineChartCard from '@/components/data-display/LineChartCard/LineChartCard';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import {
  DEMO_CHART_MONTHS,
  DEMO_REVENUE_CHART,
  DEMO_STAT_CARDS,
  DEMO_USER_GROWTH_CHART,
} from '@/data/demoData';

const AdminDashboardView = () => {
  const [userYear, setUserYear] = useState('This year');
  const [revenueYear, setRevenueYear] = useState('This year');

  return (
    <PanelPage>
      <PanelPageHeader
        title="Dashboard"
        subtitle="Overview of your Lab Unity platform."
      />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {DEMO_STAT_CARDS.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <LineChartCard
          title={DEMO_USER_GROWTH_CHART.title}
          series={DEMO_USER_GROWTH_CHART.series}
          labels={DEMO_CHART_MONTHS}
          yTicks={DEMO_USER_GROWTH_CHART.yTicks}
          yMax={DEMO_USER_GROWTH_CHART.yMax}
          yearValue={userYear}
          onYearChange={setUserYear}
        />
        <LineChartCard
          title={DEMO_REVENUE_CHART.title}
          series={DEMO_REVENUE_CHART.series}
          labels={DEMO_CHART_MONTHS}
          yTicks={DEMO_REVENUE_CHART.yTicks}
          yMax={DEMO_REVENUE_CHART.yMax}
          yearValue={revenueYear}
          onYearChange={setRevenueYear}
        />
      </div>
    </PanelPage>
  );
};

export default AdminDashboardView;
