import { MessageCircle, Share2 } from 'lucide-react';
import ReactionButton from './ReactionButton';

export const PostStats = ({ stats, reactionId }) => {
  const reactionLabel = reactionId ? ' · You reacted' : '';

  return (
    <div className="flex items-center justify-between border-b border-[#E4E7EC] px-4 py-2 text-[12px] text-[#64748B]">
      <span>
        {stats.reactions} reactions · {stats.comments} comments{reactionLabel}
      </span>
      <span>{stats.shares} shares</span>
    </div>
  );
};

export const PostActions = ({
  reactionId,
  onReact,
  commentsOpen,
  onToggleComments,
  onShare,
  shared,
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
      onClick={onShare}
      className={`flex items-center justify-center gap-2 py-3 text-[13px] font-medium transition-colors hover:bg-[#F9FAFB] ${
        shared ? 'text-primary' : 'text-[#475467]'
      }`}
    >
      <Share2 className="h-4 w-4" />
      {shared ? 'Shared' : 'Share'}
    </button>
  </div>
);
