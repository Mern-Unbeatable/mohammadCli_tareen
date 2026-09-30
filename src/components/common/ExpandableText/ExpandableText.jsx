import { useEffect, useRef, useState } from 'react';

/**
 * Facebook-style "See more / See less" for long plain-text content.
 *
 * The full text is always rendered (whitespace preserved); when collapsed it is
 * visually clamped to `lines`, and the toggle only appears if the text actually
 * overflows at the current width.
 */
const ExpandableText = ({
  text,
  lines = 5,
  className = '',
  moreLabel = 'See more',
  lessLabel = 'See less',
}) => {
  const textRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el || expanded) return undefined;

    const observer = new ResizeObserver(() => {
      setOverflowing(el.scrollHeight - el.clientHeight > 1);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, lines, expanded]);

  const handleToggle = () => {
    if (expanded) {
      setExpanded(false);
      const el = textRef.current;
      if (el) {
        const headerOffset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
        if (el.getBoundingClientRect().top < headerOffset) {
          el.scrollIntoView({ block: 'start' });
        }
      }
      return;
    }
    setExpanded(true);
  };

  if (!text) return null;

  return (
    <div>
      <p
        ref={textRef}
        className={`scroll-mt-20 whitespace-pre-wrap break-words ${className}`}
        style={
          expanded
            ? undefined
            : {
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: lines,
                overflow: 'hidden',
              }
        }
      >
        {text}
      </p>
      {overflowing || expanded ? (
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={expanded}
          className="mt-1 text-[14px] font-semibold text-primary hover:underline"
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      ) : null}
    </div>
  );
};

export default ExpandableText;
