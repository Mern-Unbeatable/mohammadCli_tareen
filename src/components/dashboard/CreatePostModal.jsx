import { useState } from 'react';
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-[8vh]">
      <div
        className="w-full max-w-[560px] rounded-xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-post-title"
      >
        <div className="flex items-center justify-between border-b border-[#E4E7EC] px-5 py-4">
          <h2 id="create-post-title" className="text-[18px] font-bold text-deep-blue">
            Create Post
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

        <div className="px-5 py-4">
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
                className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
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
            className="w-full resize-none rounded-lg border border-[#E4E7EC] px-4 py-3 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
          />

          <div className="mt-3 rounded-lg bg-[#F9FAFB] px-4 py-6 text-center text-[13px] text-[#98A2B3]">
            {content.trim()
              ? content
              : 'Nothing written yet — your post will appear here as you type.'}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#E4E7EC] px-5 py-4">
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-[#E4E7EC] px-3 py-2 text-[13px] font-medium text-[#475467] hover:bg-[#F9FAFB]"
            >
              <Image className="h-4 w-4" />
              Image
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-[#E4E7EC] px-3 py-2 text-[13px] font-medium text-[#475467] hover:bg-[#F9FAFB]"
            >
              <FileText className="h-4 w-4" />
              Document
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-primary px-6 py-2.5 text-[14px] font-semibold text-white hover:opacity-90"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
