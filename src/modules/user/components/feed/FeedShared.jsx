import { FileText } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { currentUser } from '@/modules/user/data/dashboard';

export { PostStats, PostActions } from './PostActionsBar';

export const AttachmentCard = ({ attachment }) => (
  <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] p-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
      <FileText className="h-5 w-5 text-primary" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-[13px] font-semibold text-deep-blue">{attachment.name}</p>
      <p className="text-[12px] text-[#64748B]">{attachment.meta}</p>
    </div>
    <button
      type="button"
      className="shrink-0 rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
    >
      Download
    </button>
  </div>
);

export const FeedComposer = ({ onCreatePost }) => (
  <div className="rounded-xl border border-[#E4E7EC] bg-white p-4">
    <div className="flex gap-3">
      <Avatar
        src={currentUser.avatar}
        alt={currentUser.name}
        initials={currentUser.initials}
        size="md"
      />
      <button
        type="button"
        onClick={onCreatePost}
        className="flex-1 rounded-full border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-2.5 text-left text-[14px] text-[#98A2B3] transition-colors hover:border-[#D0D5DD] hover:bg-white"
      >
        Share an update with the laboratory community...
      </button>
    </div>
    <div className="mt-3 flex flex-wrap gap-2 border-t border-[#E4E7EC] pt-3">
      {['Create Post', 'Ask a Question', 'Share Information'].map((label) => (
        <button
          key={label}
          type="button"
          onClick={onCreatePost}
          className="rounded-full border border-[#E4E7EC] px-3.5 py-1.5 text-[12px] font-semibold text-[#475467] transition-colors hover:border-primary hover:text-primary"
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);

export const FeedFilters = ({ filters, activeFilter, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {filters.map(({ id, label }) => (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
          activeFilter === id
            ? 'bg-primary text-white'
            : 'border border-[#E4E7EC] bg-white text-[#475467] hover:border-primary/40'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);
