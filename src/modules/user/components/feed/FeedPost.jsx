import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MoreHorizontal, Pencil, Repeat2, Tag, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import ExpandableText from '@/components/common/ExpandableText/ExpandableText';
import { AttachmentCard, PostStats, PostActions } from './FeedShared';
import PostComments from './PostComments';
import SharePostModal from './SharePostModal';
import RepostedPostCard from './RepostedPostCard';
import PostImageGallery from './PostImageGallery';
import {
  addComment,
  likeComment,
  reactToPost,
  repostPost,
  undoRepost,
} from '@/features/user/feed';
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

const OwnerPostMenu = ({ post, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full p-1.5 text-[#98A2B3] hover:bg-[#F9FAFB] hover:text-[#64748B]"
        aria-label="Post options"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+4px)] z-[20] w-[160px] overflow-hidden rounded-lg border border-[#E4E7EC] bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
        >
          {onEdit ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onEdit(post);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-semibold text-deep-blue transition-colors hover:bg-[#F9FAFB]"
            >
              <Pencil className="h-4 w-4" strokeWidth={1.8} />
              Edit post
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onDelete(post);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-semibold text-[#DC2626] transition-colors hover:bg-[#FEF2F2]"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.8} />
              Delete post
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

const PostHeader = ({ post, onReport, onEdit, onDelete, isOwner }) => {
  const badge = badgeByType[post.type];
  const meta = [post.author.meta, post.edited ? 'Edited' : null]
    .filter(Boolean)
    .join(' · ');

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
          {post.isRepost && (
            <span className="inline-flex items-center gap-1 text-[13px] text-[#64748B]">
              <Repeat2 className="h-3.5 w-3.5" />
              shared a post
            </span>
          )}
          {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
          {post.type === 'promo' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-pink-secondary px-2 py-0.5 text-[10px] font-semibold text-pink-light">
              <Tag className="h-3 w-3" />
              Promotional Offer
            </span>
          )}
        </div>
        <p className="text-[12px] text-[#64748B]">{post.author.subtitle}</p>
        <p className="text-[12px] text-[#98A2B3]">{meta}</p>
      </div>
      {isOwner && (onEdit || onDelete) ? (
        <OwnerPostMenu post={post} onEdit={onEdit} onDelete={onDelete} />
      ) : (
        <button
          type="button"
          onClick={() => onReport?.(post)}
          className="rounded-full p-1.5 text-[#98A2B3] hover:bg-[#F9FAFB] hover:text-[#64748B]"
          aria-label="Report post"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      )}
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

const FeedPost = ({ post, onReport, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userProfile);
  const likingCommentId = useSelector(
    (state) => state.userFeed.likingCommentId,
  );
  const reposting = useSelector(
    (state) => state.userFeed.repostingId === post.id,
  );
  const profileUser = useMemo(() => toProfilePageUser(user), [user]);
  const isOwner = Boolean(
    profileUser?.id && post.author?.id && profileUser.id === post.author.id,
  );
  const originalAuthorId = post.isRepost
    ? post.sharedPost?.author?.id
    : post.author?.id;
  const repostUnavailableReason =
    post.isRepost && !post.sharedPost
      ? 'The original post is no longer available'
      : profileUser?.id && originalAuthorId === profileUser.id
        ? "You can't repost your own post"
        : null;

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reactionId, setReactionId] = useState(
    post.myReaction ? String(post.myReaction).toLowerCase() : null,
  );
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

  const handleAddComment = async (text, parentCommentId) => {
    const result = await dispatch(
      addComment({
        postId: post.id,
        body: text,
        parentCommentId: parentCommentId || undefined,
      }),
    );
    if (addComment.fulfilled.match(result)) {
      return true;
    }

    toast.error(result.payload || "Failed to add comment");
    return false;
  };

  const findComment = (list, commentId) => {
    for (const item of list || []) {
      if (item.id === commentId) return item;
      const nested = findComment(item.replies, commentId);
      if (nested) return nested;
    }
    return null;
  };

  const mapComments = (list, commentId, updater) =>
    (list || []).map((item) => {
      if (item.id === commentId) return updater(item);
      if (!Array.isArray(item.replies) || item.replies.length === 0) return item;
      return {
        ...item,
        replies: mapComments(item.replies, commentId, updater),
      };
    });

  const handleLikeComment = async (commentId) => {
    const previous = findComment(comments, commentId);
    if (!previous) return;

    const nextLiked = !previous.liked;
    setComments((prev) =>
      mapComments(prev, commentId, (c) => ({
        ...c,
        liked: nextLiked,
        likeCount: Math.max(0, (c.likeCount ?? 0) + (nextLiked ? 1 : -1)),
      })),
    );

    const result = await dispatch(
      likeComment({ postId: post.id, commentId }),
    );
    if (likeComment.rejected.match(result)) {
      setComments((prev) => mapComments(prev, commentId, () => previous));
      toast.error(result.payload || 'Failed to like comment');
      return;
    }

    const data = result.payload?.data;
    if (data) {
      setComments((prev) =>
        mapComments(prev, commentId, (c) => ({
          ...c,
          liked: Boolean(data.liked ?? data.isLiked),
          likeCount: data.likeCount ?? c.likeCount ?? 0,
        })),
      );
    }
  };

  const handleShare = () => {
    setShareOpen(true);
  };

  const handleRepost = async (caption) => {
    const result = await dispatch(
      repostPost({ postId: post.id, content: caption }),
    );
    if (repostPost.fulfilled.match(result)) {
      toast.success('Reposted to your feed');
      return true;
    }
    toast.error(result.payload || 'Failed to repost');
    return false;
  };

  const handleUndoRepost = async () => {
    const result = await dispatch(undoRepost({ postId: post.id }));
    if (undoRepost.fulfilled.match(result)) {
      toast.success('Repost removed');
      return true;
    }
    toast.error(result.payload || 'Failed to undo repost');
    return false;
  };

  const toggleComments = () => setCommentsOpen((prev) => !prev);

  return (
    <>
      <Card>
        <PostHeader
          post={post}
          onReport={onReport}
          onEdit={onEdit}
          onDelete={onDelete}
          isOwner={isOwner}
        />

        {post.isRepost ? (
          <div className="p-4">
            {post.content ? (
              <ExpandableText
                text={post.content}
                lines={5}
                className="text-base leading-relaxed text-[#475467]"
              />
            ) : null}
            {post.attachment && <AttachmentCard attachment={post.attachment} />}
            <PostImageGallery images={post.images} image={post.image} />
            <RepostedPostCard post={post.sharedPost} />
          </div>
        ) : (
          <div className="p-4">
            {post.title && (
              <h4 className="mb-2 text-[16px] font-bold text-deep-blue">{post.title}</h4>
            )}
            <ExpandableText
              text={post.content}
              lines={5}
              className="text-base leading-relaxed text-[#475467]"
            />

            {post.attachment && <AttachmentCard attachment={post.attachment} />}

            {post.type !== 'promo' && (
              <PostImageGallery images={post.images} image={post.image} />
            )}

            {post.type === 'promo' && post.image && (
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
        )}

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
          shared={post.sharedByMe}
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

      {shareOpen ? (
        <SharePostModal
          open
          post={post}
          onClose={() => setShareOpen(false)}
          shared={post.sharedByMe}
          reposting={reposting}
          repostUnavailableReason={repostUnavailableReason}
          onRepost={handleRepost}
          onUndoRepost={handleUndoRepost}
        />
      ) : null}
    </>
  );
};

export default memo(FeedPost);
