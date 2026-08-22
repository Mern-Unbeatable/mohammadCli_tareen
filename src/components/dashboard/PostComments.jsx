import { useState } from 'react';
import { Send } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { currentUser } from '../../data/dashboard';

const CommentItem = ({ comment, onLike }) => (
  <div className="flex gap-3">
    <Avatar
      src={comment.author.avatar}
      alt={comment.author.name}
      initials={comment.author.initials}
      size="sm"
      className="mt-1"
    />
    <div className="min-w-0 flex-1">
      <div className="rounded-lg bg-[#F3F4F6] px-3 py-2.5">
        <p className="text-[13px] font-semibold text-deep-blue">{comment.author.name}</p>
        <p className="text-[11px] text-[#64748B]">{comment.author.subtitle}</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#475467]">{comment.content}</p>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-3 px-1 text-[12px] font-semibold text-[#64748B]">
        <button
          type="button"
          onClick={() => onLike(comment.id)}
          className={`hover:text-primary ${comment.liked ? 'text-primary' : ''}`}
        >
          {comment.liked ? 'Liked' : 'Like'}
        </button>
        <button type="button" className="hover:text-primary">
          Reply
        </button>
        {comment.replies > 0 && (
          <button type="button" className="hover:text-primary">
            View {comment.replies} {comment.replies === 1 ? 'reply' : 'replies'}
          </button>
        )}
        <span className="font-normal text-[#98A2B3]">{comment.time}</span>
      </div>
    </div>
  </div>
);

const PostComments = ({ comments, onAddComment, onLikeComment }) => {
  const [draft, setDraft] = useState('');

  const handleSubmit = () => {
    const text = draft.trim();
    if (!text) return;
    onAddComment(text);
    setDraft('');
  };

  return (
    <div className="border-t border-[#E4E7EC] px-4 py-4">
      <p className="mb-4 text-[14px] font-bold text-deep-blue">
        Comments ({comments.length})
      </p>

      <div className="mb-4 flex gap-3">
        <Avatar
          src={currentUser.avatar}
          alt={currentUser.name}
          initials={currentUser.initials}
          size="md"
          className="shrink-0"
        />
        <div className="min-w-0 flex-1">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="Add a professional comment..."
            className="w-full resize-none rounded-lg border border-[#E4E7EC] px-3 py-2.5 text-[13px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!draft.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Comment
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onLike={onLikeComment} />
        ))}
      </div>
    </div>
  );
};

export default PostComments;
