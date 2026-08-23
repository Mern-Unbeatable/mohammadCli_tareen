import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import CategoryPill from '@/components/data-display/CategoryPill/CategoryPill';
import Card from '@/components/ui/Card';
import CreateAdModal from '@/modules/supplier/components/CreateAdModal';
import { SUPPLIER_AD_ROWS } from '@/modules/supplier/data/advertisements';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import { panelPageTheme, panelPrimaryBtn } from '@/shared/layout/PanelLayout/panelPageTheme';

const PAGE_SIZE = 7;

const AdCell = ({ row }) => (
  <div>
    <p className="font-semibold text-deep-blue">{row.title}</p>
    <CategoryPill label={row.category} className="mt-1" />
  </div>
);

const SupplierAdsView = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(SUPPLIER_AD_ROWS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortFilter, setSortFilter] = useState('newest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = rows.filter((row) => {
      const statusOk =
        statusFilter === 'all' || row.status.toLowerCase() === statusFilter;

      if (!statusOk) return false;
      if (!query) return true;

      return [row.title, row.category, row.status, row.duration, row.uploadDate].some((field) =>
        String(field).toLowerCase().includes(query)
      );
    });

    result = [...result].sort((a, b) => {
      if (sortFilter === 'oldest') {
        return a.uploadDate.localeCompare(b.uploadDate);
      }
      return b.uploadDate.localeCompare(a.uploadDate);
    });

    return result;
  }, [rows, statusFilter, sortFilter, search]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

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

  const rowActions = (row) => {
    const actions = [
      {
        id: 'details',
        label: 'See Details',
        onClick: () => navigate(`/supplier/ads/${row.id}`),
      },
    ];

    if (row.status === 'Rejected') {
      actions.push({
        id: 'resubmit',
        label: 'Resubmit',
        onClick: () => setCreateOpen(true),
      });
    }

    if (row.status === 'Expired') {
      actions.push({
        id: 'renew',
        label: 'Renew',
        onClick: () => setCreateOpen(true),
      });
    }

    return actions;
  };

  const handleCreated = (newRow) => {
    setRows((prev) => [newRow, ...prev]);
    setPage(1);
  };

  return (
    <PanelPage>
      <PanelPageHeader
        title="My Advertisement"
        subtitle="Create and manage your ads on here"
        action={
          <button type="button" onClick={() => setCreateOpen(true)} className={panelPrimaryBtn}>
            Create a advertisement
          </button>
        }
      />

      <Card className="overflow-hidden p-4 sm:p-5">
        

        <div>
          <DataTable
            showCard={false}
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
              {
                id: 'sort',
                value: sortFilter,
                options: [
                  { value: 'newest', label: 'Newest First' },
                  { value: 'oldest', label: 'Oldest First' },
                ],
                onChange: (value) => {
                  setSortFilter(value);
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
            tableMinWidth="900px"
          />
        </div>
      </Card>

      <CreateAdModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />
    </PanelPage>
  );
};

export default SupplierAdsView;
