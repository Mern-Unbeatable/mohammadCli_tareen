import { useMemo, useState } from 'react';
import JobCard from '@/components/data-display/JobCard/JobCard';
import RecruitmentToolbar from '@/modules/user/components/recruitment/RecruitmentToolbar';
import SupplierRecruitmentActions from '@/modules/supplier/components/SupplierRecruitmentActions';
import { filterJobs, jobs } from '@/modules/user/data/recruitment';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';

const JOB_BASE = '/supplier/recruitment';

const SupplierRecruitmentView = () => {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('All');

  const filtered = useMemo(() => filterJobs(jobs, query, level), [query, level]);

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
        {filtered.map((job, index) => (
          <JobCard
            key={job.id}
            job={job}
            highlighted={index < 4}
            detailHref={`${JOB_BASE}/${job.id}`}
          />
        ))}
      </div>
    </PanelPage>
  );
};

export default SupplierRecruitmentView;
