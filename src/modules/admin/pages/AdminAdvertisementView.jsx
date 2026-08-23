import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import CategoryPill from '@/components/data-display/CategoryPill/CategoryPill';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import ReasonModal from '@/modules/admin/components/ReasonModal';
import { ADMIN_AD_ROWS } from '@/modules/admin/data/advertisements';

const PAGE_SIZE = 5;

const AdCell = ({ row }) => (
  <div>
    <p className="font-semibold text-deep-blue">{row.title}</p>
    <CategoryPill label={row.category} className="mt-1" />
  </div>
);

const AdminAdvertisementView = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(ADMIN_AD_ROWS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rejectTarget, setRejectTarget] = useState(null);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      const statusOk =
        statusFilter === 'all' || row.status.toLowerCase() === statusFilter;

      if (!statusOk) return false;
      if (!query) return true;

      return [row.title, row.category, row.status, row.duration, row.uploadDate].some((field) =>
        String(field).toLowerCase().includes(query)
      );
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
      onClick: () => navigate(`/admin/advertisement/${row.id}`),
    },
    {
      id: 'active',
      label: 'Active',
      disabled: () => row.status === 'Active',
      onClick: () => updateStatus(row.id, 'Active'),
    },
    {
      id: 'pending',
      label: 'Pending',
      disabled: () => row.status === 'Pending',
      onClick: () => updateStatus(row.id, 'Pending'),
    },
    {
      id: 'expired',
      label: 'Expired',
      disabled: () => row.status === 'Expired',
      onClick: () => updateStatus(row.id, 'Expired'),
    },
    {
      id: 'rejected',
      label: 'Rejected',
      variant: 'danger',
      disabled: () => row.status === 'Rejected',
      onClick: () => setRejectTarget(row),
    },
  ];

  return (
    <PanelPage>
      <PanelPageHeader title="Advertisement" subtitle="Manage advertisement post" />

      <DataTable
        showSearch
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Search advertisements..."
        showFilters
        filterLabel="Sort by:"
        filters={[
          {
            id: 'status',
            value: statusFilter,
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'expired', label: 'Expired' },
              { value: 'rejected', label: 'Rejected' },
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
        tableMinWidth="1000px"
      />

      <ReasonModal
        open={Boolean(rejectTarget)}
        title="Rejected User"
        submitLabel="Suspend"
        placeholder="Why rejected this advertisement"
        description={
          rejectTarget
            ? `Rejecting "${rejectTarget.title}" will remove it from active promotion.`
            : undefined
        }
        onClose={() => setRejectTarget(null)}
        onConfirm={() => {
          if (rejectTarget) updateStatus(rejectTarget.id, 'Rejected');
        }}
      />
    </PanelPage>
  );
};

export default AdminAdvertisementView;
