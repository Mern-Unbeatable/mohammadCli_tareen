import { Link } from 'react-router';
import { Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';

const typeStyles = {
  news: 'bg-[#FEF3E8] text-[#E67E22]',
  document: 'bg-pink-secondary text-pink-light',
};

const GeneralPostCard = ({
  post,
  variant = 'browse',
  detailHref,
  onEdit,
  onDelete,
}) => {
  const href = detailHref || `/general/${post.id}`;

  return (
  <Card className="flex h-full flex-col overflow-hidden">
    <Link to={href} className="relative block aspect-[16/10] overflow-hidden bg-[#F9FAFB]">
      <img src={post.image} alt="" className="h-full w-full object-cover" />
      <span
        className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
          typeStyles[post.type]
        }`}
      >
        {post.type === 'news' ? 'News' : 'Document'}
      </span>
    </Link>

    <div className="flex flex-1 flex-col p-4">
      <Link
        to={href}
        className="line-clamp-2 text-[14px] font-bold leading-snug text-deep-blue hover:text-primary"
      >
        {post.title}
      </Link>
      <p className="mt-2 line-clamp-2 flex-1 text-[12px] leading-relaxed text-[#64748B]">
        {post.summary}
      </p>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[#98A2B3]">
        <Calendar className="h-3.5 w-3.5" />
        {post.date}
      </p>

      {variant === 'mine' ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(post.id)}
            className="rounded-md bg-primary px-3 py-2 text-[12px] font-semibold text-white hover:bg-[#066BB0]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(post.id)}
            className="rounded-md bg-[#CC1016] px-3 py-2 text-[12px] font-semibold text-white hover:bg-[#B30E13]"
          >
            Delete
          </button>
        </div>
      ) : null}

      {variant === 'admin' ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onDelete?.(post.id)}
            className="rounded-md bg-pink-light px-3 py-2 text-[12px] font-semibold text-white hover:opacity-90"
          >
            Delete
          </button>
          <Link
            to={href}
            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-[12px] font-semibold text-white hover:bg-[#066BB0]"
          >
            View Details
          </Link>
        </div>
      ) : null}
    </div>
  </Card>
  );
};

export default GeneralPostCard;
