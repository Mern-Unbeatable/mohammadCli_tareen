import { Link, useParams } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import JobDetailCard from '@/components/data-display/JobDetailCard/JobDetailCard';
import { getJobById } from '@/modules/user/data/recruitment';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import NotFound from '@/shared/pages/NotFound';

const SupplierJobDetailView = () => {
  const { jobId } = useParams();
  const job = getJobById(jobId);

  if (!job) return <NotFound />;

  return (
    <PanelPage className="max-w-[760px]">
      <Link
        to="/supplier/recruitment"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <JobDetailCard job={job} applyHref={job.applyLink} />
    </PanelPage>
  );
};

export default SupplierJobDetailView;
