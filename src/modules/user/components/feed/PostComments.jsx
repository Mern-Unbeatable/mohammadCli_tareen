import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';

const LINE = 'bg-[#D0D5DD]';
const SPINE_X = 18;
const BRANCH_W = 30;

const mentionFromName = (name = '') => {
  const first = String(name).trim().split(/\s+/)[0];
  return first ? `@${first}` : '@Member';
};

const InlineReplyBox = ({
  currentUser,
  initialValue = '',
  submitting,
  onSubmit,
  onCancel,
}) => {
  const [draft, setDraft] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    setDraft(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    const len = el.value.length;
    el.setSelectionRange(len, len);
  }, []);

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
          ref={inputRef}
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

const CommentBody = ({
  comment,
  onLike,
  onReply,
  liking,
  showReplyCount,
  expanded,
  onToggleReplies,
  showInlineReply,
  currentUser,
  replyInitialValue,
  replySubmitting,
  onSubmitReply,
  onCancelReply,
}) => {
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

      {showInlineReply ? (
        <InlineReplyBox
          currentUser={currentUser}
          initialValue={replyInitialValue}
          submitting={replySubmitting}
          onSubmit={onSubmitReply}
          onCancel={onCancelReply}
        />
      ) : null}
    </div>
  );
};

const CommentItem = ({
  comment,
  currentUser,
  onLike,
  onReply,
  likingCommentId,
  expandedIds,
  onToggleReplies,
  replyTargetId,
  replyInitialValue,
  replySubmitting,
  onSubmitReply,
  onCancelReply,
}) => {
  const nested = Array.isArray(comment.replies) ? comment.replies : [];
  const expanded = expandedIds.has(comment.id);
  const showThread = expanded && nested.length > 0;
  const replyOpenOnRoot = replyTargetId === comment.id;

  return (
    <div className="relative">
      {showThread || replyOpenOnRoot ? (
        <span
          className={`pointer-events-none absolute z-0 w-px -translate-x-1/2 ${LINE}`}
          style={{
            left: SPINE_X,
            top: 36,
            bottom: showThread ? SPINE_X : 0,
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
        <CommentBody
          comment={comment}
          onLike={onLike}
          onReply={onReply}
          liking={likingCommentId === comment.id}
          showReplyCount
          expanded={expanded}
          onToggleReplies={onToggleReplies}
          showInlineReply={replyOpenOnRoot}
          currentUser={currentUser}
          replyInitialValue={replyInitialValue}
          replySubmitting={replySubmitting}
          onSubmitReply={onSubmitReply}
          onCancelReply={onCancelReply}
        />
      </div>

      {showThread ? (
        <div className="relative space-y-3 pt-3">
          {nested.map((reply, index) => {
            const isLast = index === nested.length - 1;
            const replyOpen = replyTargetId === reply.id;
            return (
              <div key={reply.id} className="relative">
                <span
                  className={`pointer-events-none absolute z-[1] h-px ${LINE}`}
                  style={{ left: SPINE_X, top: SPINE_X, width: BRANCH_W }}
                  aria-hidden
                />
                {isLast && !replyOpen ? (
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
                    showInlineReply={replyOpen}
                    currentUser={currentUser}
                    replyInitialValue={replyInitialValue}
                    replySubmitting={replySubmitting}
                    onSubmitReply={onSubmitReply}
                    onCancelReply={onCancelReply}
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
    if (
      Array.isArray(root.replies) &&
      root.replies.some((r) => r.id === commentId)
    ) {
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
  const [submitting, setSubmitting] = useState(false);
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [replyRootId, setReplyRootId] = useState(null);
  const [replyInitialValue, setReplyInitialValue] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const handleTopSubmit = async () => {
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

  const handleReply = (comment) => {
    if (replyTargetId === comment.id) {
      setReplyTargetId(null);
      setReplyRootId(null);
      setReplyInitialValue('');
      return;
    }

    const rootId = findRootId(comments, comment.id);
    const isLevel1 = rootId !== comment.id;

    setReplyTargetId(comment.id);
    setReplyRootId(rootId);
    setReplyInitialValue(
      isLevel1 ? `${mentionFromName(comment?.author?.name)} ` : '',
    );
    setExpandedIds((prev) => new Set(prev).add(rootId));
  };

  const handleCancelReply = () => {
    setReplyTargetId(null);
    setReplyRootId(null);
    setReplyInitialValue('');
  };

  const handleSubmitReply = async (text) => {
    if (!text?.trim() || replySubmitting || !replyRootId) return false;
    setReplySubmitting(true);
    try {
      const ok = await onAddComment(text, replyRootId);
      if (ok !== false) {
        setExpandedIds((prev) => new Set(prev).add(replyRootId));
        handleCancelReply();
      }
      return ok;
    } finally {
      setReplySubmitting(false);
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
              onClick={handleTopSubmit}
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
            onReply={handleReply}
            likingCommentId={likingCommentId}
            expandedIds={expandedIds}
            onToggleReplies={handleToggleReplies}
            replyTargetId={replyTargetId}
            replyInitialValue={replyInitialValue}
            replySubmitting={replySubmitting}
            onSubmitReply={handleSubmitReply}
            onCancelReply={handleCancelReply}
          />
        ))}
      </div>
    </div>
  );
};

export default PostComments;
