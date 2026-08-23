import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { messageRecipients } from '@/modules/user/data/messages';

const fieldClass =
  'w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10';

const labelClass = 'mb-1.5 block text-[13px] font-semibold text-deep-blue';

const NewMessageModal = ({ open, onClose, onSend }) => {
  const [recipientId, setRecipientId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setRecipientId('');
      setMessage('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend?.({ recipientId, message });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white sm:max-w-[480px] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-message-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-[#E4E7EC] px-5 py-4">
          <div>
            <h2 id="new-message-title" className="text-[17px] font-bold text-deep-blue sm:text-[18px]">
              New Message
            </h2>
            <p className="mt-1 text-[13px] text-[#64748B] sm:text-[14px]">
              Send a new message to anyone in your network.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        >
          <div className="mb-4">
            <label htmlFor="recipient" className={labelClass}>
              Select User<span className="text-pink-light"> *</span>
            </label>
            <select
              id="recipient"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className={fieldClass}
              required
            >
              <option value="">Choose a contact...</option>
              {messageRecipients.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="new-message-body" className={labelClass}>
              Message<span className="text-pink-light"> *</span>
            </label>
            <textarea
              id="new-message-body"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Write your message..."
              className={`${fieldClass} resize-y`}
              required
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-[13px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0]"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMessageModal;
