import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Pagination from '@/components/common/Pagination/Pagination';
import BlogAdminCard from '@/components/data-display/BlogAdminCard/BlogAdminCard';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import { panelPrimaryBtn } from '@/shared/layout/PanelLayout/panelPageTheme';
import { allArticles, popularPosts } from '@/modules/user/data/blogs';
import { GRID_PAGE_SIZE, usePaginatedList } from '@/shared/hooks/usePaginatedList';

const toAdminArticle = (article) => ({
  ...article,
  readTime: article.readTime?.includes('min') ? '10 Minutes' : article.readTime,
  author: article.author || 'Mohamed',
});

const INITIAL_ARTICLES = [
  ...popularPosts.map(toAdminArticle),
  ...allArticles.map(toAdminArticle),
].slice(0, 8);

const AdminBlogsView = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState(INITIAL_ARTICLES);

  const uniqueArticles = useMemo(() => {
    const seen = new Set();
    return articles.filter((article) => {
      if (seen.has(article.id)) return false;
      seen.add(article.id);
      return true;
    });
  }, [articles]);

  const { page, setPage, totalPages, pageItems } = usePaginatedList(
    uniqueArticles,
    GRID_PAGE_SIZE
  );

  return (
    <PanelPage>
      <PanelPageHeader
        title="Blogs"
        subtitle="Manage all blog posts from one place."
        action={
          <Link to="/admin/blogs/new" className={`${panelPrimaryBtn} w-full sm:w-auto`}>
            New Blog
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pageItems.map((article) => (
          <BlogAdminCard
            key={article.id}
            article={article}
            onEdit={(id) => {
              const item = uniqueArticles.find((entry) => entry.id === id);
              navigate('/admin/blogs/new', { state: { article: item } });
            }}
            onDelete={(id) => setArticles((prev) => prev.filter((entry) => entry.id !== id))}
          />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-2" />
    </PanelPage>
  );
};

export default AdminBlogsView;
