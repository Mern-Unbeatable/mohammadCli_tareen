import { Link, useParams } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import Container from '@/components/ui/Container';
import JobDetailCard from '@/components/data-display/JobDetailCard/JobDetailCard';
import { getJobById } from '@/modules/user/data/recruitment';
import NotFound from '@/shared/pages/NotFound';

const JobDetailView = () => {
  const { jobId } = useParams();
  const job = getJobById(jobId);

  if (!job) return <NotFound />;

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container className="max-w-[760px]">
        <Link
          to="/recruitment"
          className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        <JobDetailCard job={job} applyHref={job.applyLink} />
      </Container>
    </main>
  );
};

export default JobDetailView;
