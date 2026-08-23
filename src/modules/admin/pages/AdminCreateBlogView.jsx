import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Upload } from 'lucide-react';
import Card from '@/components/ui/Card';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import { panelPrimaryBtn, panelSecondaryBtn } from '@/shared/layout/PanelLayout/panelPageTheme';

const labelClass = 'mb-1.5 block text-[14px] font-medium text-deep-blue';
const inputClass =
  'w-full rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none transition-colors placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/15';

const AdminCreateBlogView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editing = location.state?.article;

  const [headline, setHeadline] = useState(editing?.title ?? '');
  const [description, setDescription] = useState(editing?.excerpt ?? '');

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/admin/blogs');
  };

  return (
    <PanelPage className="mx-auto max-w-[720px]">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">Blogs</p>

      <PanelPageHeader
        title={editing ? 'Edit Blog Post' : 'Create New Blog Post'}
        subtitle="Fill in the details to publish or save as draft."
      />

      <Card className="p-4 sm:p-5">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="blog-headline" className={labelClass}>
              Headline
            </label>
            <input
              id="blog-headline"
              type="text"
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              placeholder="Write title"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="blog-description" className={labelClass}>
              Description
            </label>
            <textarea
              id="blog-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write description about this blog"
              rows={5}
              className={`${inputClass} resize-none`}
              required
            />
          </div>

          <div>
            <p className={labelClass}>Upload Photo</p>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-8 text-center transition-colors hover:border-primary hover:bg-secondary/40 sm:px-6 sm:py-10">
              <Upload className="mb-3 h-8 w-8 text-[#98A2B3]" />
              <span className="text-[14px] font-semibold text-deep-blue">Upload Profile Photo</span>
              <span className="mt-1 text-[12px] text-[#64748B]">JPG, PNG or WebP · 400×400px</span>
              <input type="file" accept="image/*" className="sr-only" />
            </label>
          </div>

          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
            <button type="submit" className={`${panelPrimaryBtn} w-full sm:w-auto`}>
              Upload
            </button>
            <Link to="/admin/blogs" className={`${panelSecondaryBtn} w-full sm:w-auto`}>
              Cancel
            </Link>
          </div>
        </form>
      </Card>
    </PanelPage>
  );
};

export default AdminCreateBlogView;
