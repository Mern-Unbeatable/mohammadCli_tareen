import { useCallback, useEffect, useRef, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { getReaction, reactions } from "@/modules/user/data/reactions";

const OPEN_DELAY_MS = 350;
/** Grace period for moving the cursor from the button up to the panel. */
const CLOSE_DELAY_MS = 300;
const LONG_PRESS_MS = 450;

const ReactionButton = ({ reactionId, onReact }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const wrapRef = useRef(null);
  const hoverTimer = useRef(null);
  const longPressTimer = useRef(null);
  const openedByTouch = useRef(false);
  const lastTouchReactAt = useRef(0);
  const selected = getReaction(reactionId);

  const clearHoverTimer = useCallback(() => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  }, []);

  const clearLongPressTimer = () => {
    clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };

  const scheduleOpen = () => {
    clearHoverTimer();
    if (pickerOpen) return;
    hoverTimer.current = setTimeout(() => setPickerOpen(true), OPEN_DELAY_MS);
  };

  const scheduleClose = () => {
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => setPickerOpen(false), CLOSE_DELAY_MS);
  };

  const handleSelect = (id) => {
    clearHoverTimer();
    setPickerOpen(false);
    onReact(id);
  };

  const handleClick = () => {
    if (Date.now() - lastTouchReactAt.current < 500) return;
    clearHoverTimer();
    setPickerOpen(false);
    onReact(selected ? null : "like");
  };

  const handleTouchStart = () => {
    openedByTouch.current = false;
    clearLongPressTimer();
    longPressTimer.current = setTimeout(() => {
      openedByTouch.current = true;
      setPickerOpen(true);
    }, LONG_PRESS_MS);
  };

  const handleTouchEnd = (e) => {
    clearLongPressTimer();
    if (openedByTouch.current || pickerOpen) return;
    e.preventDefault();
    lastTouchReactAt.current = Date.now();
    onReact(selected ? null : "like");
  };

  useEffect(() => {
    if (!pickerOpen) return undefined;
    const handleOutside = (e) => {
      if (!wrapRef.current?.contains(e.target)) setPickerOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setPickerOpen(false);
    };
    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [pickerOpen]);

  useEffect(
    () => () => {
      clearHoverTimer();
      clearLongPressTimer();
    },
    [clearHoverTimer],
  );

  const isLike = selected?.id === "like";
  const buttonColor = !selected
    ? "text-gray-600"
    : isLike
      ? "text-blue-600"
      : selected.color;

  return (
    <div
      ref={wrapRef}
      className="relative flex flex-1"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
    >
      {/* pb-2 keeps the gap above the button inside the hover area. */}
      <div
        role="menu"
        aria-label="Reactions"
        aria-hidden={!pickerOpen}
        className={`absolute bottom-full left-2 z-30 pb-2 transition-all duration-150 ease-out ${
          pickerOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-1 scale-95 opacity-0"
        }`}
        style={{ transformOrigin: "bottom left" }}
      >
        <div className="flex items-center gap-0.5 rounded-full border border-[#E4E7EC] bg-white px-2 py-1.5 shadow-[0_8px_24px_rgba(10,26,68,0.15)] sm:gap-1">
          {reactions.map((reaction) => (
            <button
              key={reaction.id}
              type="button"
              role="menuitem"
              title={reaction.label}
              aria-label={reaction.label}
              tabIndex={pickerOpen ? 0 : -1}
              onClick={() => handleSelect(reaction.id)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-[22px] transition-transform duration-150 hover:-translate-y-1 hover:scale-125 sm:h-10 sm:w-10 sm:text-[26px] ${
                reaction.id === selected?.id ? "bg-[#F2F4F7]" : ""
              }`}
            >
              {reaction.emoji}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={clearLongPressTimer}
        onContextMenu={(e) => e.preventDefault()}
        aria-haspopup="menu"
        aria-expanded={pickerOpen}
        aria-pressed={Boolean(selected)}
        className={`flex w-full items-center justify-center gap-2 py-3 text-[13px] font-medium transition-colors hover:bg-[#F9FAFB] ${buttonColor}`}
      >
        {!selected || isLike ? (
          <ThumbsUp
            aria-hidden="true"
            className={`h-4 w-4 ${isLike ? "fill-current" : ""}`}
          />
        ) : (
          <span aria-hidden="true" className="text-[16px] leading-none">
            {selected.emoji}
          </span>
        )}
        {selected ? selected.label : "Like"}
      </button>
    </div>
  );
};

export default ReactionButton;
