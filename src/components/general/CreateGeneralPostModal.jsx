import { useEffect, useState } from 'react';
import { FileText, Newspaper, Paperclip, X } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { generalAuthor } from '../../data/general';

const postTypes = [
  {
    id: 'news',
    label: 'News',
    sublabel: 'Industry article',
    icon: Newspaper,
    activeBorder: 'border-[#E67E22] bg-[#FEF3E8]/40',
    activeText: 'text-[#E67E22]',
  },
  {
    id: 'document',
    label: 'Document',
    sublabel: 'SOP, protocol, paper',
    icon: FileText,
    activeBorder: 'border-[#E67E22] bg-[#FEF3E8]/40',
    activeText: 'text-[#E67E22]',
  },
];

const fieldClass =
  'w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10';

const labelClass = 'mb-1.5 block text-[13px] font-semibold text-deep-blue';

const UploadZone = ({ label, hint, required = false }) => (
  <div>
    <p className={labelClass}>
      {label}
      {required && <span className="text-pink-light"> *</span>}
    </p>
    <button
      type="button"
      className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-8 text-center transition-colors hover:border-primary hover:bg-secondary/30"
    >
      <Paperclip className="h-5 w-5 text-[#98A2B3]" />
      <span className="text-[13px] font-medium text-primary">Click to upload a file</span>
      <span className="text-[11px] text-[#98A2B3]">{hint}</span>
    </button>
  </div>
);

const CreateGeneralPostModal = ({ open, onClose }) => {
  const [postType, setPostType] = useState('news');
  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [source, setSource] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-start sm:overflow-y-auto sm:p-4 sm:pt-[6vh]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-[560px] flex-col rounded-t-2xl bg-white sm:max-h-none sm:rounded-xl"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-[#E4E7EC] px-5 py-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={generalAuthor.avatar}
              alt={generalAuthor.name}
              initials={generalAuthor.initials}
              size="md"
            />
            <div>
              <p className="text-[14px] font-semibold text-deep-blue">{generalAuthor.name}</p>
              <p className="text-[12px] text-[#64748B]">{generalAuthor.company}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#98A2B3]">
            Post type
          </p>
          <div className="mb-5 grid grid-cols-2 gap-3">
            {postTypes.map(({ id, label, sublabel, icon: Icon, activeBorder, activeText }) => {
              const active = postType === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPostType(id)}
                  className={`rounded-xl border-2 px-3 py-3 text-left transition-colors ${
                    active ? activeBorder : 'border-[#E4E7EC] hover:border-[#D0D5DD]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? activeText : 'text-[#64748B]'}`} />
                  <p className={`mt-2 text-[13px] font-semibold ${active ? activeText : 'text-deep-blue'}`}>
                    {label}
                  </p>
                  <p className="text-[11px] text-[#98A2B3]">{sublabel}</p>
                </button>
              );
            })}
          </div>

          {postType === 'news' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="headline" className={labelClass}>
                  Headline<span className="text-pink-light"> *</span>
                </label>
                <input
                  id="headline"
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. FDA Issues New Draft Guidance on Analytical Procedures"
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="summary" className={labelClass}>
                  Summary / Description<span className="text-pink-light"> *</span>
                </label>
                <textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  placeholder="Write a brief summary of the news article..."
                  className={`${fieldClass} resize-y`}
                  required
                />
              </div>
              <div>
                <label htmlFor="source" className={labelClass}>
                  Source / Publisher <span className="font-normal text-[#98A2B3]">(optional)</span>
                </label>
                <input
                  id="source"
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. EMA, FDA, Nature, LabManager"
                  className={fieldClass}
                />
              </div>
              <UploadZone label="Upload Image" hint="JPEG, PNG — up to 50 MB" required />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="docTitle" className={labelClass}>
                  Document Title<span className="text-pink-light"> *</span>
                </label>
                <input
                  id="docTitle"
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. HPLC Method Validation SOP v2.1"
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className={labelClass}>
                  Description <span className="font-normal text-[#98A2B3]">(optional)</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Briefly describe what this document covers..."
                  className={`${fieldClass} resize-y`}
                />
              </div>
              <UploadZone label="Upload Document" hint="PDF, DOC, XLS, PPT — up to 50 MB" required />
              <UploadZone label="Upload Image" hint="JPEG, PNG — up to 50 MB" required />
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2 border-t border-[#E4E7EC] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#E4E7EC] px-4 py-2 text-[12px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#066BB0]"
            >
              {postType === 'news' ? 'Publish News' : 'Share Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGeneralPostModal;
