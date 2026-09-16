import { useState } from 'react';
import { Send } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';

const LINE = 'bg-[#D0D5DD]';
/** Avatar sm is 36px; spine sits on avatar center (18px). */
const SPINE_X = 18;
/** Horizontal stub from spine to nested avatar center. */
const BRANCH_W = 30;

const ReplyComposer = ({ currentUser, onSubmit, onCancel, submitting }) => {
  const [draft, setDraft] = useState('');

  const handleSubmit = async () => {
    const text = draft.trim();
    if (!text || submitting) return;
    const ok = await onSubmit(text);
    if (ok !== false) setDraft('');
  };

  return (
    <div className="mt-2 flex gap-2">
      <Avatar
        src={currentUser?.avatar}
        alt={currentUser?.name || 'Member'}
        initials={currentUser?.initials || 'MB'}
        size="sm"
        className="mt-1 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          placeholder="Write a reply..."
          disabled={submitting}
          className="w-full resize-none rounded-lg border border-[#E4E7EC] px-3 py-2 text-[13px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
        />
        <div className="mt-1.5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-md px-3 py-1.5 text-[12px] font-semibold text-[#64748B] hover:bg-[#F9FAFB] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!draft.trim() || submitting}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-3 w-3" />
            {submitting ? 'Posting...' : 'Reply'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CommentItem = ({
  comment,
  currentUser,
  onLike,
  onReply,
  onSubmitReply,
  likingCommentId,
  replyTargetId,
  replySubmitting,
  expandedIds,
  onToggleReplies,
}) => {
  const replyCount = comment.replyCount ?? comment.replies?.length ?? 0;
  const nested = Array.isArray(comment.replies) ? comment.replies : [];
  const isReplying = replyTargetId === comment.id;
  const liking = likingCommentId === comment.id;
  const expanded = expandedIds.has(comment.id);
  const showThread = expanded && nested.length > 0;

  return (
    <div className="relative">
      {/* One continuous spine: under parent avatar → through replies */}
      {showThread ? (
        <span
          className={`pointer-events-none absolute z-0 w-px -translate-x-1/2 ${LINE}`}
          style={{
            left: SPINE_X,
            top: 36,
            bottom: SPINE_X,
          }}
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
                <span className="tabular-nums font-normal">
                  ({comment.likeCount})
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => onReply(comment.id)}
              className="hover:text-primary"
            >
              Reply
            </button>
            {replyCount > 0 ? (
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

          {isReplying ? (
            <ReplyComposer
              currentUser={currentUser}
              submitting={replySubmitting}
              onCancel={() => onReply(null)}
              onSubmit={(text) => onSubmitReply(text, comment.id)}
            />
          ) : null}
        </div>
      </div>

      {showThread ? (
        <div className="relative space-y-3 pt-3">
          {nested.map((reply, index) => {
            const isLast = index === nested.length - 1;
            return (
              <div key={reply.id} className="relative">
                <span
                  className={`pointer-events-none absolute z-[1] h-px ${LINE}`}
                  style={{
                    left: SPINE_X,
                    top: SPINE_X,
                    width: BRANCH_W,
                  }}
                  aria-hidden
                />
                {isLast ? (
                  <span
                    className="pointer-events-none absolute z-[1] w-px -translate-x-1/2 bg-white"
                    style={{
                      left: SPINE_X,
                      top: SPINE_X,
                      bottom: 0,
                    }}
                    aria-hidden
                  />
                ) : null}

                <div style={{ paddingLeft: BRANCH_W }}>
                  <CommentItem
                    comment={reply}
                    currentUser={currentUser}
                    onLike={onLike}
                    onReply={onReply}
                    onSubmitReply={onSubmitReply}
                    likingCommentId={likingCommentId}
                    replyTargetId={replyTargetId}
                    replySubmitting={replySubmitting}
                    expandedIds={expandedIds}
                    onToggleReplies={onToggleReplies}
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

const countComments = (list = []) =>
  list.reduce((sum, item) => sum + 1 + countComments(item.replies), 0);

const collectAncestorIds = (list = [], targetId, path = []) => {
  for (const item of list) {
    if (item.id === targetId) return path;
    const found = collectAncestorIds(item.replies, targetId, [
      ...path,
      item.id,
    ]);
    if (found) return found;
  }
  return null;
};

const PostComments = ({
  comments,
  currentUser,
  onAddComment,
  onLikeComment,
  likingCommentId,
}) => {
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const handleSubmit = async () => {
    const text = draft.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    try {
      const ok = await onAddComment(text);
      if (ok !== false) setDraft('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleReplies = (commentId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const handleReplyClick = (commentId) => {
    setReplyTargetId((prev) => (prev === commentId ? null : commentId));
  };

  const handleSubmitReply = async (text, parentCommentId) => {
    if (!text?.trim() || replySubmitting) return false;
    setReplySubmitting(true);
    try {
      const ok = await onAddComment(text, parentCommentId);
      if (ok !== false) {
        setReplyTargetId(null);
        setExpandedIds((prev) => {
          const next = new Set(prev);
          next.add(parentCommentId);
          (collectAncestorIds(comments, parentCommentId) || []).forEach((id) =>
            next.add(id),
          );
          return next;
        });
      }
      return ok;
    } finally {
      setReplySubmitting(false);
    }
  };

  return (
    <div className="border-t border-[#E4E7EC] px-4 py-4">
      <p className="mb-4 text-[14px] font-bold text-deep-blue">
        Comments ({countComments(comments)})
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
            currentUser={currentUser}
            onLike={onLikeComment}
            onReply={handleReplyClick}
            onSubmitReply={handleSubmitReply}
            likingCommentId={likingCommentId}
            replyTargetId={replyTargetId}
            replySubmitting={replySubmitting}
            expandedIds={expandedIds}
            onToggleReplies={handleToggleReplies}
          />
        ))}
      </div>
    </div>
  );
};

export default PostComments;
