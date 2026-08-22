import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Check,
  Link2,
  MessageCircle,
  Repeat2,
  Send,
  X,
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { suggestedPeople } from '@/modules/user/data/dashboard';

const shareOptions = [
  { id: 'repost', label: 'Repost to your feed', icon: Repeat2, color: 'text-primary' },
  { id: 'message', label: 'Send in a message', icon: Send, color: 'text-[#475467]' },
  { id: 'copy', label: 'Copy link to post', icon: Link2, color: 'text-[#475467]' },
];

const SharePostModal = ({ open, post, onClose, onShare }) => {
  const [copied, setCopied] = useState(false);
  const [sentTo, setSentTo] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    setCopied(false);
    setSentTo(null);
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open || !post) return null;

  const postUrl = `${window.location.origin}/feed?post=${post.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
    } catch {
      // fallback for non-secure contexts
    }
    setCopied(true);
    onShare('copy');
    setTimeout(onClose, 1200);
  };

  const handleRepost = () => {
    onShare('repost');
    onClose();
  };

  const handleSend = (person) => {
    setSentTo(person.name);
    onShare('message');
    setTimeout(onClose, 1400);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[90dvh] w-full max-w-[480px] flex-col rounded-t-2xl bg-white shadow-xl sm:max-h-none sm:rounded-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-post-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4E7EC] px-4 py-3.5 sm:px-5 sm:py-4">
          <h2 id="share-post-title" className="text-[17px] font-bold text-deep-blue sm:text-[18px]">
            Share this post
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {copied && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-secondary px-3 py-2.5 text-[13px] font-medium text-green-primary">
              <Check className="h-4 w-4" />
              Link copied to clipboard
            </div>
          )}

          {sentTo && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-secondary px-3 py-2.5 text-[13px] font-medium text-primary">
              <Check className="h-4 w-4" />
              Sent to {sentTo}
            </div>
          )}

          <p className="mb-3 line-clamp-2 text-[13px] text-[#64748B]">
            <span className="font-semibold text-deep-blue">{post.author.name}</span>
            {' · '}
            {post.content.slice(0, 80)}
            {post.content.length > 80 ? '…' : ''}
          </p>

          <div className="mb-4 space-y-1">
            {shareOptions.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                type="button"
                onClick={
                  id === 'copy' ? handleCopy : id === 'repost' ? handleRepost : undefined
                }
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-[#F9FAFB]"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] ${color}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-[14px] font-medium text-deep-blue">{label}</span>
              </button>
            ))}
          </div>

          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#98A2B3]">
            Send to connections
          </p>
          <ul className="space-y-1">
            {suggestedPeople.map((person) => (
              <li key={person.id}>
                <button
                  type="button"
                  onClick={() => handleSend(person)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[#F9FAFB]"
                >
                  <Avatar
                    src={person.avatar}
                    alt={person.name}
                    initials={person.initials}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-[13px] font-semibold text-deep-blue">
                      {person.name}
                    </p>
                    <p className="truncate text-[12px] text-[#64748B]">{person.company}</p>
                  </div>
                  <MessageCircle className="h-4 w-4 shrink-0 text-[#98A2B3]" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="shrink-0 border-t border-[#E4E7EC] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-5 sm:py-4 sm:pb-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md border border-[#E4E7EC] py-2.5 text-[14px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SharePostModal;
