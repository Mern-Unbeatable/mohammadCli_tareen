import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import Card from '@/components/ui/Card';
import { employmentTypes, levels } from '@/modules/user/data/recruitment';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';

const fieldClass =
  'w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10';

const labelClass = 'mb-1.5 block text-[13px] font-semibold text-deep-blue';

const SupplierPostJobView = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    company: '',
    applyLink: '',
    location: '',
    salary: '',
    employmentType: employmentTypes[0],
    level: levels[1],
    description: '',
    requirements: '',
  });

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/supplier/recruitment/my-jobs');
  };

  return (
    <PanelPage className="max-w-[760px]">
      <Link
        to="/supplier/recruitment"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <Card>
        <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
          <h1 className="text-[22px] font-bold text-deep-blue sm:text-[24px]">Post a Job</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label htmlFor="title" className={labelClass}>
                Job Title
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={update('title')}
                placeholder="e.g. Quality Control Analyst"
                className={fieldClass}
                required
              />
            </div>
            <div>
              <label htmlFor="company" className={labelClass}>
                Company / Laboratory
              </label>
              <input
                id="company"
                type="text"
                value={form.company}
                onChange={update('company')}
                placeholder="e.g. EuroLab Sciences"
                className={fieldClass}
                required
              />
            </div>
            <div>
              <label htmlFor="applyLink" className={labelClass}>
                Apply Link
              </label>
              <input
                id="applyLink"
                type="url"
                value={form.applyLink}
                onChange={update('applyLink')}
                placeholder="https://www.applyhere.com"
                className={fieldClass}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="location" className={labelClass}>
                Location
              </label>
              <input
                id="location"
                type="text"
                value={form.location}
                onChange={update('location')}
                placeholder="e.g. Brussels, Belgium"
                className={fieldClass}
                required
              />
            </div>
            <div>
              <label htmlFor="salary" className={labelClass}>
                Salary Range
              </label>
              <input
                id="salary"
                type="text"
                value={form.salary}
                onChange={update('salary')}
                placeholder="e.g. €35,000 – €45,000"
                className={fieldClass}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="employmentType" className={labelClass}>
                Employment Type
              </label>
              <select
                id="employmentType"
                value={form.employmentType}
                onChange={update('employmentType')}
                className={fieldClass}
              >
                {employmentTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="level" className={labelClass}>
                Level
              </label>
              <select id="level" value={form.level} onChange={update('level')} className={fieldClass}>
                {levels.slice(1).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Job Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={update('description')}
              rows={4}
              placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
              className={`${fieldClass} resize-y`}
              required
            />
          </div>

          <div>
            <label htmlFor="requirements" className={labelClass}>
              Requirements (one per line)
            </label>
            <textarea
              id="requirements"
              value={form.requirements}
              onChange={update('requirements')}
              rows={4}
              placeholder={'BSc in Chemistry\n3+ years QC experience\nHPLC proficiency'}
              className={`${fieldClass} resize-y`}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0]"
          >
            Publish Job
          </button>
        </form>
      </Card>
    </PanelPage>
  );
};

export default SupplierPostJobView;
