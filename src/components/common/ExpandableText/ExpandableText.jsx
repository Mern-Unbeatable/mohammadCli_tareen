import { useEffect, useRef, useState } from 'react';

const ELLIPSIS = '\u2026';
/** How far back (in characters) the cut may move to land on a word boundary. */
const WORD_BACKTRACK = 24;

const clampStyle = (lines) => ({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: lines,
  overflow: 'hidden',
});

/**
 * Facebook-style "See more / See less" for long plain-text content.
 *
 * Collapsed, the text is cut so that "… See more" ends exactly on the last of
 * `lines` lines, with the toggle inline right after the dots. The cut is found
 * with a binary search on an invisible copy of the paragraph (same width and
 * classes) and recomputed whenever the width changes. Until the first
 * measurement, CSS line-clamp keeps the text at `lines` lines.
 */
const ExpandableText = ({
  text,
  lines = 2,
  className = '',
  moreLabel = 'See more',
  lessLabel = 'See less',
}) => {
  const textRef = useRef(null);
  const measureRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  /** `undefined` = not measured yet, `null` = fits, number = characters to keep. */
  const [cut, setCut] = useState(undefined);

  useEffect(() => {
    const box = measureRef.current;
    if (!box || !text) return undefined;

    const textNode = document.createTextNode(text);
    const label = document.createElement('span');
    label.className = 'font-semibold';
    label.textContent = moreLabel;
    const suffix = document.createElement('span');
    suffix.append(`${ELLIPSIS} `, label);
    box.replaceChildren(textNode, suffix);

    const measure = () => {
      const style = getComputedStyle(box);
      const lineHeight =
        parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
      const maxHeight = lineHeight * lines + 1;

      textNode.data = text;
      suffix.hidden = true;
      if (box.scrollHeight <= maxHeight) {
        setCut(null);
        return;
      }

      suffix.hidden = false;
      const fits = (count) => {
        textNode.data = text.slice(0, count).trimEnd();
        return box.scrollHeight <= maxHeight;
      };
      let low = 0;
      let high = text.length;
      while (low < high) {
        const mid = Math.ceil((low + high) / 2);
        if (fits(mid)) low = mid;
        else high = mid - 1;
      }

      const head = text.slice(0, low);
      const wordEnd = head.lastIndexOf(' ');
      const onSameLine = wordEnd > head.lastIndexOf('\n');
      setCut(
        wordEnd > 0 && onSameLine && low - wordEnd <= WORD_BACKTRACK
          ? wordEnd
          : low,
      );
    };

    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [text, lines, moreLabel]);

  const collapse = () => {
    setExpanded(false);
    const el = textRef.current;
    if (!el) return;
    const headerOffset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    if (el.getBoundingClientRect().top < headerOffset) {
      el.scrollIntoView({ block: 'start' });
    }
  };

  if (!text) return null;

  const toggleClass =
    'inline cursor-pointer font-semibold text-primary hover:underline focus-visible:underline focus-visible:outline-none';

  let content = text;
  if (expanded) {
    content = (
      <>
        {text}{' '}
        <button type="button" onClick={collapse} aria-expanded className={toggleClass}>
          {lessLabel}
        </button>
      </>
    );
  } else if (typeof cut === 'number') {
    content = (
      <>
        {text.slice(0, cut).trimEnd()}
        {`${ELLIPSIS} `}
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-expanded={false}
          className={toggleClass}
        >
          {moreLabel}
        </button>
      </>
    );
  }

  return (
    <div className="relative">
      <p
        ref={textRef}
        className={`scroll-mt-20 whitespace-pre-wrap break-words ${className}`}
        style={!expanded && cut === undefined ? clampStyle(lines) : undefined}
      >
        {content}
      </p>
      <p
        ref={measureRef}
        aria-hidden="true"
        className={`pointer-events-none invisible absolute inset-x-0 top-0 whitespace-pre-wrap break-words ${className}`}
      />
    </div>
  );
};

export default ExpandableText;
