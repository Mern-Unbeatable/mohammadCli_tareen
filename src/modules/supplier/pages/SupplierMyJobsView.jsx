import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import JobCard from "@/components/data-display/JobCard/JobCard";
import RecruitmentToolbar from "@/modules/user/components/recruitment/RecruitmentToolbar";
import SupplierRecruitmentActions from "@/modules/supplier/components/SupplierRecruitmentActions";
import {
  fetchSupplierJobs,
  removeSupplierJob,
  clearRecruitmentError,
  levelToApi,
  toJobCardModel,
} from "@/features/supplier/recruitment";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";

const JOB_BASE = "/supplier/recruitment";

const buildMyJobsQuery = ({ query, level }) => {
  const params = {
    page: 1,
    pageSize: 50,
    sort: "desc",
    mine: true,
  };
  const q = query?.trim();
  if (q) params.search = q;
  const levelApi = levelToApi(level);
  if (levelApi) params.level = levelApi;
  return params;
};

const SupplierMyJobsView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, jobsLoading, deleting, error } = useSelector(
    (state) => state.supplierRecruitment,
  );

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [level, setLevel] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    dispatch(clearRecruitmentError());
    dispatch(
      fetchSupplierJobs(
        buildMyJobsQuery({ query: debouncedQuery, level }),
      ),
    );
  }, [dispatch, debouncedQuery, level]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filtered = useMemo(
    () => (jobs || []).map(toJobCardModel).filter(Boolean),
    [jobs],
  );

  const handleDelete = async (id) => {
    const result = await dispatch(removeSupplierJob(id));
    if (removeSupplierJob.fulfilled.match(result)) {
      toast.success("Job deleted");
      return;
    }
    toast.error(result.payload || "Failed to delete job");
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

      {jobsLoading && !filtered.length ? (
        <div className="flex h-40 items-center justify-center rounded-xl bg-white shadow-sm">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
          <span className="text-[14px] text-[#64748B]">Loading your jobs…</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                variant="mine"
                highlighted={index === 0}
                detailHref={`${JOB_BASE}/${job.id}`}
                onDelete={deleting ? undefined : handleDelete}
                onEdit={() => navigate(`${JOB_BASE}/${job.id}`)}
              />
            ))
          ) : (
            <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
              <p className="text-[15px] font-semibold text-deep-blue">
                No job posts yet
              </p>
              <p className="mt-2 text-[14px] text-[#64748B]">
                Post your first role to reach qualified laboratory professionals.
              </p>
            </div>
          )}
        </div>
      )}
    </PanelPage>
  );
};

export default SupplierMyJobsView;
