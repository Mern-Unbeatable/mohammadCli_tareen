import { useEffect, useState } from 'react';
import { X, Image, FileText } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { currentUser } from '../../data/dashboard';

const postTypes = [
  { id: 'post', label: 'Create Post' },
  { id: 'question', label: 'Ask a Question' },
  { id: 'information', label: 'Share Information' },
];

const CreatePostModal = ({ open, onClose }) => {
  const [postType, setPostType] = useState('post');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-start sm:overflow-y-auto sm:p-4 sm:pt-[8vh]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-[560px] flex-col rounded-t-2xl bg-white shadow-xl sm:max-h-none sm:rounded-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-post-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4E7EC] px-4 py-3.5 sm:px-5 sm:py-4">
          <h2 id="create-post-title" className="text-[17px] font-bold text-deep-blue sm:text-[18px]">
            Create Post
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="mb-4 flex items-center gap-3">
            <Avatar
              src={currentUser.avatar}
              alt={currentUser.name}
              initials={currentUser.initials}
              size="md"
            />
            <p className="text-[13px] text-[#64748B]">
              Posting as{' '}
              <span className="font-semibold text-deep-blue">{currentUser.name}</span> ·{' '}
              {currentUser.company}
            </p>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {postTypes.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setPostType(id)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors sm:px-3.5 sm:text-[12px] ${
                  postType === id
                    ? 'border-primary bg-secondary text-primary'
                    : 'border-[#E4E7EC] text-[#475467] hover:border-primary/40'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Write something useful for the laboratory community..."
            className="w-full resize-none rounded-lg border border-[#E4E7EC] px-3 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 sm:px-4 sm:py-3"
          />

          <div className="mt-3 rounded-lg bg-[#F9FAFB] px-3 py-5 text-center text-[13px] text-[#98A2B3] sm:px-4 sm:py-6">
            {content.trim()
              ? content
              : 'Nothing written yet — your post will appear here as you type.'}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-[#E4E7EC] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4 sm:pb-4">
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-[#E4E7EC] px-3 py-2 text-[13px] font-medium text-[#475467] hover:bg-[#F9FAFB] sm:flex-none"
            >
              <Image className="h-4 w-4" />
              Image
            </button>
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-[#E4E7EC] px-3 py-2 text-[13px] font-medium text-[#475467] hover:bg-[#F9FAFB] sm:flex-none"
            >
              <FileText className="h-4 w-4" />
              Document
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md bg-primary py-2.5 text-[14px] font-semibold text-white hover:opacity-90 sm:w-auto sm:px-6"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
