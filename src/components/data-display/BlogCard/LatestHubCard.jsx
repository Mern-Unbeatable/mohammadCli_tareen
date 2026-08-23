import { Link } from 'react-router';
import BlogCategoryBadge from './BlogCategoryBadge';
import { blogCardTheme } from './blogCardTheme';

const LatestHubCard = ({ article, blogBasePath = '/blogs' }) => (
  <Link
    to={`${blogBasePath}/${article.slug}`}
    className={`flex h-full w-full gap-3 rounded-xl border border-[#E4E7EC] bg-white transition-colors hover:border-[#D0D5DD] sm:gap-4 ${blogCardTheme.bodyPad}`}
  >
    <img
      src={article.image}
      alt=""
      className="h-20 w-20 shrink-0 rounded-lg object-cover sm:h-24 sm:w-24 lg:h-28 lg:w-28"
    />
    <div className="min-w-0 flex-1 py-0.5">
      <BlogCategoryBadge category={article.category} />
      <h3 className={`mt-1.5 sm:mt-2 ${blogCardTheme.title}`}>{article.title}</h3>
      <p className={`mt-1 flex-1 sm:mt-1.5 ${blogCardTheme.excerpt}`}>{article.excerpt}</p>
      <p className={`mt-1.5 sm:mt-2 ${blogCardTheme.meta}`}>
        {article.date} — {article.author}
      </p>
    </div>
  </Link>
);

export default LatestHubCard;
