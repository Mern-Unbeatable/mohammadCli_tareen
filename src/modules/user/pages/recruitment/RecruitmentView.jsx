import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '@/components/common/Pagination/Pagination';
import Container from '@/components/ui/Container';
import JobCard from '@/components/data-display/JobCard/JobCard';
import RecruitmentToolbar from '@/modules/user/components/recruitment/RecruitmentToolbar';
import {
  fetchJobs,
  clearRecruitmentError,
  levelToApi,
  toJobCardModel,
} from '@/features/user/recruitment';
import { LIST_PAGE_SIZE } from '@/shared/hooks/usePaginatedList';

const JOB_BASE = '/recruitment';

const buildJobsQuery = ({ page, query, level }) => {
  const params = {
    page,
    pageSize: LIST_PAGE_SIZE,
    sort: 'desc',
  };
  const q = query?.trim();
  if (q) params.search = q;
  const levelApi = levelToApi(level);
  if (levelApi) params.level = levelApi;
  return params;
};

const RecruitmentView = () => {
  const dispatch = useDispatch();
  const { jobs, jobsMeta, jobsLoading, error } = useSelector(
    (state) => state.userRecruitment,
  );

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [level, setLevel] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    dispatch(clearRecruitmentError());
    dispatch(
      fetchJobs(buildJobsQuery({ page, query: debouncedQuery, level })),
    );
  }, [dispatch, page, debouncedQuery, level]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const pageItems = useMemo(
    () => (jobs || []).map(toJobCardModel).filter(Boolean),
    [jobs],
  );

  const totalPages = Math.max(1, jobsMeta?.totalPages || 1);

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container>
        <RecruitmentToolbar
          query={query}
          onQueryChange={setQuery}
          level={level}
          onLevelChange={(value) => {
            setLevel(value);
            setPage(1);
          }}
          activeView="browse"
          basePath={JOB_BASE}
        />

        <div className="mt-6 space-y-4">
          {jobsLoading && !pageItems.length ? (
            <div className="flex h-40 items-center justify-center rounded-xl bg-white shadow-sm">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
              <span className="text-[14px] text-[#64748B]">Loading jobs…</span>
            </div>
          ) : pageItems.length ? (
            pageItems.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                highlighted={index === 0 && page === 1}
                detailHref={`${JOB_BASE}/${job.id}`}
              />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-14 text-center">
              <p className="text-[15px] font-semibold text-deep-blue">
                No jobs found
              </p>
              <p className="mt-2 text-[14px] text-[#64748B]">
                Try a different search or level filter.
              </p>
            </div>
          )}
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
