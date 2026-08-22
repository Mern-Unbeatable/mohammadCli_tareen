import { useState } from 'react';
import { X } from 'lucide-react';
import { reportReasons } from '../../data/dashboard';

const ReportPostModal = ({ open, post, onClose }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
    setReason('');
    setDetails('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-[8vh]">
      <div
        className="w-full max-w-[560px] rounded-xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-post-title"
      >
        <div className="flex items-center justify-between border-b border-[#E4E7EC] px-5 py-4">
          <h2 id="report-post-title" className="text-[18px] font-bold text-deep-blue">
            Report this post
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#64748B] hover:bg-[#F9FAFB]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4">
          {post && (
            <p className="mb-4 text-[13px] text-[#64748B]">
              Reporting post by{' '}
              <span className="font-semibold text-deep-blue">{post.author.name}</span>
            </p>
          )}

          <p className="mb-3 text-[14px] font-semibold text-deep-blue">
            Select your reporting reason
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {reportReasons.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setReason(item)}
                className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  reason === item
                    ? 'border-primary bg-secondary text-primary'
                    : 'border-[#E4E7EC] text-[#475467] hover:border-primary/40'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            placeholder="Write something why you report this post"
            className="w-full resize-none rounded-lg border border-[#E4E7EC] px-4 py-3 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
          />

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={!reason}
              className="rounded-md bg-primary px-6 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportPostModal;
