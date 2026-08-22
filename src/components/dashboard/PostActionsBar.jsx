import { MessageCircle, Share2 } from 'lucide-react';
import ReactionButton from './ReactionButton';

export const PostStats = ({ stats }) => (
  <div className="flex items-center justify-between border-b border-[#E4E7EC] px-4 py-2 text-[12px] text-[#64748B]">
    <span>
      {stats.reactions} reactions · {stats.comments} comments
    </span>
    <span>{stats.shares} shares</span>
  </div>
);

export const PostActions = ({
  reactionId,
  onReact,
  commentsOpen,
  onToggleComments,
}) => (
  <div className="grid grid-cols-3 divide-x divide-[#E4E7EC]">
    <ReactionButton reactionId={reactionId} onReact={onReact} />

    <button
      type="button"
      onClick={onToggleComments}
      className={`flex items-center justify-center gap-2 py-3 text-[13px] font-medium transition-colors hover:bg-[#F9FAFB] ${
        commentsOpen ? 'text-primary' : 'text-[#475467]'
      }`}
    >
      <MessageCircle className="h-4 w-4" />
      Comment
    </button>

    <button
      type="button"
      className="flex items-center justify-center gap-2 py-3 text-[13px] font-medium text-[#475467] transition-colors hover:bg-[#F9FAFB]"
    >
      <Share2 className="h-4 w-4" />
      Share
    </button>
  </div>
);
