import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { reactions } from "@/modules/user/data/reactions";

const LONG_PRESS_MS = 450;
const HOVER_DELAY_MS = 350;
const PICKER_WIDTH = 300;

const ReactionPicker = ({
  open,
  anchorRef,
  pickerRef,
  onSelect,
  onClose,
  onKeepOpen,
}) => {
  const [position, setPosition] = useState({ left: 0, bottom: 0 });

  useEffect(() => {
    if (!open || !anchorRef.current) return;

    const updatePosition = () => {
      const rect = anchorRef.current.getBoundingClientRect();
      let left = rect.left + rect.width / 2;
      const edge = PICKER_WIDTH / 2 + 12;
      left = Math.max(edge, Math.min(left, window.innerWidth - edge));

      setPosition({
        left,
        bottom: window.innerHeight - rect.top + 10,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, anchorRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={pickerRef}
      className="fixed z-[110]"
      style={{
        left: position.left,
        bottom: position.bottom,
        transform: "translateX(-50%)",
      }}
      onMouseEnter={onKeepOpen}
      onMouseLeave={onClose}
    >
      <div className="flex items-center gap-0.5 rounded-full border border-[#E4E7EC] bg-white px-2 py-1.5 shadow-[0_8px_24px_rgba(10,26,68,0.15)] sm:gap-1">
        {reactions.map((reaction) => (
          <button
            key={reaction.id}
            type="button"
            title={reaction.label}
            // Stop pointerdown so the document "outside click" listener
            // does not unmount the portal before this click fires.
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(reaction.id);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[22px] transition-transform hover:scale-110 hover:bg-[#F9FAFB] sm:h-10 sm:w-10 sm:text-[26px]"
          >
            {reaction.emoji}
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
};

const ReactionButton = ({ reactionId, onReact }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const wrapRef = useRef(null);
  const pickerRef = useRef(null);
  const hoverTimer = useRef(null);
  const longPressTimer = useRef(null);
  const pickerOpenedByTouch = useRef(false);
  const lastTouchReactAt = useRef(0);
  const selected = reactions.find((r) => r.id === reactionId);

  const openPicker = useCallback(() => setPickerOpen(true), []);
  const closePicker = useCallback(() => setPickerOpen(false), []);

  const clearHoverTimer = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }, []);

  const keepPickerOpen = useCallback(() => {
    clearHoverTimer();
  }, [clearHoverTimer]);

  const handleSelect = (id) => {
    onReact(id);
    closePicker();
  };

  const clearLongPressTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearHoverTimer();
    hoverTimer.current = setTimeout(openPicker, HOVER_DELAY_MS);
  };

  const handleMouseLeave = () => {
    clearHoverTimer();
    // Delay close so the cursor can move into the portaled picker.
    hoverTimer.current = setTimeout(closePicker, 250);
  };

  const handleTouchStart = () => {
    pickerOpenedByTouch.current = false;
    clearLongPressTimer();
    longPressTimer.current = setTimeout(() => {
      pickerOpenedByTouch.current = true;
      openPicker();
    }, LONG_PRESS_MS);
  };

  const handleTouchEnd = (e) => {
    clearLongPressTimer();
    if (pickerOpenedByTouch.current || pickerOpen) return;
    e.preventDefault();
    lastTouchReactAt.current = Date.now();
    onReact(selected ? null : "like");
  };

  const handleClick = () => {
    if (pickerOpen) return;
    if (Date.now() - lastTouchReactAt.current < 500) return;
    if (selected) {
      onReact(null);
      return;
    }
    onReact("like");
  };

  useEffect(() => {
    const handleOutside = (e) => {
      const inTrigger = wrapRef.current?.contains(e.target);
      const inPicker = pickerRef.current?.contains(e.target);
      if (!inTrigger && !inPicker) closePicker();
    };
    if (pickerOpen) {
      document.addEventListener("pointerdown", handleOutside);
    }
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [pickerOpen, closePicker]);

  useEffect(
    () => () => {
      clearHoverTimer();
      clearLongPressTimer();
    },
    [clearHoverTimer],
  );

  return (
    <div
      ref={wrapRef}
      className="relative flex flex-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ReactionPicker
        open={pickerOpen}
        anchorRef={wrapRef}
        pickerRef={pickerRef}
        onSelect={handleSelect}
        onClose={closePicker}
        onKeepOpen={keepPickerOpen}
      />
      <button
        type="button"
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={clearLongPressTimer}
        onContextMenu={(e) => e.preventDefault()}
        className={`flex w-full items-center justify-center gap-2 py-3 text-[13px] font-medium transition-colors hover:bg-[#F9FAFB] ${
          selected ? selected.color : "text-[#475467]"
        }`}
      >
        {selected ? (
          <>
            <span className="text-[16px] leading-none">{selected.emoji}</span>
            {selected.label}
          </>
        ) : (
          <>
            <span className="text-[16px] leading-none">👍</span>
            Like
          </>
        )}
      </button>
    </div>
  );
};

export default ReactionButton;
