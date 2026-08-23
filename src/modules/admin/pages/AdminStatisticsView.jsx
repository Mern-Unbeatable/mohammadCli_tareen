import { useState } from 'react';
import StatCard from '@/components/data-display/StatCard/StatCard';
import LineChartCard from '@/components/data-display/LineChartCard/LineChartCard';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import {
  DEMO_CHART_MONTHS,
  DEMO_MONTHLY_SUB_REVENUE_CHART,
  DEMO_NEW_SUBSCRIBERS_CHART,
  DEMO_NEW_USER_CHART,
  DEMO_REVENUE_CHART,
  DEMO_STAT_CARDS,
  DEMO_USER_GROWTH_CHART,
  DEMO_YEARLY_SUB_REVENUE_CHART,
} from '@/data/demoData';

const AdminStatisticsView = () => {
  const [chartYears, setChartYears] = useState({
    userGrowth: 'This year',
    revenue: 'This year',
    newUser: 'This year',
    monthlySub: 'This year',
    newSubs: 'This year',
    yearlySub: 'This year',
  });

  const setYear = (key, value) => {
    setChartYears((prev) => ({ ...prev, [key]: value }));
  };

  const charts = [
    { key: 'userGrowth', config: DEMO_USER_GROWTH_CHART },
    { key: 'revenue', config: DEMO_REVENUE_CHART },
    { key: 'newUser', config: DEMO_NEW_USER_CHART },
    { key: 'monthlySub', config: DEMO_MONTHLY_SUB_REVENUE_CHART },
    { key: 'newSubs', config: DEMO_NEW_SUBSCRIBERS_CHART },
    { key: 'yearlySub', config: DEMO_YEARLY_SUB_REVENUE_CHART },
  ];

  return (
    <PanelPage>
      <PanelPageHeader title="Revenue Statistics" subtitle="Full Details your Lab Unity" />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {DEMO_STAT_CARDS.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {charts.map(({ key, config }) => (
          <LineChartCard
            key={key}
            title={config.title}
            series={config.series}
            labels={DEMO_CHART_MONTHS}
            yTicks={config.yTicks}
            yMax={config.yMax}
            yearValue={chartYears[key]}
            onYearChange={(value) => setYear(key, value)}
          />
        ))}
      </div>
    </PanelPage>
  );
};

export default AdminStatisticsView;
