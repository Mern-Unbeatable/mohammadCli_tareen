import { MessageCircle, Share2 } from 'lucide-react';
import { getReaction } from '@/modules/user/data/reactions';
import ReactionButton from './ReactionButton';

export const PostStats = ({ stats, reactionId, reactionCounts }) => {
  const selected = getReaction(reactionId);
  const reactionLabel = selected
    ? ` · You reacted with ${selected.emoji}`
    : '';

  const topEmojis = reactionCounts
    ? Object.entries(reactionCounts)
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id]) => getReaction(id)?.emoji)
        .filter(Boolean)
    : [];

  return (
    <div className="flex items-center justify-between border-b border-[#E4E7EC] px-4 py-2 text-[12px] text-[#64748B]">
      <span className="inline-flex items-center gap-1.5">
        {topEmojis.length ? (
          <span className="inline-flex items-center" aria-hidden>
            {topEmojis.map((emoji) => (
              <span key={emoji} className="-ml-1 first:ml-0 text-[13px]">
                {emoji}
              </span>
            ))}
          </span>
        ) : null}
        <span>
          {stats.reactions} reactions · {stats.comments} comments{reactionLabel}
        </span>
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
  commentCount = 0,
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
      {commentCount > 0 ? (
        <span className="tabular-nums">({commentCount})</span>
      ) : null}
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
