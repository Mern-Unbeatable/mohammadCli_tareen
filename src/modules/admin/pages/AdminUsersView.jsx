import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import SuspendUserModal from '@/modules/admin/components/SuspendUserModal';
import SubscriptionPill from '@/modules/admin/components/SubscriptionPill';
import { fetchUsersList, updateUserStatus } from '@/features/admin/adminSlice';
import { DEMO_TABLE_TABS } from '@/data/demoData';

const PAGE_SIZE = 10;

const AdminUsersView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, usersMeta, usersLoading } = useSelector((state) => state.admin);

  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [suspendTarget, setSuspendTarget] = useState(null);

  const isSupplierTab = tab === 'supplier';

  // Fetch users from API whenever filters or pagination change
  useEffect(() => {
    const params = {
      page,
      pageSize: PAGE_SIZE,
    };

    if (tab === 'supplier') {
      params.role = 'SUPPLIER';
    } else if (tab === 'user') {
      params.role = 'USER';
    }

    if (statusFilter !== 'all') {
      params.status = statusFilter === 'suspend' ? 'SUSPENDED' : statusFilter.toUpperCase();
    }

    if (subscriptionFilter !== 'all') {
      params.subscription = subscriptionFilter.toUpperCase();
    }

    dispatch(fetchUsersList(params));
  }, [dispatch, page, tab, statusFilter, subscriptionFilter]);

  // Format API users into table row objects
  const tableRows = useMemo(() => {
    if (!users || !users.length) return [];

    let filteredUsers = users;

    if (tab === 'supplier') {
      filteredUsers = users.filter(
        (u) =>
          u.role === 'SUPPLIER' ||
          u.role === 'supplier' ||
          u.profileType === 'SUPPLIER' ||
          u.profileType === 'supplier'
      );
    } else if (tab === 'user') {
      filteredUsers = users.filter(
        (u) =>
          u.role === 'USER' ||
          u.role === 'user' ||
          u.profileType === 'LABORATORY'
      );
    }

    return filteredUsers.map((u) => {
      const rawName =
        u.profile?.name ||
        [u.profile?.firstName, u.profile?.lastName].filter(Boolean).join(' ') ||
        u.email;

      const rawPlan = u.subscription?.plan || u.subscription?.status || 'Free';
      const planCapitalized =
        rawPlan.charAt(0).toUpperCase() + rawPlan.slice(1).toLowerCase();

      const rawStatus = u.status === 'SUSPENDED' ? 'Suspend' : 'Active';

      return {
        id: u.id,
        userName: rawName,
        userType: u.profileType || u.profile?.title || 'Laboratory',
        company: u.profile?.company || u.profile?.country || 'N/A',
        role: u.role || 'USER',
        subscription: planCapitalized,
        joinedDate: u.createdAt
          ? new Date(u.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : 'N/A',
        status: rawStatus,
        rawUser: u,
      };
    });
  }, [users, tab]);


  const handleTabChange = (nextTab) => {
    setTab(nextTab);
    setPage(1);
    setSubscriptionFilter('all');
    setStatusFilter('all');
  };

  const handleStatusChange = async (userId, newStatus, reason = '') => {
    const apiStatus = newStatus === 'Suspend' ? 'SUSPENDED' : 'ACTIVE';
    const resultAction = await dispatch(
      updateUserStatus({ userId, status: apiStatus, reason })
    );

    if (updateUserStatus.fulfilled.match(resultAction)) {
      toast.success(
        newStatus === 'Suspend' ? 'User suspended successfully' : 'User activated successfully'
      );
      // Refresh active view
      dispatch(fetchUsersList({ page, pageSize: PAGE_SIZE, role: tab === 'all' ? undefined : tab.toUpperCase() }));
    } else {
      toast.error(resultAction.payload || 'Failed to update user status');
    }
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
      onClick: () => handleStatusChange(row.id, 'Active'),
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
      <PanelPageHeader
        title="Users & Subscriptions"
        subtitle={`${usersMeta.total || 0} Total Customers`}
      />

      <DataTable
        showTabs
        tabs={DEMO_TABLE_TABS}
        activeTab={tab}
        onTabChange={handleTabChange}
        showFilters
        filterLabel=""
        filters={filters}
        columns={userColumns}
        data={tableRows}
        loading={usersLoading}
        showActions
        getActions={rowActions}
        showPagination
        pagination={{
          page: usersMeta.page || page,
          pageSize: usersMeta.pageSize || PAGE_SIZE,
          total: tab === 'all' ? (usersMeta.total || tableRows.length) : tableRows.length,
          onPageChange: setPage,
        }}

      />

      <SuspendUserModal
        open={Boolean(suspendTarget)}
        userName={suspendTarget?.userName}
        onClose={() => setSuspendTarget(null)}
        onConfirm={(reason) => {
          if (suspendTarget) {
            handleStatusChange(suspendTarget.id, 'Suspend', reason);
            setSuspendTarget(null);
          }
        }}
      />
    </PanelPage>
  );
};

export default AdminUsersView;
