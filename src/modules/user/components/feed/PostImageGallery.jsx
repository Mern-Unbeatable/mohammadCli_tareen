import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const MAX_TILES = 4;

const ImageViewer = ({ images, index, onChange, onClose }) => {
  const count = images.length;
  const go = (step) => onChange((index + step + count) % count);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (count > 1 && event.key === 'ArrowLeft') onChange((index - 1 + count) % count);
      if (count > 1 && event.key === 'ArrowRight') onChange((index + 1) % count);
    };
    document.addEventListener('keydown', handleKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = overflow;
    };
  }, [count, index, onChange, onClose]);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${count}`}
    >
      <img
        src={images[index]}
        alt=""
        className="max-h-[85vh] max-w-full rounded-lg object-contain"
        onClick={(event) => event.stopPropagation()}
      />
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
        aria-label="Close image"
      >
        <X className="h-5 w-5" />
      </button>
      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              go(-1);
            }}
            className="absolute left-3 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              go(1);
            }}
            className="absolute right-3 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <p className="absolute bottom-4 rounded-full bg-black/50 px-3 py-1 text-[13px] text-white">
            {index + 1} / {count}
          </p>
        </>
      ) : null}
    </div>
  );
};

/** Feed post images: 1 full width, 2 side by side, 3 as one wide plus two, 4+ as a 2×2 grid with "+N". */
const PostImageGallery = ({ images: imageList, image, className = 'mt-3' }) => {
  const [viewerIndex, setViewerIndex] = useState(null);
  const images = imageList?.length ? imageList : image ? [image] : [];
  if (!images.length) return null;

  const tiles = images.slice(0, MAX_TILES);
  const hidden = images.length - tiles.length;
  const single = images.length === 1;

  return (
    <>
      <div
        className={`${className} grid gap-1 overflow-hidden rounded-lg ${
          single ? 'grid-cols-1' : 'grid-cols-2'
        }`}
      >
        {tiles.map((src, index) => {
          const wide = images.length === 3 && index === 0;
          const showMore = hidden > 0 && index === tiles.length - 1;
          return (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setViewerIndex(index)}
              className={`relative block overflow-hidden bg-[#F2F4F7] ${
                single ? 'aspect-[16/9]' : wide ? 'col-span-2 aspect-[2/1]' : 'aspect-square'
              }`}
              aria-label={showMore ? `View ${hidden} more images` : `View image ${index + 1}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              {showMore ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-[24px] font-bold text-white sm:text-[28px]">
                  +{hidden}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {viewerIndex !== null ? (
        <ImageViewer
          images={images}
          index={viewerIndex}
          onChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      ) : null}
    </>
  );
};

export default PostImageGallery;
