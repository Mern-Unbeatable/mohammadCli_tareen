import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Pencil } from 'lucide-react';
import BarChartCard from '@/components/data-display/BarChartCard/BarChartCard';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import CategoryPill from '@/components/data-display/CategoryPill/CategoryPill';
import StatCard from '@/components/data-display/StatCard/StatCard';
import Card from '@/components/ui/Card';
import CreateAdModal from '@/modules/supplier/components/CreateAdModal';
import {
  SUPPLIER_AD_PERFORMANCE_CHART,
  SUPPLIER_CHART_MONTHS,
  SUPPLIER_DASHBOARD_NOTIFICATIONS,
  SUPPLIER_DASHBOARD_STATS,
} from '@/modules/supplier/data/dashboard';
import { SUPPLIER_AD_ROWS } from '@/modules/supplier/data/advertisements';
import { useAuth } from '@/shared/auth/AuthContext';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import { panelPageTheme, panelPrimaryBtn } from '@/shared/layout/PanelLayout/panelPageTheme';

const RECENT_ADS = SUPPLIER_AD_ROWS.slice(0, 5);

const AdCell = ({ row }) => (
  <div>
    <p className="font-semibold text-deep-blue">{row.title}</p>
    <CategoryPill label={row.category} className="mt-1" />
  </div>
);

const SupplierDashboardView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chartYear, setChartYear] = useState('This year');
  const [createOpen, setCreateOpen] = useState(false);

  const columns = useMemo(
    () => [
      {
        key: 'title',
        header: 'Advertisement',
        render: (_, row) => <AdCell row={row} />,
      },
      {
        key: 'status',
        header: 'Status',
        render: (value) => <StatusBadge status={value} label={value} />,
      },
      { key: 'views', header: 'Views' },
      { key: 'clicks', header: 'Clicks' },
      { key: 'duration', header: 'Duration' },
      { key: 'uploadDate', header: 'Upload date' },
    ],
    []
  );

  const rowActions = (row) => [
    {
      id: 'details',
      label: 'See Details',
      onClick: () => navigate(`/supplier/ads/${row.id}`),
    },
  ];

  return (
    <PanelPage>
      <div className="rounded-xl bg-deep-blue p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[24px] font-bold leading-tight text-white sm:text-[28px] lg:text-[32px]">
              Welcome back, {user?.name || 'Supplier'}
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-white/70 sm:text-[15px] lg:text-[16px]">
              Here&apos;s an overview of your advertisements and activity
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className={`${panelPrimaryBtn} w-full shrink-0 gap-2 sm:w-auto`}
          >
            <Pencil className="h-4 w-4" />
            Create A Advertisement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SUPPLIER_DASHBOARD_STATS.map((stat) => (
          <Card key={stat.id} className="flex h-full flex-col p-4 sm:p-5">
            <StatCard
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              tone={stat.tone}
              className="!rounded-none !border-0 !bg-transparent !p-0 shadow-none"
            />
            <p className="mt-auto pt-3 text-[12px] text-[#98A2B3] sm:text-[13px]">{stat.hint}</p>
          </Card>
        ))}
      </div>

      <BarChartCard
        title={SUPPLIER_AD_PERFORMANCE_CHART.title}
        series={SUPPLIER_AD_PERFORMANCE_CHART.series}
        labels={SUPPLIER_CHART_MONTHS}
        yTicks={SUPPLIER_AD_PERFORMANCE_CHART.yTicks}
        yMax={SUPPLIER_AD_PERFORMANCE_CHART.yMax}
        yearValue={chartYear}
        onYearChange={setChartYear}
        chartHeight={180}
        legendPosition="bottom"
        fullWidth
      />

      <Card className="overflow-hidden p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className={panelPageTheme.cardTitle}>Recent Advertisements</h2>
            <p className={panelPageTheme.cardSubtitle}>Manage and track your latest campaigns</p>
          </div>
          <Link
            to="/supplier/ads"
            className="text-[13px] font-semibold text-primary hover:underline sm:text-[14px]"
          >
            View All →
          </Link>
        </div>

        <DataTable
          showCard={false}
          columns={columns}
          data={RECENT_ADS}
          showActions
          getActions={rowActions}
          tableMinWidth="900px"
        />
      </Card>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-[#E4E7EC] px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div>
            <h2 className={panelPageTheme.cardTitle}>Recent Notifications</h2>
            <p className={panelPageTheme.cardSubtitle}>
              Latest updates about your advertisements
            </p>
          </div>
          <Link
            to="/supplier/notifications"
            className="text-[13px] font-semibold text-primary hover:underline sm:text-[14px]"
          >
            View All →
          </Link>
        </div>

        <ul className="divide-y divide-[#E4E7EC]">
          {SUPPLIER_DASHBOARD_NOTIFICATIONS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <div className="flex items-start gap-3 px-5 py-4 sm:gap-4 sm:px-6">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${item.iconClass}`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold leading-snug text-deep-blue sm:text-[15px]">
                      {item.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#64748B] sm:text-[14px]">
                      {item.subtitle}
                    </p>
                    <p className="mt-2 text-[12px] text-[#98A2B3] sm:text-[13px]">{item.time}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <CreateAdModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </PanelPage>
  );
};

export default SupplierDashboardView;
