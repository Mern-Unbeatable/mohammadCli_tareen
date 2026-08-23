import { useMemo, useState } from 'react';
import Container from '@/components/ui/Container';
import JobCard from '@/components/data-display/JobCard/JobCard';
import RecruitmentToolbar from '@/modules/user/components/recruitment/RecruitmentToolbar';
import { filterJobs, getMyJobs } from '@/modules/user/data/recruitment';

const MyJobsView = () => {
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
    <main className="pt-6 pb-8 sm:pt-8">
      <Container>
        <RecruitmentToolbar
          query={query}
          onQueryChange={setQuery}
          level={level}
          onLevelChange={setLevel}
          activeView="mine"
        />

        <div className="mt-6 space-y-4">
          {filtered.length > 0 ? (
            filtered.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                variant="mine"
                highlighted={index === 0}
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
      </Container>
    </main>
  );
};

export default MyJobsView;
