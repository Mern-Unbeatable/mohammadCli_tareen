import { Link } from 'react-router';
import { Calendar } from 'lucide-react';
import Card from '../ui/Card';

const typeStyles = {
  news: 'bg-[#FEF3E8] text-[#E67E22]',
  document: 'bg-pink-secondary text-pink-light',
};

const GeneralPostCard = ({ post }) => (
  <Card className="flex h-full flex-col overflow-hidden">
    <Link to={`/general/${post.id}`} className="relative block aspect-[16/10] overflow-hidden bg-[#F9FAFB]">
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
        to={`/general/${post.id}`}
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
    </div>
  </Card>
);

export default GeneralPostCard;
