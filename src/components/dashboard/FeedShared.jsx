import { FileText, MessageCircle, Share2, ThumbsUp } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { currentUser } from '../../data/dashboard';

export const PostStats = ({ stats }) => (
  <div className="flex items-center justify-between border-b border-[#E4E7EC] px-4 py-2 text-[12px] text-[#64748B]">
    <span>
      {stats.reactions} reactions · {stats.comments} comments
    </span>
    <span>{stats.shares} shares</span>
  </div>
);

export const PostActions = () => (
  <div className="grid grid-cols-3 divide-x divide-[#E4E7EC]">
    {[
      { label: 'Like', icon: ThumbsUp },
      { label: 'Comment', icon: MessageCircle },
      { label: 'Share', icon: Share2 },
    ].map(({ label, icon: Icon }) => (
      <button
        key={label}
        type="button"
        className="flex items-center justify-center gap-2 py-3 text-[13px] font-medium text-[#475467] transition-colors hover:bg-[#F9FAFB]"
      >
        <Icon className="h-4 w-4" />
        {label}
      </button>
    ))}
  </div>
);

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
