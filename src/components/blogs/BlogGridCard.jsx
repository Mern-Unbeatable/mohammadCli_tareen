import { Link } from 'react-router';
import { ArrowRight, Clock } from 'lucide-react';
import BlogCategoryBadge from './BlogCategoryBadge';

const BlogGridCard = ({ article }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white">
    <Link to={`/blogs/${article.slug}`} className="block overflow-hidden">
      <img
        src={article.image}
        alt=""
        className="aspect-[16/10] w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
      />
    </Link>

    <div className="flex flex-1 flex-col p-4 sm:p-5">
      <BlogCategoryBadge category={article.category} />
      <Link to={`/blogs/${article.slug}`}>
        <h3 className="mt-2 line-clamp-2 text-[14px] font-bold leading-snug text-deep-blue hover:text-primary sm:mt-3 sm:text-[15px]">
          {article.title}
        </h3>
      </Link>
      <p className="mt-2 line-clamp-2 flex-1 text-[12px] leading-relaxed text-[#64748B] sm:text-[13px]">
        {article.excerpt}
      </p>

      <div className="mt-3 flex flex-col gap-3 border-t border-[#E4E7EC] pt-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-deep-blue text-[11px] font-semibold text-white">
            {article.authorInitials || 'MO'}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-deep-blue">{article.author}</p>
            <p className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[11px] text-[#98A2B3]">
              <span>{article.date}</span>
              <span className="text-[#D0D5DD]">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readTime}
              </span>
            </p>
          </div>
        </div>
        <Link
          to={`/blogs/${article.slug}`}
          className="inline-flex shrink-0 items-center gap-1 self-start text-[12px] font-semibold text-primary hover:underline sm:self-auto"
        >
          Read
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  </article>
);

export default BlogGridCard;
