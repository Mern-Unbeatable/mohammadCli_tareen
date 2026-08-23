import Card from '@/components/ui/Card';
import { blogCardTheme } from '@/components/data-display/BlogCard/blogCardTheme';

const BlogAdminCard = ({ article, onEdit, onDelete }) => (
  <Card className="flex h-full flex-col overflow-hidden">
    <div className="aspect-[16/10] overflow-hidden bg-[#F9FAFB]">
      <img src={article.image} alt="" className="h-full w-full object-cover" />
    </div>

    <div className={`flex flex-1 flex-col ${blogCardTheme.bodyPad}`}>
      <h3 className={blogCardTheme.title}>{article.title}</h3>
      <p className={`mt-2 flex-1 ${blogCardTheme.excerpt}`}>{article.excerpt}</p>
      <p className={`mt-3 ${blogCardTheme.meta}`}>
        {article.readTime} — {article.author}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onEdit?.(article.id)}
          className={`inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-white hover:bg-[#066BB0] ${blogCardTheme.action}`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(article.id)}
          className={`inline-flex items-center justify-center rounded-md border border-[#E4E7EC] bg-white px-3 py-2 text-deep-blue hover:bg-[#F9FAFB] ${blogCardTheme.action}`}
        >
          Delete
        </button>
      </div>
    </div>
  </Card>
);

export default BlogAdminCard;
