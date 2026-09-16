import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Pagination from "@/components/common/Pagination/Pagination";
import { CardSkeleton } from "@/components/common/Skeleton";
import BlogAdminCard from "@/components/data-display/BlogAdminCard/BlogAdminCard";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import { panelPrimaryBtn } from "@/shared/layout/PanelLayout/panelPageTheme";
import {
  fetchBlogsList,
  removeBlogPost,
} from "@/features/admin/blogs";
import { toBlogCardModel } from "@/features/admin/blogs/blogsMappers";

const PAGE_SIZE = 8;

const AdminBlogsView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { blogs, blogsMeta, blogsLoading, error } = useSelector(
    (state) => state.adminBlogs,
  );

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchBlogsList({
        page,
        pageSize: PAGE_SIZE,
      }),
    );
  }, [dispatch, page]);

  const pageItems = useMemo(
    () => (blogs || []).map(toBlogCardModel).filter(Boolean),
    [blogs],
  );

  const handleDelete = async (blogId) => {
    const result = await dispatch(removeBlogPost(blogId));
    if (removeBlogPost.fulfilled.match(result)) {
      toast.success("Blog deleted");
      return;
    }
    toast.error(result.payload || "Failed to delete blog");
  };

  return (
    <PanelPage>
      <PanelPageHeader
        title="Blogs"
        subtitle="Manage all blog posts from one place."
        action={
          <Link
            to="/admin/blogs/new"
            className={`${panelPrimaryBtn} w-full sm:w-auto`}
          >
            New Blog
          </Link>
        }
      />

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {blogsLoading && !pageItems.length ? (
        <CardSkeleton
          variant="generalPost"
          count={8}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        />
      ) : pageItems.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#64748B]">
          No blog posts yet. Create your first article.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pageItems.map((article) => (
            <BlogAdminCard
              key={article.id}
              article={article}
              onEdit={(id) => {
                const item = pageItems.find((entry) => entry.id === id);
                navigate("/admin/blogs/new", { state: { article: item } });
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Pagination
        page={blogsMeta?.page || page}
        totalPages={blogsMeta?.totalPages || 1}
        onPageChange={setPage}
        className="mt-2"
      />
    </PanelPage>
  );
};

export default AdminBlogsView;
