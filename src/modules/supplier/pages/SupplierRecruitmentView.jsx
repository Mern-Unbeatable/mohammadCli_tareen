import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Pagination from "@/components/common/Pagination/Pagination";
import { CardSkeleton } from "@/components/common/Skeleton";
import JobCard from "@/components/data-display/JobCard/JobCard";
import RecruitmentToolbar from "@/modules/user/components/recruitment/RecruitmentToolbar";
import SupplierRecruitmentActions from "@/modules/supplier/components/SupplierRecruitmentActions";
import {
  fetchSupplierJobs,
  clearRecruitmentError,
  levelToApi,
  toJobCardModel,
} from "@/features/supplier/recruitment";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import { LIST_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

const JOB_BASE = "/supplier/recruitment";

const buildJobsQuery = ({ page, query, level }) => {
  const params = {
    page,
    pageSize: LIST_PAGE_SIZE,
    sort: "desc",
  };
  const q = query?.trim();
  if (q) params.search = q;
  const levelApi = levelToApi(level);
  if (levelApi) params.level = levelApi;
  return params;
};

const SupplierRecruitmentView = () => {
  const dispatch = useDispatch();
  const { jobs, jobsMeta, jobsLoading, error } = useSelector(
    (state) => state.supplierRecruitment,
  );

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, level]);

  useEffect(() => {
    dispatch(clearRecruitmentError());
    dispatch(
      fetchSupplierJobs(
        buildJobsQuery({ page, query: debouncedQuery, level }),
      ),
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

      {jobsLoading && !pageItems.length ? (
        <CardSkeleton
          variant="job"
          count={LIST_PAGE_SIZE}
          className="space-y-4"
        />
      ) : pageItems.length ? (
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

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="mt-2"
      />
    </PanelPage>
  );
};

export default SupplierRecruitmentView;
