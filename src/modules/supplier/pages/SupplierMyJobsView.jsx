import { useMemo, useState } from 'react';
import JobCard from '@/components/data-display/JobCard/JobCard';
import RecruitmentToolbar from '@/modules/user/components/recruitment/RecruitmentToolbar';
import SupplierRecruitmentActions from '@/modules/supplier/components/SupplierRecruitmentActions';
import { filterJobs, getMyJobs } from '@/modules/user/data/recruitment';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';

const JOB_BASE = '/supplier/recruitment';

const SupplierMyJobsView = () => {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('All');
  const [myJobs, setMyJobs] = useState(getMyJobs);

  const filtered = useMemo(
    () => filterJobs(myJobs, query, level),
    [myJobs, query, level]
  );

  const handleDelete = (id) => {
    setMyJobs((prev) => prev.filter((job) => job.id !== id));
  };

  return (
    <PanelPage>
      <PanelPageHeader
        title="Recruitment"
        subtitle="Find your next laboratory-industry role or discover qualified candidates."
        action={<SupplierRecruitmentActions activeView="mine" />}
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
        {filtered.length > 0 ? (
          filtered.map((job, index) => (
            <JobCard
              key={job.id}
              job={job}
              variant="mine"
              highlighted={index === 0}
              detailHref={`${JOB_BASE}/${job.id}`}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
            <p className="text-[15px] font-semibold text-deep-blue">No job posts yet</p>
            <p className="mt-2 text-[14px] text-[#64748B]">
              Post your first role to reach qualified laboratory professionals.
            </p>
          </div>
        )}
      </div>
    </PanelPage>
  );
};

export default SupplierMyJobsView;
