import { useMemo, useState } from 'react';
import Pagination from '@/components/common/Pagination/Pagination';
import Container from '@/components/ui/Container';
import JobCard from '@/components/data-display/JobCard/JobCard';
import RecruitmentToolbar from '@/modules/user/components/recruitment/RecruitmentToolbar';
import { filterJobs, jobs } from '@/modules/user/data/recruitment';
import { LIST_PAGE_SIZE, usePaginatedList } from '@/shared/hooks/usePaginatedList';

const RecruitmentView = () => {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('All');

  const filtered = useMemo(() => filterJobs(jobs, query, level), [query, level]);
  const { page, setPage, totalPages, pageItems } = usePaginatedList(filtered, LIST_PAGE_SIZE, [
    query,
    level,
  ]);

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container>
        <RecruitmentToolbar
          query={query}
          onQueryChange={setQuery}
          level={level}
          onLevelChange={setLevel}
          activeView="browse"
        />

        <div className="mt-6 space-y-4">
          {pageItems.map((job, index) => (
            <JobCard key={job.id} job={job} highlighted={index === 0 && page === 1} />
          ))}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-8"
        />
      </Container>
    </main>
  );
};

export default RecruitmentView;
