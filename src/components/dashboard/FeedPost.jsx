import { memo, useState } from 'react';
import { MoreHorizontal, Tag } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { AttachmentCard, PostStats, PostActions } from './FeedShared';
import PostComments from './PostComments';
import SharePostModal from './SharePostModal';
import { currentUser } from '../../data/dashboard';

const badgeByType = {
  question: { variant: 'question', label: 'Question' },
  information: { variant: 'information', label: 'Information' },
  sponsored: { variant: 'sponsored', label: '• Sponsored' },
  promo: { variant: 'sponsored', label: '• Sponsored' },
};

const PostHeader = ({ post, onReport }) => {
  const badge = badgeByType[post.type];

  return (
    <div className="flex items-start gap-3 p-4 pb-0">
      <Avatar initials={post.author.initials} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[14px] font-bold text-deep-blue">{post.author.name}</h3>
          {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
          {post.type === 'promo' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-pink-secondary px-2 py-0.5 text-[10px] font-semibold text-pink-light">
              <Tag className="h-3 w-3" />
              Promotional Offer
            </span>
          )}
        </div>
        <p className="text-[12px] text-[#64748B]">{post.author.subtitle}</p>
        <p className="text-[12px] text-[#98A2B3]">{post.author.meta}</p>
      </div>
      <button
        type="button"
        onClick={() => onReport(post)}
        className="rounded-md p-1 text-[#98A2B3] hover:bg-[#F9FAFB] hover:text-deep-blue"
        aria-label="Post options"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
    </div>
  );
};

const PromoPricing = ({ post }) => (
  <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
    <div className="flex items-baseline gap-2">
      <span className="text-[28px] font-bold text-green-primary">{post.price}</span>
      {post.originalPrice && (
        <span className="text-[14px] text-[#98A2B3] line-through">{post.originalPrice}</span>
      )}
    </div>
    <div className="text-right">
      {post.discount && (
        <span className="inline-block rounded-md bg-[#FEF3E8] px-2 py-0.5 text-[11px] font-semibold text-[#E67E22]">
          {post.discount}
        </span>
      )}
      {post.validUntil && (
        <p className="mt-1 text-[11px] text-[#64748B]">{post.validUntil}</p>
      )}
    </div>
  </div>
);

const FeedPost = ({ post, onReport }) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reactionId, setReactionId] = useState(null);
  const [shared, setShared] = useState(false);
  const [stats, setStats] = useState(post.stats);
  const [comments, setComments] = useState(post.comments ?? []);

  const handleReact = (id) => {
    setReactionId(id);
    setStats((prev) => ({
      ...prev,
      reactions: id && !reactionId ? prev.reactions + 1 : !id && reactionId ? prev.reactions - 1 : prev.reactions,
    }));
  };

  const handleAddComment = (text) => {
    setComments((prev) => [
      {
        id: `c-${Date.now()}`,
        author: {
          initials: currentUser.initials,
          name: currentUser.name,
          subtitle: `${currentUser.title} · ${currentUser.company}`,
          avatar: currentUser.avatar,
        },
        content: text,
        time: 'Just now',
        replies: 0,
        liked: false,
      },
      ...prev,
    ]);
    setStats((prev) => ({ ...prev, comments: prev.comments + 1 }));
  };

  const handleLikeComment = (commentId) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, liked: !c.liked } : c
      )
    );
  };

  const handleShare = () => {
    setShareOpen(true);
  };

  const handleShareComplete = () => {
    if (!shared) {
      setStats((prev) => ({ ...prev, shares: prev.shares + 1 }));
    }
    setShared(true);
  };

  const toggleComments = () => setCommentsOpen((prev) => !prev);

  return (
    <>
      <Card>
        <PostHeader post={post} onReport={onReport} />

        <div className="p-4">
          {post.title && (
            <h4 className="mb-2 text-[16px] font-bold text-deep-blue">{post.title}</h4>
          )}
          <p className="text-base leading-relaxed text-[#475467]">{post.content}</p>

          {post.attachment && <AttachmentCard attachment={post.attachment} />}

          {post.image && (
            <div className="relative mt-3 overflow-hidden rounded-lg">
              <img
                src={post.image}
                alt=""
                className="aspect-[16/9] w-full object-cover"
                loading="lazy"
              />
              {post.discount && post.type === 'promo' && (
                <>
                  <span className="absolute left-3 top-3 rounded-md bg-[#E67E22] px-2 py-1 text-[11px] font-bold text-white">
                    {post.discount}
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-md bg-[#E67E22] px-2 py-1 text-[11px] font-bold text-white">
                    Ends in 29 days
                  </span>
                </>
              )}
            </div>
          )}

          {post.type === 'sponsored' && post.price && (
            <p className="mt-3 text-[22px] font-bold text-green-primary">{post.price}</p>
          )}

          {post.type === 'promo' && <PromoPricing post={post} />}

          {post.cta && (
            <button
              type="button"
              className="mt-4 w-full rounded-md bg-pink-light py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              {post.cta}
            </button>
          )}
        </div>

        <PostStats stats={stats} reactionId={reactionId} />
        <PostActions
          reactionId={reactionId}
          onReact={handleReact}
          commentsOpen={commentsOpen}
          onToggleComments={toggleComments}
          onShare={handleShare}
          shared={shared}
        />

        {commentsOpen && (
          <PostComments
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
          />
        )}
      </Card>

      <SharePostModal
        open={shareOpen}
        post={post}
        onClose={() => setShareOpen(false)}
        onShare={handleShareComplete}
      />
    </>
  );
};

export default memo(FeedPost);
