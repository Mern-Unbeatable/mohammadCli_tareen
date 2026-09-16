import { useRef, useState } from 'react';
import { Send } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';

const LINE = 'bg-[#D0D5DD]';
const SPINE_X = 18;
const BRANCH_W = 30;

const mentionFromName = (name = '') => {
  const first = String(name).trim().split(/\s+/)[0];
  return first ? `@${first}` : '@Member';
};

const CommentBody = ({ comment, onLike, onReply, liking, showReplyCount, expanded, onToggleReplies }) => {
  const replyCount = comment.replyCount ?? comment.replies?.length ?? 0;

  return (
    <div className="min-w-0 flex-1">
      <div className="rounded-lg bg-[#F3F4F6] px-3 py-2.5">
        <p className="text-[13px] font-semibold text-deep-blue">
          {comment.author?.name}
        </p>
        <p className="text-[11px] text-[#64748B]">{comment.author?.subtitle}</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#475467]">
          {comment.content}
        </p>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-3 px-1 text-[12px] font-semibold text-[#64748B]">
        <button
          type="button"
          onClick={() => onLike(comment.id)}
          disabled={liking}
          className={`inline-flex items-center gap-1 hover:text-primary disabled:opacity-60 ${
            comment.liked ? 'text-primary' : ''
          }`}
        >
          {comment.liked ? 'Liked' : 'Like'}
          {comment.likeCount > 0 ? (
            <span className="tabular-nums font-normal">({comment.likeCount})</span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={() => onReply(comment)}
          className="hover:text-primary"
        >
          Reply
        </button>
        {showReplyCount && replyCount > 0 ? (
          <button
            type="button"
            onClick={() => onToggleReplies(comment.id)}
            className="hover:text-primary"
          >
            {expanded ? 'Hide' : 'View'} {replyCount}{' '}
            {replyCount === 1 ? 'reply' : 'replies'}
          </button>
        ) : null}
        <span className="font-normal text-[#98A2B3]">{comment.time}</span>
      </div>
    </div>
  );
};

const CommentItem = ({
  comment,
  onLike,
  onReply,
  likingCommentId,
  expandedIds,
  onToggleReplies,
}) => {
  const nested = Array.isArray(comment.replies) ? comment.replies : [];
  const expanded = expandedIds.has(comment.id);
  const showThread = expanded && nested.length > 0;

  return (
    <div className="relative">
      {showThread ? (
        <span
          className={`pointer-events-none absolute z-0 w-px -translate-x-1/2 ${LINE}`}
          style={{ left: SPINE_X, top: 36, bottom: SPINE_X }}
          aria-hidden
        />
      ) : null}

      <div className="relative z-[1] flex gap-3">
        <div className="relative w-9 shrink-0">
          <Avatar
            src={comment.author?.avatar}
            alt={comment.author?.name}
            initials={comment.author?.initials}
            size="sm"
          />
        </div>
        <CommentBody
          comment={comment}
          onLike={onLike}
          onReply={onReply}
          liking={likingCommentId === comment.id}
          showReplyCount
          expanded={expanded}
          onToggleReplies={onToggleReplies}
        />
      </div>

      {showThread ? (
        <div className="relative space-y-3 pt-3">
          {nested.map((reply, index) => {
            const isLast = index === nested.length - 1;
            return (
              <div key={reply.id} className="relative">
                <span
                  className={`pointer-events-none absolute z-[1] h-px ${LINE}`}
                  style={{ left: SPINE_X, top: SPINE_X, width: BRANCH_W }}
                  aria-hidden
                />
                {isLast ? (
                  <span
                    className="pointer-events-none absolute z-[1] w-px -translate-x-1/2 bg-white"
                    style={{ left: SPINE_X, top: SPINE_X, bottom: 0 }}
                    aria-hidden
                  />
                ) : null}
                <div className="flex gap-3" style={{ paddingLeft: BRANCH_W }}>
                  <div className="relative w-9 shrink-0">
                    <Avatar
                      src={reply.author?.avatar}
                      alt={reply.author?.name}
                      initials={reply.author?.initials}
                      size="sm"
                    />
                  </div>
                  <CommentBody
                    comment={reply}
                    onLike={onLike}
                    onReply={onReply}
                    liking={likingCommentId === reply.id}
                    showReplyCount={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

const countAll = (list = []) =>
  list.reduce(
    (sum, c) => sum + 1 + (Array.isArray(c.replies) ? c.replies.length : 0),
    0,
  );

const findRootId = (comments, commentId) => {
  for (const root of comments || []) {
    if (root.id === commentId) return root.id;
    if (Array.isArray(root.replies) && root.replies.some((r) => r.id === commentId)) {
      return root.id;
    }
  }
  return commentId;
};

const PostComments = ({
  comments,
  currentUser,
  onAddComment,
  onLikeComment,
  likingCommentId,
}) => {
  const [draft, setDraft] = useState('');
  const [replyParentId, setReplyParentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const inputRef = useRef(null);

  const focusInput = () => {
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    });
  };

  const handleSubmit = async () => {
    const text = draft.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    try {
      const ok = await onAddComment(text, replyParentId || undefined);
      if (ok !== false) {
        if (replyParentId) {
          setExpandedIds((prev) => new Set(prev).add(replyParentId));
        }
        setDraft('');
        setReplyParentId(null);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (comment) => {
    const rootId = findRootId(comments, comment.id);
    const isLevel1 = rootId !== comment.id;
    setReplyParentId(rootId);

    if (isLevel1) {
      const mention = mentionFromName(comment?.author?.name);
      setDraft((prev) => {
        const rest = prev.replace(/^@\S+\s*/, '').trimStart();
        return rest ? `${mention} ${rest}` : `${mention} `;
      });
    } else {
      setDraft((prev) => prev.replace(/^@\S+\s*/, '').trimStart());
      setExpandedIds((prev) => new Set(prev).add(comment.id));
    }
    focusInput();
  };

  const handleToggleReplies = (commentId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  return (
    <div className="border-t border-[#E4E7EC] px-4 py-4">
      <p className="mb-4 text-[14px] font-bold text-deep-blue">
        Comments ({countAll(comments)})
      </p>

      <div className="mb-4 flex gap-3">
        <Avatar
          src={currentUser?.avatar}
          alt={currentUser?.name || 'Member'}
          initials={currentUser?.initials || 'MB'}
          size="md"
          className="shrink-0"
        />
        <div className="min-w-0 flex-1">
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="Add a professional comment..."
            disabled={submitting}
            className="w-full resize-none rounded-lg border border-[#E4E7EC] px-3 py-2.5 text-[13px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!draft.trim() || submitting}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {submitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={onLikeComment}
            onReply={handleReply}
            likingCommentId={likingCommentId}
            expandedIds={expandedIds}
            onToggleReplies={handleToggleReplies}
          />
        ))}
      </div>
    </div>
  );
};

export default PostComments;
