import { useMemo, useState } from 'react';
import Container from '../../components/ui/Container';
import JobCard from '../../components/recruitment/JobCard';
import RecruitmentToolbar from '../../components/recruitment/RecruitmentToolbar';
import { filterJobs, jobs } from '../../data/recruitment';

const RecruitmentView = () => {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('All');

  const filtered = useMemo(() => filterJobs(jobs, query, level), [query, level]);

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
          {filtered.map((job, index) => (
            <JobCard key={job.id} job={job} highlighted={index === 0} />
          ))}
        </div>
      </Container>
    </main>
  );
};

export default RecruitmentView;
