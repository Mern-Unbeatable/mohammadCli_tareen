import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import JobCard from '@/components/data-display/JobCard/JobCard';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import { filterJobs, jobs, levels } from '@/modules/user/data/recruitment';

const timeFilters = ['All Time', 'Last 7 days', 'Last 30 days', 'Last 90 days'];

const FilterSelect = ({ label, value, options, onChange }) => (
  <label className="relative inline-flex w-full min-w-0 sm:min-w-[140px] sm:w-auto">
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-[#E4E7EC] bg-white py-2 pl-3 pr-9 text-sm text-deep-blue outline-none transition-colors hover:border-[#D0D5DD] focus:border-primary"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
  </label>
);

const AdminRecruitmentView = () => {
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [level, setLevel] = useState('All');

  const filtered = useMemo(() => filterJobs(jobs, '', level), [level]);

  return (
    <PanelPage>
      <PanelPageHeader
        title="Recruitment"
        subtitle="Manage job listings, approvals and applications."
        action={
          <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
            <FilterSelect
              label="Time filter"
              value={timeFilter}
              options={timeFilters}
              onChange={setTimeFilter}
            />
            <FilterSelect label="Level filter" value={level} options={levels} onChange={setLevel} />
          </div>
        }
      />

      <div className="space-y-3">
        {filtered.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            variant="admin"
            detailHref={`/admin/recruitment/${job.id}`}
            onDelete={() => {}}
          />
        ))}
      </div>
    </PanelPage>
  );
};

export default AdminRecruitmentView;
