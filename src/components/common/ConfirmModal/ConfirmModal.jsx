import { useEffect } from "react";
import { Loader2, X } from "lucide-react";

/**
 * Reusable confirm dialog — same shell pattern as CancelSubscriptionModal.
 */
const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  confirming = false,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !confirming) onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, confirming, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      onClick={confirming ? undefined : onClose}
      role="presentation"
    >
      <div
        className="flex w-full max-w-[440px] flex-col rounded-xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4E7EC] px-4 py-3.5 sm:px-5 sm:py-4">
          <h2
            id="confirm-modal-title"
            className="text-[17px] font-bold text-deep-blue sm:text-[18px]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={confirming}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB] disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-5 sm:px-5">
          {typeof description === "string" ? (
            <p className="text-[14px] leading-relaxed text-[#64748B]">
              {description}
            </p>
          ) : (
            description
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#E4E7EC] px-4 py-4 sm:flex-row sm:justify-end sm:px-5">
          <button
            type="button"
            onClick={onClose}
            disabled={confirming}
            className="rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-[13px] font-semibold text-[#475467] transition-colors hover:bg-[#F9FAFB] disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#CC1016] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#B30E13] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {confirming ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
