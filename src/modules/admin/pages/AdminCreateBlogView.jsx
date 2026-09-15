import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";
import Card from "@/components/ui/Card";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import {
  panelPrimaryBtn,
  panelSecondaryBtn,
} from "@/shared/layout/PanelLayout/panelPageTheme";
import {
  createBlogPost,
  updateBlogPost,
} from "@/features/admin/blogs";
import { BLOG_CATEGORY_OPTIONS } from "@/features/admin/blogs/blogsMappers";

const labelClass = "mb-1.5 block text-[14px] font-medium text-deep-blue";
const inputClass =
  "w-full rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none transition-colors placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/15";

const AdminCreateBlogView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const editing = location.state?.article;
  const { saving } = useSelector((state) => state.adminBlogs);

  const [title, setTitle] = useState(editing?.title ?? "");
  const [category, setCategory] = useState(
    editing?.category ?? BLOG_CATEGORY_OPTIONS[0],
  );
  const [excerpt, setExcerpt] = useState(editing?.excerpt ?? "");
  const [body, setBody] = useState(editing?.body ?? editing?.excerpt ?? "");
  const [imageUrl, setImageUrl] = useState(editing?.image ?? "");
  const [readTime, setReadTime] = useState(editing?.readTime ?? "5 min read");
  const [publish, setPublish] = useState(Boolean(editing?.publishedAt ?? true));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title: title.trim(),
      category: category.trim(),
      excerpt: excerpt.trim(),
      body: body.trim() || excerpt.trim(),
      readTime: readTime.trim() || undefined,
      publish,
    };

    if (imageUrl.trim()) {
      payload.image = imageUrl.trim();
    }

    const result = editing?.id
      ? await dispatch(
          updateBlogPost({
            blogId: editing.id,
            payload,
          }),
        )
      : await dispatch(createBlogPost(payload));

    const matched = editing?.id
      ? updateBlogPost.fulfilled.match(result)
      : createBlogPost.fulfilled.match(result);

    if (matched) {
      toast.success(editing?.id ? "Blog updated" : "Blog published");
      navigate("/admin/blogs");
      return;
    }

    toast.error(result.payload || "Failed to save blog");
  };

  return (
    <PanelPage>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">
        Blogs
      </p>

      <PanelPageHeader
        title={editing ? "Edit Blog Post" : "Create New Blog Post"}
        subtitle="Fill in the details to publish or save as draft."
      />

      <Card className="p-4 sm:p-5">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="blog-headline" className={labelClass}>
              Headline
            </label>
            <input
              id="blog-headline"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Write title"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="blog-category" className={labelClass}>
              Category
            </label>
            <select
              id="blog-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={inputClass}
              required
            >
              {BLOG_CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="blog-description" className={labelClass}>
              Excerpt
            </label>
            <textarea
              id="blog-description"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Short summary shown on cards"
              rows={3}
              className={`${inputClass} resize-none`}
              required
            />
          </div>

          <div>
            <label htmlFor="blog-body" className={labelClass}>
              Body
            </label>
            <textarea
              id="blog-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Full article content"
              rows={8}
              className={`${inputClass} resize-y`}
              required
            />
          </div>

          <div>
            <label htmlFor="blog-image" className={labelClass}>
              Image URL
            </label>
            <input
              id="blog-image"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://…"
              className={inputClass}
            />
            <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-8 text-center transition-colors hover:border-primary hover:bg-secondary/40 sm:px-6 sm:py-10">
              <Upload className="mb-3 h-8 w-8 text-[#98A2B3]" />
              <span className="text-[14px] font-semibold text-deep-blue">
                Paste an image URL above
              </span>
              <span className="mt-1 text-[12px] text-[#64748B]">
                JPG, PNG or WebP via hosted URL
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="blog-read-time" className={labelClass}>
                Read time
              </label>
              <input
                id="blog-read-time"
                type="text"
                value={readTime}
                onChange={(event) => setReadTime(event.target.value)}
                placeholder="5 min read"
                className={inputClass}
              />
            </div>
            <label className="mt-7 flex items-center gap-2 text-[14px] text-deep-blue">
              <input
                type="checkbox"
                checked={publish}
                onChange={(event) => setPublish(event.target.checked)}
                className="h-4 w-4 rounded border-[#D0D5DD] text-primary focus:ring-primary"
              />
              Publish immediately
            </label>
          </div>

          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
            <button
              type="submit"
              disabled={saving}
              className={`${panelPrimaryBtn} w-full sm:w-auto disabled:opacity-60`}
            >
              {saving ? "Saving…" : editing ? "Update" : "Upload"}
            </button>
            <Link
              to="/admin/blogs"
              className={`${panelSecondaryBtn} w-full sm:w-auto`}
            >
              Cancel
            </Link>
          </div>
        </form>
      </Card>
    </PanelPage>
  );
};

export default AdminCreateBlogView;
