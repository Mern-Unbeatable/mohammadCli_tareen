import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import SuspendUserModal from '@/modules/admin/components/SuspendUserModal';
import SubscriptionPill from '@/modules/admin/components/SubscriptionPill';
import {
  ADMIN_SUPPLIER_ROWS,
  ADMIN_USER_ROWS,
} from '@/modules/admin/data/users';
import { DEMO_TABLE_TABS } from '@/data/demoData';

const PAGE_SIZE = 7;

const AdminUsersView = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);
  const [userRows, setUserRows] = useState(ADMIN_USER_ROWS);
  const [supplierRows, setSupplierRows] = useState(ADMIN_SUPPLIER_ROWS);
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [suspendTarget, setSuspendTarget] = useState(null);

  const isSupplierTab = tab === 'supplier';
  const sourceRows = isSupplierTab ? supplierRows : userRows;

  const filteredRows = useMemo(() => {
    return sourceRows.filter((row) => {
      const statusOk =
        statusFilter === 'all' ||
        row.status.toLowerCase() === statusFilter ||
        (statusFilter === 'suspend' && row.status === 'Suspend');

      if (isSupplierTab) return statusOk;

      const subscriptionOk =
        subscriptionFilter === 'all' ||
        row.subscription?.toLowerCase() === subscriptionFilter;

      return statusOk && subscriptionOk;
    });
  }, [sourceRows, subscriptionFilter, statusFilter, isSupplierTab]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  const updateRowStatus = (rowId, status) => {
    const updater = (rows) =>
      rows.map((row) => (row.id === rowId ? { ...row, status } : row));

    if (isSupplierTab) {
      setSupplierRows(updater);
    } else {
      setUserRows(updater);
    }
  };

  const handleTabChange = (nextTab) => {
    setTab(nextTab);
    setPage(1);
    setSubscriptionFilter('all');
    setStatusFilter('all');
  };

  const userColumns = useMemo(() => {
    const base = [
      { key: 'userName', header: 'User Name', className: 'font-semibold' },
      { key: 'userType', header: 'User Type' },
      { key: 'company', header: 'Company/Organization' },
      { key: 'role', header: 'Role' },
    ];

    if (!isSupplierTab) {
      base.push({
        key: 'subscription',
        header: 'Subscription',
        render: (value) => <SubscriptionPill label={value} />,
      });
    }

    base.push(
      { key: 'joinedDate', header: 'Joined Date' },
      {
        key: 'status',
        header: 'Status',
        render: (value) => <StatusBadge status={value} />,
      }
    );

    return base;
  }, [isSupplierTab]);

  const rowActions = (row) => [
    {
      id: 'details',
      label: 'See Details',
      onClick: () => navigate(`/admin/users/${row.id}`),
    },
    {
      id: 'active',
      label: 'Active',
      disabled: () => row.status === 'Active',
      onClick: () => updateRowStatus(row.id, 'Active'),
    },
    {
      id: 'suspend',
      label: 'Suspend',
      variant: 'danger',
      disabled: () => row.status === 'Suspend',
      onClick: () => setSuspendTarget(row),
    },
  ];

  const filters = [
    ...(isSupplierTab
      ? []
      : [
          {
            id: 'subscription',
            value: subscriptionFilter,
            options: [
              { value: 'all', label: 'All Subscription' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
              { value: 'free', label: 'Free' },
            ],
            onChange: (value) => {
              setSubscriptionFilter(value);
              setPage(1);
            },
          },
        ]),
    {
      id: 'status',
      value: statusFilter,
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'active', label: 'Active' },
        { value: 'suspend', label: 'Suspended' },
      ],
      onChange: (value) => {
        setStatusFilter(value);
        setPage(1);
      },
    },
  ];

  return (
    <PanelPage>
      <PanelPageHeader title="Users & Subscriptions" subtitle="200 Customers" />

      <DataTable
        showTabs
        tabs={DEMO_TABLE_TABS}
        activeTab={tab}
        onTabChange={handleTabChange}
        showFilters
        filterLabel=""
        filters={filters}
        columns={userColumns}
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
      />

      <SuspendUserModal
        open={Boolean(suspendTarget)}
        userName={suspendTarget?.userName}
        onClose={() => setSuspendTarget(null)}
        onConfirm={() => {
          if (suspendTarget) updateRowStatus(suspendTarget.id, 'Suspend');
        }}
      />
    </PanelPage>
  );
};

export default AdminUsersView;
