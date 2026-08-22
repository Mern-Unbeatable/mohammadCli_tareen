import { Link } from 'react-router';
import BlogCategoryBadge from './BlogCategoryBadge';

const LatestHubCard = ({ article }) => (
  <Link
    to={`/blogs/${article.slug}`}
    className="flex h-full w-full gap-3 rounded-xl border border-[#E4E7EC] bg-white p-3 transition-colors hover:border-[#D0D5DD] sm:gap-4 sm:p-4"
  >
    <img
      src={article.image}
      alt=""
      className="h-20 w-20 shrink-0 rounded-lg object-cover sm:h-24 sm:w-24 lg:h-28 lg:w-28"
    />
    <div className="min-w-0 flex-1 py-0.5">
      <BlogCategoryBadge category={article.category} />
      <h3 className="mt-1.5 line-clamp-2 text-[13px] font-bold leading-snug text-deep-blue sm:mt-2 sm:text-[14px]">
        {article.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#64748B] sm:mt-1.5 sm:text-[12px]">
        {article.excerpt}
      </p>
      <p className="mt-1.5 text-[10px] text-[#98A2B3] sm:mt-2 sm:text-[11px]">
        {article.date} — {article.author}
      </p>
    </div>
  </Link>
);

export default LatestHubCard;
