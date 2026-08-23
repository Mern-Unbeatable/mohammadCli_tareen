import { useMemo, useState } from 'react';
import Pagination from '@/components/common/Pagination/Pagination';
import JobCard from '@/components/data-display/JobCard/JobCard';
import RecruitmentToolbar from '@/modules/user/components/recruitment/RecruitmentToolbar';
import SupplierRecruitmentActions from '@/modules/supplier/components/SupplierRecruitmentActions';
import { filterJobs, jobs } from '@/modules/user/data/recruitment';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import { LIST_PAGE_SIZE, usePaginatedList } from '@/shared/hooks/usePaginatedList';

const JOB_BASE = '/supplier/recruitment';

const SupplierRecruitmentView = () => {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('All');

  const filtered = useMemo(() => filterJobs(jobs, query, level), [query, level]);
  const { page, setPage, totalPages, pageItems } = usePaginatedList(filtered, LIST_PAGE_SIZE, [
    query,
    level,
  ]);

  return (
    <PanelPage>
      <PanelPageHeader
        title="Recruitment"
        subtitle="Find your next laboratory-industry role or discover qualified candidates."
        action={<SupplierRecruitmentActions activeView="browse" />}
      />

      <RecruitmentToolbar
        query={query}
        onQueryChange={setQuery}
        level={level}
        onLevelChange={setLevel}
        basePath={JOB_BASE}
        showTitle={false}
        showActions={false}
      />

      <div className="space-y-4">
        {pageItems.map((job, index) => (
          <JobCard
            key={job.id}
            job={job}
            highlighted={index < 4 && page === 1}
            detailHref={`${JOB_BASE}/${job.id}`}
          />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-2" />
    </PanelPage>
  );
};

export default SupplierRecruitmentView;
