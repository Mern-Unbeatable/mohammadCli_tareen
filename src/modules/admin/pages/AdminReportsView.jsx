import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2, Clock, Shield } from 'lucide-react';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import StatCard from '@/components/data-display/StatCard/StatCard';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import { ADMIN_REPORT_ROWS, REPORT_STAT_CARDS } from '@/modules/admin/data/reports';

const PAGE_SIZE = 5;

const REPORT_ICONS = {
  total: Shield,
  pending: Clock,
  review: Clock,
  resolved: CheckCircle2,
};

const ReportedUserCell = ({ row }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="font-medium text-deep-blue">{row.reportedUser}</span>
    <span className="inline-flex rounded-md bg-pink-secondary px-2 py-0.5 text-[11px] font-semibold text-pink-light sm:text-[12px] lg:text-[13px]">
      {row.reportCount} Reports
    </span>
  </div>
);

const AdminReportsView = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(ADMIN_REPORT_ROWS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      const statusOk =
        statusFilter === 'all' ||
        row.status.toLowerCase().replace(/\s+/g, ' ') === statusFilter;

      if (!statusOk) return false;
      if (!query) return true;

      return [
        row.reportedBy,
        row.reportedItem,
        row.type,
        row.reason,
        row.reportedUser,
        row.status,
        row.reportedDate,
      ].some((field) => String(field).toLowerCase().includes(query));
    });
  }, [rows, statusFilter, search]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  const updateStatus = (rowId, status) => {
    setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, status } : row)));
  };

  const columns = useMemo(
    () => [
      { key: 'reportedBy', header: 'Reported By', className: 'font-semibold' },
      {
        key: 'reportedItem',
        header: 'Reported Item',
        wrap: true,
        className: 'max-w-[220px]',
      },
      { key: 'type', header: 'Type' },
      { key: 'reason', header: 'Reason' },
      {
        key: 'reportedUser',
        header: 'Reported User',
        render: (_, row) => <ReportedUserCell row={row} />,
      },
      { key: 'reportedDate', header: 'Reported Date' },
      {
        key: 'status',
        header: 'Status',
        render: (value) => <StatusBadge status={value} label={value} />,
      },
    ],
    []
  );

  const rowActions = (row) => [
    {
      id: 'details',
      label: 'See Details',
      onClick: () => navigate(`/admin/reports/${row.id}`),
    },
    {
      id: 'pending',
      label: 'Pending',
      disabled: () => row.status === 'Pending',
      onClick: () => updateStatus(row.id, 'Pending'),
    },
    {
      id: 'review',
      label: 'Under Review',
      disabled: () => row.status === 'Under Review',
      onClick: () => updateStatus(row.id, 'Under Review'),
    },
    {
      id: 'resolved',
      label: 'Resolved',
      disabled: () => row.status === 'Resolved',
      onClick: () => updateStatus(row.id, 'Resolved'),
    },
  ];

  return (
    <PanelPage>
      <PanelPageHeader
        title="Reports & Moderation"
        subtitle="Review reported content and users, take appropriate action, and manage moderation cases across the Lab Unity healthcare and diagnostic network."
      />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {REPORT_STAT_CARDS.map((stat) => (
          <StatCard key={stat.id} icon={REPORT_ICONS[stat.id]} {...stat} />
        ))}
      </div>

      <DataTable
        showSearch
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Search reports..."
        showFilters
        filterLabel=""
        filters={[
          {
            id: 'status',
            value: statusFilter,
            options: [
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'under review', label: 'Under Review' },
              { value: 'resolved', label: 'Resolved' },
            ],
            onChange: (value) => {
              setStatusFilter(value);
              setPage(1);
            },
          },
        ]}
        columns={columns}
        data={pageRows}
        showActions
        getActions={rowActions}
        showPagination
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          total: filteredRows.length,
          onPageChange: setPage,
        }}
        tableMinWidth="1100px"
      />
    </PanelPage>
  );
};

export default AdminReportsView;
