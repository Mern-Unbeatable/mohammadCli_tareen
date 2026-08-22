import { useCallback, useEffect, useRef, useState } from 'react';
import { reactions } from '../../data/reactions';

const LONG_PRESS_MS = 450;
const HOVER_DELAY_MS = 350;

const ReactionPicker = ({ open, onSelect, onClose }) => {
  if (!open) return null;

  return (
    <div
      className="absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2"
      onMouseLeave={onClose}
    >
      <div className="flex items-center gap-1 rounded-full border border-[#E4E7EC] bg-white px-2 py-1.5 shadow-[0_8px_24px_rgba(10,26,68,0.12)]">
        {reactions.map((reaction) => (
          <button
            key={reaction.id}
            type="button"
            title={reaction.label}
            onClick={() => onSelect(reaction.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[26px] transition-transform hover:scale-125 hover:bg-[#F9FAFB]"
          >
            {reaction.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

const ReactionButton = ({ reactionId, onReact }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const wrapRef = useRef(null);
  const hoverTimer = useRef(null);
  const longPressTimer = useRef(null);
  const pickerOpenedByTouch = useRef(false);
  const selected = reactions.find((r) => r.id === reactionId);

  const openPicker = useCallback(() => setPickerOpen(true), []);
  const closePicker = useCallback(() => setPickerOpen(false), []);

  const handleSelect = (id) => {
    onReact(id);
    closePicker();
  };

  const clearHoverTimer = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
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
    hoverTimer.current = setTimeout(closePicker, 200);
  };

  const handleTouchStart = () => {
    pickerOpenedByTouch.current = false;
    clearLongPressTimer();
    longPressTimer.current = setTimeout(() => {
      pickerOpenedByTouch.current = true;
      openPicker();
    }, LONG_PRESS_MS);
  };

  const handleTouchEnd = () => {
    clearLongPressTimer();
    if (pickerOpenedByTouch.current || pickerOpen) return;
    if (!selected) onReact('like');
  };

  const handleClick = () => {
    if (selected) {
      onReact(null);
      return;
    }
    onReact('like');
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        closePicker();
      }
    };
    if (pickerOpen) {
      document.addEventListener('pointerdown', handleOutside);
    }
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [pickerOpen, closePicker]);

  useEffect(
    () => () => {
      clearHoverTimer();
      clearLongPressTimer();
    },
    []
  );

  return (
    <div
      ref={wrapRef}
      className="relative flex flex-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ReactionPicker open={pickerOpen} onSelect={handleSelect} onClose={closePicker} />
      <button
        type="button"
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={clearLongPressTimer}
        onContextMenu={(e) => e.preventDefault()}
        className={`flex w-full items-center justify-center gap-2 py-3 text-[13px] font-medium transition-colors hover:bg-[#F9FAFB] ${
          selected ? selected.color : 'text-[#475467]'
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
