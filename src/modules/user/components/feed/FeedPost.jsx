import { memo, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MoreHorizontal, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { AttachmentCard, PostStats, PostActions } from './FeedShared';
import PostComments from './PostComments';
import SharePostModal from './SharePostModal';
import { addComment, likeComment, reactToPost } from '@/features/user/feed';
import { toProfilePageUser } from '@/features/user/profile';

const badgeByType = {
  question: { variant: 'question', label: 'Question' },
  information: { variant: 'information', label: 'Information' },
  sponsored: { variant: 'sponsored', label: '• Sponsored' },
  promo: { variant: 'sponsored', label: '• Sponsored' },
};

const REACTION_API = {
  like: "like",
  love: "love",
  haha: "haha",
  wow: "wow",
  sad: "sad",
  angry: "angry",
  // Legacy LinkedIn-style ids from older clients/UI
  celebrate: "haha",
  support: "wow",
  insightful: "sad",
  curious: "angry",
};

const PostHeader = ({ post, onReport }) => {
  const badge = badgeByType[post.type];

  return (
    <div className="flex items-start gap-3 p-4 pb-0">
      <Avatar
        src={post.author.avatar}
        initials={post.author.initials}
        size="md"
      />
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
        className="rounded-full p-1.5 text-[#98A2B3] hover:bg-[#F9FAFB] hover:text-[#64748B]"
        aria-label="Report post"
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
        <span className="inline-flex rounded-md bg-[#FEF3E8] px-2 py-0.5 text-[11px] font-semibold text-[#E67E22]">
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
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userProfile);
  const likingCommentId = useSelector(
    (state) => state.userFeed.likingCommentId,
  );
  const profileUser = useMemo(() => toProfilePageUser(user), [user]);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reactionId, setReactionId] = useState(
    post.myReaction ? String(post.myReaction).toLowerCase() : null,
  );
  const [shared, setShared] = useState(false);
  const [stats, setStats] = useState(post.stats);
  const [reactionCounts, setReactionCounts] = useState(
    post.reactionCounts || null,
  );
  const [comments, setComments] = useState(post.comments ?? []);

  useEffect(() => {
    setStats(post.stats);
    setComments(post.comments ?? []);
    setReactionCounts(post.reactionCounts || null);
    setReactionId(
      post.myReaction ? String(post.myReaction).toLowerCase() : null,
    );
  }, [post]);

  const handleReact = async (id) => {
    const next = reactionId === id ? null : id;
    const prevId = reactionId;
    const prevStats = stats;
    setReactionId(next);
    setStats((prev) => ({
      ...prev,
      reactions:
        next && !prevId
          ? prev.reactions + 1
          : !next && prevId
            ? Math.max(0, prev.reactions - 1)
            : prev.reactions,
    }));

    const apiType = REACTION_API[next || prevId] || "like";
    const result = await dispatch(
      reactToPost({ postId: post.id, type: apiType }),
    );
    if (reactToPost.rejected.match(result)) {
      setReactionId(prevId);
      setStats(prevStats);
      toast.error(result.payload || 'Failed to update reaction');
      return;
    }

    const data = result.payload?.data;
    if (data) {
      const serverReaction =
        data.myReaction !== undefined
          ? data.myReaction
          : data.reacted
            ? data.type
            : null;
      setReactionId(
        serverReaction ? String(serverReaction).toLowerCase() : null,
      );
      if (data.reactionCount != null || data.stats?.reactions != null) {
        setStats((prev) => ({
          ...prev,
          reactions: data.reactionCount ?? data.stats.reactions,
        }));
      }
      if (data.reactionCounts) {
        setReactionCounts(data.reactionCounts);
      }
    }
  };

  const handleAddComment = async (text) => {
    const result = await dispatch(
      addComment({ postId: post.id, body: text }),
    );
    if (addComment.fulfilled.match(result)) {
      return true;
    }

    toast.error(result.payload || "Failed to add comment");
    return false;
  };

  const handleLikeComment = async (commentId) => {
    const previous = comments.find((c) => c.id === commentId);
    if (!previous) return;

    const nextLiked = !previous.liked;
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              liked: nextLiked,
              likeCount: Math.max(0, (c.likeCount ?? 0) + (nextLiked ? 1 : -1)),
            }
          : c,
      ),
    );

    const result = await dispatch(
      likeComment({ postId: post.id, commentId }),
    );
    if (likeComment.rejected.match(result)) {
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? previous : c)),
      );
      toast.error(result.payload || 'Failed to like comment');
      return;
    }

    const data = result.payload?.data;
    if (data) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                liked: Boolean(data.liked ?? data.isLiked),
                likeCount:
                  data.likeCount ??
                  c.likeCount ??
                  0,
              }
            : c,
        ),
      );
    }
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

        <PostStats
          stats={stats}
          reactionId={reactionId}
          reactionCounts={reactionCounts}
        />
        <PostActions
          reactionId={reactionId}
          onReact={handleReact}
          commentsOpen={commentsOpen}
          onToggleComments={toggleComments}
          commentCount={stats?.comments ?? 0}
          onShare={handleShare}
          shared={shared}
        />

        {commentsOpen && (
          <PostComments
            comments={comments}
            currentUser={profileUser}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            likingCommentId={likingCommentId}
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
